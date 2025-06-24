import { ActionTypes } from "../actions/Action_Types";
import { ActionWithPayload } from "../actions/ActionWithPayload";
import { midnightToday } from "../helpers/midnightToday";
import { API_DELETE_TRANSACTION_FAILURE_ALERT, API_DELETE_TRANSACTION_SUCESS_ALERT, API_LOAD_TRANSACTIONS_FAILURE_ALERT } from "../types/constants";
import type { Indexable } from "../types/Indexable";
import { newTransaction, type Transaction } from "../types/Transaction";
import { emptyFilter, maxFilter, type TransactionSearchFilterType } from "../types/TransactionSeachFilterType";
import type { AlertType, TranactionsSummaryType, TransactionsState } from "../types/TransactionsState";
import type { ModalType } from "../types/unionTypes";

function filterTransactions({ transactions, pageNumber, pageSize, sort, filter }: TransactionsState): { transactionPage: Transaction[], summary: TranactionsSummaryType } {
  if (!transactions) return { transactionPage: [], summary: { numPages: 0, totalAmount: 0, transactionsCount: 0}};
  const sortCol = sort?.column || "date";
  const direction = sort?.direction || "asc";
  const ascSorter = (a: Indexable, b: Indexable) => a[sortCol] > b[sortCol] ? 1 : -1;
  const descSorter = (a: Indexable, b: Indexable) => a[sortCol] > b[sortCol] ? -1 : 1;
  const sorter = direction === "asc" ? ascSorter : descSorter;
  // don't want to mutate the original array so...
  let localTrans = [...transactions ].sort(sorter);
  const localFilter = { ...maxFilter, ...filter};
  localTrans = localTrans.filter(t => 
      t.amount >= (localFilter.fromAmount ?? 0) &&
      t.amount <= (localFilter.toAmount ?? 0) &&
      t.date >= new Date(localFilter.fromDate ?? "1/1/1970") &&
      t.date <= new Date(localFilter.toDate ?? "1/1/2050" ) &&
      t.comments.toLowerCase().indexOf(localFilter.comments?.toLowerCase() ?? "") > -1
    );

  if (localFilter.merchants.length > 0) {
    localTrans = localTrans.filter(t => localFilter.merchants.indexOf(t.merchant) > -1);
  }
  if (localFilter.types.length > 0) {
    localTrans = localTrans.filter(t => localFilter.types.indexOf(t.type) > -1);
  }
  const startNumber = (pageNumber - 1) * pageSize;
  const endNumber = startNumber + pageSize;
  const transactionPage = localTrans.slice(startNumber, endNumber);
  return { transactionPage, summary: getTransactionsSummary(localTrans, pageSize) }
}

function getTransactionsSummary(transactions: Transaction[], pageSize: number): TranactionsSummaryType {
  return ({ 
    numPages: Math.ceil(transactions.length / pageSize),
    transactionsCount: transactions.length,
    totalAmount: transactions.reduce((a, t) => a + t.amount, 0)
  });
}

