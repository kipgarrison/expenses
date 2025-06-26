import type { ColumnType } from "./ColumnType";
import type { SortType } from "./TransactionsState";

export type TransactionTableHeaderProps = {
  onSort: (column: ColumnType) => void
  sort: SortType
};
  
