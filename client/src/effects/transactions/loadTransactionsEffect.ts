import axios from "axios";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { TransactionActionTypes } from "../../actions/TransactionActionTypes";
import { LoadTransactionsFailureAction, LoadTransactionsSuccessAction } from "../../actions/TransactionActions";

export function loadTransactionsEffect(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
  if (action?.type === TransactionActionTypes.LOAD_TRANSACTIONS_INIT) {
    executeLoad();
  }
  
  async function executeLoad() {
    const url = `http://localhost:3000/api/v1/transactions` 
    try {
      const result = await axios.get(url);
      dispatch(new LoadTransactionsSuccessAction(result.data));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(ex: any) {
      dispatch(new LoadTransactionsFailureAction(ex.response.data.error));
    }
  }
}


