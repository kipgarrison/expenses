import { useEffect, useReducer } from "react";
import { budgetReducer } from "../../reducers/bugetReducer";
import { InitialBudgetState } from "../../types/budget/BudgetState";
import { Card, Table } from "react-bootstrap";
import { formatCurrency } from "../../helpers/currencyFormatter";
import { formatMonthYear } from "../../helpers/formatDate";
import "./Budget.css";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { getBudgetEffect } from "../../effects/budget/getBudgetEffect";
import { getBudgetSummaryEffect } from "../../effects/budget/getBudgetSummaryEffect";
import { getMonthYearsEffect } from "../../effects/budget/getMonthYearsEffect";
import { LoadBudgetInitAction, LoadMonthYearsInitAction, LoadSummaryInitAction } from "../../actions/budget/BudgetActions";
import { AppWrapper } from "../shared/AppWrapper";

export default function Budget() {
  const [ state, dispatch ] = useReducer(budgetReducer, InitialBudgetState);

  useEffect(() => {
    dispatch(new LoadBudgetInitAction());
    dispatch(new LoadMonthYearsInitAction());
    dispatch(new LoadSummaryInitAction())
  }, []);

  useEffect(() => getBudgetEffect(state.lastBudgetApi.init, dispatch), [state.lastBudgetApi.init]);
  useEffect(() => getBudgetSummaryEffect(state.lastDailyTotalsApi.init, dispatch), [state.lastDailyTotalsApi.init]);
  useEffect(() => getMonthYearsEffect(state.lastMonthYearApi.init, dispatch), [state.lastMonthYearApi.init]);

  const handleMonthYearSelection = (e: { target: { value: string | number | Date } }) => {
    const d = new Date(e.target.value);
    const monthYear = { month: d.getMonth()+1, year: d.getFullYear() };
    dispatch(new LoadBudgetInitAction(monthYear))
    dispatch(new LoadSummaryInitAction(monthYear))
  }
  //const spinnerTypes = [ BudgetActionTypes.LOAD_BUDGET_INIT, BudgetActionTypes.LOAD_MONTH_YEARS_INIT ];
  //const showSpinner = state.lastActions.some(a => spinnerTypes.includes(a.type));
  const appWrapperParams = {
      error: state.lastBudgetApi.error ?? state.lastDailyTotalsApi.error ?? state.lastMonthYearApi.error,
      showSpinner: state.lastBudgetApi.spinnerType === "App" ||  state.lastMonthYearApi.spinnerType === "App" || state.lastDailyTotalsApi.spinnerType === "App",
      onRetry: () => { 
        if (state.lastBudgetApi.error) dispatch(state.lastBudgetApi.init);
        if (state.lastDailyTotalsApi.error) dispatch(state.lastDailyTotalsApi.init);
        if (state.lastMonthYearApi.error) dispatch(state.lastMonthYearApi.init);
      }
    }
       
  return (
       <>
      <AppWrapper {...appWrapperParams}>
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
      </AppWrapper>
    </>
  )
}

