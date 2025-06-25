import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { TransactionActionTypes } from "../../actions/TransactionActionTypes";
import { DeleteTransactionFailureAction, DeleteTransactionSuccessAction, type DeleteTransactionInitAction } from "../../actions/TransactionActions";
import type { Transaction } from "../../types/Transaction";
import axios from "axios";
import { DELETE_URL } from "../../types/constants";

export function deleteTransaction(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
  if (action?.type === TransactionActionTypes.DELETE_TRANSACTION_INIT) {
    const trans = (action as DeleteTransactionInitAction).payload as Transaction;
    executeDelete(trans, dispatch);
  }
}

async function executeDelete(transaction: Transaction, dispatch: (action: ActionWithPayload)=>void) {
    const url = `${DELETE_URL}/${transaction.id}` 
    try {
      await axios.delete(url);
      dispatch(new DeleteTransactionSuccessAction());
    }
    catch {
      dispatch(new DeleteTransactionFailureAction());
    }
  }
