import { vi } from 'vitest';
import axios from 'axios'
import { newTransaction, type Transaction } from '../../types/Transaction';
import { UpdateTransactionAction, UpdateTransactionFailureAction, UpdateTransactionInitAction, UpdateTransactionSuccessAction } from '../../actions/TransactionActions';
import { updateTransaction } from './updateTransactionEffect';

describe("deleteTransactionEffect", () => {
  const dispatch= vi.fn();
  let transaction: Transaction;

  beforeEach(() => {
    vi.mock('axios');
    transaction = {...newTransaction, id: 1 }
    vi.mocked(axios.put).mockResolvedValue({ data: transaction})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const deleteAction = new UpdateTransactionInitAction(transaction);
    await updateTransaction(deleteAction, dispatch);
    const expectedAction = new UpdateTransactionSuccessAction(transaction);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a delete action init", async () => {
    const wrongAction = new UpdateTransactionAction(newTransaction);
    await updateTransaction(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const deleteAction = new UpdateTransactionInitAction(transaction);
    const expectedAction = new UpdateTransactionFailureAction();
    vi.mocked(axios.put).mockRejectedValue({});
    await updateTransaction(deleteAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})