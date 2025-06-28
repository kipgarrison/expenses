import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { getCurrentMonthYear } from "../../helpers/formatDate";
import type { AlertType, SortType } from "../TransactionsState";
import type { ModalType } from "../unionTypes";
import { EmptyBudget, type Budget } from "./Budget";
import type { BudgetLineItem } from "./budgetLineItem";

export type BudgetState = {
  budget: Budget,
  monthYears: Array<{ month: number, year: number }>,
  currentLineItem?: BudgetLineItem,
  backupLineItem?: BudgetLineItem,
  lastActions: ActionWithPayload[],
  apiStatus?: "NOT_RUNNING" | "RUNNING" | "INITIAL_MONTH_YEARS" | "INITIAL_BUDGET",
  alert?: AlertType,
  sort: SortType,
  modal: ModalType,
  selectedMonthYear: { month: number, year: number }
}



export const InitialBudgetState: BudgetState = {
  budget: EmptyBudget,
  monthYears: [],
  sort: { column: "category", direction: "asc" },
  modal: "None",
  selectedMonthYear: getCurrentMonthYear(),
  lastActions: []
};