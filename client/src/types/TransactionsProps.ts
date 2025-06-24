import type { Transaction } from "./Transaction"
import type { TransactionSearchFilterType } from "./TransactionSeachFilterType"
import type { TransactionsState } from "./TransactionsState"
import type { ModalType } from "./unionTypes"

export type TransactionsProps = {
  state: TransactionsState,
  handlers: handlersType
};

type handlersType = {
    startDelete: (transaction: Transaction) => void,
    delete: (transaction: Transaction) => void,
    cancelDelete: () => void,
    edit: (transaction: Transaction) => void,
    pageNumber: (pageNumber: number) => void,
    addTransaction: () => void,
    update: (transaction: Transaction) => void
    save: (transaction: Transaction) => void 
    sort: (col: string) => void,
    search: (filter: TransactionSearchFilterType) => void,
    setModal: (modal: ModalType) => void,
    clearFilterColumns: (columns: string[]) => void
  }
