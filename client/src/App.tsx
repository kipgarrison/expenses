import "./App.css";
import { NavigationTabs, type TabType } from "./components/NavigationTabs";
import { Merchants } from "./components/merchants/merchants";
import { Transactions } from './components/Transactions';
import Budget from "./components/budget/Budget";
import { useEffect } from "react";
import { AppReducer } from "./reducers/AppReducer";
import { InitialAppState } from "./types/AppState";
import axios from "axios";
import type { ReferenceData } from "./types/app/ReferenceData";
import { LoadReferenceDataFailureAction, LoadReferenceDataInitAction, LoadReferenceDataSuccessAction } from "./actions/app/AppActions";
import React from "react";

function App() {   
  const [state, dispatch] = React.useReducer(AppReducer, InitialAppState);

  const tabs: TabType[] = [ 
    { title: "Transactions", content: <Transactions merchants={state.merchants} categories={state.categories}/>, isActive: true },
  { title: "Merchants", content: <Merchants />, isActive: false },
    { title: "Budget", content: <Budget />, isActive: false}
  ]

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
