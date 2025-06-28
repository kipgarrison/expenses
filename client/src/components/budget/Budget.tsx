import { useEffect, useReducer } from "react";
import { budgetReducer } from "../../reducers/bugetReducer";
import { InitialBudgetState } from "../../types/budget/BudgetState";
import { BudgetActionTypes } from "../../actions/budget/budgetActionTypes";
import axios from "axios";
import { LoadBudgetFailureAction, LoadBudgetInitAction, LoadBudgetSuccessAction, LoadMonthYearsFailureAction, LoadMonthYearsInitAction, LoadMonthYearsSuccessAction } from "../../actions/budget/BudgetActions";
import { Table } from "react-bootstrap";
import { formatCurrency } from "../../helpers/currencyFormatter";
import { formatMonthYear } from "../../helpers/formatDate";
import "./Budget.css";
import { ApiSpinner } from "../ApiSpinner";

export default function Budget() {
  const [ state, dispatch ] = useReducer(budgetReducer, InitialBudgetState);
  
  useEffect(() => {
    const budgetInit = state.lastActions.find(a => a.type === BudgetActionTypes.LOAD_BUDGET_INIT);
    if (budgetInit) {
      executeLoad(budgetInit.payload as { month: number, year: number });
    }
    
    async function executeLoad(monthYear?: { month: number, year: number}) {
      const date = new Date();
      const month = monthYear?.month ?? date.getMonth();
      const year = monthYear?.year ?? date.getFullYear();

      const url = `http://localhost:3000/api/v1/budget/${year}/${month}` 
      try {
        const result = await axios.get(url);
        dispatch(new LoadBudgetSuccessAction(result.data));
      }
      catch {
        dispatch(new LoadBudgetFailureAction());
      }
    }
  }, [state.lastActions]); 

  useEffect(() => {
    const monthYearsAction = state.lastActions.find(a => a.type === BudgetActionTypes.LOAD_MONTH_YEARS_INIT);
    if (monthYearsAction) {
      executeLoad();
    }
    
    async function executeLoad() {
      const url = `http://localhost:3000/api/v1/budget/months` 
      try {
        const result = await axios.get(url);
        dispatch(new LoadMonthYearsSuccessAction(result.data));
      }
      catch {
        dispatch(new LoadMonthYearsFailureAction());
      }
    }
  }, [state.lastActions]); 

  useEffect(() => {
    dispatch(new LoadBudgetInitAction());
    dispatch(new LoadMonthYearsInitAction());
  }, []);


  const handleMonthYearSelection = (e) => {
    const d = new Date(e.target.value);
    const monthYear = { month: d.getMonth()+1, year: d.getFullYear() };
    dispatch(new LoadBudgetInitAction(monthYear))
  }
  const spinnerTypes = [ BudgetActionTypes.LOAD_BUDGET_INIT, BudgetActionTypes.LOAD_MONTH_YEARS_INIT ];
  const showSpinner = state.lastActions.some(a => spinnerTypes.includes(a.type));
  return (
    <>
    <h5>
      Budget for 
      <select id="merchant" name="merchant" role="merchant-name" data-testid="budget-months" 
        value={formatMonthYear(state.selectedMonthYear)} 
        onChange={handleMonthYearSelection} required
        className="from-control month-year-select mx-2">
        {state.monthYears.map(my => (
            <option selected key={`${my.month}${my.year}`}>{formatMonthYear(my)}</option>
        ))}
      </select>
      <ApiSpinner show={showSpinner} />
    </h5>
    
    <Table striped bordered hover variant="dark">  
      <thead>
        <tr>
          <th>

          </th>
          <th>
            Category
          </th>
          <th>
            Budgeted
          </th>
          <th>
            Spent
          </th>
          <th>
            Remaining
          </th>
        </tr>
      </thead>
      <tbody>
        {state.budget.lineItems.map(li => (
          <tr key={li.category}>
            <td></td>
            <td>
              {li.category}
            </td>
            <td>
              {formatCurrency(li.budgeted)}
            </td>
            <td>
              {formatCurrency(li.actual)}
            </td>
            <td>
              {formatCurrency(li.budgeted - li.actual)}
            </td>
          </tr>
        ))}
      </tbody>      
      <tfoot>
        <tr>
          <td></td>
          <td>Totals</td>
          <td>{formatCurrency(state.budget.budgeted)}</td>
          <td>{formatCurrency(state.budget.actual)}</td>
          <td>{formatCurrency(state.budget.budgeted - state.budget.actual)}</td>
        </tr>
      </tfoot>
    </Table>
    </>
  )
}

