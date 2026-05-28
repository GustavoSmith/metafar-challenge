import * as React from "react";
import {
  TableHeader as UiTableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

const StockTableHeader: React.FC = () => (
  <UiTableHeader>
    <TableRow>
      <TableHead>Símbolo</TableHead>
      <TableHead>Nombre</TableHead>
      <TableHead>Moneda</TableHead>
      <TableHead>Tipo</TableHead>
    </TableRow>
  </UiTableHeader>
);

export default StockTableHeader;
