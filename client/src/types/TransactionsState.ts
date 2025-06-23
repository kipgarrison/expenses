import type { ActionWithPayload } from "../actions/ActionWithPayload";
import type { Transaction } from "./Transaction";
import type { TransactionSearchFilter } from "./TransactionSeachFilter";
import type { ModalType } from "./unionTypes";

export type TransactionsState = {
  transactions: Transaction[],
  pageNumber: number,
  pageSize: number,
  currentTransaction?: Transaction,
  backupTransaction?: Transaction,
  transactionPage: Transaction[],
  lastAction?: ActionWithPayload,
  apiStatus?: "NOT_RUNNING" | "RUNNING" | "INITIAL",
  alert?: AlertType,
  sort: SortType,
  filter: TransactionSearchFilter,
  modal: ModalType,
  summary: TranactionsSummaryType
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
  apiStatus: "INITIAL",
  summary: { numPages: 0, transactionsCount: 0, totalAmount: 0}
}

export type AlertType = { type: "success" | "failure" , message: string } 

export type SortType = { column: string, direction: "asc" | "desc" };