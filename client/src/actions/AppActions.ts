import { ActionWithPayload } from "./ActionWithPayload";
import { AppActionTypes } from "./AppActionTypes";
import type { AlertType } from "../types/TransactionsState";
import type { ApiSatusType } from "../types/unionTypes";

export class SetApiStatusAction extends ActionWithPayload {
  constructor(payload: ApiSatusType) {
    super(AppActionTypes.SET_API_STATUS, payload);
  }
}

export class SetAlertAction extends ActionWithPayload {
  constructor(payload?: AlertType) {
    super(AppActionTypes.SET_ALERT, payload);
  }
}

export class ClearAlertAction extends ActionWithPayload {
  constructor() {
    super(AppActionTypes.CLEAR_ALERT);
  }
}