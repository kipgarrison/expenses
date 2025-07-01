import type { ActionWithPayload } from "../actions/ActionWithPayload";
import { MerchantActionTypes } from "../actions/merchants/MerchantActionTypes";
import type { Merchant } from "../types/merchants/Merchant";
import type { MerchantsState } from "../types/merchants/MerchantState";
import { sortObjectsArray } from "../helpers/sortObjectsArray";

// const sortMerchants = (merchants: Merchant[], sort: SortType): Merchant[] => {
//   if (!merchants || !merchants.length) return [];
//   const sortCol = sort.column || "date";
//   const direction = sort.direction || "asc";
//   const ascSorter = (a: Indexable, b: Indexable) => a[sortCol] > b[sortCol] ? 1 : -1;
//   const descSorter = (a: Indexable, b: Indexable) => a[sortCol] > b[sortCol] ? -1 : 1;
//   const sorter = direction === "asc" ? ascSorter : descSorter;
//   // don't want to mutate the original array so...
//   const localMerchants = [...merchants ].sort(sorter);
//   return localMerchants;
// }

export const merchantsReducer = (state: MerchantsState, action: ActionWithPayload): MerchantsState => {
  const newState: MerchantsState = { ...state, lastAction: action };
  console.log("Merchant Reducer*********************>" + action.type, action);
  switch (action.type) {
    case MerchantActionTypes.LOAD_MERCHANTS_INIT: {
      return { ...newState, apiStatus: "RUNNING" };
    }
    case MerchantActionTypes.LOAD_MERCHANTS_SUCCESS: {
      const merchants = (action.payload as Merchant[]).map(m => ({ ...m, firstDate: new Date(m.firstDate), lastDate: new Date(m.lastDate)}));
      return { ...newState, apiStatus: "NOT_RUNNING", merchants: sortObjectsArray(merchants, state.sort) as Merchant[] };      
    }
    case MerchantActionTypes.LOAD_MERCHANTS_FAILURE: {
      return { ...newState, apiStatus: "NOT_RUNNING", showFailureMessage: true}
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
