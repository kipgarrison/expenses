import type { Transaction } from "./Transaction"
import type { SortType, TranactionsSummaryType } from "./TransactionsState";

export type TransactionTableProps = {
  transactions: Transaction[],
  pageNumber: number,
  currentSort: SortType,
  summary: TranactionsSummaryType,
  onPageNumberChange: (newPageNumber: number) => void
  onSort?: (column: string) => void,
  onDelete: (transaction: Transaction) => void,
  onEdit: (transaction: Transaction) => void,
  onView?: (transaction: Transaction) => void,
};