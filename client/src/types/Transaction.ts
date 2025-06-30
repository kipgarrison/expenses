import type { ReferenceData } from "./app/ReferenceData"
import type { CreditCardTransactionType } from "./unionTypes"

export type Transaction = {
  id: number,
  date: Date,
  merchant: ReferenceData,
  merchantName?: string,
  type: CreditCardTransactionType,
  amount: number,
  comments: string,
  hasReceipt?: boolean,
  runningBalance: number,
  category: ReferenceData,
  categoryName?: string
}

export const newDebitTransaction: Transaction = {
  id: 0,
  type: "Debit",
  date: new Date(),
  merchant: { id: 0, name: ""},
  merchantName: "",
  amount: 0,
  comments: "",
  hasReceipt: false,
  runningBalance: 0,
  category: { id: 0, name: "" },
  categoryName: ""
}

export const newCreditTransaction: Transaction = {
  id: 0,
  type: "Credit",
  date: new Date(),
  merchant: { id: 0, name: ""},
  amount: 0,
  comments: "",
  hasReceipt: false,
  runningBalance: 0,
  category: { id: 0, name: "" },
}