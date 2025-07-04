import type { ApiError } from "./apiError"
import type { ReferenceData } from "./app/ReferenceData"
import type { AlertType } from "./TransactionsState"

export type AppState = {
  merchants: ReferenceData[],
  categories: ReferenceData[],
  merchantsLoading: boolean,
  categoriesLoading: boolean,
  alert?: AlertType,
  lastApiError?: ApiError
}

export const InitialAppState: AppState = {
  merchants: [],
  categories: [],
  merchantsLoading: false,
  categoriesLoading: false
}