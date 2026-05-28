import * as React from "react";
import { TextField, TableHeader, TableRow } from "./atomics/index";
import { Table, TableBody } from "@/components/ui/table";
import { ClipLoader } from "react-spinners";
import { getStockListForAutocomplete } from "../api";
import { IStock } from "../types";
import useDebounce from "../hooks/useDebounce";

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100] as const;

interface TablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  return (
    <div className="text-muted-foreground flex flex-wrap items-center justify-end gap-4 border-t px-2 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span>Filas por página:</span>
        <select
          value={rowsPerPage}
          onChange={(event) =>
            onRowsPerPageChange(parseInt(event.target.value, 10))
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          {ROWS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <span>
        {from}-{to} de {count}
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

const StockTable: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchName, setSearchName] = React.useState<string>("");
  const [searchSymbol, setSearchSymbol] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [stocks, setStocks] = React.useState<IStock[]>([]);
  const [filteredStocks, setFilteredStocks] = React.useState<IStock[]>([]);

  const debouncedSearchName = useDebounce(searchName, 500);
  const debouncedSearchSymbol = useDebounce(searchSymbol, 500);

  React.useEffect(() => {
    fetchStockList();
  }, []);

  React.useEffect(() => {
    filterStocks(debouncedSearchName, debouncedSearchSymbol);
  }, [debouncedSearchName, debouncedSearchSymbol, stocks]);

  async function fetchStockList() {
    setLoading(true);
    try {
      const stockList = await getStockListForAutocomplete();
      setStocks(stockList.data);
      setFilteredStocks(stockList.data);
    } catch (error) {
      console.error("Error fetching stock list:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchName(event.target.value);
  }

  function handleSearchSymbolChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearchSymbol(event.target.value);
  }

  function handleChangePage(newPage: number) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }

  function filterStocks(name: string, symbol: string) {
    const filtered = stocks.filter((stock) => {
      return (
        stock.name.toLowerCase().includes(name.toLowerCase()) &&
        stock.symbol.toLowerCase().includes(symbol.toLowerCase())
      );
    });
    setFilteredStocks(filtered);
    setPage(0);
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <TextField
          label="Buscar por nombre"
          value={searchName}
          onChange={handleSearchNameChange}
        />
        <TextField
          label="Buscar por símbolo"
          value={searchSymbol}
          onChange={handleSearchSymbolChange}
        />
      </div>
      <div className="rounded-md border bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <ClipLoader color="#2563eb" loading={loading} size={50} />
          </div>
        ) : (
          <Table>
            <TableHeader />
            <TableBody>
              {filteredStocks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((stock) => (
                  <TableRow key={stock.symbol} stock={stock} />
                ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          count={filteredStocks.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default StockTable;
