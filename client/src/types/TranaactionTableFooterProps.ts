import type { ReactNode } from "react"
import type { TranactionsSummaryType } from "./TransactionsState"

export type TransactionTableFooterProps = 
{ 
  summary: TranactionsSummaryType
  currentPage: number,
  children: Array<ReactNode>
  onPageChanged: (newPage: number) => void
}