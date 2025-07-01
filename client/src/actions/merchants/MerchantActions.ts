import type { Merchant } from "../../types/merchants/Merchant";
import { ActionWithPayload } from "../ActionWithPayload";
import { MerchantActionTypes } from "./MerchantActionTypes";

export class LoadMerchantsInitAction extends ActionWithPayload {
  constructor(range?: number) {
    super(MerchantActionTypes.LOAD_MERCHANTS_INIT, range ??  0);
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

export class SortMerchants extends ActionWithPayload {
  constructor(payload: string) {
    super(MerchantActionTypes.SORT_MERCHANTS, payload);
  }
}
