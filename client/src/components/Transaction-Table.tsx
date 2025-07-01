import type { TransactionTableProps } from "../types/TransactionTableProps";
import type { TransactionTableRowProps } from "../types/transactionTableRowProps";
import "./Transaction-Table.css";
import DeleteIcon from './Delete-Icon';
import EditIcon from "./Edit-Icon";
import AttachmentIcon from "./Attachment";
import { formatCurrency } from "../helpers/currencyFormatter";
import type { TransactionTableFooterProps } from "../types/TranaactionTableFooterProps";
import { Pagination, Table } from "react-bootstrap";
import type { TransactionTableHeaderProps } from "../types/TransactionTableHeaderProps";
import { SortButton } from "./SortButton";
import type { SortType } from "../types/TransactionsState";
import type { ReactNode } from "react";
import { elipsis } from "../helpers/elipsis";
import type { ColumnType } from "../types/ColumnType";

export default function TransactionTable(props: TransactionTableProps) {
  const { transactions, pageNumber, onDelete, onEdit, onView, onPageNumberChange, summary, onSort, currentSort, children } = props;
  const view = onView ?? (t => alert('Hello ' + t.merchant));
  const handleSort = onSort ?? (()=> {});
  const balance = Math.round((summary.totalDebitAmount - summary.totalCreditAmount) * 100) / 100;
  return (
    <>
    <div className="row mb-2">
      <div className="col-3 text-center">
        <strong className="me-1">Transactions:</strong>{summary.transactionsCount} 
      </div>
      <div className="col-3 text-center">
        <strong className="me-1">Total Debits:</strong> {formatCurrency(summary.totalDebitAmount)}    
      </div>
      <div className="col-3 text-center">
        <strong className="me-1">Total Credits:</strong> {formatCurrency(summary.totalCreditAmount)}
      </div>
      <div className="col-3 text-center">
        <strong className="me-1">Current Balance:</strong> {formatCurrency(balance)}
      </div>
      
    </div> 
    <Table data-testid="transaction-table" striped bordered hover variant="dark">  
      <TransactionTableHeader onSort={(c) => handleSort(c)} sort={currentSort} key={1}/>
      <tbody>
        {transactions.map(transaction => 
          <TransactionTableRow transaction={transaction} onDelete={onDelete} onEdit={onEdit} onView={view} key={transaction.id}/>
        )}
      </tbody>
      <tfoot>
        <TransactionTableFooter 
          summary={summary}
          currentPage={pageNumber} 
          onPageChanged={onPageNumberChange}>
          {children}
        </TransactionTableFooter>
      </tfoot>
    </Table>
    </>
  )
}


function TransactionTableHeader({ onSort, sort }: TransactionTableHeaderProps) {
  const getSortDir = (col: string, sort: SortType): "asc" | "desc" | "none" => {
    if (sort?.column !== col) return "none";
    return sort?.direction || "asc";
  }  

  const columns: ColumnType[] = [ 
    { column: "date", header: "Date", dir: getSortDir("date", sort) }, 
    { column: "categoryName", header: "Category", dir: getSortDir("categoryName", sort) },
    { column: "merchantName", header: "Merchant", dir: getSortDir("merchantName", sort) },
    { column: "amount", header: "Amount", dir: getSortDir("amount", sort) },
    { column: "runningBalance", header: "Running Balance", dir: getSortDir("runningBalance", sort) },
    { column: "comments", header: "Comments", dir: getSortDir("comments", sort) },
    { column: "hasReceipt", header: "", dir: getSortDir("hasReceipt", sort), unsortable: false }
  ];

  return (
    <thead>
      <tr>
        <th></th>
        {columns.map(c => (
          <th key={c.column}>
            <SortButton sortDir={c.dir} column={c.column} onSort={() => onSort(c)}>{c.header}</SortButton>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TransactionTableRow({ transaction, onDelete, onEdit, onView}: TransactionTableRowProps) {
  const elidedComments = elipsis(transaction.comments, 50);
  const comments = elidedComments === transaction.comments ? transaction.comments : <span title={transaction.comments}>{elidedComments}</span>;

  return (
      <tr data-testid="transaction-row">
        <td>
          <DeleteIcon onAction={onDelete} item={transaction}/>
          <EditIcon onAction={onEdit} item={transaction} />
        </td>
        <td>
          {transaction.date.toLocaleDateString()}
        </td>
        <td>
          {transaction.category.name}
        </td>
        <td>
          {transaction.merchant.name}
        </td>
        <td>
          {formatCurrency(transaction.amount)}
        </td>
        <td>
          {formatCurrency(transaction.runningBalance as number)}
        </td>
        <td>
          {comments} - {transaction.id}
        </td>
        <td>
          {transaction.hasReceipt &&
            <AttachmentIcon onAction={onView} item={transaction} />
          }
        </td>
      </tr>
  )
}

function TransactionTableFooter({ summary, currentPage, onPageChanged, children }: TransactionTableFooterProps) {
  const maxElipsis = summary.numPages > 12 && (summary.numPages - currentPage) > 7;
  const minElipsis = summary.numPages > 12 && currentPage > 7;
  let range = { above: 0, below: 0};
  if (maxElipsis && minElipsis) range = {above: 5, below: 5} // pager will have elipsis on both ends
  else if (maxElipsis) range = { above: 11 - currentPage, below: 5 }; // pager will have elipsis on upper end only
  else if (minElipsis) range = { above: 5, below: currentPage - (summary.numPages - 11) }; // pager will have elipsis on lower end only
  else range = { above: 6, below: 6 }; // pager will have elipsis on neither end
  const numbers = { 
    starting: (minElipsis ? currentPage - range.below : 1),
    ending: (maxElipsis ? currentPage + range.above : summary.numPages)
  };

  const items: Array<ReactNode> = [];
  if (minElipsis) items.push(<Pagination.Item key="0" disabled data-testid="paging-item">...</Pagination.Item>)
  for (let number = numbers.starting; number <= numbers.ending; number++) {
    items.push(
      <Pagination.Item key={number} active={number === currentPage} data-testid="paging-item">
        {number}
      </Pagination.Item>
    );
  }
  if (maxElipsis) items.push(<Pagination.Item key="-1" disabled data-testid="paging-item">...</Pagination.Item>);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (e: any) => {
    e.preventDefault();
    const selected = e.target?.innerHTML;
    // ignore clicks on elipsis
    if (selected.includes("...")) return;
    else onPageChanged(parseInt(selected));
  };

  return (
    <tr className='table-dark text-center' data-testid="transactions-summary">
      <td colSpan={4}>
        {children}
      </td>
      <td colSpan={8}> 
        <Pagination  style={{width: "max-content", margin: "auto" }} onClick={handlePageChange} data-testid="pagination">{items}</Pagination>
      </td>
    </tr>
  ); 
}