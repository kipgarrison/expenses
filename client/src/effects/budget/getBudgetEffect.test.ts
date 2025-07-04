import { vi } from "vitest";
import axios from "axios";
import { newDebitTransaction } from "../../types/Transaction";
import { UpdateTransactionAction } from "../../actions/TransactionActions";
import { ApiError } from "../../types/apiError";
import { EmptyBudget } from "../../types/budget/Budget";
import { LoadBudgetFailureAction, LoadBudgetInitAction, LoadBudgetSuccessAction } from "../../actions/budget/BudgetActions";
import { getBudgetEffect } from "./getBudgetEffect";

describe("loadBudgetEffect", () => {
  const dispatch= vi.fn();
  const budget = EmptyBudget;

  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.get).mockResolvedValue({ data: budget})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const loadAction = new LoadBudgetInitAction();
    await getBudgetEffect(loadAction, dispatch);
    const expectedAction = new LoadBudgetSuccessAction(budget);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a load transactions init", async () => {
    const wrongAction = new UpdateTransactionAction(newDebitTransaction);
    await getBudgetEffect(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const error = new ApiError("error", "stack trace", "request id") 
    const mockAxiosResponse = { response: { data: { error } } };
    const loadAction = new LoadBudgetInitAction();
    const expectedAction = new LoadBudgetFailureAction(error);
    vi.mocked(axios.get).mockRejectedValue(mockAxiosResponse)
    await getBudgetEffect(loadAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})