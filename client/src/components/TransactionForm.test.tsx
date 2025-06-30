import { vi } from "vitest";
import TransactionForm from "./TransactionForm";
import { newTransaction, type Transaction } from "../types/Transaction";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TransactionForm", () => {
  it("should render form with merchants and types listed with empty transaction", async () => {
    const merchants = [ { id: 1, name: "Wal-Mart" }, { id: 2, name: "Target" }, { id: 3, name: "Sam's Club" } ];
    const categories = [ {id: 1, name: "Cat #1"}, { id: 2, name: "Cat #2" } ];
    
    const save = vi.fn();
    const change = vi.fn();
    const transaction = newTransaction;
    render(<TransactionForm merchants={merchants} categories={categories} onSave={save} onChange={change} transaction={transaction} />);
    const merchantsList = await waitFor(() => screen.getByTestId("merchants") as HTMLSelectElement);
    const categoriesList = await waitFor(() => screen.getByTestId("categories") as HTMLSelectElement);
    expect(merchantsList).toBeInTheDocument();
    expect(merchantsList.options.length).toBe(4);
    expect(merchantsList.options[0].textContent).toBe('');
    merchants.forEach((m, i) => expect(merchantsList.options[i+1].textContent).toBe(m.name));
    expect(categoriesList).toBeInTheDocument();
    expect(categoriesList.options.length).toBe(3);
    expect(categoriesList.options[0].textContent).toBe('');
    categories.forEach((c, i) => expect(categoriesList.options[i+1].textContent).toBe(c.name));
  })

  it("should prefill with values from transaction being edited", async () => {
    const merchants = [ { id: 1, name: "Wal-Mart" }, { id: 2, name: "Target" }, { id: 3, name: "Sam's Club" } ];
    const categories = [ {id: 1, name: "Cat #1"}, { id: 2, name: "Cat #2" } ];
    
    const save = vi.fn();
    const change = vi.fn();
    const transaction: Transaction = { id: 1, amount: 10, comments: "comments", date: new Date(2025, 0, 1), merchant: merchants[0], category: categories[1], runningBalance: 0, hasReceipt: true };
    render(<TransactionForm merchants={merchants} categories={categories} onSave={save} onChange={change} transaction={transaction} />);
    const merchantsList = await waitFor(() => screen.getByTestId("merchants") as HTMLSelectElement);
    const categoriesList = await waitFor(() => screen.getByTestId("categories") as HTMLSelectElement);
    const amount = await waitFor(() => screen.getByTestId("amount") as HTMLInputElement);
    const comments = await waitFor(() => screen.getByTestId("comments") as HTMLInputElement);
    const date = await waitFor(() => screen.getByTestId("date") as HTMLInputElement);
    const hasReceipt = await waitFor(() => screen.getByTestId("hasReceipt") as HTMLInputElement);
    expect(merchantsList.value).toBe("Wal-Mart")
    expect(categoriesList.value).toBe("Cat #2")
    expect(amount).toBeInTheDocument();
    expect(amount.value).toBe("10");
    expect(comments).toBeInTheDocument();
    expect(comments.value).toBe("comments")
    expect(date).toBeInTheDocument();
    expect(date.value).toBe("2025-01-01");
    expect(hasReceipt).toBeInTheDocument();
    expect(hasReceipt.checked).toBe(true);
  })

  it("should call update when key entered into field comments", async () => {
    const merchants = [ { id: 1, name: "Wal-Mart" }, { id: 2, name: "Target" }, { id: 3, name: "Sam's Club" } ];
    const categories = [ {id: 1, name: "Cat #1"}, { id: 2, name: "Cat #2" } ];
    
    const save = vi.fn();
    const transaction: Transaction = { id: 1, amount: 10, comments: "comments", date: new Date(2025, 0, 1), merchant:merchants[1], category: categories[1], runningBalance: 0, hasReceipt: true };
    const updateTrans = { ...transaction, comments: "commentsa" };
    const change = vi.fn();

    render(<TransactionForm merchants={merchants} categories={categories} onSave={save} onChange={change} transaction={transaction} />);
    const comments = await waitFor(() => screen.getByTestId("comments") as HTMLInputElement);
    expect(comments).toBeInTheDocument();
    await userEvent.click(comments);
    expect(change).not.toHaveBeenCalled();
    await userEvent.keyboard("a");
    expect(change).toHaveBeenCalledWith(updateTrans);
  })

  it.skip("should call save when submit button clicked", async () => {
    const merchants = [ { id: 1, name: "Wal-Mart" }, { id: 2, name: "Target" }, { id: 3, name: "Sam's Club" } ];
    const categories = [ {id: 1, name: "Cat #1"}, { id: 2, name: "Cat #2" } ];
    
    const save = vi.fn();
    let transaction: Transaction = { id: 1, amount: 10, comments: "comments", date: new Date(2025, 0, 1), merchant: merchants[0] , category: categories[0], runningBalance: 0, hasReceipt: true };
    const updateTrans = { ...transaction, comments: "commentsa" };
    const change = vi.fn().mockImplementation(t => transaction = t);

    render(<TransactionForm merchants={merchants} categories={categories} onSave={save} onChange={change} transaction={transaction} />);
    const comments = await waitFor(() => screen.getByTestId("comments") as HTMLInputElement);
    const saveBtn = await waitFor(() => screen.getByTestId("submit"));
    expect(comments).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();

    await userEvent.click(comments);
    await userEvent.keyboard("a");
    expect(change).toHaveBeenCalledWith(updateTrans);
    expect(save).not.toHaveBeenCalled();
    await userEvent.click(saveBtn); 
    expect(save).toHaveBeenCalledWith(updateTrans);
  })

})