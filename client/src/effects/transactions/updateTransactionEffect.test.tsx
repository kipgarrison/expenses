import { vi } from 'vitest';
import axios from 'axios'
import { UpdateTransactionAction, UpdateTransactionFailureAction, UpdateTransactionInitAction, UpdateTransactionSuccessAction } from '../../actions/TransactionActions';
import { newDebitTransaction, type Transaction } from '../../types/Transaction';
import { updateTransactionEffect } from './updateTransactionEffect';
import { ApiError } from '../../types/apiError';

describe("deleteTransactionEffect", () => {
  const dispatch= vi.fn();
  let transaction: Transaction;

  beforeEach(() => {
    vi.mock('axios');
    transaction = {...newDebitTransaction, id: 1 }
    vi.mocked(axios.put).mockResolvedValue({ data: transaction})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const deleteAction = new UpdateTransactionInitAction(transaction);
    await updateTransactionEffect(deleteAction, dispatch);
    const expectedAction = new UpdateTransactionSuccessAction(transaction);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a delete action init", async () => {
    const wrongAction = new UpdateTransactionAction(newDebitTransaction);
    await updateTransactionEffect(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const error = new ApiError("error", "stack trace", "request id") 
    const mockAxiosResponse = { response: { data: { error } } };
    const deleteAction = new UpdateTransactionInitAction(transaction);
    const expectedAction = new UpdateTransactionFailureAction(error);
    vi.mocked(axios.put).mockRejectedValue(mockAxiosResponse);
    await updateTransactionEffect(deleteAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})