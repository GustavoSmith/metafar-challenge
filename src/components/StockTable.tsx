import * as React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  Paper,
  TablePagination,
} from "@mui/material";
import { TextField, TableHeader, TableRow } from "./atomics/index";
import { ClipLoader } from "react-spinners";
import { getStockListForAutocomplete } from "../api";
import { IStock } from "../types";
import useDebounce from "../hooks/useDebounce";

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
  }, [debouncedSearchName, debouncedSearchSymbol]);

  async function fetchStockList() {
    setLoading(true);
    try {
      const stockList = await getStockListForAutocomplete();
      setStocks(stockList.data);
      setFilteredStocks(stockList.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock list:", error);
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

  function handleChangePage(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10));
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
  }

  return (
    <>
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
      <TableContainer component={Paper}>
        <Table>
          <TableHeader />
          <ClipLoader color="#0000ff" loading={loading} size={50} />
          {!loading && (
            <TableBody>
              {filteredStocks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((stock) => (
                  <TableRow key={stock.symbol} stock={stock} />
                ))}
            </TableBody>
          )}
        </Table>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={filteredStocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default StockTable;
