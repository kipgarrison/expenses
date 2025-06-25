import type { ActionWithPayload } from "../actions/ActionWithPayload";
import { AppActionTypes } from "../actions/AppActionTypes";
import type { AppState } from "../types/AppState";
//import type { AlertType } from "../types/TransactionsState";
import type { ApiSatusType } from "../types/unionTypes";

export const AppReducer = (state: AppState, action: ActionWithPayload): AppState => {
  const newState: AppState = { ...state, lastAction: action };
  console.log("*********************>" + action.type, action);
  switch (action.type) {
    case (AppActionTypes.SET_API_STATUS): {
    return { ...newState, apiStatus: action.payload as ApiSatusType };
    }
    default: {
      return { ...newState };
    }
  }
}
    
