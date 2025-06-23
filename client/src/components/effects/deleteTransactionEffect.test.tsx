import { vi } from 'vitest';
import axios from 'axios'
import { DeleteTransactionFailureAction, DeleteTransactionInitAction, DeleteTransactionSuccessAction, UpdateTransactionAction } from '../../actions/Actions';
import { newTransaction } from '../../types/Transaction';
import { deleteTransaction } from './deleteTransactionEffect';

describe.only("deleteTransactionEffect", () => {
  const dispatch= vi.fn();
  
  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.delete).mockResolvedValue({ data: {...newTransaction, id: 1 }})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const deleteAction = new DeleteTransactionInitAction(newTransaction);
    await deleteTransaction(deleteAction, dispatch);
    const expectedAction = new DeleteTransactionSuccessAction();
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a delete action init", async () => {
    const wrongAction = new UpdateTransactionAction(newTransaction);
    await deleteTransaction(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const deleteAction = new DeleteTransactionInitAction(newTransaction);
    const expectedAction = new DeleteTransactionFailureAction();
    vi.mocked(axios.delete).mockRejectedValue({})
    await deleteTransaction(deleteAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})