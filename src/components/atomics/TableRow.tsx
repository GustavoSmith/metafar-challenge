import React from "react";
import { Link } from "react-router-dom";
import { TableRow, TableCell } from "@/components/ui/table";
import { IStock } from "../../types";

interface IStockTableRowProps {
  stock: IStock;
  onPrefetch?: () => void;
}

const StockTableRow: React.FC<IStockTableRowProps> = ({
  stock,
  onPrefetch,
}) => (
  <TableRow onMouseEnter={onPrefetch}>
    <TableCell>
      <Link
        to={`/stock/${stock.symbol}`}
        className="text-blue-600 hover:underline"
      >
        {stock.symbol}
      </Link>
    </TableCell>
    <TableCell>{stock.name}</TableCell>
    <TableCell>{stock.currency}</TableCell>
    <TableCell>{stock.type}</TableCell>
  </TableRow>
);

export default StockTableRow;
