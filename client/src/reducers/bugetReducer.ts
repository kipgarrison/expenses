
import type { ActionWithPayload } from "../actions/ActionWithPayload";
import { BudgetActionTypes } from "../actions/budget/budgetActionTypes";
import { EmptyBudget, type Budget } from "../types/budget/Budget";
import type { BudgetState } from "../types/budget/BudgetState";
import { API_LOAD_BUDGET_FAILURE_ALERT, API_LOAD_MONTH_YEARS_FAILURE_ALERT } from "../types/constants";

const loadLastActions = (action: ActionWithPayload, actions: ActionWithPayload[]): Array<ActionWithPayload> => {
  const types = [BudgetActionTypes.LOAD_BUDGET_INIT, BudgetActionTypes.LOAD_MONTH_YEARS_INIT];
  const lastActions = actions.filter(a => types.includes(a.type));
  return [ ...lastActions, action ];
} 

export const budgetReducer = (state: BudgetState, action: ActionWithPayload): BudgetState => {
const newState = { ...state, lastActions: loadLastActions(action, state.lastActions) };
  switch (action.type) {
    case BudgetActionTypes.LOAD_BUDGET_INIT: {
      const monthYear = action.payload as { month: number, year: number };
      return { ...newState,  apiStatus: "RUNNING", selectedMonthYear: monthYear, budget: EmptyBudget }
    }
    case BudgetActionTypes.LOAD_BUDGET_SUCCESS: {
      const budget = action.payload as Budget;
      const actions = newState.lastActions.filter(a => a.type !== BudgetActionTypes.LOAD_BUDGET_INIT);
      const st: BudgetState = { ...newState, budget, apiStatus: "NOT_RUNNING", lastActions: actions };
      console.log(st)
      return st;
    }
    case BudgetActionTypes.LOAD_BUDGET_FAILURE: {
      const actions = newState.lastActions.filter(a => a.type !== BudgetActionTypes.LOAD_BUDGET_INIT);
      return { ...newState, apiStatus: "NOT_RUNNING", alert: API_LOAD_BUDGET_FAILURE_ALERT, lastActions: actions};
    }
    case BudgetActionTypes.LOAD_MONTH_YEARS_INIT: {
      return { ...newState,  apiStatus: "INITIAL_MONTH_YEARS" };
    }
    case BudgetActionTypes.LOAD_MONTH_YEARS_SUCCESS: {
      const monthYears = action.payload as { month: number, year: number }[];
      const actions = state.lastActions.filter(a => a.type !== BudgetActionTypes.LOAD_MONTH_YEARS_INIT)
      const st: BudgetState = { ...newState, monthYears, apiStatus: "NOT_RUNNING", lastActions: actions };
      console.log(st)
      return st;
    }
    case BudgetActionTypes.LOAD_MONTH_YEARS_FAILURE: {
      const actions = state.lastActions.filter(a => a.type !== BudgetActionTypes.LOAD_MONTH_YEARS_INIT)
      return { ...newState, apiStatus: "NOT_RUNNING", alert: API_LOAD_MONTH_YEARS_FAILURE_ALERT, lastActions: actions };
    }
    default: {
      return newState;
    }
  }
}