export const transactionsReducer = (state: TransactionsState, action: ActionWithPayload): TransactionsState => {
  const newState: TransactionsState = { ...state, lastAction: action };
  console.log("*********************>" + action.type, action);
  switch (action.type) {
    // case ActionTypes.SET_TRANSACTIONS: {
    //   const transactions = (action.payload as Array<Transaction>).map(t => ({ ...t, date: new Date(t.date)}));
    //   const localState = { ...newState, transactions: transactions };
    //   return { ...localState, transactions, ...filterTransactions(localState), apiStatus: 'NOT_RUNNING'};
    // }
    case ActionTypes.SET_PAGE_NUMBER: {
      const pageNumber = action.payload as number;
      const localState = { ...newState, pageNumber };
      return { ...localState, ...filterTransactions(localState), };
    }
    case ActionTypes.ADD_TRANSACTION: { 
      const currentTransaction = { ...newTransaction, date: midnightToday() };
      return { ...newState, currentTransaction, modal: "Edit" }
    }
    case ActionTypes.EDIT_TRANSACTION: {
      const currentTransaction = action.payload as Transaction;
      return { ...newState, currentTransaction, modal: "Edit" }
    }
    case ActionTypes.UPDATE_TRANSACTION: {
      const currentTransaction = action.payload as Transaction;
      return { ...newState, currentTransaction, modal: "Edit" };
    } 
    case ActionTypes.CREATE_TRANSACTION_INIT: {
      const trans = action.payload as Transaction;
      const transId = trans?.id;
      if (transId) throw new Error("Create cannot be called for an existing transaction");
      const transactions = [ ...newState.transactions, trans ];
      return { ...newState, backupTransaction: undefined, currentTransaction: newTransaction, transactions, modal: "None", apiStatus: "RUNNING" }; 
    }
    case ActionTypes.CREATE_TRANSACTION_SUCCESS: {
      let trans = action.payload as Transaction;
      trans = { ...trans, date: new Date(trans.date) };
      if (!trans.id) throw new Error("An id must be assigned to the transaction");
      const transactions = state.transactions.map(t => t.id === 0 ? trans : t);
      if (!transactions.includes(trans)) throw new Error("Unable to locate transaction that was saved")
      const localState: TransactionsState = { ...newState, currentTransaction: newTransaction, backupTransaction: undefined, transactions, apiStatus: "NOT_RUNNING" };
      return { ...localState, ...filterTransactions(localState)}; 
    }
    case ActionTypes.CREATE_TRANSACTION_FAILURE: {
      const transactions = state.transactions.filter(t => t.id !== 0);
      const localState: TransactionsState = { ...newState, currentTransaction: newTransaction, backupTransaction: undefined, transactions, apiStatus: "NOT_RUNNING" }; 
      return { ...localState, ...filterTransactions(localState)}
    }
    case ActionTypes.UPDATE_TRANSACTION_INIT: {
      const trans = action.payload as Transaction;
      const transId = trans?.id;
      if (!transId) throw new Error("Transaction id must be set to update");
      const backupTransaction = newState.transactions.find(t => t.id === transId);
      const transactions = newState.transactions.map(t => t.id === transId ? trans : t);
      return { ...newState, backupTransaction, currentTransaction: newTransaction, transactions, modal: "None", apiStatus: "RUNNING" }; 
    }
    case ActionTypes.UPDATE_TRANSACTION_SUCCESS: {
      const localState: TransactionsState = { ...newState, currentTransaction: newTransaction, backupTransaction: undefined, apiStatus: "NOT_RUNNING" }; 
      return { ...localState, ...filterTransactions(localState)}
    }
    case ActionTypes.UPDATE_TRANSACTION_FAILURE: {
      const transactions = state.transactions.map(t => t.id === state.backupTransaction?.id ? state.backupTransaction as Transaction : t)
      const localState: TransactionsState = { ...newState, currentTransaction: newTransaction, backupTransaction: undefined, transactions, apiStatus: "NOT_RUNNING" }; 
      return { ...localState, ...filterTransactions(localState)}
    }
    case ActionTypes.DELETE_TRANSACTION_INIT: {
      const id = newState.currentTransaction?.id;
      const transactions = newState.transactions.filter(t => t.id !== id);
      const backupTransaction = newState.transactions.find(t => t.id === id);
      const localState: TransactionsState = {...newState, transactions, backupTransaction, lastAction: action, apiStatus: "RUNNING", summary: getTransactionsSummary(transactions, state.pageSize) };
      return { ...localState, ...filterTransactions(localState) };
    }
    case ActionTypes.DELETE_TRANSACTION_SUCCESS: {
      const alert = API_DELETE_TRANSACTION_SUCESS_ALERT;
      return { ...newState, backupTransaction: undefined, lastAction: action, apiStatus: "NOT_RUNNING", alert };
    }
    case ActionTypes.DELETE_TRANSACTION_FAILURE: {
      const alert = API_DELETE_TRANSACTION_FAILURE_ALERT;
      const transactions: Array<Transaction> = [ ...state.transactions, state.backupTransaction as Transaction];
      const localState: TransactionsState = { 
        ...newState, 
        transactions,
        backupTransaction: undefined, 
        lastAction: action, 
        apiStatus: "NOT_RUNNING", 
        alert 
      };
      return { ...localState, ...filterTransactions(localState)}
    }
    case ActionTypes.SET_CURRENT_TRANSACTION: {
      const currentTransaction = action.payload as Transaction;
      return { ...newState, currentTransaction }; 
    }
    case ActionTypes.CLEAR_CURRENT_TRANSACTION: {
      return { ...newState, currentTransaction: undefined }; 
    }
    case ActionTypes.HIDE_ALERT: {
      return { ...newState, alert: undefined }
    }
    case ActionTypes.SHOW_ALERT: {
      const alert = action.payload as AlertType;
      return { ...newState, alert }
    }
    case ActionTypes.SET_SORT: {
      const column = action.payload as string;
      let direction: "asc" | "desc" = "asc";
      if (state.sort?.column === column) {
        direction = state.sort?.direction === "asc" ? "desc" : "asc";
      }
      const localState = { ...newState, sort: { column, direction}, pageNumber: 1 }; 
      return { ...localState, ...filterTransactions(localState) };
    }
    case ActionTypes.SET_MODAL: {
      const modal = action.payload as ModalType;
      return { ...newState, modal };
    }
    case ActionTypes.SET_SEARCH_FILTER: {
      const filter = action.payload as TransactionSearchFilterType;
      const localState = { ...newState, filter, pageNumber: 1 }
      return { ...localState, ...filterTransactions(localState)};
    }
    case ActionTypes.LOAD_TRANSACTIONS_INIT: {
     return {...newState, apiStatus: "INITIAL" }; 
    }
    case ActionTypes.LOAD_TRANSACTIONS_SUCCESS: {
      const transactions = (action.payload as Array<Transaction>).map(t => ({ ...t, date: new Date(t.date)}));
      const localState = { ...newState, transactions: transactions };
      return { ...localState, transactions, ...filterTransactions(localState), apiStatus: 'NOT_RUNNING'};
    }
    case ActionTypes.LOAD_TRANSACTIONS_FAILURE: {
      const alert = API_LOAD_TRANSACTIONS_FAILURE_ALERT;
      return { ...newState, apiStatus: "NOT_RUNNING", alert };
    }
    case ActionTypes.REMOVE_COLUMN_FILTER: {
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
        // payload.forEach(f => {
        //   if (["merchants", "types"].includes(f)) newFilter = { ...newFilter, [f]: [] };
        //   else filter = { ...filter, [f]: undefined };
        // })

      const localState: TransactionsState = { ...state, filter: newFilter };
      return { ...localState, ...filterTransactions(localState)};
    }
    default:
      return state;
  }
}