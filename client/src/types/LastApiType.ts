import type { ActionWithPayload } from "../actions/ActionWithPayload"
import { NullAction } from "../actions/app/AppActions";
import type { ApiError } from "./apiError"

export type LastApiType = { 
  error?: ApiError, 
  init: ActionWithPayload, 
  failure: ActionWithPayload, 
  spinnerType: "App" | "Api" | "None"
};

export const defaultLastApi: LastApiType = { error: undefined, init: new NullAction() , failure: new NullAction() , spinnerType: "None" };
export const lastInitApi = (action: ActionWithPayload, spinner: "App" | "Api" ): LastApiType => ({ 
  error: undefined, 
  init: action, 
  failure: new NullAction(), 
  spinnerType: spinner
});
export const lastSuccessApi = () => defaultLastApi;
export const lastFailureApi = (current: LastApiType, action: ActionWithPayload): LastApiType => ({ 
  error: action.payload as ApiError,
  failure: action,
  init: current.init,
  spinnerType: "None"
 });
 