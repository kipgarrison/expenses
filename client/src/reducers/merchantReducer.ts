import type { ActionWithPayload } from "../actions/ActionWithPayload";
import { MerchantActionTypes } from "../actions/merchants/MerchantActionTypes";
import type { Merchant } from "../types/merchants/Merchant";
import type { MerchantsState } from "../types/merchants/MerchantState";
import { sortObjectsArray } from "../helpers/sortObjectsArray";

import { defaultLastApi, lastFailureApi, lastInitApi, lastSuccessApi } from "../types/LastApiType";

export const merchantsReducer = (state: MerchantsState, action: ActionWithPayload): MerchantsState => {
  const newState: MerchantsState = { ...state, lastApi: defaultLastApi };
  console.log("Merchant Reducer*********************>" + action.type, action);
  switch (action.type) {
    case MerchantActionTypes.LOAD_MERCHANTS_INIT: {
      return { ...newState, lastApi: lastInitApi(action, "App"), filterRange: action.payload as number, merchants: [] };
    }
    case MerchantActionTypes.LOAD_MERCHANTS_SUCCESS: {
      const merchants = (action.payload as Merchant[]).map(m => ({ ...m, firstDate: new Date(m.firstDate), lastDate: new Date(m.lastDate)}));
      return { ...newState, lastApi: lastSuccessApi(), merchants: sortObjectsArray(merchants, state.sort) as Merchant[] };      
    }
    case MerchantActionTypes.LOAD_MERCHANTS_FAILURE: {
      return { ...newState, lastApi: lastFailureApi(state.lastApi, action)}
    }
    case MerchantActionTypes.SORT_MERCHANTS: {
      const column = action.payload as string;
      let dir: "asc" | "desc" = "asc";
      if (state.sort?.column === column) {
        dir = state.sort?.direction === "asc" ? "desc" : "asc";
      }
      const sort = { column, direction: dir };
      return  { ...newState, merchants: sortObjectsArray(state.merchants, sort) as Merchant[], sort};
    }
    default:
      return newState;
  }
  
};
