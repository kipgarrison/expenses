import type { ActionWithPayload } from "../actions/ActionWithPayload";
import { AppActionTypes } from "../actions/app/AppActionTypes";
import type { ReferenceDataLoadSuccess } from "../types/app/ReferenceDataLoadSuccess";
import type { AppState } from "../types/AppState";
import { API_LOAD_REFERENCE_LIST_FAILURE_ALERT } from "../types/constants";
import type { ReferenceDataType } from "../types/unionTypes";

export const AppReducer = (state: AppState, action: ActionWithPayload): AppState => {
  console.log("App Reducer*********************>" + action.type, action);
  switch (action.type) {
    case (AppActionTypes.LOAD_REFERENCE_DATA_INIT): {
      const field = (action.payload as string).toLowerCase() + "Loading";
      return { ...state, [field]: true }
    }
    case (AppActionTypes.LOAD_REFERENCE_DATA_SUCCESS): {
      const { type, data} = action.payload as ReferenceDataLoadSuccess;
      const loadingField = type === "Categories" ? "categoriesLoading" : "merchantsLoding";
      const dataField = type.toLocaleLowerCase();
      return { 
        ...state, 
        [loadingField]: false, 
        [dataField]: data
      }
    }
    case (AppActionTypes.LOAD_REFERENCE_DATA_FAILURE): {
      const loadingField = action.payload as ReferenceDataType + "Loading";
      return { 
        ...state, 
        [loadingField]: false,
        alert: API_LOAD_REFERENCE_LIST_FAILURE_ALERT }
    }
    default: {
      return { ...state };
    }
  }
}
    
