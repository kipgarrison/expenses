import axios from "axios";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { BudgetActionTypes } from "../../actions/budget/BudgetActionTypes";
import { LoadMonthYearsFailureAction, LoadMonthYearsSuccessAction } from "../../actions/budget/BudgetActions";

export function getMonthYearsEffect(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
  const monthYearsAction = action.type === BudgetActionTypes.LOAD_MONTH_YEARS_INIT;
  if (monthYearsAction) {
    executeLoad();
  }
  
  async function executeLoad() {
    const url = `http://localhost:3000/api/v1/budget/months` 
    try {
      const result = await axios.get(url);
      dispatch(new LoadMonthYearsSuccessAction(result.data));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(ex: any) {
      dispatch(new LoadMonthYearsFailureAction(ex.response.data.error));
    }
  }
}