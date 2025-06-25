import { useEffect, useReducer } from "react";
import { merchantsReducer } from "../../reducers/merchantReducer";
import "./merchants.css";
import { InitialMerchantState } from "../../types/merchants/MerchantState";
import { MerchantActionTypes } from "../../actions/merchants/ActionTypes";
import { LoadMerchantsSuccessAction, LoadMerchantsFailureAction, LoadMerchantsInitAction } from '../../actions/merchants/Actions'
import axios from "axios";
import { formatCurrency } from "../../helpers/currency-formatter";

export function Merchants() {
  const [ state, dispatch ] = useReducer(merchantsReducer, InitialMerchantState);
  
  useEffect(() => {
    if (state.lastAction?.type === MerchantActionTypes.LOAD_MERCHANTS_INIT) {
      executeLoad();
    }
    
    async function executeLoad() {
      const url = `http://localhost:3000/api/v1/merchants` 
      try {
        const result = await axios.get(url);
        dispatch(new LoadMerchantsSuccessAction(result.data));
      }
      catch {
        dispatch(new LoadMerchantsFailureAction());
      }
    }
  }, [state.lastAction?.type]); 

  useEffect(() => dispatch(new LoadMerchantsInitAction()), []);

  

  return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>

            </th>
            <th>
              Name
            </th>
            <th>
              # Trans
            </th>
            <th>
              Total $
            </th>
            <th>
              Avg. $
            </th>
            <th>
              First Date
            </th>
            <th>
              Last Date
            </th>
            <th>
              Last $
            </th>
          </tr>
        </thead>
        <tbody>
          {state.merchants.map(m => (
            <tr>
              <td></td>
              <td>
                {m.name}
              </td>
              <td>
                {m.totalCount}
              </td>
              <td>
                {formatCurrency(m.totalAmount)}
              </td>
              <td>
                {formatCurrency(m.avgAmount)}
              </td>
              <td>
                {m.firstDate.toLocaleDateString()}
              </td>
              <td>
                {m.lastDate.toLocaleDateString()}
              </td>
              <td>
                {formatCurrency(m.lastAmount)}
              </td>
            </tr>
          ))}
        </tbody>      
      </table>
    )
}
