import { getCurrentMonthYear } from "../../helpers/formatDate";
import type { ApiError } from "../../types/apiError";
import type { Budget } from "../../types/budget/Budget";
import type { BudgetSummary } from "../../types/budget/BudgetDailySummary";
import { ActionWithPayload } from "../ActionWithPayload";
import { BudgetActionTypes } from "./BudgetActionTypes";

export class LoadBudgetInitAction extends ActionWithPayload {
  constructor(monthYear?: { month: number, year?: number }) {
    monthYear = monthYear ?? getCurrentMonthYear();
    super(BudgetActionTypes.LOAD_BUDGET_INIT, monthYear);
  }
}

export class LoadBudgetSuccessAction extends ActionWithPayload {
  constructor(budget: Budget) {
    super(BudgetActionTypes.LOAD_BUDGET_SUCCESS, budget);
  }
}

export class LoadBudgetFailureAction extends ActionWithPayload {
  constructor(payload: ApiError) {
    super(BudgetActionTypes.LOAD_BUDGET_FAILURE, payload);
  }
}

export class LoadMonthYearsInitAction extends ActionWithPayload {
  constructor() {
    super(BudgetActionTypes.LOAD_MONTH_YEARS_INIT);
  }
}

export class LoadMonthYearsSuccessAction extends ActionWithPayload {
  constructor(budget: Budget) {
    super(BudgetActionTypes.LOAD_MONTH_YEARS_SUCCESS, budget);
  }
}

export class LoadMonthYearsFailureAction extends ActionWithPayload {
  constructor(payload: ApiError) {
    super(BudgetActionTypes.LOAD_MONTH_YEARS_FAILURE, payload);
  }
}

export class LoadSummaryInitAction extends ActionWithPayload {
  constructor(monthYear?: { month: number, year: number}) {
    monthYear = monthYear ?? getCurrentMonthYear(); 
    super(BudgetActionTypes.LOAD_SUMMARY_INIT, monthYear);
  }
}

export class LoadSummarySuccessAction extends ActionWithPayload {
  constructor(payload: BudgetSummary) {
    super(BudgetActionTypes.LOAD_SUMMARY_SUCCESS, payload);
  }
}

export class LoadSummaryFailureAction extends ActionWithPayload {
  constructor(payload: ApiError) {
    super(BudgetActionTypes.LOAD_SUMMARY_FAILURE, payload);
  }
}

export class SortBudgetAction extends ActionWithPayload {
  constructor(column: string) {
    super(BudgetActionTypes.SORT_BUDGET, column)
  }
}