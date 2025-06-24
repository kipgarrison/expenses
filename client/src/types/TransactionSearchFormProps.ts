import type { TransactionSearchFilterType } from "./TransactionSeachFilterType"

export type TransactionSearchFormProps = {
  show: boolean, 
  filter: TransactionSearchFilterType, 
  merchants: string[],
  types: string[]
  onClose: () => void, 
  onSearch: (searchParams: TransactionSearchFilterType) => void

}
