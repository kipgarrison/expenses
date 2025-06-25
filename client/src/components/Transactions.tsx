import Modal from 'react-bootstrap/modal';
import Button from 'react-bootstrap/button';
import { ModalBody, ModalHeader } from 'react-bootstrap';
//import type { TransactionsProps } from '../types/TransactionsProps';
import type { Transaction } from '../types/Transaction';
import TransactionTable from './Transaction-Table';
import TransactionSearchForm from './TransactionSearchForm';
import TransactionForm from './Transaction-Form';
import type { TransactionFilterSummaryProps } from '../types/TransactionFilterSummaryProps';
import TransactionSearchSummary from './TransactionSummarySummary';
import { transactionsReducer } from '../reducers/transactionsReducer';
import { transactionStateInitialValue } from '../types/TransactionsState';
import { useEffect, useReducer } from 'react';
import type { ModalType } from '../types/unionTypes';
import { AddTransactionAction, ClearCurrentTransactionAction, CreateTransactionInitAction, DeleteTransactionInitAction, EditTransactionAction, HideAlertAction, LoadTransactionsInitAction, RemoveColumnFilterAction, SetCurrentTransactionAction, SetModalAction, SetSearchFilterAction, SetSortAction, UpdatePageNumberAction, UpdateTransactionAction, UpdateTransactionInitAction } from '../actions/TransactionActions';
import type { TransactionSearchFilterType } from '../types/TransactionSeachFilterType';
import type { ActionWithPayload } from '../actions/ActionWithPayload';
import { createTransaction } from './effects/createTransactionEffect';
import { deleteTransaction } from './effects/deleteTransactionEffect';
import { loadTransactions } from './effects/loadTransactionsEffect';
import { updateTransaction } from './effects/updateTransactionEffect';
//import { TransactionActionTypes } from '../actions/TransactionActionTypes';
//import { API_CREATE_TRANSACTION_FAILURE_ALERT, API_CREATE_TRANSACTION_SUCCESS_ALERT, API_DELETE_TRANSACTION_FAILURE_ALERT, API_DELETE_TRANSACTION_SUCESS_ALERT, API_UPDATE_TRANSACTION_FAILURE_ALERT, API_UPDATE_TRANSACTION_SUCCESS_ALERT } from '../types/constants';
import { AppSpinner } from './AppSpinner';
import { AppToast } from './AppToast';
import { ApiSpinner } from './ApiSpinner';


export function Transactions() {
  const [ state, dispatch ] = useReducer(transactionsReducer, transactionStateInitialValue );
  // const [showSpinner, setShowSpinner] = useState(true);
  
  const handlers = {
        startDelete: (transaction: Transaction) => {
          dispatch(new SetModalAction("ConfirmDelete"));
          dispatch(new SetCurrentTransactionAction(transaction))
        },
        delete: (transaction: Transaction) => {
          dispatch(new SetModalAction("None"));
          dispatch(new DeleteTransactionInitAction(transaction));
        },
        cancelDelete: () => {
          dispatch(new ClearCurrentTransactionAction());
          dispatch(new SetModalAction("None"));
        },
        edit: (transaction: Transaction) => dispatch(new EditTransactionAction(transaction)),
        pageNumber: (pageNumber: number) => {
          dispatch(new UpdatePageNumberAction(pageNumber));
        },
        addTransaction: () => dispatch(new AddTransactionAction()),
        update: (transaction: Transaction) => {
          dispatch(new UpdateTransactionAction(transaction));
        },
        save: (transaction: Transaction) => {
          dispatch(new SetModalAction("None"));
          dispatch(transaction.id 
            ? new UpdateTransactionInitAction(transaction) 
            : new CreateTransactionInitAction(transaction));      
          },
          sort: (col: string) => {
            dispatch(new SetSortAction(col));
          },
          search: (filter: TransactionSearchFilterType) => {
            dispatch(new SetSearchFilterAction(filter));
            dispatch(new SetModalAction("None"));  
          },
          setModal: (modal: ModalType) => dispatch(new SetModalAction(modal)),
          clearFilterColumns: (columns: string[]) => dispatch(new RemoveColumnFilterAction(columns))
      }

  const filterSummaryProps: TransactionFilterSummaryProps = {
    filter: state.filter,
    clearColumns: (cols: string[]) => handlers.clearFilterColumns(cols),
    clearAll: () => handlers.clearFilterColumns([])
  };

  
  
  useEffect(() => dispatch(new LoadTransactionsInitAction()), []);
  //load transactions
  useEffect(() => loadTransactions(state.lastAction as ActionWithPayload, dispatch), [state.lastAction]);
  //delete tranaction
  useEffect(() => deleteTransaction(state.lastAction as ActionWithPayload, dispatch), [state.lastAction]);
  // create transaction
  useEffect(() => createTransaction(state.lastAction as ActionWithPayload, dispatch), [state.lastAction]);
  // create transaction
  useEffect(() => updateTransaction(state.lastAction as ActionWithPayload, dispatch), [state.lastAction]);
  
  function closeAlert() {
    dispatch(new HideAlertAction());
  }

  const show = state.transactions?.length === 0;

  return (
      <AppSpinner show={show}>
      <>
         <Modal show={state.modal==="Edit"} onHide={() => handlers.setModal("None")} role="transaction-form">
            <ModalHeader closeButton>
              <Modal.Title>
                { state.currentTransaction?.id ? 'Edit Transaction' : 'Add Transaction' }
              </Modal.Title>
            </ModalHeader>
            <ModalBody>
                <TransactionForm 
                  transaction={state.currentTransaction as Transaction}
                  merchants={state.merchants}
                  types={state.transactionTypes}
                  onChange={handlers.update}
                  onSave={handlers.save}/>
            </ModalBody>
          </Modal>
          <ApiSpinner show={state.showSpinner} />
          <AppToast alert={state?.alert} onClose={closeAlert} />
          <TransactionSearchSummary {...filterSummaryProps} />
          <TransactionTable 
            transactions={state.transactionPage} 
            onDelete={handlers.startDelete} 
            onEdit={handlers.edit} 
            pageNumber={state.pageNumber}
            onSort={handlers.sort}
            summary={state.summary}
            onPageNumberChange={handlers.pageNumber}
            currentSort={state.sort}/>
          <Button variant="primary" onClick={handlers.addTransaction} role="add-transaction">
            Add Transaction
          </Button>          
          
          <Modal role="confirm-delete" show={state.modal === "ConfirmDelete"} onHide={()=>handlers.setModal("None")}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this transation from {state.currentTransaction?.merchant} which occured on {state.currentTransaction?.date.toLocaleDateString()}?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handlers.cancelDelete} role="cancel-button">
                Cancel
              </Button>
              <Button variant="primary" onClick={() => handlers.delete(state.currentTransaction as Transaction)} role="confirm-button">
                Delete Transaction
              </Button>
            </Modal.Footer>
          </Modal>

          <TransactionSearchForm 
            filter={state.filter} 
            merchants={state.merchants}
            types={state.transactionTypes}
            show={state.modal === "Search"} 
            onClose={() => handlers.setModal("None")} 
            onSearch={(f) => {handlers.search(f)}} />
        </>
        </AppSpinner>
    )
}
