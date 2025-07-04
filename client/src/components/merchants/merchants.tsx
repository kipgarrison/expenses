import { useEffect, useReducer } from "react";
import { merchantsReducer } from "../../reducers/merchantReducer";
import "./merchants.css";
import { filterRangeValues, InitialMerchantState } from "../../types/merchants/MerchantState";
import { formatCurrency } from "../../helpers/currencyFormatter";
import { Table } from 'react-bootstrap';
import type { ColumnType } from "../../types/ColumnType";
import { LoadMerchantsInitAction, SortMerchants } from "../../actions/merchants/MerchantActions";
import type { SortType } from "../../types/TransactionsState";
import type { ActionWithPayload } from "../../actions/ActionWithPayload";
import { loadMerchantsEffect } from "../../effects/merchants/loadMerchantsEffect";
import { SortButton } from "../icons/SortButton";
import { ApiSpinner } from "../shared/ApiSpinner";
import { AppWrapper } from "../shared/AppWrapper";

export function Merchants() {
  const [ state, dispatch ] = useReducer(merchantsReducer, InitialMerchantState);
  
  useEffect(() => dispatch(new LoadMerchantsInitAction()), []);
  useEffect(() => loadMerchantsEffect(state.lastApi.init as ActionWithPayload, dispatch), [state.lastApi.init]);

  const getSortDir = (col: string, sort: SortType): "asc" | "desc" | "none" => {
    if (sort?.column !== col) return "none";
    return sort?.direction || "asc";
  }  

  

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

  const setRange = (value: string) => {
    dispatch(new LoadMerchantsInitAction(parseInt(value)));
  } 

  const showSpinner = state.lastApi.spinnerType === "Api";

  const appWrapperParams = {
      error: state.lastApi.error,
      showSpinner: state.lastApi.spinnerType === "App", 
      onRetry: () => { if (state.lastApi.init) dispatch(state.lastApi.init) }
    }
       
  return (
      <>
      <AppWrapper {...appWrapperParams}>
        <h5>
            View
            <select id="view-range" name="view-range" data-testid="view-range" 
              value={state.filterRange}
              onChange={(e) => setRange(e.target.value)} required
              className="from-control range-select mx-2">
              {Object.keys(filterRangeValues).map(k => (
                <option key={filterRangeValues[k]} value={filterRangeValues[k]}>{k}</option>
              ))}
            </select>
            
            <ApiSpinner show={showSpinner} />
        </h5>
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
       </AppWrapper>
      </>
    )
}


