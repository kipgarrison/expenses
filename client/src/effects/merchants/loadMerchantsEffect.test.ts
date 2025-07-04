import { vi } from "vitest";
import axios from "axios";
import { newDebitTransaction } from "../../types/Transaction";
import { UpdateTransactionAction } from "../../actions/TransactionActions";
import { loadMerchantsEffect } from "./loadMerchantsEffect";
import { ApiError } from "../../types/apiError";
import type { Merchant } from "../../types/merchants/Merchant";
import { LoadMerchantsFailureAction, LoadMerchantsInitAction, LoadMerchantsSuccessAction } from "../../actions/merchants/MerchantActions";

const newMerchant: Merchant = { id: 0, name: "", avgAmount: 0, firstDate: new Date(), lastAmount: 0, lastDate: new Date(), totalAmount: 0, totalCount: 0, totAmountPct: 0, totCountPct: 0 };

describe("loadMerchantsEffect", () => {
  const dispatch= vi.fn();
  const merchants = [ { ...newMerchant, id: 1 }, {...newMerchant, id: 2 }, {...newMerchant, id: 3 } ];

  beforeEach(() => {
    vi.mock('axios');
    vi.mocked(axios.get).mockResolvedValue({ data: merchants})
    dispatch.mockClear();
  })

  it("should call dispatch with success action when call succeeds", async () => {
    const loadAction = new LoadMerchantsInitAction();
    await loadMerchantsEffect(loadAction, dispatch);
    const expectedAction = new LoadMerchantsSuccessAction(merchants);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it("should not do anything if the action is not a load transactions init", async () => {
    const wrongAction = new UpdateTransactionAction(newDebitTransaction);
    await loadMerchantsEffect(wrongAction, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  })

  it("should call dispatch with failure action when call fails", async () => {
    const error = new ApiError("error", "stack trace", "request id") 
    const mockAxiosResponse = { response: { data: { error } } };
    const loadAction = new LoadMerchantsInitAction();
    const expectedAction = new LoadMerchantsFailureAction(error);
    vi.mocked(axios.get).mockRejectedValue(mockAxiosResponse)
    await loadMerchantsEffect(loadAction, dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
})