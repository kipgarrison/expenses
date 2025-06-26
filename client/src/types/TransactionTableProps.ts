import type { ReactNode } from "react";
import type { ColumnType } from "./ColumnType";
import type { Transaction } from "./Transaction"
import type { SortType, TranactionsSummaryType } from "./TransactionsState";

export type TransactionTableProps = {
  transactions: Transaction[],
  pageNumber: number,
  currentSort: SortType,
  summary: TranactionsSummaryType,
  children: Array<ReactNode>
  onPageNumberChange: (newPageNumber: number) => void
  onSort?: (column: ColumnType) => void,
  onDelete: (transaction: Transaction) => void,
  onEdit: (transaction: Transaction) => void,
  onView?: (transaction: Transaction) => void,
};