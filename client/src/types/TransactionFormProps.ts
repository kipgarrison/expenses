import type { Transaction } from "./Transaction"

export type TransactionFormProps = {
  transaction: Transaction,
  merchants: string[],
  types: string[]
  onChange: (transaction: Transaction) => void,
  onSave: (transaction: Transaction) => void
}