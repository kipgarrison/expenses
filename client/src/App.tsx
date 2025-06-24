import { AddTransactionAction, ClearCurrentTransactionAction, UpdatePageNumberAction, UpdateTransactionAction, EditTransactionAction, DeleteTransactionInitAction, ShowAlertAction, HideAlertAction, SetSortAction, SetSearchFilterAction, CreateTransactionInitAction,  UpdateTransactionInitAction, SetModalAction, LoadTransactionsInitAction, SetCurrentTransactionAction, RemoveColumnFilter } from './actions/Actions';
import { transactionsReducer } from './reducers/transactionsReducer';
import type { Transaction } from './types/Transaction';
import { useReducer, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert'
import { transactionStateInitialValue, type AlertType } from './types/TransactionsState';
import "./App.css";
import HeaderNavigation from './components/Header-Navigation';
import type { TransactionSearchFilterType } from './types/TransactionSeachFilterType';
import { deleteTransaction } from './components/effects/deleteTransactionEffect';
import { loadTransactions } from './components/effects/loadTransactionsEffect';
import { createTransaction } from './components/effects/createTransactionEffect';
import type { ActionWithPayload } from './actions/ActionWithPayload';
import { updateTransaction } from './components/effects/updateTransactionEffect';
import type { ModalType } from './types/unionTypes';
import { Transactions } from './components/Transactions';
import type { TransactionsProps } from './types/TransactionsProps';
import { Spinner } from 'react-bootstrap';
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
 
  const transactionsProps: TransactionsProps = {
    state: transState,
    handlers : {
      startDelete: (transaction: Transaction) => {
        transDispatch(new SetModalAction("ConfirmDelete"));
        transDispatch(new SetCurrentTransactionAction(transaction))
      },
      delete: (transaction: Transaction) => {
        transDispatch(new SetModalAction("None"));
        transDispatch(new DeleteTransactionInitAction(transaction));
      },
      cancelDelete: () => {
        transDispatch(new ClearCurrentTransactionAction());
        transDispatch(new SetModalAction("None"));
      },
      edit: (transaction: Transaction) => transDispatch(new EditTransactionAction(transaction)),
      pageNumber: (pageNumber: number) => {
        transDispatch(new UpdatePageNumberAction(pageNumber));
        console.log(transState);
      },
      addTransaction: () => transDispatch(new AddTransactionAction()),
      update: (transaction: Transaction) => {
        transDispatch(new UpdateTransactionAction(transaction));
      },
      save: (transaction: Transaction) => {
        transDispatch(new SetModalAction("None"));
        transDispatch(transaction.id 
          ? new UpdateTransactionInitAction(transaction) 
          : new CreateTransactionInitAction(transaction));
      
        },
        sort: (col: string) => {
          transDispatch(new SetSortAction(col));
        },
        search: (filter: TransactionSearchFilterType) => {
          transDispatch(new SetSearchFilterAction(filter));
          transDispatch(new SetModalAction("None"));  
        },
        setModal: (modal: ModalType) => transDispatch(new SetModalAction(modal)),
        clearFilterColumns: (columns: string[]) => transDispatch(new RemoveColumnFilter(columns))
    }
  }  

  const setShowAlert = (show: boolean, alert?: AlertType) => {
    if (show && !alert) throw new Error("Unable to show alert without a message");
    if (!show) return transDispatch(new HideAlertAction());
    transDispatch(new ShowAlertAction(alert as AlertType));
  }
  
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
          <Transactions {...transactionsProps} />
        </div>
          
      </div>
    </div>
  )
}

export default App
