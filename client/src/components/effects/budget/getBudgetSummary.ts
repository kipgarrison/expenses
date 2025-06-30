import axios from "axios";
import type { ActionWithPayload } from "../../../actions/ActionWithPayload";
import { BudgetActionTypes } from "../../../actions/budget/BudgetActionTypes";
import { LoadSummarySuccessAction, LoadSummaryFailureAction } from "../../../actions/budget/BudgetActions";

export function getBudgetSummaryEffect(actions: ActionWithPayload[], dispatch: (action: ActionWithPayload)=>void) {
  const summaryAction = actions.find(a => a.type === BudgetActionTypes.LOAD_SUMMARY_INIT);
  if (summaryAction) {
    executeLoad(summaryAction.payload as { month: number, year: number });
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
    catch {
      dispatch(new LoadSummaryFailureAction());
    }
  }
}