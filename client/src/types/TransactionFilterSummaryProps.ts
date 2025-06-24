import type { TransactionSearchFilterType } from "./TransactionSeachFilterType"

export type TransactionFilterSummaryProps = {
  filter: TransactionSearchFilterType,
  clearColumns: (column: string[]) => void,
  clearAll: () => void
}