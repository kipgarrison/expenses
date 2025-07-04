import axios from "axios";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { BudgetActionTypes } from "../../actions/budget/BudgetActionTypes";
import { LoadSummarySuccessAction, LoadSummaryFailureAction } from "../../actions/budget/BudgetActions";

export function getBudgetSummaryEffect(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
  const summaryAction = action.type === BudgetActionTypes.LOAD_SUMMARY_INIT;
  if (summaryAction) {
    executeLoad(action.payload as { month: number, year: number });
  }
  
  async function executeLoad(monthYear?: { month: number, year: number}) {
    const date = new Date();
    const month = monthYear?.month ?? date.getMonth();
    const year = monthYear?.year ?? date.getFullYear();

    const url = `http://localhost:3000/api/v1/budget/daily/${year}/${month}` 
    try {
      const result = await axios.get(url);
      dispatch(new LoadSummarySuccessAction(result.data));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(ex: any) {
      dispatch(new LoadSummaryFailureAction(ex.response.data.error));
    }
 
  }
}