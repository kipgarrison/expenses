import type { ActionWithPayload } from "../actions/ActionWithPayload";
import type { Transaction } from "./Transaction";
import type { TransactionSearchFilterType } from "./TransactionSeachFilterType";
import type { ModalType } from "./unionTypes";

export type TransactionsState = {
  transactions: Transaction[],
  pageNumber: number,
  pageSize: number,
  currentTransaction?: Transaction,
  backupTransaction?: Transaction,
  transactionPage: Transaction[],
  lastAction?: ActionWithPayload,
  sort: SortType,
  filter: TransactionSearchFilterType,
  modal: ModalType,
  summary: TranactionsSummaryType,
  merchants: string[],
  transactionTypes: string[],
  alert?: AlertType, 
  showSpinner: boolean;
}

export type TranactionsSummaryType = {
  numPages: number,  
  transactionsCount: number;
  totalAmount: number
}

export const transactionStateInitialValue: TransactionsState = {
  transactions: [],
  pageNumber: 1,
  pageSize: 10,
  sort: { column: 'date', direction: "asc" },
  transactionPage: [],
  filter: { merchants: [], types: [] },
  modal: "None",
  summary: { numPages: 0, transactionsCount: 0, totalAmount: 0},
  merchants: [ "Wal-Mart", "Sam's Club", "Schnucks", "Target", "QT", "Dierbergs", "Aldis", "O'Fallon City", "McDonalds", "Menards", "Touchette", "Wal-Greens" ],
  transactionTypes: [ "Credit Card Debit", "Bank Account Debit", "Credit Card Credit", "Bank Account Credit" ],
  showSpinner: false
}

export type AlertType = { type: "success" | "failure" , message: string } 

export type SortType = { column: string, direction: "asc" | "desc" };