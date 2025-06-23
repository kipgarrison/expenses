export type Transaction = {
  id: number,
  date: Date,
  merchant: string,
  type: 'Credit Card Debit' | 'Bank Account Debit' | 'Bank Account Credit',
  amount: number,
  comments: string,
  hasReceipt?: boolean,
  runningBalance: number
}

export const newTransaction: Transaction = {
  id: 0,
  date: new Date(),
  merchant: "",
  type: "Credit Card Debit",
  amount: 0,
  comments: "",
  hasReceipt: false,
  runningBalance: 0
}