import type { AlertType } from "./TransactionsState"
import type { ApiSatusType } from "./unionTypes"

export type TransactionsProps = {
  setAlert: (alert: AlertType) => void,
  setApiStatus: (status: ApiSatusType) => void,
  show: boolean
};

