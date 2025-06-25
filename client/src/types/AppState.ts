import type { ActionWithPayload } from "../actions/ActionWithPayload"
import type { ApiSatusType } from "./unionTypes"

export type AppState = {
  apiStatus?: ApiSatusType,
  lastAction?: ActionWithPayload
}

export const InitialAppState: AppState = {
  apiStatus: "INITIAL"
}