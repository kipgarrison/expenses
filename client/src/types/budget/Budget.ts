import type { BudgetLineItem } from "./budgetLineItem"

export type Budget = {
  lineItems: BudgetLineItem[],
  budgeted: number,
  actual: number
}

export const EmptyBudget: Budget = {
  lineItems: [],
  budgeted: 0,
  actual: 0
}