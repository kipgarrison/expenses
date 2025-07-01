import axios from "axios";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { LoadMerchantsSuccessAction, LoadMerchantsFailureAction } from "../../actions/merchants/MerchantActions";
import { MerchantActionTypes } from "../../actions/merchants/MerchantActionTypes";

export function loadMerchantsEffect(action: ActionWithPayload, dispatch: (action: ActionWithPayload)=>void) {
  if (action.type === MerchantActionTypes.LOAD_MERCHANTS_INIT) {
    executeLoad(action.payload as number);
  }
  
  async function executeLoad(range: number) {
    const url = `http://localhost:3000/api/v1/merchants/${range}`; 
    try {
      const result = await axios.get(url);
      dispatch(new LoadMerchantsSuccessAction(result.data));
    }
    catch {
      dispatch(new LoadMerchantsFailureAction());
    }
  }
}