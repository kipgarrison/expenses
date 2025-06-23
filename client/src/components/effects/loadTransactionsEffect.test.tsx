import { vi } from "vitest";
import { newTransaction } from "../../types/Transaction";
import axios from "axios";
import { LoadTransactionsFailureAction, LoadTransactionsInitAction, LoadTransactionsSuccessAction, UpdateTransactionAction } from "../../actions/Actions";
import { loadTransactions } from "./loadTransactionsEffect";

describe("loadTransactionsEffect", () => {
  const dispatch= vi.fn();
  const transactions = [ { ...newTransaction, id: 1 }, {...newTransaction, id: 2 }, {...newTransaction, id: 3 } ];

  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.get).mockResolvedValue({ data: transactions})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const loadAction = new LoadTransactionsInitAction();
    await loadTransactions(loadAction, dispatch);
    const expectedAction = new LoadTransactionsSuccessAction(transactions);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a load transactions init", async () => {
    const wrongAction = new UpdateTransactionAction(newTransaction);
    await loadTransactions(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const loadAction = new LoadTransactionsInitAction();
    const expectedAction = new LoadTransactionsFailureAction();
    vi.mocked(axios.get).mockRejectedValue({})
    await loadTransactions(loadAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})