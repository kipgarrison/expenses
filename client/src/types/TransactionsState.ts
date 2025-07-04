//  import { NullAction } from "../actions/app/AppActions";
import { defaultLastApi, type LastApiType } from "./LastApiType";
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
  // lastAction: ActionWithPayload,
  sort: SortType,
  filter: TransactionSearchFilterType,
  modal: ModalType,
  summary: TranactionsSummaryType,
  alert?: AlertType, 
  // showAppSpinner: boolean;
  //  showApiSpinner: boolean;
  showFailureMessage?: boolean,
  // lastApiError?: ApiError,
  lastApi: LastApiType 

}

export type TranactionsSummaryType = {
  numPages: number,  
  transactionsCount: number;
  totalCreditAmount: number,
  totalDebitAmount: number
}

export const transactionStateInitialValue: TransactionsState = {
  transactions: [],
  pageNumber: 1,
  pageSize: 10,
  sort: { column: 'date', direction: "asc" },
  transactionPage: [],
  filter: { merchants: [], categories: [] },
  modal: "None",
  summary: { numPages: 0, transactionsCount: 0, totalCreditAmount: 0, totalDebitAmount: 0},
  lastApi: defaultLastApi
}

export type AlertType = { type: "success" | "failure" , message: string } 

export type SortType = { column: string, direction: "asc" | "desc" };