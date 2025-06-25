import type { TransactionTableProps } from "../types/TransactionTableProps";
import type { TransactionTableRowProps } from "../types/transactionTableRowProps";
import "./Transaction-Table.css";
import DeleteIcon from './Delete-Icon';
import EditIcon from "./Edit-Icon";
import AttachmentIcon from "./Attachment";
import { formatCurrency } from "../helpers/currency-formatter";
import type { TransactionTableFooterProps } from "../types/TranaactionTableFooterProps";
import { Pagination } from "react-bootstrap";
import type { TransactionTableHeaderProps } from "../types/TransactionTableHeaderProps";
import { SortButton } from "./sort-button";
import type { SortType } from "../types/TransactionsState";

export default function TransactionTable(props: TransactionTableProps) {
  const { transactions, pageNumber, onDelete, onEdit, onView, onPageNumberChange, summary, onSort, currentSort } = props;
  const view = onView ?? (t => alert('Hello ' + t.merchant));
  const handleSort = onSort ?? (()=> {});
  
  return (
    <table role="transactionTable" className="table table-hover"  id="transactions">
      <TransactionTableHeader onSort={handleSort} sort={currentSort} />
      <tbody>
        {transactions.map(transaction => 
          <TransactionTableRow transaction={transaction} onDelete={onDelete} onEdit={onEdit} onView={view} key={transaction.id}/>
        )}
      </tbody>
      <tfoot>
        <TransactionTableFooter 
          summary={summary}
          currentPage={pageNumber} 
          onPageChanged={onPageNumberChange} />
      </tfoot>
    </table>
  )
}


function TransactionTableHeader({ onSort, sort }: TransactionTableHeaderProps) {
  const getSortDir = (col: string, sort: SortType): "asc" | "desc" | "none" => {
    if (sort?.column !== col) return "none";
    return sort?.direction || "asc";
  }  

  const headers = [ 
    { column: "date", header: "Date", dir: getSortDir("date", sort) }, 
    { column: "type", header: "Type", dir: getSortDir("type", sort) },
    { column: "merchant", header: "Merchant", dir: getSortDir("merchant", sort) },
    { column: "amount", header: "Amount", dir: getSortDir("amount", sort) },
    { column: "runningBalance", header: "Running Balance", dir: getSortDir("runningBalance", sort) },
    { column: "comments", header: "Comments", dir: getSortDir("comments", sort) }
  ];

  return (
    <thead>
      <tr>
        <th></th>
        {headers.map(h => (
          <th>
            <SortButton sortDir={h.dir} column={h.column} onSort={onSort}>{h.header}</SortButton>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TransactionTableRow({ transaction, onDelete, onEdit, onView}: TransactionTableRowProps) {
  return (
      <tr role="transaction-row">
        <td>
          <DeleteIcon onAction={onDelete} item={transaction}/>
          <EditIcon onAction={onEdit} item={transaction} />
        </td>
        <td>
          {transaction.date.toLocaleDateString()}
        </td>
        <td>
          {transaction.type}
        </td>
        <td>
          {transaction.merchant}
        </td>
        <td>
          {formatCurrency(transaction.amount)}
        </td>
        <td>
          {formatCurrency(transaction.runningBalance as number)}
        </td>
        <td>
          {transaction.comments}
        </td>
        <td>
          {transaction.hasReceipt &&
            <AttachmentIcon onAction={onView} item={transaction} />
          }
        </td>
      </tr>
  )
}

function TransactionTableFooter({ summary, currentPage, onPageChanged}: TransactionTableFooterProps) {
  const items = [];
  for (let number = 1; number <= summary.numPages; number++) {
  items.push(
    <Pagination.Item key={number} active={number === currentPage}>
      {number}
    </Pagination.Item>,
  );
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (e: any) => {
    const selected = e.target?.innerHTML;
    if (selected === "Next") onPageChanged(currentPage+1);
    else if (selected === "Previous") onPageChanged(currentPage - 1);
    else onPageChanged(parseInt(selected));
    e.preventDefault();
  };

  return (
    <tr className='table-dark text-center'>
      <td colSpan={4}>
        {summary.transactionsCount} total transactions for {formatCurrency(summary.totalAmount)}
      </td>
      <td colSpan={4}> 
        <Pagination onClick={handlePageChange}>{items}</Pagination>
      </td>
    </tr>
  ); 
}