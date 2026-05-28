import { BrowserRouter, Routes, Route } from "react-router-dom";
import StockTable from "./components/StockTable";
import Detail from "./components/Detail";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./api/queryClient";

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StockTable />} />
          <Route path="/stock/:symbol" element={<Detail />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
