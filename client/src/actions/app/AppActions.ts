import type { ReferenceDataLoadSuccess } from "../../types/app/ReferenceDataLoadSuccess";
import type { AlertType } from "../../types/TransactionsState";
import type { ApiSatusType, ReferenceDataType } from "../../types/unionTypes";
import { ActionWithPayload } from "../ActionWithPayload";
import { AppActionTypes } from "./AppActionTypes";

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

export class LoadReferenceDataInitAction extends ActionWithPayload {
  constructor(referenceType: ReferenceDataType) {
    super(AppActionTypes.LOAD_REFERENCE_DATA_INIT, referenceType);
  }
}

export class LoadReferenceDataSuccessAction extends ActionWithPayload {
  constructor(payload: ReferenceDataLoadSuccess) {
    super(AppActionTypes.LOAD_REFERENCE_DATA_SUCCESS, payload);
  }
}

export class LoadReferenceDataFailureAction extends ActionWithPayload {
  constructor(referenceType: ReferenceDataType) {
    super(AppActionTypes.LOAD_REFERENCE_DATA_FAILURE, referenceType);
  }
}

export class NullAction extends ActionWithPayload {
  constructor() {
    super(AppActionTypes.NULL);
  }
}

