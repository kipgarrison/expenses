import { vi } from "vitest";
import { Transactions } from "./Transactions";
import { render, screen, waitFor } from "@testing-library/react";
import { newDebitTransaction, type Transaction } from "../types/Transaction";
import React from "react";
import { transactionStateInitialValue, type TransactionsState } from "../types/TransactionsState";
import { ClearCurrentTransactionAction, DeleteTransactionInitAction, EditTransactionAction, LoadTransactionsInitAction, SetCurrentTransactionAction, SetModalAction, UpdatePageNumberAction } from "../actions/TransactionActions";
import userEvent from "@testing-library/user-event";
// import type { ActionWithPayload } from "../actions/ActionWithPayload";

describe.only("Transactions", () => {
  const transactions: Transaction[] = [ 
    { id: 1, amount: 100, merchant: { id: 1, name: "Wal-Mart" }, category: { id: 1, name: 'Category1' }, date: new Date("1/1/2022"), runningBalance: 100, hasReceipt: true, comments: "Comments", type: "Debit" },
    { id: 2, amount: 100, merchant: { id: 2, name: "Target" }, category: { id: 2, name: 'Category2' }, date: new Date("2/1/2022"), runningBalance: 300, hasReceipt: false, comments: "Comments", type: "Debit" },
    { id: 3, amount: 100, merchant: { id: 3, name: "Schnucks" }, category: { id: 3, name: 'Category3' }, date: new Date("3/1/2022"), runningBalance: 600, hasReceipt: true,  comments: "Comments", type: "Debit" },
    { id: 4, amount: 100, merchant: { id: 4, name: "Wal-Greens" }, category: { id: 4, name: 'Category4' }, date: new Date("4/1/2022"), runningBalance: 1000, hasReceipt: false, comments: "Comments", type: "Debit" },
    { id: 5, amount: 100, merchant: { id: 5, name: "Amazon" }, category: { id: 5, name: 'Category5' }, date: new Date("5/1/2022"), runningBalance: 1500, hasReceipt: true, comments: "Comments", type: "Debit" },
  ];
  const mockState: TransactionsState = {
    ...transactionStateInitialValue, 
    transactions: transactions,
    pageNumber: 1,
    pageSize: 2,
    transactionPage: transactions.slice(0,  2),
    summary: { numPages: 3, totalAmount: 500, transactionsCount: 5 }
  }

  const merchants = [ {id: 1, name: "Wal-Mart"}, { id: 2, name: "Target"}, { id: 3, name: "Schnucks"}, {id: 4, name: "Wal-Greens"}, {id: 5, name: "Amazon" }];
  const categories = [ {id: 1, name: "Category1"}, { id: 2, name: "Category2"}, { id: 3, name: "Category3"}, {id: 4, name: "Category4"}, {id: 5, name: "Category5" }];
  const mockDispatch = vi.fn().mockImplementation((action) => console.log(action)); // Mock the dispatch function to assert its calls

  beforeEach(() => {
    const mockUseReducer = vi.fn().mockImplementation(() => [mockState, mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockUseReducer);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });


  it("should initiate call to get transactions when component first loads", () => {
    expect(mockDispatch).toHaveBeenCalledTimes(0)
    render(<Transactions merchants={merchants} categories={categories} />);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(new LoadTransactionsInitAction());
  });

  it("should show app spinner if the apiStatus showAppSpinner is true", async () => {
    const newState = { ...mockState, showAppSpinner: true };
    const mockReducer = vi.fn().mockImplementation(() => [newState, mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockReducer);
    render(<Transactions merchants={merchants} categories={categories} />);
    const spinner = await waitFor(() => screen.getByTestId("app-spinner"));
    expect(spinner).toBeInTheDocument();
  })

  it("should not show app spinner if the apiStatus showAppSpinner is true", async () => {
    render(<Transactions merchants={merchants} categories={categories} />);
    const spinner = screen.queryByTestId("app-spinner");
    expect(spinner).toBeNull();
  })

  it("should display a table of transactions for the transaction page in state", async () => {
    render(<Transactions merchants={merchants} categories={categories} />);

    const table = await waitFor(() => screen.getByTestId("transaction-table"));
    const rows = table.querySelectorAll("tbody tr");
    expect(rows.length).toBe(2);
    expect(table.innerHTML).toContain("Wal-Mart");
    expect(table.innerHTML).toContain("Target");
    expect(table.innerHTML).not.toContain("Schnucks");
    expect(table.innerHTML).not.toContain("Wal-Greens");
    expect(table.innerHTML).not.toContain("Amazon");
  })

  it("should display a paging control with entries for each page", async () => {
    render(<Transactions merchants={merchants} categories={categories} />);
    
    const pageingItems = await waitFor(() => screen.getAllByTestId("paging-item"));
    expect(pageingItems.length).toBe(3);
    expect(pageingItems[0].innerHTML).toContain("1")
    expect(pageingItems[1].innerHTML).toContain("2")
    expect(pageingItems[2].innerHTML).toContain("3")
  })

  it("should dispatch a change page action to the store when page item clicked", async () => {
    render(<Transactions merchants={merchants} categories={categories} />);
    const pageingItems = await waitFor(() => screen.getAllByTestId("paging-item"));
    await userEvent.click(pageingItems[1]);
    expect(mockDispatch).toHaveBeenCalledWith(new UpdatePageNumberAction(2));
  })

  it("should dispatch an action to set the current transaction and another to display the modal when delete button clicked", async () => {
    render(<Transactions merchants={merchants} categories={categories} />);
    const rows = await waitFor(() => screen.getAllByTestId("transaction-row"));
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll("td");
    const firstCell = cells[0];
    const svg = firstCell.querySelectorAll("svg");
    vi.resetAllMocks(); // the call the load transactions should be ignored in this test
    await userEvent.click(svg[0]);

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(new SetModalAction("ConfirmDelete"));
    expect(mockDispatch).toHaveBeenCalledWith(new SetCurrentTransactionAction(transactions[0]))
  });

  it("should not display the delete modal if the modal value in state is not 'ConfirmDelete'", async () => {
    render(<Transactions merchants={merchants} categories={categories} />);
    const dialog = await waitFor(() => screen.queryByTestId("confirm-delete"));
    expect(dialog).not.toBeInTheDocument();
  });

  it("should display the delete modal if the modal value in state is 'ConfirmDelete'", async () => {
    const mockUseReducer = vi.fn().mockImplementation(() => [{ ...mockState, modal: 'ConfirmDelete' }, mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockUseReducer);
    render(<Transactions merchants={merchants} categories={categories} />);
    const dialog = await waitFor(() => screen.queryByTestId("confirm-delete"));
    expect(dialog).toBeInTheDocument();
  });

  it("should dispach action to initiate delete and close dialog if 'OK' button on the delete modal is clicked", async () => {
    const mockUseReducer = vi.fn().mockImplementation(() => [{ ...mockState, currentTransaction: newDebitTransaction, modal: 'ConfirmDelete' }, mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockUseReducer);
    render(<Transactions merchants={merchants} categories={categories} />);
    const confirmBtn = await waitFor(() => screen.queryByTestId("confirm-button"));
    expect(confirmBtn).toBeInTheDocument();
    vi.resetAllMocks();
    await userEvent.click(confirmBtn as HTMLButtonElement);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(new DeleteTransactionInitAction(newDebitTransaction));
    expect(mockDispatch).toHaveBeenCalledWith(new SetModalAction("None"));
  });

  it("should dispach actions to close dialog and clear the current transaction if 'Cancel' button on the delete modal is clicked", async () => {
    const mockUseReducer = vi.fn().mockImplementation(() => [{ ...mockState, currentTransaction: newDebitTransaction, modal: 'ConfirmDelete' }, mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockUseReducer);
    render(<Transactions merchants={merchants} categories={categories} />);
    const confirmBtn = await waitFor(() => screen.queryByTestId("cancel-button"));
    expect(confirmBtn).toBeInTheDocument();
    vi.resetAllMocks();
    await userEvent.click(confirmBtn as HTMLButtonElement);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(new SetModalAction("None"));
    expect(mockDispatch).toHaveBeenCalledWith(new ClearCurrentTransactionAction());
  });

  it("should display '...' at end of paging control if more than displayable number of pages  exist", async () => {
    const newState: TransactionsState = { ...mockState, summary: {numPages: 20, totalAmount: 1000, transactionsCount: 1000 } }
    const mockUseReducer = vi.fn().mockImplementation(() => [newState , mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockUseReducer);
    render(<Transactions merchants={merchants} categories={categories} />);
    const pagingItems = await waitFor(() => screen.getAllByTestId("paging-item"));
    expect(pagingItems[pagingItems.length - 1].innerHTML).toContain("...")
  })

  it("should display '...' at start of paging control if # pages - currentPage is too large to display all  links", async () => {
    const newState: TransactionsState = { ...mockState, pageNumber: 20,  summary: {numPages: 25, totalAmount: 1000, transactionsCount: 1000 } }
    const mockUseReducer = vi.fn().mockImplementation(() => [newState , mockDispatch]);
    vi.spyOn(React, 'useReducer').mockImplementation(mockUseReducer);
    render(<Transactions merchants={merchants} categories={categories} />);
    const pagingItems = await waitFor(() => screen.getAllByTestId("paging-item"));
    expect(pagingItems[0].innerHTML).toContain("...")
  })

  it("should dispatch an action to display the edit dialog when edit button clicked", async () => {
    render(<Transactions merchants={merchants} categories={categories} />);
    const rows = await waitFor(() => screen.getAllByTestId("transaction-row"));
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll("td");
    const firstCell = cells[0];
    const svg = firstCell.querySelectorAll("svg");
    vi.resetAllMocks(); // the call the load transactions should be ignored in this test
    await userEvent.click(svg[1]);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(new EditTransactionAction(transactions[0]));
  });

  
});