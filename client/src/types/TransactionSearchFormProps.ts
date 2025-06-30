import type { ReferenceData } from "./app/ReferenceData"
import type { TransactionSearchFilterType } from "./TransactionSeachFilterType"

export type TransactionSearchFormProps = {
  show: boolean, 
  filter: TransactionSearchFilterType, 
  merchants: ReferenceData[],
  categories: ReferenceData[]
  onClose: () => void, 
  onSearch: (searchParams: TransactionSearchFilterType) => void

}
