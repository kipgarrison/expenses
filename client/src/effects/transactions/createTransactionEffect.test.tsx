import { vi } from 'vitest';
import axios from 'axios'
import { CreateTransactionFailureAction, CreateTransactionInitAction, CreateTransactionSuccessAction, UpdateTransactionAction } from '../../actions/TransactionActions';
import { newDebitTransaction } from '../../types/Transaction';
import { createTransactionEffect } from './createTransactionEffect';
import { ApiError } from '../../types/apiError';

describe("CreateTransactionEffect", () => {
  const dispatch= vi.fn();
  
  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.post).mockResolvedValue({ data: {...newDebitTransaction, id: 1 }})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const createAction = new CreateTransactionInitAction(newDebitTransaction);
    await createTransactionEffect(createAction, dispatch);
    const expectedAction = new CreateTransactionSuccessAction({ ...newDebitTransaction, id: 1 });
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a create action init", async () => {
    const wrongAction = new UpdateTransactionAction(newDebitTransaction);
    await createTransactionEffect(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const createAction = new CreateTransactionInitAction(newDebitTransaction);
    // TODO: Fix this
    const error = new ApiError("error", "stack trace", "request id") 
    const mockAxiosResponse = { response: { data: { error } } };
    const expectedAction = new CreateTransactionFailureAction(error);
    vi.mocked(axios.post).mockRejectedValue(mockAxiosResponse);
    await createTransactionEffect(createAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})