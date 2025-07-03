import { useState, type ReactNode } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export type TabType = { 
  content: ReactNode,
  title: string,
  isActive: boolean
};

export function NavigationTabs({ tabs, onChanged }: { tabs: TabType[], onChanged: (tab: string) => void }) {
  const tab = tabs.find(t=>t.isActive) ?? tabs[0];

  const [key, setKey] = useState(tab.title) ;

  function handleTabSelected(tab: string) {
    setKey(tab);
    onChanged(tab);
  }

  return (
    <>
        <Tabs
          data-testid="app-tabs"
          activeKey={key}
          onSelect={(k) => { handleTabSelected(k??"")}}
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