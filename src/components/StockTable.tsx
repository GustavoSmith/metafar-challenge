import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { TextField } from "./atomics/index";
import { ClipLoader } from "react-spinners";
import { getStockData } from "@/api/stocks";
import type { IStock } from "@/api/types";
import { stockQueryKeys } from "@/hooks/queries/queryKeys";
import { useStockList } from "@/hooks/queries/useStockList";
import useDebounce from "../hooks/useDebounce";

const INITIAL_VISIBLE_ROWS = 100;
const LOAD_MORE_ROWS = 100;
const ROW_HEIGHT = 48;

interface VirtualStockRowProps {
  stock: IStock;
  onPrefetch: (symbol: string) => void;
}

const VirtualStockRow = React.memo(function VirtualStockRow({
  stock,
  onPrefetch,
}: VirtualStockRowProps) {
  return (
    <div
      className="grid min-w-[720px] grid-cols-[120px_minmax(280px,1fr)_120px_160px] items-center border-b px-2 text-sm transition-colors hover:bg-gray-50"
      onMouseEnter={() => onPrefetch(stock.symbol)}
    >
      <Link
        to={`/stock/${stock.symbol}`}
        className="text-blue-600 hover:underline"
      >
        {stock.symbol}
      </Link>
      <span>{stock.name}</span>
      <span>{stock.currency}</span>
      <span>{stock.type}</span>
    </div>
  );
});

const StockTable: React.FC = () => {
  const queryClient = useQueryClient();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [searchName, setSearchName] = React.useState<string>("");
  const [searchSymbol, setSearchSymbol] = React.useState<string>("");
  const [visibleCount, setVisibleCount] =
    React.useState<number>(INITIAL_VISIBLE_ROWS);
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

  const visibleStocks = React.useMemo(
    () => filteredStocks.slice(0, visibleCount),
    [filteredStocks, visibleCount],
  );

  const rowVirtualizer = useVirtualizer({
    count: visibleStocks.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => parentRef.current,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const hasMoreRows = visibleCount < filteredStocks.length;

  const errorMessage =
    stockListQuery.error instanceof Error
      ? stockListQuery.error.message
      : "No pudimos cargar la lista de acciones.";

  function handleSearchNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchName(event.target.value);
    resetVisibleRows();
  }

  function handleSearchSymbolChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearchSymbol(event.target.value);
    resetVisibleRows();
  }

  const handlePrefetchStockData = React.useCallback((symbol: string) => {
    void queryClient.prefetchQuery({
      queryKey: stockQueryKeys.data(symbol),
      queryFn: ({ signal }) => getStockData(symbol, signal),
      staleTime: 60 * 60 * 1000,
    });
    void import("./Detail");
  }, [queryClient]);

  function handleRefreshStockList() {
    void queryClient.invalidateQueries({
      queryKey: stockQueryKeys.list(),
    });
  }

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceToBottom < ROW_HEIGHT * 6) {
      setVisibleCount((currentCount) =>
        Math.min(currentCount + LOAD_MORE_ROWS, filteredStocks.length),
      );
    }
  }

  function resetVisibleRows() {
    setVisibleCount(INITIAL_VISIBLE_ROWS);
    parentRef.current?.scrollTo({ top: 0 });
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
        ) : filteredStocks.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No hay acciones para los filtros aplicados.
          </div>
        ) : (
          <>
            <div className="grid min-w-[720px] grid-cols-[120px_minmax(280px,1fr)_120px_160px] border-b bg-gray-50 px-2 py-3 text-sm font-medium">
              <span>Símbolo</span>
              <span>Nombre</span>
              <span>Moneda</span>
              <span>Tipo</span>
            </div>
            <div
              ref={parentRef}
              className="h-[560px] overflow-auto"
              onScroll={handleScroll}
            >
              <div
                className="relative min-w-[720px]"
                style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
              >
                {virtualRows.map((virtualRow) => {
                  const stock = visibleStocks[virtualRow.index];

                  return (
                    <div
                      key={virtualRow.key}
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <VirtualStockRow
                        stock={stock}
                        onPrefetch={handlePrefetchStockData}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t px-3 py-2 text-right text-sm text-gray-500">
              Mostrando {visibleStocks.length} de {filteredStocks.length}
              {hasMoreRows && " acciones."}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockTable;
