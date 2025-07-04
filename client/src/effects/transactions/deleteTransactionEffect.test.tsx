import { vi } from 'vitest';
import axios from 'axios'
import { DeleteTransactionInitAction, DeleteTransactionSuccessAction, UpdateTransactionAction, DeleteTransactionFailureAction } from '../../actions/TransactionActions';
import { newDebitTransaction } from '../../types/Transaction';
import { deleteTransactionEffect } from './deleteTransactionEffect';
import { ApiError } from '../../types/apiError';

describe("deleteTransactionEffect", () => {
  const dispatch= vi.fn();
  
  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.delete).mockResolvedValue({ data: {...newDebitTransaction, id: 1 }})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const deleteAction = new DeleteTransactionInitAction(newDebitTransaction);
    await deleteTransactionEffect(deleteAction, dispatch);
    const expectedAction = new DeleteTransactionSuccessAction();
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a delete action init", async () => {
    const wrongAction = new UpdateTransactionAction(newDebitTransaction);
    await deleteTransactionEffect(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const error = new ApiError("error", "stack trace", "request id") 
    const mockAxiosResponse = { response: { data: { error } } };
    const deleteAction = new DeleteTransactionInitAction(newDebitTransaction);
    const expectedAction = new DeleteTransactionFailureAction(error);
    vi.mocked(axios.delete).mockRejectedValue(mockAxiosResponse)
    await deleteTransactionEffect(deleteAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})