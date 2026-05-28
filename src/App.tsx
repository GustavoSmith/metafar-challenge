import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StockTable from "./components/StockTable";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./api/queryClient";

const Detail = React.lazy(() => import("./components/Detail"));

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <React.Suspense fallback={<div className="p-4">Cargando...</div>}>
          <Routes>
            <Route path="/" element={<StockTable />} />
            <Route path="/stock/:symbol" element={<Detail />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
