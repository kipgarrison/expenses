import axios from "axios";
import type { ActionWithPayload } from "../../../actions/ActionWithPayload";
import { BudgetActionTypes } from "../../../actions/budget/BudgetActionTypes";
import { LoadBudgetFailureAction, LoadBudgetSuccessAction } from "../../../actions/budget/BudgetActions";

export function getBudgetEffect(actions: ActionWithPayload[], dispatch: (action: ActionWithPayload)=>void) {
  const budgetInit = actions.find(a => a.type === BudgetActionTypes.LOAD_BUDGET_INIT);
  if (budgetInit) {
    executeLoad(budgetInit.payload as { month: number, year: number });
  }
    
  async function executeLoad(monthYear?: { month: number, year: number}) {
    const date = new Date();
    const month = monthYear?.month ?? date.getMonth();
    const year = monthYear?.year ?? date.getFullYear();

    const url = `http://localhost:3000/api/v1/budget/${year}/${month}` 
    try {
      const result = await axios.get(url);
      dispatch(new LoadBudgetSuccessAction(result.data));
    }
    catch {
      dispatch(new LoadBudgetFailureAction());
    }
  }
}