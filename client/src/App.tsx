import "./App.css";
import { NavigationTabs, type TabType } from "./components/NavigationTabs";
import { Merchants } from "./components/merchants/merchants";
import { Transactions } from './components/Transactions';
import Budget from "./components/budget/Budget";

function App() {   
  const tabs: TabType[] = [ 
    { title: "Transactions", content: <Transactions/>, isActive: true },
    { title: "Merchants", content: <Merchants />, isActive: false },
    { title: "Budget", content: <Budget />, isActive: false}
  ]
return (  
 
  <div className='container full-screen'>
      <div className='row'>
        <NavigationTabs tabs={tabs} />
      </div>
  </div>
)}

export default App
