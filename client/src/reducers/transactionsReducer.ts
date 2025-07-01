import { ActionWithPayload } from "../actions/ActionWithPayload";
import { TransactionActionTypes } from "../actions/TransactionActionTypes";
import { midnightToday } from "../helpers/midnightToday";
import { sortObjectsArray } from "../helpers/sortObjectsArray";
import { API_CREATE_TRANSACTION_FAILURE_ALERT, API_CREATE_TRANSACTION_SUCCESS_ALERT, API_DELETE_TRANSACTION_FAILURE_ALERT, API_DELETE_TRANSACTION_SUCESS_ALERT, API_UPDATE_TRANSACTION_FAILURE_ALERT, API_UPDATE_TRANSACTION_SUCCESS_ALERT } from "../types/constants";
import type { Indexable } from "../types/Indexable";
import { newCreditTransaction, newDebitTransaction, type Transaction } from "../types/Transaction";
import { emptyFilter, maxFilter, type TransactionSearchFilterType } from "../types/TransactionSeachFilterType";
import type { TranactionsSummaryType, TransactionsState } from "../types/TransactionsState";
import type { CreditCardTransactionType, ModalType } from "../types/unionTypes";

export function filterTransactions({ transactions, pageNumber, pageSize, sort, filter }: TransactionsState): { transactions: Transaction[], transactionPage: Transaction[], summary: TranactionsSummaryType } {
  throw new Error("Whoops");
  if (!transactions) return { transactions, transactionPage: [], summary: { numPages: 0, totalDebitAmount: 0, totalCreditAmount: 0, transactionsCount: 0}};
  const updatedTransactions = addRunningBalance([...transactions]);
  let localTrans = sortObjectsArray([ ...updatedTransactions ], sort, "id") as Array<Transaction>;
  const localFilter = { ...maxFilter, ...filter};
  localTrans = localTrans.filter(t => 
      t.amount >= (localFilter.fromAmount ?? 0) &&
      t.amount <= (localFilter.toAmount ?? 0) &&
      t.date >= new Date(localFilter.fromDate ?? "1/1/1970") &&
      t.date <= new Date(localFilter.toDate ?? "1/1/2050" ) &&
      t.comments.toLowerCase().indexOf(localFilter.comments?.toLowerCase() ?? "") > -1
    );

  if (localFilter.merchants.length > 0) {
    localTrans = localTrans.filter(t => !!localFilter.merchants.find(m => t.merchant?.id === m.id));
  }
  if (localFilter.categories.length > 0) {
    localTrans = localTrans.filter(t => !!localFilter.categories.find(c => t.category.id === c.id));
  }
  const startNumber = (pageNumber - 1) * pageSize;
  const endNumber = startNumber + pageSize;
  const transactionPage = localTrans.slice(startNumber, endNumber);
  console.log("Sorted ", localTrans);
  return { transactions: updatedTransactions, transactionPage, summary: getTransactionsSummary(localTrans, pageSize) }
}

function addRunningBalance(transactions: Transaction[]): Transaction[] {
  const localTrans = sortObjectsArray(transactions, { column: "date", direction: "asc"}, "id") as Transaction[];
  let runningBalance = 0;
  return localTrans.map((lt => {
     runningBalance += (lt.type === "Credit" ? (-1*lt.amount) : lt.amount);
     return { ...lt, runningBalance };
  }));
}

function getTransactionsSummary(transactions: Transaction[], pageSize: number): TranactionsSummaryType {
  return ({ 
    numPages: Math.ceil(transactions.length / pageSize),
    transactionsCount: transactions.length,
    totalCreditAmount: transactions.reduce((a, t) => t.type === "Credit" ? (a + t.amount) : a, 0),
    totalDebitAmount: transactions.reduce((a, t) => t.type === "Debit" ? (a + t.amount) : a, 0)
  });
}

