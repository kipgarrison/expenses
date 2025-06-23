import type { SortType } from "./TransactionsState";

export type TransactionTableHeaderProps = {
  onSort: (column: string) => void
  sort: SortType
};
  
