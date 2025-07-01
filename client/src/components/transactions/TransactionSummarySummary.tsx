import type { ReactNode } from 'react';
import Badge from 'react-bootstrap/Badge';
import "./TransactionSearchSummary.css";
import { filterToStrings, type FilterMessage } from '../../helpers/filterToStrings';
import type { TransactionFilterSummaryProps } from '../../types/TransactionFilterSummaryProps';

export default function TransactionSearchSummary(props: TransactionFilterSummaryProps) {
  const filterStrings = filterToStrings(props.filter);
  let badges: ReactNode;

  if (filterStrings.length === 0) badges = <></>
  else 
    badges = <>{filterStrings.map((fs: FilterMessage) => 
      <Badge className="m-1 font-bold" bg="light" text="dark" style={{cursor: 'pointer' }} pill onClick={()=>props.clearColumns(fs.columns)} >{fs.message}</Badge>
    )}</>

  const showClearFilter = filterStrings.length > 1;
  return (
    <div className="row">
      <div className="col-12 badge-row">
        { !!filterStrings.length && <span className="mx-2">Current Filter: </span> }
        {badges}
        {!showClearFilter || <Badge className="m-1 font-bold" bg="light" text="dark" style={{cursor: 'pointer' }} onClick={()=>props.clearColumns([])} pill>Clear All</Badge>}
        
      </div>
    </div>
  );
}
