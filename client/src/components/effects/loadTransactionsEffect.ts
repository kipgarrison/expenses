import axios from "axios";
import { LoadTransactionsFailureAction, LoadTransactionsSuccessAction } from "../../actions/Actions";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { ActionTypes } from "../../actions/Action_Types";

export function loadTransactions(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
  if (action?.type === ActionTypes.LOAD_TRANSACTIONS_INIT) {
    executeLoad();
  }
  
  async function executeLoad() {
    const url = `http://localhost:3000/api/v1/transactions` 
    try {
      const result = await axios.get(url);
      dispatch(new LoadTransactionsSuccessAction(result.data));
    }
    catch {
      dispatch(new LoadTransactionsFailureAction());
    }
  }
}


