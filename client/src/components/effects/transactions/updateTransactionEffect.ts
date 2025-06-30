import axios from "axios";
import type { ActionWithPayload } from "../../../actions/ActionWithPayload";
import { TransactionActionTypes } from "../../../actions/TransactionActionTypes";
import type { Transaction } from "../../../types/Transaction";
import { UpdateTransactionInitAction, UpdateTransactionSuccessAction, UpdateTransactionFailureAction } from "../../../actions/TransactionActions";

export function updateTransaction(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
    if (action?.type === TransactionActionTypes.UPDATE_TRANSACTION_INIT) {
      const trans = (action as UpdateTransactionInitAction).payload as Transaction;
      executeUpdate(trans, dispatch);
    }
  }

async function executeUpdate(transaction: Transaction, dispatch: (action: ActionWithPayload)=>void) {
  const url = `http://localhost:3000/api/v1/transactions/${transaction.id}`;
  try {
    const response = await axios.put<Transaction>(url, transaction);
    dispatch(new UpdateTransactionSuccessAction(response.data));
  }
  catch {
    dispatch(new UpdateTransactionFailureAction());
  }
}
   