export const transactionsReducer = (state: TransactionsState, action: ActionWithPayload): TransactionsState => {
  const newState: TransactionsState = { ...state, lastAction: action };
  console.log("Transaction Reducer*********************>" + action.type, action, state);
  switch (action.type) {
    case TransactionActionTypes.SET_PAGE_NUMBER: {
      const pageNumber = action.payload as number;
      const localState = { ...newState, pageNumber };
      return { ...localState, ...filterTransactions(localState), };
    }
    case TransactionActionTypes.ADD_TRANSACTION: { 
      const type = action.payload as CreditCardTransactionType;
      const baseTransaction = type === "Credit" ? newCreditTransaction : newDebitTransaction;
      const currentTransaction = { ...baseTransaction, date: midnightToday() };
      return { ...newState, currentTransaction, modal: "Edit" }
    }
    case TransactionActionTypes.EDIT_TRANSACTION: {
      const currentTransaction = action.payload as Transaction;
      return { ...newState, currentTransaction, modal: "Edit" }
    }
    case TransactionActionTypes.UPDATE_TRANSACTION: {
      const currentTransaction = action.payload as Transaction;
      return { ...newState, currentTransaction, modal: "Edit" };
    } 
    case TransactionActionTypes.CREATE_TRANSACTION_INIT: {
      const trans = action.payload as Transaction;
      const transId = trans?.id;
      if (transId) throw new Error("Create cannot be called for an existing transaction");
      //const transactions = [ ...newState.transactions, trans ];
      return { ...newState, backupTransaction: undefined, currentTransaction: newDebitTransaction, modal: "None", showAppSpinner: false, showApiSpinner: true }; 
    }
    case TransactionActionTypes.CREATE_TRANSACTION_SUCCESS: {
      let trans = action.payload as Transaction;
      trans = { ...trans, date: new Date(trans.date) };
      if (!trans.id) throw new Error("An id must be assigned to the transaction");
      //const transactions = state.transactions.map(t => t.id === 0 ? trans : t);
      const transactions = [ ...state.transactions, trans]
      if (!transactions.includes(trans)) throw new Error("Unable to locate transaction that was saved")
      const localState: TransactionsState = { ...newState, currentTransaction: newDebitTransaction, backupTransaction: undefined, transactions, alert: API_CREATE_TRANSACTION_SUCCESS_ALERT, showAppSpinner: false, showApiSpinner: false };
      return { ...localState, ...filterTransactions(localState)}; 
    }
    case TransactionActionTypes.CREATE_TRANSACTION_FAILURE: {
      const transactions = state.transactions.filter(t => t.id !== 0);
      const localState: TransactionsState = { ...newState, currentTransaction: newDebitTransaction, backupTransaction: undefined, transactions, alert: API_CREATE_TRANSACTION_FAILURE_ALERT, showAppSpinner: false, showApiSpinner: false }; 
      return { ...localState, ...filterTransactions(localState)}
    }
    case TransactionActionTypes.UPDATE_TRANSACTION_INIT: {
      const trans = action.payload as Transaction;
      const transId = trans?.id;
      if (!transId) throw new Error("Transaction id must be set to update");
      const backupTransaction = newState.transactions.find(t => t.id === transId);
      const transactions = newState.transactions.map(t => t.id === transId ? trans : t);
      return { ...newState, backupTransaction, currentTransaction: newDebitTransaction, transactions, modal: "None", showAppSpinner: false, showApiSpinner: true }; 
    }
    case TransactionActionTypes.UPDATE_TRANSACTION_SUCCESS: {
      const localState: TransactionsState = { ...newState, currentTransaction: newDebitTransaction, backupTransaction: undefined, alert: API_UPDATE_TRANSACTION_SUCCESS_ALERT, showApiSpinner: false }; 
      return { ...localState, ...filterTransactions(localState)}
    }
    case TransactionActionTypes.UPDATE_TRANSACTION_FAILURE: {
      const transactions = state.transactions.map(t => t.id === state.backupTransaction?.id ? state.backupTransaction as Transaction : t)
      const localState: TransactionsState = { ...newState, currentTransaction: newDebitTransaction, backupTransaction: undefined, transactions, alert: API_UPDATE_TRANSACTION_FAILURE_ALERT, showApiSpinner: false }; 
      return { ...localState, ...filterTransactions(localState)}
    }
    case TransactionActionTypes.DELETE_TRANSACTION_INIT: {
      const id = newState.currentTransaction?.id;
      const transactions = newState.transactions.filter(t => t.id !== id);
      const backupTransaction = newState.transactions.find(t => t.id === id);
      const localState: TransactionsState = {...newState, transactions, backupTransaction, summary: getTransactionsSummary(transactions, state.pageSize), showApiSpinner: true };
      return { ...localState, ...filterTransactions(localState) };
    }
    case TransactionActionTypes.DELETE_TRANSACTION_SUCCESS: {
      const localState: TransactionsState = { ...newState, alert: API_DELETE_TRANSACTION_SUCESS_ALERT }
      console.log("Delete Transaction Success", localState);
      return { ...localState, backupTransaction: undefined, ...filterTransactions(localState), showApiSpinner: false };
    }
    case TransactionActionTypes.DELETE_TRANSACTION_FAILURE: {
      const transactions: Array<Transaction> = [ ...state.transactions, state.backupTransaction as Transaction];
      const localState: TransactionsState = { 
        ...newState, 
        transactions,
        backupTransaction: undefined, 
        lastAction: action,
        alert: API_DELETE_TRANSACTION_FAILURE_ALERT,
        showApiSpinner: false
      };
      return { ...localState, ...filterTransactions(localState)}
    }
    case TransactionActionTypes.SET_CURRENT_TRANSACTION: {
      const currentTransaction = action.payload as Transaction;
      return { ...newState, currentTransaction }; 
    }
    case TransactionActionTypes.CLEAR_CURRENT_TRANSACTION: {
      return { ...newState, currentTransaction: undefined }; 
    }
    case TransactionActionTypes.SET_SORT: {
      const column = action.payload as string;
      let direction: "asc" | "desc" = "asc";
      if (state.sort?.column === column) {
        direction = state.sort?.direction === "asc" ? "desc" : "asc";
      }
      const localState = { ...newState, sort: { column, direction}, pageNumber: 1 }; 
      return { ...localState, ...filterTransactions(localState) };
    }
    case TransactionActionTypes.SET_MODAL: {
      const modal = action.payload as ModalType;
      return { ...newState, modal };
    }
    case TransactionActionTypes.SET_SEARCH_FILTER: {
      const filter = action.payload as TransactionSearchFilterType;
      const localState = { ...newState, filter, pageNumber: 1 }
      return { ...localState, ...filterTransactions(localState)};
    }
    case TransactionActionTypes.LOAD_TRANSACTIONS_INIT: {
     return {...newState, showAppSpinner: true }; 
    }
    case TransactionActionTypes.LOAD_TRANSACTIONS_SUCCESS: {
      const transactions = (action.payload as Array<Transaction>).map(t => ({ 
        ...t, 
        date: new Date(t.date),
        merchantName: t.merchant ? t.merchant.name : "",
        categoryName: t.category ? t.category.name : ""
      }));
      const localState = { ...newState, transactions: transactions, showAppSpinner: false };
      return { ...localState, ...filterTransactions(localState) };
    }
    case TransactionActionTypes.LOAD_TRANSACTIONS_FAILURE: {
      return { ...newState, showAppSpinner: false, showFailureMessage: true };
    }
    case TransactionActionTypes.HIDE_ALERT: {
      return { ...newState, alert: undefined };
    }
    case TransactionActionTypes.REMOVE_COLUMN_FILTER: {
      const payload = action.payload as string[];
      
      if (!payload || payload.length === 0) {
        const localState = { ...state, filter: emptyFilter };
        return { ...localState,  ...filterTransactions(localState) };
      }
        
      const filter = state.filter as Indexable;
      let newFilter: TransactionSearchFilterType = emptyFilter;
      const keys = Object.keys(filter);

      keys.forEach(k => {
        //if (["merchants", "types"].includes(k)) newFilter = { ...newFilter, [k]: filter[k] };
        if (!payload.includes(k)) {
          newFilter = { ...newFilter, [k]: filter[k] }
        }
      })
      const localState: TransactionsState = { ...state, filter: newFilter };
      return { ...localState, ...filterTransactions(localState)};
    }
    default:
      return state;
  }
}