import type { TransactionSearchFilter } from "./TransactionSeachFilter"

export type TransactionSearchFormProps = {
  show: boolean, 
  filter: TransactionSearchFilter, 
  merchants: string[],
  types: string[]
  onClose: () => void, 
  onSearch: (searchParams: TransactionSearchFilter) => void

}
