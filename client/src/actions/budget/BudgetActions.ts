import { getCurrentMonthYear } from "../../helpers/formatDate";
import type { Budget } from "../../types/budget/Budget";
import { ActionWithPayload } from "../ActionWithPayload";
import { BudgetActionTypes } from "./budgetActionTypes";

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
  constructor() {
    super(BudgetActionTypes.LOAD_BUDGET_FAILURE);
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
  constructor() {
    super(BudgetActionTypes.LOAD_MONTH_YEARS_FAILURE);
  }
}

export class SortBudgetAction extends ActionWithPayload {
  constructor(column: string) {
    super(BudgetActionTypes.SORT_BUDGET, column)
  }
}