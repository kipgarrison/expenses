import type { ReferenceData } from "./app/ReferenceData"
import type { Transaction } from "./Transaction"

export type TransactionFormProps = {
  transaction: Transaction,
  merchants: ReferenceData[],
  categories: ReferenceData[]
  onChange: (transaction: Transaction) => void,
  onSave: (transaction: Transaction) => void
}