import { AddTransactionAction, ClearCurrentTransactionAction, UpdatePageNumberAction, UpdateTransactionAction, EditTransactionAction, DeleteTransactionInitAction, ShowAlertAction, HideAlertAction, SetSortAction, SetSearchFilterAction, CreateTransactionInitAction,  UpdateTransactionInitAction, SetModalAction, LoadTransactionsInitAction, SetCurrentTransactionAction } from './actions/Actions';
import TransactionTable from './components/Transaction-Table';
import { transactionsReducer } from './reducers/transactionsReducer';
import type { Transaction } from './types/Transaction';
import { useReducer, useEffect } from 'react';
import TransactionForm from './components/Transaction-Form';
import Modal from 'react-bootstrap/modal';
import Button from 'react-bootstrap/button';
import { ModalBody, ModalHeader, Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'
import { transactionStateInitialValue, type AlertType } from './types/TransactionsState';
import "./App.css";
import HeaderNavigation from './components/Header-Navigation';
import TransactionSearchForm from './components/TransactionSearchForm';
import type { TransactionSearchFilter } from './types/TransactionSeachFilter';
import { deleteTransaction } from './components/effects/deleteTransactionEffect';
import { loadTransactions } from './components/effects/loadTransactionsEffect';
import { createTransaction } from './components/effects/createTransactionEffect';
import type { ActionWithPayload } from './actions/ActionWithPayload';
import { updateTransaction } from './components/effects/updateTransactionEffect';
import type { ModalType } from './types/unionTypes';

function App() {   
  const [ transState, transDispatch] = useReducer(transactionsReducer, transactionStateInitialValue );
  //const [ showModal, setShowModal ] = useState(false);

  //Initialize data loading
  useEffect(() => transDispatch(new LoadTransactionsInitAction()), []);

  //load transactions
  useEffect(() => loadTransactions(transState.lastAction as ActionWithPayload, transDispatch), [transState.lastAction]);
  //delete tranaction
  useEffect(() => deleteTransaction(transState.lastAction as ActionWithPayload, transDispatch), [transState.lastAction]);
  // create transaction
  useEffect(() => createTransaction(transState.lastAction as ActionWithPayload, transDispatch), [transState.lastAction]);
  // create transaction
  useEffect(() => updateTransaction(transState.lastAction as ActionWithPayload, transDispatch), [transState.lastAction]);
 
  // hide any alert that is shown after 5 seconds
  useEffect(() => {
    if (transState.alert?.type) {
      setTimeout(()=>{
        setShowAlert(false);
      }, 5000);
    } 
  }, [transState.alert]);
 
  function handleDelete(transaction: Transaction) {
    setModal("ConfirmDelete");  
    transDispatch(new SetCurrentTransactionAction(transaction))
  }

  function confirmDelete(transaction: Transaction) {
    setModal("None");
    transDispatch(new DeleteTransactionInitAction(transaction));
  }

  function cancelDelete() {
    transDispatch(new ClearCurrentTransactionAction());
    setModal("None");
  }

  function handleEdit(transaction: Transaction) {
    transDispatch(new EditTransactionAction(transaction))
  }

  const handlePageNumberChange = (pageNumber: number) => {
    transDispatch(new UpdatePageNumberAction(pageNumber));
    console.log(transState);
  }

 const addTransaction = () => {
  transDispatch(new AddTransactionAction());
 }

 const handleTransactionUpdate = (transaction: Transaction) => {
  transDispatch(new UpdateTransactionAction(transaction));
 }

 const handleTransactionSave = (transaction: Transaction) => {
  setModal("None");
  transDispatch(transaction.id 
    ? new UpdateTransactionInitAction(transaction) 
    : new CreateTransactionInitAction(transaction));
 }

const setShowAlert = (show: boolean, alert?: AlertType) => {
  if (show && !alert) throw new Error("Unable to show alert without a message");
  if (!show) return transDispatch(new HideAlertAction());
  transDispatch(new ShowAlertAction(alert as AlertType));
};

const handleSort = (col: string) => {
  transDispatch(new SetSortAction(col));
}

const handleSearch = (filter: TransactionSearchFilter) => {
  console.log(filter);
  transDispatch(new SetSearchFilterAction(filter));
  setModal("None")
}  

const setModal = (modal: ModalType) => transDispatch(new SetModalAction(modal))
const merchants = [ "Wal-Mart", "Sam's Club", "Schnucks", "Target", "QT", "Dierbergs", "Aldis", "O'Fallon City", "McDonalds", "Menards", "Touchette", "Wal-Greens" ]
const types = [ "Credit Card Debit", "Bank Account Debit", "Credit Card Credit", "Bank Account Credit" ];
const spinnerClass = transState.apiStatus === "INITIAL" ? "spinner" : "hide";
const apiSpinnerClass = transState.apiStatus === "RUNNING" ? "apiSpinner" : "hide";

return (
    <div className='container'>
      <div className={apiSpinnerClass}>
        <Spinner animation="border"></Spinner>
      </div>
      <div className='row'>
        <HeaderNavigation />
        <div className='col-12'>
          { transState.alert &&
              <Alert variant={transState.alert.type} onClose={() => setShowAlert(false)} dismissible>
                  {transState.alert.message}
              </Alert>
          }
            
          <Modal show={transState.modal==="Edit"} onHide={() => setModal("None")} role="transaction-form">
            <ModalHeader closeButton>
              <Modal.Title>
                { transState.currentTransaction?.id ? 'Edit Transaction' : 'Add Transaction' }
              </Modal.Title>
            </ModalHeader>
            <ModalBody>
                <TransactionForm 
                  transaction={transState.currentTransaction as Transaction}
                  merchants={merchants}
                  types={types}
                  onChange={handleTransactionUpdate}
                  onSave={handleTransactionSave}/>
            </ModalBody>
          </Modal>
          <div className="row">
            <div className="col-6">
              <h3>Expenses</h3>
            </div>
            <div className="col-6">
              <Button 
                role="search-button"
                className='float-end' 
                size='sm' 
                onClick={()=>setModal("Search")}>
                  Filter
              </Button>
            </div>
          </div>
          
          <div className={spinnerClass}><Spinner animation="border"/><span className='mr-5'>Please be patient while we load your data...</span></div>
          <TransactionTable 
            show={transState.apiStatus !== "INITIAL"}
            transactions={transState.transactionPage} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
            pageNumber={transState.pageNumber}
            onSort={handleSort}
            summary={transState.summary}
            onPageNumberChange={handlePageNumberChange}
            currentSort={transState.sort}/>
          <Button variant="primary" onClick={addTransaction} role="add-transaction">
            Add Transaction
          </Button>          
        </div>
      </div>
       
      <Modal role="confirm-delete" show={transState.modal === "ConfirmDelete"} onHide={()=>setModal("Search")}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this transation from {transState.currentTransaction?.merchant} which occured on {transState.currentTransaction?.date.toLocaleDateString()}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete} role="cancel-button">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => confirmDelete(transState.currentTransaction as Transaction)} role="confirm-button">
            Delete Transaction
          </Button>
        </Modal.Footer>
      </Modal>

      <TransactionSearchForm 
        filter={transState.filter} 
        merchants={merchants}
        types={types}
        show={transState.modal === "Search"} 
        onClose={() => setModal("None")} 
        onSearch={(f) => {handleSearch(f)}} />
      { /*<button onClick={() => console.log(transState)}>State</button> */ }
    </div>
  )
}

export default App
