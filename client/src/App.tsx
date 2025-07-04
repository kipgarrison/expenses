import "./App.css";
import { Merchants } from "./components/merchants/merchants";
import Budget from "./components/budget/Budget";
import { useEffect } from "react";
import { AppReducer } from "./reducers/AppReducer";
import { InitialAppState } from "./types/AppState";
import axios from "axios";
import type { ReferenceData } from "./types/app/ReferenceData";
import { LoadReferenceDataFailureAction, LoadReferenceDataInitAction, LoadReferenceDataSuccessAction, SetError as SetErrorAction } from "./actions/app/AppActions";
import React from "react";
import { useCallback } from "react";
import ErrorBoundry from "./components/shared/ErrorBoundary";
import { Transactions } from "./components/transactions/Transactions";
import AppError from "./components/errors/AppError";
import { NavigationTabs, type TabType } from "./components/shared/NavigationTabs";
import type { ApiError } from "./types/apiError";


function App() {   

  const [state, dispatch] = React.useReducer(AppReducer, InitialAppState);
  
  const handler = useCallback((error: ApiError) => {
    dispatch(new SetErrorAction(error));
  }, []);

  const transactions = (
    <ErrorBoundry fallback={<AppError message="An error occured while processing your request"  />}>
      <Transactions merchants={state.merchants} categories={state.categories} onError={handler}/>
    </ErrorBoundry>
  );
  
  const merchants = (
    <ErrorBoundry fallback={<AppError message="An error occured while processing your request" />}>
      <Merchants />
    </ErrorBoundry>
  );

  const budget = (
    <ErrorBoundry fallback={<AppError message="An error occured while processing your request" />}>
      <Budget />
    </ErrorBoundry>
  );

  const tabs: TabType[] = [ 
    { title: "Transactions", content: transactions, isActive: true },
    { title: "Merchants", content: merchants, isActive: false },
    { title: "Budget", content: budget, isActive: false}
  ];

  const [ area, setArea ] = React.useState(tabs[0].title);

  // Load Reference data
  useEffect(() => {
    if (state.merchantsLoading) {
      executeLoad();
    } 
    
    async function executeLoad() {
      const url = `http://localhost:3000/api/v1/reference/merchants` 
      try {
        const result = await axios.get(url);
        dispatch(new LoadReferenceDataSuccessAction({ data: result.data as ReferenceData[], type: "Merchants" }));
      }
      catch {
        dispatch(new LoadReferenceDataFailureAction("Merchants"));
      }
    }
  }, [state.merchantsLoading]); 

  useEffect(() => {
    if (state.categoriesLoading) {
      executeLoad();
    } 

    async function executeLoad() {
      const url = `http://localhost:3000/api/v1/reference/categories` 
      try {
        const result = await axios.get(url);
        dispatch(new LoadReferenceDataSuccessAction({ data: result.data as ReferenceData[], type: "Categories" }));
      }
      catch {
        dispatch(new LoadReferenceDataFailureAction("Categories"));
      }
    }
  }, [state.categoriesLoading]); 

  useEffect(() => {
    dispatch(new LoadReferenceDataInitAction("Categories"));
    dispatch(new LoadReferenceDataInitAction("Merchants"));
  }, [])

  const onTabSelected = (tab: string) => {
    setArea(tab);
  }

return (  
 
  <div className='container full-screen' test-roleid="container">
    <div className="row">
      <div className="col-12" style={{fontFamily: 'Edwardian Script ITC', fontSize: "2em", display: "flex", alignContent: "center"} }>
        <h1 style={{display: "inline-block", margin: "auto"}}>Expenses - {area}</h1>
      {/* <div className="col-12" style={ { "backgroundImage": "url(./banner.jpg)", backgroundSize: "900px 160px", height: 150, width: 900, margin: "auto" } } > */}
        {/* <img src= height="150" width="700" style={{ "display": "block" }}/> */}
      </div>
    </div>
      <div className='row'>
        <NavigationTabs tabs={tabs} onChanged={onTabSelected}/>
      </div>
  </div>
)}

export default App
