import type { ReactNode } from 'react';
import { filterToStrings } from '../helpers/filterToStrings';
import type { FilterMessage } from '../helpers/filterToStrings';
import { type TransactionFilterSummaryProps } from '../types/TransactionFilterSummaryProps';
import Badge from 'react-bootstrap/Badge';

export default function TransactionSearchSummary(props: TransactionFilterSummaryProps) {
  const filterStrings = filterToStrings(props.filter);
  let badges: ReactNode;

  if (filterStrings.length === 0) badges = <></>
  else 
    badges = <>{filterStrings.map((fs: FilterMessage) => 
      <Badge style={{cursor: 'pointer' }} pill onClick={()=>props.clearColumns(fs.columns)} className='mx-1'>{fs.message}</Badge>
    )}</>

  const showClearFilter = filterStrings.length > 1;

  return (
    <div className="row">
      <div className="col-12 text-end">
        {badges}
        {!showClearFilter || <Badge style={{cursor: 'pointer' }} onClick={()=>props.clearColumns([])} pill>Clear All</Badge>}
      </div>
    </div>
  );
}
