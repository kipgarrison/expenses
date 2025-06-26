import "./App.css";
import { NavigationTabs, type TabType } from "./components/effects/NavigationTabs";
import { Merchants } from "./components/merchants/merchants";
import { Transactions } from './components/Transactions';

function App() {   
  const tabs: TabType[] = [ 
    { title: "Transactions", content: <Transactions/>, isActive: true },
    { title: "Merchants", content: <Merchants />, isActive: false }
  ]
return (  
 
  <div className='container full-screen'>
      <div className='row'>
        <NavigationTabs tabs={tabs} />
      </div>
  </div>
)}

export default App
