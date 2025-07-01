import "./App.css";
import { Merchants } from "./components/merchants/merchants";
import Budget from "./components/budget/Budget";
import { useEffect } from "react";
import { AppReducer } from "./reducers/AppReducer";
import { InitialAppState } from "./types/AppState";
import axios from "axios";
import type { ReferenceData } from "./types/app/ReferenceData";
import { LoadReferenceDataFailureAction, LoadReferenceDataInitAction, LoadReferenceDataSuccessAction } from "./actions/app/AppActions";
import React from "react";
import ErrorBoundry from "./components/shared/ErrorBoundary";
import { Transactions } from "./components/transactions/Transactions";
import AppError from "./components/errors/AppError";
import { NavigationTabs, type TabType } from "./components/shared/NavigationTabs";


function App() {   
  const [state, dispatch] = React.useReducer(AppReducer, InitialAppState);

  const transactions = (
    <ErrorBoundry fallback={<AppError area="Transactions" message="An error occured while processing your request" />}>
      <Transactions merchants={state.merchants} categories={state.categories}/>
    </ErrorBoundry>
  );
  
  const merchants = (
    <ErrorBoundry fallback={<AppError area="Merchants" message="An error occured while processing your request" />}>
      <Merchants />
    </ErrorBoundry>
  );

  const budget = (
    <ErrorBoundry fallback={<AppError area="Budget" message="An error occured while processing your request" />}>
      <Budget />
    </ErrorBoundry>
  );
  
  const tabs: TabType[] = [ 
    { title: "Transactions", content: transactions, isActive: true },
    { title: "Merchants", content: merchants, isActive: false },
    { title: "Budget", content: budget, isActive: false}
  ];

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
return (  
 
  <div className='container full-screen' test-roleid="container">
      <div className='row'>
        <NavigationTabs tabs={tabs} />
      </div>
  </div>
)}

export default App
