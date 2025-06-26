import type { Merchant } from "../../types/merchants/Merchant";
import { ActionWithPayload } from "../ActionWithPayload";
import { MerchantActionTypes } from "./ActionTypes";

export class LoadMerchantsInitAction extends ActionWithPayload {
  constructor() {
    super(MerchantActionTypes.LOAD_MERCHANTS_INIT);
  }
}

export class LoadMerchantsSuccessAction extends ActionWithPayload {
  constructor(payload: Merchant[]) {
    super(MerchantActionTypes.LOAD_MERCHANTS_SUCCESS, payload);
  }
}

export class LoadMerchantsFailureAction extends ActionWithPayload {
  constructor() {
    super(MerchantActionTypes.LOAD_MERCHANTS_FAILURE);
  }
}
