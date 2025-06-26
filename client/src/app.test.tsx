import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { vi } from 'vitest';
import axios from 'axios'
import { type Transaction } from './types/Transaction';
import { formatCurrency } from './helpers/currency-formatter';
import { DELETE_URL } from './types/constants';



describe("App", () => {
  const transactions: Transaction[] = [ 
    { id: 1, amount: 100, merchant: "Wal-Mart", date: new Date("1/1/2022"), runningBalance: 100, hasReceipt: true, type: "Credit Card Debit", comments: "Comments" },
    { id: 1, amount: 100, merchant: "Target", date: new Date("2/1/2022"), runningBalance: 300, hasReceipt: false, type: "Credit Card Debit", comments: "Comments" },
    { id: 1, amount: 100, merchant: "Schnucks", date: new Date("3/1/2022"), runningBalance: 600, hasReceipt: true, type: "Credit Card Debit", comments: "Comments" },
    { id: 1, amount: 100, merchant: "Wal-Greens", date: new Date("4/1/2022"), runningBalance: 1000, hasReceipt: false, type: "Credit Card Debit", comments: "Comments" },
    { id: 1, amount: 100, merchant: "Amazon", date: new Date("5/1/2022"), runningBalance: 1500, hasReceipt: true, type: "Credit Card Debit", comments: "Comments" },
  ]
  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.get).mockResolvedValue({ data: transactions })
    vi.mocked(axios.delete).mockResolvedValue({})
  })

  it('should render initial load message correctly', async () => {
    vi.mocked(axios.get).mockImplementationOnce(async () =>{
      return new Promise(resolve => setTimeout(() => resolve(transactions), 250));
    });
    render(<App />);
    
    const eRole = await waitFor(() => screen.getByRole("app-spinner"));
    const element = await waitFor(() => screen.getByText('Please be patient while we load your data...'));

    expect(eRole).toBeInTheDocument();
    expect(element).toBeInTheDocument();
  });

  it("shouid render table of transactions when load completes", async () => {
    render(<App/>);
    const element = await waitFor(() => screen.getAllByRole('transactionTable'));
    expect(element.length).toBe(1);
    expect(element[0]).toBeInTheDocument();
  });

  
  it("should render one row in table for each row < pageSize of transactions when load completes", async () => {
    render(<App/>);
    const element = await waitFor(() => screen.getAllByRole('transaction-row'));
    expect(element.length).toBe(5);
  });

  it("should render data from associated transaction for each row", async () => {
    render(<App/>);
    const rows = await waitFor(() => screen.getAllByRole("transaction-row"));
    let row = rows[0];
    let cells = row.querySelectorAll("td");
    expect(cells.length).toBe(8);
    const transaction = transactions[0];
    // skip the first cell since it contains svgs that are hard to know what to check
    expect(cells[1].innerHTML).toBe(transaction.date.toLocaleDateString());
    expect(cells[2].innerHTML).toBe(transaction.type);
    expect(cells[3].innerHTML).toBe(transaction.merchant);  
    expect(cells[4].innerHTML).toBe(formatCurrency(transaction.amount));
    expect(cells[5].innerHTML).toBe(formatCurrency(transaction.runningBalance));
    expect(cells[6].innerHTML).toBe(transaction.comments);
    //this is the hasReceipt column.  The first tr/ansaction has a receipt
    expect(cells[7].innerHTML).toContain("svg");
    row = rows[1];
    cells = row.querySelectorAll("td");
    // the 2nd transaction does not have a receipt so this column should't have a svg
    expect(cells[7].innerHTML).not.toContain("svg");
  })

  it("should show delete confirmation dialog when delete clicked with correct message", async () => {
    render(<App/>);
    const rows = await waitFor(() => screen.getAllByRole("transaction-row"));
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll("td");
    const firstCell = cells[0];
    const svg = firstCell.querySelectorAll("svg");
    await userEvent.click(svg[0]);
    const dialog = await waitFor(() => screen.getByRole("confirm-delete"));
    expect(dialog).toBeInTheDocument();
    const message = "Are you sure you want to delete this transation from Wal-Mart which occured on 1/1/2022";
    expect(dialog.innerHTML).toContain(message);
  })

  it("should delete the transaction when confirm button clicked", async () => {
    render(<App/>);
    const rows = await waitFor(() => screen.getAllByRole("transaction-row"));
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll("td");
    const firstCell = cells[0];
    const svg = firstCell.querySelectorAll("svg");
    await userEvent.click(svg[0]);
    const confirm = await waitFor(() => screen.getByRole("confirm-button"));
    expect(confirm).toBeInTheDocument();
    expect(rows.length).toBe(5);
    await userEvent.click(confirm);
    expect(axios.delete).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenLastCalledWith(`${DELETE_URL}/1`)
  })

  it("should edit the transaction when edit button clicked", async () => {
    render(<App/>);
    const rows = await waitFor(() => screen.getAllByRole("transaction-row"));
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll("td");
    const firstCell = cells[0];
    const svg = firstCell.querySelectorAll("svg");
    await userEvent.click(svg[1]);
    const editDialog = await waitFor(() => screen.getByRole("transaction-form"));
    expect(editDialog).toBeInTheDocument();
    const merchantName = await waitFor(() => screen.getByRole("merchant-name"));
    expect((merchantName as HTMLSelectElement).value).toContain(transactions[0].merchant)
  })

  it("should show search dialog when search button clicked", async () => {
    render(<App/>);
    const button = await waitFor(() => screen.getByRole("search-button"));
    expect(button).toBeInTheDocument();
    await userEvent.click(button)
    const form = await waitFor(() => screen.getByRole("search-form"));
    expect(form).toBeInTheDocument();
  })

  it("should show the transaction entry dialog when add transaction is clicked", async () => {
    render(<App/>);
    const button = await waitFor(() => screen.getByRole("add-transaction"));
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const form = await waitFor(() => screen.getByRole("transaction-form"));
    expect(form).toBeInTheDocument();
    expect(form.innerHTML).toContain("Add Transaction");
  })

  //TODO:  Add tests for paging and summary
})

