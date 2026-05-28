import { BrowserRouter, Routes, Route } from "react-router-dom";
import StockTable from "./components/StockTable";
import Detail from "./components/Detail";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StockTable />} />
        <Route path="/stock/:symbol" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
