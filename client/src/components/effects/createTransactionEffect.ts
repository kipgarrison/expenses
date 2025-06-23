import axios from "axios";
import { ActionTypes } from "../../actions/Action_Types";
import { CreateTransactionFailureAction, CreateTransactionSuccessAction, type CreateTransactionInitAction } from "../../actions/Actions";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import type { Transaction } from "../../types/Transaction";

export function createTransaction(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
  if (action?.type === ActionTypes.CREATE_TRANSACTION_INIT) {
    const trans = (action as CreateTransactionInitAction).payload as Transaction;
    executeCreate(trans); 
  }


  async function executeCreate(transaction: Transaction) {
    const url = "http://localhost:3000/api/v1/transactions";
    try {
      const response = await axios.post<Transaction>(url, transaction)
      const trans = { ...transaction, id: response.data.id };
      dispatch(new CreateTransactionSuccessAction(trans));
    }
    catch {
      dispatch(new CreateTransactionFailureAction());
    }
    
      /*.then((response: AxiosResponse<Transaction>) => {
        const trans = { ...transaction, id: response.data.id };
        dispatch(new CreateTransactionSuccessAction(trans));
      }).catch(() => dispatch(new CreateTransactionFailureAction()));*/
  }
}