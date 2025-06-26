import type { ActionWithPayload } from "../actions/ActionWithPayload";
import { MerchantActionTypes } from "../actions/merchants/ActionTypes";
import type { Merchant } from "../types/merchants/Merchant";
import type { MerchantsState } from "../types/merchants/MerchantState";
import { API_LOAD_MERCHANTS_FAILURE_ALERT } from "../types/constants";

export const merchantsReducer = (state: MerchantsState, action: ActionWithPayload): MerchantsState => {
  const newState: MerchantsState = { ...state, lastAction: action };
  console.log("*********************>" + action.type, action);
  switch (action.type) {
    case MerchantActionTypes.LOAD_MERCHANTS_INIT: {
      return { ...newState, apiStatus: "RUNNING" };
    }
    case MerchantActionTypes.LOAD_MERCHANTS_SUCCESS: {
      const merchants = (action.payload as Merchant[]).map(m => ({ ...m, firstDate: new Date(m.firstDate), lastDate: new Date(m.lastDate)}));
      return { ...newState, apiStatus: "NOT_RUNNING", merchants };      
    }
    case MerchantActionTypes.LOAD_MERCHANTS_FAILURE: {
      return { ...newState, apiStatus: "NOT_RUNNING", alert: API_LOAD_MERCHANTS_FAILURE_ALERT}
    }
    default:
      return newState;
  }
  
};
