import { useEffect, useReducer } from "react";
import { merchantsReducer } from "../../reducers/merchantReducer";
import "./merchants.css";
import { InitialMerchantState } from "../../types/merchants/MerchantState";
import { MerchantActionTypes } from "../../actions/merchants/MerchantActionTypes";
import { LoadMerchantsSuccessAction, LoadMerchantsFailureAction, LoadMerchantsInitAction } from '../../actions/merchants/MerchantActions'
import axios from "axios";
import { formatCurrency } from "../../helpers/currencyFormatter";
import { Table } from 'react-bootstrap';
import type { ColumnType } from "../../types/ColumnType";
import { SortButton } from "../SortButton";
import { SortMerchants } from "../../actions/merchants/MerchantActions";
import type { SortType } from "../../types/TransactionsState";

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

  const getSortDir = (col: string, sort: SortType): "asc" | "desc" | "none" => {
    if (sort?.column !== col) return "none";
    return sort?.direction || "asc";
  }  

  useEffect(() => dispatch(new LoadMerchantsInitAction()), []);

  const sort = state.sort;

  const columns: ColumnType[] = [ 
    { column: "name", header: "Name", dir: getSortDir("name", sort) }, 
    { column: "totalCount", header: "# Trans", dir: getSortDir("totalCount", sort) },
    { column: "totalAmount", header: "Total $", dir: getSortDir("totalAmount", sort) },
    { column: "avgAmount", header: "Avg. $", dir: getSortDir("avgAmount", sort) },
    { column: "firstDate", header: "First Date", dir: getSortDir("firstDate", sort) },
    { column: "lastDate", header: "Last Date", dir: getSortDir("lastDate", sort) },
    { column: "lastAmount", header: "Last $", dir: getSortDir("lastAmount", sort) },
    { column: "totCountPct", header: "Count %", dir: getSortDir("totCountPct", sort)},
    { column: "totAmountPct", header: "Amount %", dir: getSortDir("totAmountPct", sort)},
  ];
  
  const onSort = (column: ColumnType) => {
    dispatch(new SortMerchants(column.column));
  }

  const headers = columns.map(c => (
    <th key={c.column}>
      <SortButton sortDir={c.dir} column={c.column} onSort={() => onSort(c)}>{c.header}</SortButton>
    </th>
  ));

  return (
      <Table striped bordered hover variant="dark">  
        <thead>
          <tr>
            <th>

            </th>
            { headers }
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
