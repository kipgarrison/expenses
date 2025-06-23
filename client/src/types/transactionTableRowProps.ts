import type { Transaction } from "./Transaction"

export type TransactionTableRowProps = {
  transaction: Transaction, 
  onDelete: (transaction: Transaction) => void,
  onEdit: (tranaction: Transaction) => void
  onView: (tranaction: Transaction) => void
}
