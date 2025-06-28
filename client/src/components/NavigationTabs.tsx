import { useState, type ReactNode } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export type TabType = { 
  content: ReactNode,
  title: string,
  isActive: boolean
};

export function NavigationTabs({ tabs}: { tabs: TabType[]}) {
  const tab = tabs.find(t=>t.isActive) ?? tabs[0];

  const [key, setKey] = useState(tab.title) ;

  return (
    <>
        <h3>Expenses</h3>
        <Tabs
          activeKey={key}
          onSelect={(k) => { setKey(k??"")}}
          className="mb-3">
          {tabs.map(tab => ( 
            <Tab key={tab.title} eventKey={tab.title} title={tab.title}>
              {tab.content}
            </Tab>
          ))}
        </Tabs>
    </>
    
  );
}