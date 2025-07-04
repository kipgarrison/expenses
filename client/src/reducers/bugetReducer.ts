
import type { ActionWithPayload } from "../actions/ActionWithPayload";
import { BudgetActionTypes } from "../actions/budget/BudgetActionTypes";
import { EmptyBudget, type Budget } from "../types/budget/Budget";
import type { BudgetSummary } from "../types/budget/BudgetDailySummary";
import type { BudgetState } from "../types/budget/BudgetState";
import { lastFailureApi, lastInitApi, lastSuccessApi } from "../types/LastApiType";

export const budgetReducer = (state: BudgetState, action: ActionWithPayload): BudgetState => {
  const newState: BudgetState = { ...state }; //BudgetState = { ...state, lastBudgetApi: defaultLastApi, lastDailyTotalsApi: defaultLastApi, lastMonthYearApi: defaultLastApi };
  switch (action.type) {
    case BudgetActionTypes.LOAD_BUDGET_INIT: {
      const monthYear = action.payload as { month: number, year: number };
      return { ...newState,  lastBudgetApi: lastInitApi(action, "App"), selectedMonthYear: { ...monthYear, month: monthYear.month - 1 }, budget: EmptyBudget }
    }
    case BudgetActionTypes.LOAD_BUDGET_SUCCESS: {
      const budget = action.payload as Budget;
      const st: BudgetState = { ...newState, budget, lastBudgetApi: lastSuccessApi()  };
      return st;
    }
    case BudgetActionTypes.LOAD_BUDGET_FAILURE: {
      return { ...newState, lastBudgetApi: lastFailureApi(state.lastBudgetApi, action) };
    }
    case BudgetActionTypes.LOAD_MONTH_YEARS_INIT: {
      return { ...newState,  lastMonthYearApi: lastInitApi(action, "App") };
    }
    case BudgetActionTypes.LOAD_MONTH_YEARS_SUCCESS: {
      const monthYears = action.payload as { month: number, year: number }[];
      const st: BudgetState = { ...newState, monthYears, lastMonthYearApi: lastSuccessApi() };
      return st;
    }
    case BudgetActionTypes.LOAD_MONTH_YEARS_FAILURE: {
      return { ...newState, lastMonthYearApi: lastFailureApi(state.lastMonthYearApi, action) };
    }
    case BudgetActionTypes.LOAD_SUMMARY_INIT: {
      return { ...newState,  lastDailyTotalsApi: lastInitApi(action, "App") };
    }
    case BudgetActionTypes.LOAD_SUMMARY_SUCCESS: {
      const summary = action.payload as BudgetSummary;
      const st: BudgetState = { ...newState, summary, lastDailyTotalsApi: lastSuccessApi()};
      return st;
    }
    case BudgetActionTypes.LOAD_SUMMARY_FAILURE: {
      return { ...newState,lastDailyTotalsApi: lastFailureApi(state.lastDailyTotalsApi, action) };
    }
    default: {
      return newState;
    }
  }
}