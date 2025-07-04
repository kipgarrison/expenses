import { getCurrentMonthYear } from "../../helpers/formatDate";
import { defaultLastApi, type LastApiType } from "../LastApiType";
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
  summary: BudgetSummary,
  alert?: AlertType,
  sort: SortType,
  modal: ModalType,
  selectedMonthYear: { month: number, year: number },
  showFailureMessage? : boolean,
  lastBudgetApi: LastApiType,
  lastMonthYearApi: LastApiType,
  lastDailyTotalsApi: LastApiType
}

export const InitialBudgetState: BudgetState = {
  budget: EmptyBudget,
  monthYears: [],
  summary: EmptyBudgetSummary,
  sort: { column: "category", direction: "asc" },
  modal: "None",
  selectedMonthYear: getCurrentMonthYear(),
  lastBudgetApi: defaultLastApi,
  lastMonthYearApi: defaultLastApi,
  lastDailyTotalsApi: defaultLastApi
};