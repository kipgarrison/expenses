import Modal from 'react-bootstrap/modal';
import Button from 'react-bootstrap/button';
import { ModalBody, ModalHeader } from 'react-bootstrap';
import type { TransactionsProps } from '../types/TransactionsProps';
import type { Transaction } from '../types/Transaction';
import TransactionTable from './Transaction-Table';
import TransactionSearchForm from './TransactionSearchForm';
import TransactionForm from './Transaction-Form';
import TransactionFilterSummary from './TransactionFilterSummary';
import type { TransactionFilterSummaryProps } from '../types/TransactionFilterSummaryProps';

export function Transactions(props: TransactionsProps) {
const { state, handlers } = props;

  const filterSummaryProps: TransactionFilterSummaryProps = {
    filter: state.filter,
    clearColumns: (cols: string[]) => handlers.clearFilterColumns(cols),
    clearAll: () => handlers.clearFilterColumns([])
  };

  return (
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
        <div className="row">
          <div className="col-6">
            <h3>Expenses</h3>
          </div>
          <div className="col-6">
            <Button 
              role="search-button"
              className='float-end' 
              size='sm' 
              onClick={()=>handlers.setModal("Search")}>
                Filter
            </Button>
          </div>
        </div>
          
        <TransactionFilterSummary {...filterSummaryProps} />
        <TransactionTable 
          show={state.apiStatus !== "INITIAL"}
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
        
        <Modal role="confirm-delete" show={state.modal === "ConfirmDelete"} onHide={()=>handlers.setModal("Search")}>
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
        { /*<button onClick={() => console.log(transState)}>State</button> */ }
      </>
    )
}
