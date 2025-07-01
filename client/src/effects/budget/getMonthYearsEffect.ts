import axios from "axios";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { BudgetActionTypes } from "../../actions/budget/BudgetActionTypes";
import { LoadMonthYearsFailureAction, LoadMonthYearsSuccessAction } from "../../actions/budget/BudgetActions";

export function getMonthYearsEffect(actions: ActionWithPayload[], dispatch: (action: ActionWithPayload)=>void) {
  const monthYearsAction = actions.find(a => a.type === BudgetActionTypes.LOAD_MONTH_YEARS_INIT);
  if (monthYearsAction) {
    executeLoad();
  }
  
  async function executeLoad() {
    const url = `http://localhost:3000/api/v1/budget/months` 
    try {
      const result = await axios.get(url);
      dispatch(new LoadMonthYearsSuccessAction(result.data));
    }
    catch {
      dispatch(new LoadMonthYearsFailureAction());
    }
  }
}