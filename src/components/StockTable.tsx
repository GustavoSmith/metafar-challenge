import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, TextField } from "./atomics/index";
import { getStockData } from "@/api/stocks";
import type { IStock } from "@/api/types";
import { stockQueryKeys } from "@/hooks/queries/queryKeys";
import { useStockList } from "@/hooks/queries/useStockList";
import useDebounce from "../hooks/useDebounce";
import { appToast } from "@/lib/toast";
import { getUserFriendlyMessage } from "@/lib/userMessages";

const INITIAL_VISIBLE_ROWS = 100;
const LOAD_MORE_ROWS = 100;
const PREFETCH_HOVER_DELAY_MS = 500;
const ROW_HEIGHT = 48;
const SKELETON_ROWS = [
  ["w-14", "w-48", "w-10", "w-20"],
  ["w-16", "w-64", "w-10", "w-24"],
  ["w-12", "w-56", "w-10", "w-16"],
  ["w-14", "w-72", "w-10", "w-20"],
  ["w-16", "w-52", "w-10", "w-24"],
  ["w-12", "w-60", "w-10", "w-16"],
] as const;

interface VirtualStockRowProps {
  stock: IStock;
  onPrefetch: (symbol: string) => void;
}

const VirtualStockRow = React.memo(function VirtualStockRow({
  stock,
  onPrefetch,
}: VirtualStockRowProps) {
  const prefetchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  function clearPendingPrefetch() {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
      prefetchTimeoutRef.current = null;
    }
  }

  function handleMouseEnter() {
    clearPendingPrefetch();
    prefetchTimeoutRef.current = setTimeout(() => {
      onPrefetch(stock.symbol);
      prefetchTimeoutRef.current = null;
    }, PREFETCH_HOVER_DELAY_MS);
  }

  React.useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="border-border hover:bg-surface-muted grid h-12 min-w-[600px] grid-cols-[88px_minmax(200px,1fr)_80px_120px] items-center border-b px-4 text-sm transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={clearPendingPrefetch}
    >
      <Link
        to={`/stock/${stock.symbol}`}
        className="text-accent focus-visible:outline-accent font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {stock.symbol}
      </Link>
      <span className="text-foreground truncate pr-4">{stock.name}</span>
      <span className="text-muted-foreground">{stock.currency}</span>
      <span className="text-muted-foreground">{stock.type}</span>
    </div>
  );
});

function StockTableSkeleton() {
  return (
    <div className="overflow-x-auto" aria-label="Cargando acciones">
      <div className="min-w-[600px]">
        <div
          role="status"
          className="border-border flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold">Cargando listado</p>
            <p className="text-muted-foreground text-sm">
              Estamos preparando las acciones disponibles.
            </p>
          </div>
          <div className="bg-accent-muted h-2 w-full overflow-hidden rounded-full sm:w-56">
            <div className="bg-accent/40 h-full w-2/5 animate-pulse rounded-full" />
          </div>
        </div>
        <div className="border-border bg-surface-muted text-muted-foreground grid grid-cols-[88px_minmax(200px,1fr)_80px_120px] border-b px-4 py-3 text-xs font-semibold tracking-[0.08em] uppercase">
          <span>Símbolo</span>
          <span>Nombre</span>
          <span>Moneda</span>
          <span>Tipo</span>
        </div>
        <div className="divide-border divide-y">
          {SKELETON_ROWS.map(
            ([symbolWidth, nameWidth, currencyWidth, typeWidth], index) => (
              <div
                key={index}
                className="grid h-12 grid-cols-[88px_minmax(200px,1fr)_80px_120px] items-center px-4"
              >
                <div
                  className={`bg-muted h-4 animate-pulse rounded ${symbolWidth}`}
                />
                <div
                  className={`bg-muted h-4 max-w-full animate-pulse rounded ${nameWidth}`}
                />
                <div
                  className={`bg-muted h-4 animate-pulse rounded ${currencyWidth}`}
                />
                <div
                  className={`bg-muted h-4 animate-pulse rounded ${typeWidth}`}
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

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

  const errorMessage = getUserFriendlyMessage(
    stockListQuery.error,
    "stockList",
  );

  React.useEffect(() => {
    if (stockListQuery.isError) {
      appToast.error({
        id: "stock-list-error",
        title: "No pudimos cargar las acciones",
        description: errorMessage,
      });
    }
  }, [errorMessage, stockListQuery.isError]);

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

  const handlePrefetchStockData = React.useCallback(
    (symbol: string) => {
      void queryClient.prefetchQuery({
        queryKey: stockQueryKeys.data(symbol),
        queryFn: ({ signal }) => getStockData(symbol, signal),
        staleTime: 60 * 60 * 1000,
      });
      void import("./Detail");
    },
    [queryClient],
  );

  function handleRefreshStockList() {
    appToast.info({
      id: "stock-list-retry",
      title: "Reintentando carga",
      description: "Volvemos a consultar la lista de acciones.",
    });
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
    <main className="bg-background text-foreground min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="border-border bg-surface mb-6 rounded-3xl border p-5 shadow-sm sm:p-6">
          <p className="text-accent mb-2 text-xs font-semibold tracking-[0.18em] uppercase">
            Panel de mercado
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Acciones
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Buscá por nombre o símbolo y abrí el detalle para consultar la
                evolución del precio.
              </p>
            </div>
            <div className="bg-accent-muted text-accent rounded-2xl px-4 py-3 text-sm">
              {stocks.length > 0
                ? `${stocks.length} acciones cargadas`
                : "Lista en preparación"}
            </div>
          </div>
        </header>

        <section className="border-border bg-surface rounded-3xl border shadow-sm">
          <div className="border-border border-b p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">Explorar acciones</h2>
                <p className="text-muted-foreground text-sm">
                  Los filtros se aplican sobre la lista cargada.
                </p>
              </div>
              {stockListQuery.isFetching && !stockListQuery.isLoading && (
                <p className="text-accent text-sm font-medium">
                  Actualizando datos...
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
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
          </div>

          {stockListQuery.isLoading ? (
            <StockTableSkeleton />
          ) : stockListQuery.isError ? (
            <div className="p-6 text-center sm:p-8">
              <p className="text-danger mx-auto mb-4 max-w-md text-sm">
                {errorMessage}
              </p>
              <Button
                variant="contained"
                type="button"
                onClick={handleRefreshStockList}
              >
                Reintentar
              </Button>
            </div>
          ) : filteredStocks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium">
                No hay acciones para esos filtros.
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Probá con otro nombre o símbolo.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="border-border bg-surface-muted text-muted-foreground grid min-w-[600px] grid-cols-[88px_minmax(200px,1fr)_80px_120px] border-b px-4 py-3 text-xs font-semibold tracking-[0.08em] uppercase">
                  <span>Símbolo</span>
                  <span>Nombre</span>
                  <span>Moneda</span>
                  <span>Tipo</span>
                </div>
                <div
                  ref={parentRef}
                  className="h-[560px] min-w-[600px] overflow-x-hidden overflow-y-auto"
                  onScroll={handleScroll}
                >
                  <div
                    className="relative min-w-[600px]"
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
              </div>
              <div className="border-border text-muted-foreground border-t px-4 py-3 text-right text-sm">
                Mostrando {visibleStocks.length} de {filteredStocks.length}{" "}
                acciones{hasMoreRows ? ". Desplazate para cargar más." : "."}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default StockTable;
