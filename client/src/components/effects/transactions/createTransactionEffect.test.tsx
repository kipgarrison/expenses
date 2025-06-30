import { vi } from 'vitest';
import axios from 'axios'
import { CreateTransactionFailureAction, CreateTransactionInitAction, CreateTransactionSuccessAction, UpdateTransactionAction } from '../../../actions/TransactionActions';
import { newTransaction } from '../../../types/Transaction';
import { createTransaction } from './createTransactionEffect';

describe("CreateTransactionEffect", () => {
  const dispatch= vi.fn();
  
  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.post).mockResolvedValue({ data: {...newTransaction, id: 1 }})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const createAction = new CreateTransactionInitAction(newTransaction);
    await createTransaction(createAction, dispatch);
    const expectedAction = new CreateTransactionSuccessAction({ ...newTransaction, id: 1 });
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a create action init", async () => {
    const wrongAction = new UpdateTransactionAction(newTransaction);
    await createTransaction(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const createAction = new CreateTransactionInitAction(newTransaction);
    const expectedAction = new CreateTransactionFailureAction();
    vi.mocked(axios.post).mockResolvedValue({})
    await createTransaction(createAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})