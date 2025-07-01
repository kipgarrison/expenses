import type { ReferenceData } from "./app/ReferenceData"
import type { Transaction } from "./Transaction"

export type TransactionFormProps = {
  transaction: Transaction,
  merchants: ReferenceData[],
  categories: ReferenceData[],
  show: boolean,
  onChange: (transaction: Transaction) => void,
  onSave: (transaction: Transaction) => void,
  onHide: () => void
}