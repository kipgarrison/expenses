import Modal from 'react-bootstrap/modal';
import Button from 'react-bootstrap/button';
import TransactionTable from './TransactionTable';
import TransactionSearchForm from './TransactionSearchForm';
import TransactionForm from './TransactionForm';
import TransactionSearchSummary from './TransactionSummarySummary';
import { useEffect} from 'react';
import React from 'react';
import type { ActionWithPayload } from '../../actions/ActionWithPayload';
import { createTransaction } from '../../effects/transactions/createTransactionEffect';
import { deleteTransaction } from '../../effects/transactions/deleteTransactionEffect';
import { loadTransactions } from '../../effects/transactions/loadTransactionsEffect';
import { updateTransaction } from '../../effects/transactions/updateTransactionEffect';
import { transactionsReducer } from '../../reducers/transactionsReducer';
import type { ColumnType } from '../../types/ColumnType';
import type { Transaction } from '../../types/Transaction';
import type { TransactionFilterSummaryProps } from '../../types/TransactionFilterSummaryProps';
import type { TransactionSearchFilterType } from '../../types/TransactionSeachFilterType';
import type { TransactionsProps } from '../../types/TransactionsProps';
import { transactionStateInitialValue } from '../../types/TransactionsState';
import type { CreditCardTransactionType, ModalType } from '../../types/unionTypes';
import { AppCrash } from '../errors/AppCrash';
import { ApiSpinner } from '../shared/ApiSpinner';
import { AppSpinner } from '../shared/AppSpinner';
import { AppToast } from '../shared/AppToast';
import { AddTransactionAction, ClearCurrentTransactionAction, CreateTransactionInitAction, DeleteTransactionInitAction, EditTransactionAction, HideAlertAction, LoadTransactionsInitAction, RemoveColumnFilterAction, SetCurrentTransactionAction, SetModalAction, SetSearchFilterAction, SetSortAction, UpdatePageNumberAction, UpdateTransactionAction, UpdateTransactionInitAction } from '../../actions/TransactionActions';

export function Transactions( { merchants, categories }: TransactionsProps) {
  const [ state, dispatch ] = React.useReducer(transactionsReducer, transactionStateInitialValue );
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
    addTransaction: (type: CreditCardTransactionType) => dispatch(new AddTransactionAction(type)),
    update: (transaction: Transaction) => {
      dispatch(new UpdateTransactionAction(transaction));
    },
    save: (transaction: Transaction) => {
      dispatch(new SetModalAction("None"));
      dispatch(transaction.id 
        ? new UpdateTransactionInitAction(transaction) 
        : new CreateTransactionInitAction(transaction));      
    },
    sort: (col: ColumnType) => {
        if (col.unsortable) return;
        dispatch(new SetSortAction(col.column));
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

  const show = state.showAppSpinner;

  return (
    <AppSpinner show={show}>
      <>
        <TransactionForm 
          transaction={state.currentTransaction as Transaction}
          merchants={merchants}
          categories={categories}
          onChange={handlers.update}
          onSave={handlers.save}
          onHide={() => handlers.setModal("None")}
          show={state.modal === "Edit"}/>
  
        <ApiSpinner show={state.showApiSpinner} />
        <AppToast alert={state?.alert} onClose={closeAlert} />
        <AppCrash show={state.showFailureMessage} />
        <TransactionTable 
          transactions={state.transactionPage} 
          onDelete={handlers.startDelete} 
          onEdit={handlers.edit} 
          pageNumber={state.pageNumber}
          onSort={handlers.sort}
          summary={state.summary}
          onPageNumberChange={handlers.pageNumber}
          currentSort={state.sort}>
            <Button variant="primary" onClick={() => handlers.addTransaction("Debit")} role="add-transaction" className='m-1'>
              Add Debit
            </Button>          
            <Button variant="primary" onClick={() => handlers.addTransaction("Credit")} role="add-transaction" className='m-1'>
              Add Credit
            </Button>          
            <Button role="search-button" variant="secondary" onClick={()=>handlers.setModal("Search")} className='m-1'>
                  Filter
            </Button>
          </TransactionTable>
          <TransactionSearchSummary {...filterSummaryProps} />
        
        <Modal data-testid="confirm-delete" show={state.modal === "ConfirmDelete"} onHide={()=>handlers.setModal("None")}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this transation from {state.currentTransaction?.merchant.name} which occured on {state.currentTransaction?.date.toLocaleDateString()}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handlers.cancelDelete} data-testid="cancel-button">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handlers.delete(state.currentTransaction as Transaction)} data-testid="confirm-button">
              Delete Transaction
            </Button>
          </Modal.Footer>
        </Modal>

        <TransactionSearchForm 
          filter={state.filter} 
          merchants={merchants}
          categories={categories}
          show={state.modal === "Search"} 
          onClose={() => handlers.setModal("None")} 
          onSearch={(f) => {handlers.search(f)}} />
      </>
    </AppSpinner>
    )
}
