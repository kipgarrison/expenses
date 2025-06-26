import { useEffect, useReducer } from "react";
import { merchantsReducer } from "../../reducers/merchantReducer";
import "./merchants.css";
import { InitialMerchantState } from "../../types/merchants/MerchantState";
import { MerchantActionTypes } from "../../actions/merchants/ActionTypes";
import { LoadMerchantsSuccessAction, LoadMerchantsFailureAction, LoadMerchantsInitAction } from '../../actions/merchants/Actions'
import axios from "axios";
import { formatCurrency } from "../../helpers/currency-formatter";
import { Table } from 'react-bootstrap';

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
      <Table striped bordered hover variant="dark">  
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
            <th>
              Count %
            </th>
            <th>
              Amount %
            </th>
          </tr>
        </thead>
        <tbody>
          {state.merchants.map(m => (
            <tr key={m.name}>
              <td></td>
              <td key="1">
                {m.name}
              </td>
              <td key="2">
                {m.totalCount}
              </td>
              <td key="3">
                {formatCurrency(m.totalAmount)}
              </td>
              <td key="4">
                {formatCurrency(m.avgAmount)}
              </td>
              <td key="5">
                {m.firstDate.toLocaleDateString()}
              </td>
              <td key="6">
                {m.lastDate.toLocaleDateString()}
              </td>
              <td key="7">
                {formatCurrency(m.lastAmount)}
              </td>
              <td key="8">
                {m.totCountPct}%
              </td>
              <td key="9">
                {m.totAmountPct}%
              </td>
            </tr>
          ))}
        </tbody>      
      </Table>
    )
}
