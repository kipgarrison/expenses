import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { getCurrentMonthYear } from "../../helpers/formatDate";
import type { AlertType, SortType } from "../TransactionsState";
import type { ModalType } from "../unionTypes";
import { EmptyBudget, type Budget } from "./Budget";
import { EmptyBudgetSummary, type BudgetSummary } from "./BudgetDailySummary";
import type { BudgetLineItem } from "./budgetLineItem";

export type BudgetState = {
  budget: Budget,
  monthYears: Array<{ month: number, year: number }>,
  currentLineItem?: BudgetLineItem,
  backupLineItem?: BudgetLineItem,
  lastActions: ActionWithPayload[],
  summary: BudgetSummary,
  apiStatus?: "NOT_RUNNING" | "RUNNING" | "INITIAL_MONTH_YEARS" | "INITIAL_BUDGET" | 'INITIAL_SUMMARY',
  alert?: AlertType,
  sort: SortType,
  modal: ModalType,
  selectedMonthYear: { month: number, year: number },
  showFailureMessage? : boolean
}



export const InitialBudgetState: BudgetState = {
  budget: EmptyBudget,
  monthYears: [],
  summary: EmptyBudgetSummary,
  sort: { column: "category", direction: "asc" },
  modal: "None",
  selectedMonthYear: getCurrentMonthYear(),
  lastActions: []
};