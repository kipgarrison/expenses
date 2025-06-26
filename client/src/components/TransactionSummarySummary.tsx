import type { ReactNode } from 'react';
import { filterToStrings } from '../helpers/filterToStrings';
import type { FilterMessage } from '../helpers/filterToStrings';
import { type TransactionFilterSummaryProps } from '../types/TransactionFilterSummaryProps';
import Badge from 'react-bootstrap/Badge';
import "./TransactionSearchSummary.css";

export default function TransactionSearchSummary(props: TransactionFilterSummaryProps) {
  const filterStrings = filterToStrings(props.filter);
  let badges: ReactNode;

  if (filterStrings.length === 0) badges = <></>
  else 
    badges = <>{filterStrings.map((fs: FilterMessage) => 
      <Badge className="float-end m-1 font-bold" bg="light" text="dark" style={{cursor: 'pointer' }} pill onClick={()=>props.clearColumns(fs.columns)} >{fs.message}</Badge>
    )}</>

  const showClearFilter = filterStrings.length > 1;
  return (
    <div className="row">
      <div className="col-12 badge-row">
        
        {badges}
        {!showClearFilter || <Badge className="float-end m-1 font-bold" bg="light" text="dark" style={{cursor: 'pointer' }} onClick={()=>props.clearColumns([])} pill>Clear All</Badge>}
        { !!filterStrings.length && <span className="float-end mx-2">Current Filter: </span> }
      </div>
    </div>
  );
}
