import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TextField, TableHeader, TableRow } from "./atomics/index";
import { Table, TableBody } from "@/components/ui/table";
import { ClipLoader } from "react-spinners";
import { getStockData } from "@/api/stocks";
import type { IStock } from "@/api/types";
import { stockQueryKeys } from "@/hooks/queries/queryKeys";
import { useStockList } from "@/hooks/queries/useStockList";
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
  const queryClient = useQueryClient();
  const [searchName, setSearchName] = React.useState<string>("");
  const [searchSymbol, setSearchSymbol] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const stockListQuery = useStockList();
  const stocks: IStock[] = stockListQuery.data ?? [];

  const debouncedSearchName = useDebounce(searchName, 500);
  const debouncedSearchSymbol = useDebounce(searchSymbol, 500);

  const filteredStocks = React.useMemo(() => {
    return stocks.filter((stock) => {
      return (
        stock.name.toLowerCase().includes(debouncedSearchName.toLowerCase()) &&
        stock.symbol.toLowerCase().includes(debouncedSearchSymbol.toLowerCase())
      );
    });
  }, [debouncedSearchName, debouncedSearchSymbol, stocks]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStocks.length / rowsPerPage),
  );
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedStocks = React.useMemo(
    () =>
      filteredStocks.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage,
      ),
    [currentPage, filteredStocks, rowsPerPage],
  );

  const errorMessage =
    stockListQuery.error instanceof Error
      ? stockListQuery.error.message
      : "No pudimos cargar la lista de acciones.";

  function handleSearchNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchName(event.target.value);
    setPage(0);
  }

  function handleSearchSymbolChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearchSymbol(event.target.value);
    setPage(0);
  }

  function handleChangePage(newPage: number) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }

  function handlePrefetchStockData(symbol: string) {
    void queryClient.prefetchQuery({
      queryKey: stockQueryKeys.data(symbol),
      queryFn: ({ signal }) => getStockData(symbol, signal),
      staleTime: 60 * 60 * 1000,
    });
  }

  function handleRefreshStockList() {
    void queryClient.invalidateQueries({
      queryKey: stockQueryKeys.list(),
    });
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
        {stockListQuery.isFetching && !stockListQuery.isLoading && (
          <div className="border-b px-3 py-2 text-sm text-gray-500">
            Actualizando datos en segundo plano...
          </div>
        )}
        {stockListQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <ClipLoader
              color="#2563eb"
              loading={stockListQuery.isLoading}
              size={50}
            />
          </div>
        ) : stockListQuery.isError ? (
          <div className="p-6 text-center">
            <p className="mb-3 text-sm text-red-600">{errorMessage}</p>
            <button
              type="button"
              onClick={handleRefreshStockList}
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader />
            <TableBody>
              {paginatedStocks.map((stock) => (
                <TableRow
                  key={stock.symbol}
                  stock={stock}
                  onPrefetch={() => handlePrefetchStockData(stock.symbol)}
                />
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          count={filteredStocks.length}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default StockTable;
