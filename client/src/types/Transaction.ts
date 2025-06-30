import { NullAction } from "../actions/app/AppActions"
import type { ReferenceData } from "./app/ReferenceData"

export type Transaction = {
  id: number,
  date: Date,
  merchant: ReferenceData,
  //type: 'Credit Card Debit' | 'Bank Account Debit' | 'Bank Account Credit',
  amount: number,
  comments: string,
  hasReceipt?: boolean,
  runningBalance: number,
  category: ReferenceData
}

export const newTransaction: Transaction = {
  id: 0,
  date: new Date(),
  merchant: { id: 0, name: ""},
  amount: 0,
  comments: "",
  hasReceipt: false,
  runningBalance: 0,
  category: { id: 0, name: "" },
}