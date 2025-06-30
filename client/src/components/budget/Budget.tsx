import { useEffect, useReducer } from "react";
import { budgetReducer } from "../../reducers/bugetReducer";
import { InitialBudgetState } from "../../types/budget/BudgetState";
import { BudgetActionTypes } from "../../actions/budget/BudgetActionTypes";
import { Card, Table } from "react-bootstrap";
import { formatCurrency } from "../../helpers/currencyFormatter";
import { formatMonthYear } from "../../helpers/formatDate";
import "./Budget.css";
import { ApiSpinner } from "../ApiSpinner";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { getBudgetEffect } from "../effects/budget/getBudgetEffect";
import { getBudgetSummaryEffect } from "../effects/budget/getBudgetSummary";
import { getMonthYearsEffect } from "../effects/budget/getMonthYearsEffect";
import { LoadBudgetInitAction, LoadMonthYearsInitAction, LoadSummaryInitAction } from "../../actions/budget/BudgetActions";

export default function Budget() {
  const [ state, dispatch ] = useReducer(budgetReducer, InitialBudgetState);

  useEffect(() => {
    dispatch(new LoadBudgetInitAction());
    dispatch(new LoadMonthYearsInitAction());
    dispatch(new LoadSummaryInitAction())
  }, []);

  useEffect(() => getBudgetEffect(state.lastActions, dispatch), [state.lastActions]);
  useEffect(() => getBudgetSummaryEffect(state.lastActions, dispatch), [state.lastActions]);
  useEffect(() => getMonthYearsEffect(state.lastActions, dispatch), [state.lastActions]);

  // useEffect(() => {
  //   const budgetInit = state.lastActions.find(a => a.type === BudgetActionTypes.LOAD_BUDGET_INIT);
  //   if (budgetInit) {
  //     executeLoad(budgetInit.payload as { month: number, year: number });
  //   }
    
  //   async function executeLoad(monthYear?: { month: number, year: number}) {
  //     const date = new Date();
  //     const month = monthYear?.month ?? date.getMonth();
  //     const year = monthYear?.year ?? date.getFullYear();

  //     const url = `http://localhost:3000/api/v1/budget/${year}/${month}` 
  //     try {
  //       const result = await axios.get(url);
  //       dispatch(new LoadBudgetSuccessAction(result.data));
  //     }
  //     catch {
  //       dispatch(new LoadBudgetFailureAction());
  //     }
  //   }
  // }, [state.lastActions]); 

  // useEffect(() => {
  //   const monthYearsAction = state.lastActions.find(a => a.type === BudgetActionTypes.LOAD_MONTH_YEARS_INIT);
  //   if (monthYearsAction) {
  //     executeLoad();
  //   }
    
  //   async function executeLoad() {
  //     const url = `http://localhost:3000/api/v1/budget/months` 
  //     try {
  //       const result = await axios.get(url);
  //       dispatch(new LoadMonthYearsSuccessAction(result.data));
  //     }
  //     catch {
  //       dispatch(new LoadMonthYearsFailureAction());
  //     }
  //   }
  // }, [state.lastActions]); 



  //   const summaryAction = state.lastActions.find(a => a.type === BudgetActionTypes.LOAD_SUMMARY_INIT);
  //   if (summaryAction) {
  //     executeLoad(summaryAction.payload as { month: number, year: number });
  //   }
    
  //   async function executeLoad(monthYear?: { month: number, year: number}) {
  //     const date = new Date();
  //     const month = monthYear?.month ?? date.getMonth();
  //     const year = monthYear?.year ?? date.getFullYear();

  //     const url = `http://localhost:3000/api/v1/budget/daily/${year}/${month}` 
  //     try {
  //       const result = await axios.get(url);
  //       dispatch(new LoadSummarySuccessAction(result.data));
  //     }
  //     catch {
  //       dispatch(new LoadDailySummaryFailureAction());
  //     }
  //   }
  // }, [state.lastActions]); 

  
  const handleMonthYearSelection = (e) => {
    const d = new Date(e.target.value);
    const monthYear = { month: d.getMonth()+1, year: d.getFullYear() };
    dispatch(new LoadBudgetInitAction(monthYear))
    dispatch(new LoadSummaryInitAction(monthYear))
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
            <option key={`${my.month}${my.year}`}>{formatMonthYear(my)}</option>
        ))}
      </select>
      <ApiSpinner show={showSpinner} />
    </h5>

    <div className="row">
      <div className="col-6">
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
      </div>
      <div className="col-6">
        <Card>
          <Card.Title className="p-2">Monthly Summary</Card.Title>
          <Card.Body>
            <div className="row mt-1 mb-2">
              <div className="col-6">
                <strong>Status:</strong> {state.summary.status}
              </div> 
              <div className="col-6">
               <strong>Remaining:</strong> {formatCurrency(state.summary.balance)}
              </div>
            </div>
            <div className="row m-2">
              <div className="col-6">
                <strong>Per Day:</strong> {formatCurrency(state.summary.perDay)}
              </div>
              <div className="col-6">
                <strong>Current Pace:</strong> {formatCurrency(state.summary.currentPace)}
              </div>
            </div>
            <LineChart width={600} height={450} data={state.summary.daily}>
              <CartesianGrid />
              <Line dataKey="actual" stroke="blue" strokeWidth={3} />
              <Line dataKey="budgeted" stroke="green" strokeWidth={3} />
              <Line dataKey="average" stroke="orange" strokeWidth={3} />
              <XAxis dataKey="date" />
              <YAxis />
              <Legend width={140} wrapperStyle={{ top: 0 , left: 80, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
            </LineChart>
          </Card.Body>
        </Card>
        
      </div>
    </div>
    

    
    </>
  )
}

