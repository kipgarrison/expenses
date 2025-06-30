export type BudgetSummary = {
  status: "In Progress" | "Completed" | "Future" | "",
  balance: number,
  perDay: number,
  currentPace: number,
  daily: Array<{
    date: string,
    average: number,
    actual: number,
    budgeted: number
  }>
}

export const EmptyBudgetSummary: BudgetSummary = {
  status: "",
  balance: 0,
  perDay: 0,
  currentPace: 0,
  daily: []
};