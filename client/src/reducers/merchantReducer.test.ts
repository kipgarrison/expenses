import { ActionWithPayload } from "../actions/ActionWithPayload";
import { LoadMerchantsFailureAction, LoadMerchantsInitAction, LoadMerchantsSuccessAction, SortMerchants as SortMerchantsAction } from "../actions/merchants/MerchantActions"
import { sortObjectsArray } from "../helpers/sortObjectsArray";
import { defaultLastApi, lastFailureApi, lastInitApi, lastSuccessApi } from "../types/LastApiType";
import type { Merchant } from "../types/merchants/Merchant";
import { InitialMerchantState, type MerchantsState } from "../types/merchants/MerchantState";
import type { SortType } from "../types/TransactionsState";
import { merchantsReducer } from "./merchantReducer";

describe("merchantReucer", () => {
  describe("LOAD_MERCHANTS_INIT", () => {
    it("should update state to set the api status to running and capture last action", () => {
      const action = new LoadMerchantsInitAction();
      const initialState = InitialMerchantState;

      const expected: MerchantsState = { ...initialState, lastApi: lastInitApi(action, "App") };
      const actual = merchantsReducer(initialState, action);

      expect(actual).toEqual(expected);
    })
  });
  
  describe("LOAD_MERCHANTS_SUCCESS", () => {
    it("should update state to set the api status to not running, set sorted merchant list and capture last action", () => {
      const merchants: Merchant[] = [ 
        { id: 1, name: 'Wal-Mart', avgAmount: 10, firstDate: new Date('1/1/2025'), lastDate: new Date('1/2/20025'), lastAmount: 100, totalAmount: 1000, totalCount: 10, totAmountPct: 12.5, totCountPct: 1.1 },
        { id: 2, name: 'Target', avgAmount: 11, firstDate: new Date('2/1/2025'), lastDate: new Date('2/2/20025'), lastAmount: 101, totalAmount: 1001, totalCount: 11, totAmountPct: 13.5, totCountPct: 2.1 },
        { id: 2, name: 'Schnucks', avgAmount: 12, firstDate: new Date('3/1/2025'), lastDate: new Date('3/2/20025'), lastAmount: 102, totalAmount: 1002, totalCount: 21, totAmountPct: 23.5, totCountPct: 4.1 }
      ];
      const action = new LoadMerchantsSuccessAction(merchants);

      const sort: SortType = { column: "name", direction: "asc" };
      const initialState: MerchantsState = { ...InitialMerchantState, lastApi: lastInitApi(new ActionWithPayload(""), "App") };
       
      const expectedState: MerchantsState = { 
        ...initialState, lastApi: lastSuccessApi(),
        merchants: sortObjectsArray(merchants, sort) as Merchant[], 
      };

      const actualState = merchantsReducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe("LOAD_MERCHANTS_FAILURE", () => {
    it("should update state to set the api status to not running, capture last action and set correct alert", () => {
      const action = new LoadMerchantsFailureAction();
      const lastApi = lastInitApi(new ActionWithPayload(""), "App");
      const initialState: MerchantsState = { ...InitialMerchantState, lastApi };
      const expectedState: MerchantsState = { ...initialState, lastApi: lastFailureApi(lastApi, action) };
      const actualState = merchantsReducer(initialState, action);
      expect(actualState).toEqual(expectedState);
    })
  });

  describe("SORT_MERCHANTS", () => {
    it("Should sort the merchant list according to new sort column", () => {
      const merchants: Merchant[] = [ 
        { id: 1, name: 'Wal-Mart', avgAmount: 10, firstDate: new Date('1/1/2025'), lastDate: new Date('1/2/20025'), lastAmount: 100, totalAmount: 1000, totalCount: 10, totAmountPct: 12.5, totCountPct: 1.1 },
        { id: 2, name: 'Target', avgAmount: 11, firstDate: new Date('2/1/2025'), lastDate: new Date('2/2/20025'), lastAmount: 101, totalAmount: 1001, totalCount: 11, totAmountPct: 13.5, totCountPct: 2.1 },
        { id: 2, name: 'Schnucks', avgAmount: 12, firstDate: new Date('3/1/2025'), lastDate: new Date('3/2/20025'), lastAmount: 102, totalAmount: 1002, totalCount: 21, totAmountPct: 23.5, totCountPct: 4.1 }
      ];
      const sort: SortType = { column: "name", direction: "desc" };
      const initialState: MerchantsState = { ...InitialMerchantState, merchants, sort, lastApi: defaultLastApi };
      const action = new SortMerchantsAction("name");
      const newSort: SortType = { column: "name", direction: "asc" };
      const expectedState: MerchantsState = { 
        ...initialState, 
        merchants: sortObjectsArray(merchants, newSort) as Merchant[], 
        lastApi: lastSuccessApi(), sort: newSort 
      };
      const actualState = merchantsReducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  })
});