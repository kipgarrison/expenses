import type { TranactionsSummaryType } from "./TransactionsState"

export type TransactionTableFooterProps = 
{ 
  summary: TranactionsSummaryType
  currentPage: number,
  onPageChanged: (newPage: number) => void
}