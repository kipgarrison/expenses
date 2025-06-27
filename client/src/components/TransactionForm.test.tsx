import { vi } from "vitest";
import TransactionForm from "./TransactionForm";
import { newTransaction, type Transaction } from "../types/Transaction";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TransactionForm", () => {
  it("should render form with merchants and types listed with empty transaction", async () => {
    const merchants = [ "Wal-Mart", "Target", "Sam's Club" ];
    const types = [ "CCC", "CCD" ];
    const save = vi.fn();
    const change = vi.fn();
    const transaction = newTransaction;
    render(<TransactionForm merchants={merchants} types={types} onSave={save} onChange={change} transaction={transaction} />);
    const merchantsList = await waitFor(() => screen.getByTestId("merchants") as HTMLSelectElement);
    const typesList = await waitFor(() => screen.getByTestId("types") as HTMLSelectElement);
    expect(merchantsList).toBeInTheDocument();
    expect(merchantsList.options.length).toBe(4);
    expect(merchantsList.options[0].textContent).toBe('');
    merchants.forEach((m, i) => expect(merchantsList.options[i+1].textContent).toBe(m));
    expect(typesList).toBeInTheDocument();
    expect(typesList.options.length).toBe(3);
    expect(typesList.options[0].textContent).toBe('');
    types.forEach((t, i) => expect(typesList.options[i+1].textContent).toBe(t));
  })

  it("should prefill with values from transaction being edited", async () => {
    const merchants = [ "Wal-Mart", "Target", "Sam's Club" ];
    const types = [ "Credit Card Debit", "Bank Account Credit" ];
    const save = vi.fn();
    const change = vi.fn();
    const transaction: Transaction = { id: 1, amount: 10, comments: "comments", date: new Date(2025, 0, 1), merchant: "Target", type: "Credit Card Debit", runningBalance: 0, hasReceipt: true };
    render(<TransactionForm merchants={merchants} types={types} onSave={save} onChange={change} transaction={transaction} />);
    const merchantsList = await waitFor(() => screen.getByTestId("merchants") as HTMLSelectElement);
    const typesList = await waitFor(() => screen.getByTestId("types") as HTMLSelectElement);
    const amount = await waitFor(() => screen.getByTestId("amount") as HTMLInputElement);
    const comments = await waitFor(() => screen.getByTestId("comments") as HTMLInputElement);
    const date = await waitFor(() => screen.getByTestId("date") as HTMLInputElement);
    const hasReceipt = await waitFor(() => screen.getByTestId("hasReceipt") as HTMLInputElement);
    expect(merchantsList).toBeInTheDocument();
    expect(merchantsList.value).toBe("Target")
    expect(typesList).toBeInTheDocument();
    expect(typesList.value).toBe("Credit Card Debit")
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
    const merchants = [ "Wal-Mart", "Target", "Sam's Club" ];
    const types = [ "Credit Card Debit", "Bank Account Credit" ];
    
    const save = vi.fn();
    const transaction: Transaction = { id: 1, amount: 10, comments: "comments", date: new Date(2025, 0, 1), merchant: "Target", type: "Credit Card Debit", runningBalance: 0, hasReceipt: true };
    const updateTrans = { ...transaction, comments: "commentsa" };
    const change = vi.fn();

    render(<TransactionForm merchants={merchants} types={types} onSave={save} onChange={change} transaction={transaction} />);
    const comments = await waitFor(() => screen.getByTestId("comments") as HTMLInputElement);
    expect(comments).toBeInTheDocument();
    await userEvent.click(comments);
    expect(change).not.toHaveBeenCalled();
    await userEvent.keyboard("a");
    expect(change).toHaveBeenCalledWith(updateTrans);
  })

  it.skip("should call save when submit button clicked", async () => {
    const merchants = [ "Wal-Mart", "Target", "Sam's Club" ];
    const types = [ "Credit Card Debit", "Bank Account Credit" ];
    
    const save = vi.fn();
    let transaction: Transaction = { id: 1, amount: 10, comments: "comments", date: new Date(2025, 0, 1), merchant: "Target", type: "Credit Card Debit", runningBalance: 0, hasReceipt: true };
    const updateTrans = { ...transaction, comments: "commentsa" };
    const change = vi.fn().mockImplementation(t => transaction = t);

    render(<TransactionForm merchants={merchants} types={types} onSave={save} onChange={change} transaction={transaction} />);
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