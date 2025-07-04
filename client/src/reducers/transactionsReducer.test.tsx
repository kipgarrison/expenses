import { ActionWithPayload } from "../actions/ActionWithPayload";
import { AddTransactionAction, ClearCurrentTransactionAction, CreateTransactionFailureAction, CreateTransactionInitAction, CreateTransactionSuccessAction, DeleteTransactionFailureAction, DeleteTransactionInitAction, DeleteTransactionSuccessAction, EditTransactionAction, HideAlertAction, LoadTransactionsFailureAction, LoadTransactionsInitAction, LoadTransactionsSuccessAction, RemoveColumnFilterAction, SetCurrentTransactionAction, SetModalAction, SetSearchFilterAction, SetSortAction, UpdatePageNumberAction, UpdateTransactionAction, UpdateTransactionFailureAction, UpdateTransactionInitAction, UpdateTransactionSuccessAction } from "../actions/TransactionActions";
import { midnightToday } from "../helpers/midnightToday";
import { midnightTomorrow } from "../helpers/midnightTomorrow";
import { ApiError } from "../types/apiError";
import { API_CREATE_TRANSACTION_FAILURE_ALERT, API_CREATE_TRANSACTION_SUCCESS_ALERT, API_DELETE_TRANSACTION_FAILURE_ALERT, API_DELETE_TRANSACTION_SUCESS_ALERT, API_UPDATE_TRANSACTION_FAILURE_ALERT, API_UPDATE_TRANSACTION_SUCCESS_ALERT } from "../types/constants";
import { defaultLastApi, lastFailureApi, lastInitApi, lastSuccessApi } from "../types/LastApiType";
import { newDebitTransaction, type Transaction } from "../types/Transaction";
import { emptyFilter, maxFilter, type TransactionSearchFilterType } from "../types/TransactionSeachFilterType";
import { transactionStateInitialValue, type TransactionsState } from "../types/TransactionsState";
import { filterTransactions, transactionsReducer } from "./transactionsReducer"

describe("TransactionsReducer", () => {
  let transactions: Array<Transaction>;
  let initialTransactionState: TransactionsState;
  const reducer = transactionsReducer;

  beforeEach(() => {  
     transactions = [ 
        { id: 1, type: "Debit", date: new Date("1/1/2020"), merchant: { id: 1, name: "Wal-Mart" }, category: { id: 1, name: "Category1" },  amount: 100, comments: "testing 123 testing", runningBalance: 100 },
        { id: 2, type: "Debit", date: new Date("2/1/2021"), merchant: { id: 2, name: "Target" },  category: { id: 2, name: "Category1" },  amount: 200, comments: "", runningBalance: 300 },
        { id: 3, type: "Debit", date: new Date("3/1/2022"), merchant: { id: 3, name: "Sears" },   category: { id: 3, name: "Category1" },  amount: 300, comments: "", runningBalance: 600 },
        { id: 4, type: "Debit", date: new Date("4/1/2023"), merchant: { id: 4, name: "Schnucks" }, category: { id: 4, name: "Category1" },  amount: 400, comments: "12356 TESTING", runningBalance: 1000 },
      ];

      transactions = transactions.map(t => ({ ...t, merchantName: t.merchant.name, categoryName: t.category.name }));

       initialTransactionState  = { ...transactionStateInitialValue, pageSize: 2, transactions };
  });

  describe("SET_PAGE_NUMBER", () => {
    it("should set the page number to the passed in value and set transactionsPage", () => {
      const action = new UpdatePageNumberAction(2);

      const newState = reducer(initialTransactionState, action);

      expect(newState.pageNumber).toBe(2);
      expect(newState.transactionPage).toEqual(transactions.slice(2, 4));
    })
  })

  describe("Add_Transaction", () => {
    it("should add the state to show the transaction for for adding", () => {
      //const newTransaction = { ...transactions[0], merchant: "Test", id: 20 }
      const action = new AddTransactionAction("Debit");

      const newState = reducer(initialTransactionState, action)
      const expectedTransaction = { ...newDebitTransaction, date: midnightToday()}
      
      expect(newState.currentTransaction).toEqual(expectedTransaction);    
      expect(newState.modal).toBe("Edit")
    })
  });

  describe("Edit_Transaction", () => {
    it("Should set the the state correctly to edit the passed in transaction", () => {
      const action = new EditTransactionAction(transactions[0]);

      const newState = reducer(initialTransactionState, action);

      expect(newState.currentTransaction).toBe(action.payload);
      expect(newState.modal).toBe("Edit");
    });
  });

  describe("UPDATE_Transaction", () => {
    it("Should set the the state correctly to update the passed in transaction", () => {
      const action = new UpdateTransactionAction(transactions[0]);

      const newState = reducer(initialTransactionState, action);

      expect(newState.currentTransaction).toBe(action.payload);
      expect(newState.modal).toBe("Edit");
    });
  });

  describe("Update_Transaction", () => {
    it("should update the current transaction in state to reflect the one passed in", () => {
      const updatedTrans = { ...transactions[0], merchant: { id: 1, name: "Test Merchant" } };

      const action = new EditTransactionAction(updatedTrans);

      const newState = reducer(initialTransactionState, action);

      expect(newState.currentTransaction).toBe(action.payload);
      expect(newState.modal).toBe("Edit");
    });
  }) 
  
  describe("CREATE_TRANSACTION_INIT", () => {
    it("Should should setup the state so the transaction can be sent to the server for saving and add the passed in transaction to the transactions list", () => {
      const transToSave = { ...transactions[0], id: 0 };
      const action = new CreateTransactionInitAction(transToSave);

      const initial: TransactionsState = { 
        ...initialTransactionState, 
        transactions,  
        currentTransaction: transToSave, 
        modal: "Edit",
        lastApi: defaultLastApi
      };
      const expected: TransactionsState = { 
        ...initial, 
        currentTransaction: newDebitTransaction, 
        transactions: [...initial.transactions ], 
        modal: "None", backupTransaction: undefined, 
        lastApi: lastInitApi(action, "Api") };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    })

    it("should throw when an existing transaction (i.e. id != 0) is passed ", () => {
      const transToSave = { ...transactions[0], id: 1 };
      const action = new CreateTransactionInitAction(transToSave);

      const initial: TransactionsState = { ...initialTransactionState, transactions,  currentTransaction: transToSave, modal: "Edit" };
      expect(() => reducer(initial, action)).toThrow();
    })
  })

  describe("CREATE_TRANSACTION_SUCCESS", () => {
    it("Should update state to show successful creation of transaction", () => {
      const transToSave = { ...transactions[0], id: 0, date: midnightTomorrow() };
      const transSaved = { ...transactions[0], id: 5,  date: midnightTomorrow(), runningBalance: 1100 };

      const action = new CreateTransactionSuccessAction(transSaved);

      const initial: TransactionsState = { ...initialTransactionState, 
        transactions: [...transactions ],
        currentTransaction: transToSave, modal: "None",
        alert: API_CREATE_TRANSACTION_SUCCESS_ALERT, 
        lastApi: lastInitApi(new ActionWithPayload(""), "Api") };
      const expected: TransactionsState = { 
        ...initial, 
        currentTransaction: newDebitTransaction, 
        transactions: [...transactions, transSaved], 
        backupTransaction: undefined, 
        lastApi: lastSuccessApi(),
        summary: { numPages: 3, totalDebitAmount: 1100, totalCreditAmount: 0, transactionsCount: 5 },
        transactionPage:  transactions.slice(0, 2)};
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    });

    it("should throw if passed a new transaction (i.e. id = 0)", () => {
      const transToSave: Transaction = { ...transactions[0], id: 0, date: midnightTomorrow() };
      const action = new CreateTransactionSuccessAction(transToSave);

      expect( () => reducer(initialTransactionState, action)).toThrow();
    });

    it("should not throw if passed an existing transaction (i.e. id != 0) 2", () => {
      const transToSave = { ...transactions[0], id: 1, date: midnightTomorrow() };
      const transSaved = { ...transactions[0], id: 5,  date: midnightTomorrow() };
      const action = new CreateTransactionSuccessAction(transSaved);

      const initial: TransactionsState = { ...initialTransactionState, 
        transactions: [...transactions, transToSave],
        currentTransaction: transToSave, modal: "None" };
      
      expect(() => reducer(initial, action)).not.toThrow();

    });
  })

  describe("CREATE_TRANSACTION_FAILURE", () => {
    it("should rollback the transaction list to remove the added tranaction and set the alert", () => {
      const transToSave = { ...transactions[0], id: 0 };
      const action = new CreateTransactionFailureAction(new ApiError("error", "stack trace", "requestId"));

      const newTrans = [...transactions, transToSave ];
      const lastApi = lastInitApi(new ActionWithPayload(""), "Api");
      const initial: TransactionsState = { ...initialTransactionState, transactions: newTrans,  currentTransaction: transToSave, lastApi };
      const expected: TransactionsState = { 
        ...initial, 
        currentTransaction: newDebitTransaction, 
        transactions: transactions, summary: { numPages: 2, totalDebitAmount: 1000, totalCreditAmount: 0, transactionsCount: 4 },
        modal: "None", backupTransaction: undefined, lastApi: lastFailureApi(lastApi, action),
        transactionPage: transactions.slice(0, 2), alert:  API_CREATE_TRANSACTION_FAILURE_ALERT };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    })
  })

  describe("UPDATE_TRANSACTION_INIT", () => {
    it("should set the state to hide the modal and show the api spinner", () => {
      const transToUpdate = { ...transactions[0] };
      const action = new UpdateTransactionInitAction(transToUpdate);

      const initial: TransactionsState = { ...initialTransactionState, transactions,  currentTransaction: transToUpdate, modal: "Edit", lastApi: defaultLastApi };
      const expected: TransactionsState = { 
        ...initial, 
        currentTransaction: newDebitTransaction, 
        transactions: [...initial.transactions ], 
        modal: "None", backupTransaction: transToUpdate, lastApi: lastInitApi(action, "Api")
      };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    });

    it("should throw when called with a new transaction (i.e. id = 0", () => {
      const transToUpdate = { ...transactions[0], id: 0 };
      const action = new UpdateTransactionInitAction(transToUpdate);

      const initial: TransactionsState = { ...initialTransactionState, transactions,  currentTransaction: transToUpdate, modal: "Edit" };
      
      expect(() => reducer(initial, action)).toThrow();
    });
  })

  describe("UPDATE_TRANSACTION_SUCCESS", () => {
    it("should setup state to hide api spinner and update saved trans in trans list", () => {
      const transToSave: Transaction = { ...transactions[0], amount: 200, runningBalance: 200 };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [ _, ...remaining ]: Transaction[] = transactions;
      const updatedRemaining = remaining.map(t => ({...t, runningBalance: t.runningBalance + 100 }))
      const newTrans: Transaction[] = [ transToSave, ...updatedRemaining ];
      const action = new UpdateTransactionSuccessAction(transToSave);

      const initial: TransactionsState = { 
        ...initialTransactionState, 
        currentTransaction: transToSave, 
        transactions: newTrans, modal: "None", 
        lastApi: lastInitApi(new ActionWithPayload(""), "Api"), 
        alert: API_UPDATE_TRANSACTION_SUCCESS_ALERT};
      const expected: TransactionsState = { 
        ...initial, 
        currentTransaction: newDebitTransaction, 
        transactions: newTrans, 
        backupTransaction: undefined, 
        lastApi: lastSuccessApi(),
        summary: { numPages: 2, totalDebitAmount: 1100, totalCreditAmount: 0, transactionsCount: 4 },
        transactionPage: newTrans.slice(0, 2)
        };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);    
    });
  })

  describe("UPDATE_TRANSACTION_FAILURE", () => {
    it("should rollback the transaction list to remove the updated tranaction and set the alert", () => {
      const transToSave = { ...transactions[0], amount: 200 };
      const action = new UpdateTransactionFailureAction(new ApiError("message", "stack trace", "request id"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...remaining] = transactions; 
      const newTrans = [ transToSave, ...remaining];
      const lastApi =  lastInitApi(new ActionWithPayload(""), "Api" );
      const initial: TransactionsState = { 
        ...initialTransactionState, 
        transactions: newTrans,  
        currentTransaction: transToSave,
        lastApi,
        backupTransaction: transactions[0] 
      };
      const expected: TransactionsState = { 
        ...initial, 
        currentTransaction: newDebitTransaction, 
        transactions: transactions, 
        summary: { numPages: 2, totalDebitAmount: 1000, totalCreditAmount: 0,  transactionsCount: 4 },
        modal: "None", backupTransaction: undefined, 
        lastApi: lastFailureApi(lastApi, action),
        alert:  API_UPDATE_TRANSACTION_FAILURE_ALERT,
        transactionPage: transactions.slice(0, 2) };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    })
  });

  describe("DELETE_TRANSACTION_INIT", () => {
    it("should set the state to hide the modal and show the api spinner", () => {
      const transToUpdate = { ...transactions[0] };
      const action = new DeleteTransactionInitAction(transToUpdate);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...remaining] = transactions;
      const updatedRemaining = remaining.map(t => ({ ...t, runningBalance: t.runningBalance - transToUpdate.amount }));
      const initial: TransactionsState = { 
        ...initialTransactionState, 
        transactions, 
        currentTransaction: transToUpdate, 
        modal: "None",
        lastApi: defaultLastApi
      };
      const expected: TransactionsState = { 
        ...initial, 
        transactions: updatedRemaining, 
        modal: "None", backupTransaction: transToUpdate, 
        lastApi: lastInitApi(action, "Api"), 
        summary: { numPages: 2, totalDebitAmount: 900, totalCreditAmount: 0, transactionsCount: 3}, 
        transactionPage: updatedRemaining.slice(0, 2) };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    });

    it("should throw when called with a new transaction (i.e. id = 0", () => {
      const transToUpdate = { ...transactions[0], id: 0 };
      const action = new UpdateTransactionInitAction(transToUpdate);

      const initial: TransactionsState = { ...initialTransactionState, transactions,  currentTransaction: transToUpdate, modal: "Edit" };
      
      expect(() => reducer(initial, action)).toThrow();
    });
  })

  describe("DELETE_TRANSACTION_SUCCESS", () => {
    it("should setup state to hide api spinner and set the correct alert", () => {
      const [ removed, ...remaining ]: Transaction[] = transactions;
      const updatedRemaining = remaining.map(t => ({ ...t, runningBalance: t.runningBalance - removed.amount }))
      const action = new DeleteTransactionSuccessAction();
      
      const initial: TransactionsState = { 
        ...initialTransactionState, 
        transactions: remaining, 
        lastApi: lastInitApi(new ActionWithPayload(""), "Api"),
        modal: "None",
        summary: { numPages: 2, totalDebitAmount: 900, totalCreditAmount: 0, transactionsCount: 3 },  
        transactionPage: remaining.slice(0, 2)
      };
      const expected: TransactionsState = { 
        ...initial, 
        transactions: updatedRemaining, 
        summary: { numPages: 2, totalDebitAmount: 900, totalCreditAmount: 0,  transactionsCount: 3 },
        lastApi: lastSuccessApi(),
        alert:   API_DELETE_TRANSACTION_SUCESS_ALERT,
        transactionPage: updatedRemaining.slice(0, 2),
        backupTransaction: undefined
      };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);    
    });
  })

  describe("DELETE_TRANSACTION_FAILURE", () => {
    it("should rollback the transaction list to readd the removed tranaction and set the alert", () => {
      const action = new DeleteTransactionFailureAction(new ApiError("Error", "Stack Trace", "Request Id"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...remaining] = transactions; 
      const lastApi = lastInitApi(new ActionWithPayload(""), "Api");
       const initial: TransactionsState = { 
        ...initialTransactionState, 
        lastApi,
        transactions: remaining,  
        backupTransaction: transactions[0],
        transactionPage: transactions.slice(0, 2)
      };
      const expected: TransactionsState = { 
        ...initial, 
        transactions: [transactions[0], ...remaining, ], 
        summary: { numPages: 2, totalDebitAmount: 1000, totalCreditAmount: 0, transactionsCount: 4 },
        modal: "None", backupTransaction: undefined, 
        lastApi: lastFailureApi(lastApi, action),
        alert:  API_DELETE_TRANSACTION_FAILURE_ALERT,
        transactionPage: transactions.slice(0, 2),
      };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    })
  });

  describe("SET_CURRENT_TRANSACTION", () => {
    it("should set the current transaction in state to the transaction passed in", () => {
      const trans = transactions[0];
      const action = new SetCurrentTransactionAction(trans);

      const initial = initialTransactionState;
      const expected = { ...initialTransactionState, lastApi: defaultLastApi, currentTransaction: trans };

      const actual = reducer(initial, action);

      expect(actual).toEqual(expected);
    })
  });

  describe("CLEAR_CURRENT_TRANSACTION", () => {
    it("should set the current transaction in state to undefined", () => {
      const action = new ClearCurrentTransactionAction();

      const initial: TransactionsState = { ...initialTransactionState, currentTransaction: transactions[0] };
      const expected = { ...initialTransactionState,  lastApi: defaultLastApi, currentTransaction: undefined };

      const actual = reducer(initial, action);

      expect(actual).toEqual(expected);
    })
  });

  describe("SET_SORT", () => {
    it("should set the sort property in state and update the page to reflect the sort", () => {
      const action = new SetSortAction("merchantName");
      const initial: TransactionsState = { ...initialTransactionState, transactionPage: transactions.slice(0,2) };
      const expected: TransactionsState = { 
        ...initial, 
        transactionPage: [ transactions[3], transactions[2] ], 
        sort: { column: "merchantName", direction: "asc"},
        summary: { numPages: 2, totalDebitAmount: 1000, totalCreditAmount: 0, transactionsCount: 4 },
        lastApi: defaultLastApi  }
      
      const actual =  reducer(initial, action);

      expect(actual).toEqual(expected);
    });

    it.skip("if called twice in a row with same column should set the direction to desc", () => {
      const action = new SetSortAction("merchant");
      const initial: TransactionsState = { ...initialTransactionState, transactionPage: transactions.slice(0,2) };
      const expected: TransactionsState = { 
        ...initial, 
        transactionPage: transactions.slice(0, 2),
        sort: { column: "merchant", direction: "desc"},
        summary: { numPages: 2, totalDebitAmount: 1000, totalCreditAmount: 0, transactionsCount: 4 },
        lastApi: defaultLastApi  }
      
      const first =  reducer(initial, action);
      const actual = reducer(first, action);
      expect(actual).toEqual(expected);
    });
  });


  describe("SET_MODAL", () => {
      it("should set the modal property in state to reflect the value passed in", () => {
        const action = new SetModalAction("Search");
        const expected: TransactionsState = { ...initialTransactionState, modal: "Search", lastApi: defaultLastApi };
        const actual = reducer(initialTransactionState, action);

        expect(actual).toEqual(expected);
      });
  });

  describe("SET_SEARCH_FILTER", () => {
    it("should set the page to just those transactions in the range if searching by date range", () => {
      const filter: TransactionSearchFilterType = { 
        fromDate: "1/1/2020",
        toDate: "1/1/2021",
        merchants: [],
        categories: []
      };
      const action = new SetSearchFilterAction(filter);
    
      const expected: TransactionsState = { 
        ...initialTransactionState, 
        lastApi: defaultLastApi, 
        transactionPage: [ transactions[0] ],  
        filter, 
        summary: { numPages: 1, totalDebitAmount: 100, totalCreditAmount: 0,  transactionsCount: 1 }
      };
      
      const actual = reducer(initialTransactionState, action);

      expect(actual).toEqual(expected);
    });

    it("should set the page to just those transactions in the range if searching by amount range", () => {
      const filter: TransactionSearchFilterType = { 
          fromAmount: 400,
          toAmount: 500,
          merchants: [],
          categories: []
      };
      const action = new SetSearchFilterAction(filter);
      
      const expected: TransactionsState = { 
        ...initialTransactionState, 
        lastApi: defaultLastApi, 
        transactionPage: [ transactions[3] ],  
        filter, 
        summary: { numPages: 1, totalDebitAmount: 400, totalCreditAmount: 0, transactionsCount: 1 }
      };
      
      const actual = reducer(initialTransactionState, action);

      expect(actual).toEqual(expected);
    })

    it("should set the page to just those transactions in that contain the passed in text CI when searching by comment", () => {
      const filter: TransactionSearchFilterType = { 
          comments: "testing",
          merchants: [],
          categories: []
      };
      const action = new SetSearchFilterAction(filter);
      
      const expected: TransactionsState = { 
        ...initialTransactionState, 
        lastApi: defaultLastApi,
        transactionPage: [ transactions[0], transactions[3] ],  
        filter, 
        summary: { numPages: 1, totalDebitAmount: 500, totalCreditAmount: 0, transactionsCount: 2 }
      };
      
      
      const actual = reducer(initialTransactionState, action);

      expect(actual).toEqual(expected);
    })

    it("should set the page to just those transactions that are in the merchants specifed in the action", () => {
      const filter: TransactionSearchFilterType = { 
          merchants: [{ id: 2, name: "Target" }, { id: 3, name: "Sears" }],
          categories: []
      };
      const action = new SetSearchFilterAction(filter);
      
      const expected: TransactionsState = { 
        ...initialTransactionState, 
        lastApi: defaultLastApi,
        transactionPage: [ transactions[1], transactions[2] ],  
        filter, 
        summary: { numPages: 1, totalDebitAmount: 500, totalCreditAmount: 0, transactionsCount: 2 }
      };
      
      const actual = reducer(initialTransactionState, action);

      expect(actual).toEqual(expected);
    })

    it("should set the page to just those transactions that are in the categories specifed in the action", () => {
      const filter: TransactionSearchFilterType = { 
          merchants: [],
          categories: [{ id: 1, name: "Cat #1" }, { id: 2, name: "Cat #2" } ]
      };
      const action = new SetSearchFilterAction(filter);
      
      const expected: TransactionsState = { 
        ...initialTransactionState, 
        lastApi: defaultLastApi,
        transactionPage: [ transactions[0], transactions[1] ],  
        filter, 
        summary: { numPages: 1, totalDebitAmount: 300, totalCreditAmount: 0,  transactionsCount: 2 }
      };
      
      const actual = reducer(initialTransactionState, action);

      expect(actual).toEqual(expected);
    })
  });

  describe("LOAD_TRANSACTION_INIT", () => {
    it("should set the state to show the initial load message", () => {
      const action = new LoadTransactionsInitAction();

      const initial: TransactionsState = { ...initialTransactionState };
      const expected: TransactionsState = { 
        ...initial, 
        lastApi: lastInitApi(action, "App")
      };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    });
  });
  
  describe("LOAD_TRANSACTION_SUCCESS", () => {
    it("should set the state to hide the intial load message and set the transactions and page", () => {
      const transactions = [ 
        { ...newDebitTransaction, id: 1, date: new Date("1/1/2020"), amount: 100, runningBalance: 100 }, 
        { ...newDebitTransaction, id: 2, date: new Date("1/1/2021"), amount: 200, runningBalance: 300 }, 
        { ...newDebitTransaction, id: 3, date: new Date("1/1/2022"), amount: 300, runningBalance: 600 }
      ];

      const action = new LoadTransactionsSuccessAction(transactions);

      const initial: TransactionsState = { ...initialTransactionState };
      const expected: TransactionsState = { 
        ...initial, 
        lastApi: defaultLastApi,
        transactions: transactions,
        transactionPage: transactions.slice(0, 2),
        summary: { numPages: 2, transactionsCount: 3, totalDebitAmount: 600, totalCreditAmount: 0 }
      };
      
      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    });
  })

  describe("LOAD_TRANSACTIONS_FAILURE", () => {
    it("should set the alert to notify user of failure", () => {
      const action = new LoadTransactionsFailureAction(new ApiError("Error", "Stack trace", "request id"));

      const lastApi = lastInitApi(new ActionWithPayload(""), "App")
      const initial: TransactionsState = { ...initialTransactionState, transactions: [], lastApi };
      const expected: TransactionsState = { 
        ...initial, 
        lastApi: lastFailureApi(lastApi, action)
      }

      const newState = reducer(initial, action);

      expect(newState).toEqual(expected);
    })
  });

  describe("HIDE_ALERT", () => {
    it("should clear the alert field in state", () => {
      const action = new HideAlertAction();
      const initState = { ...initialTransactionState, alert: API_CREATE_TRANSACTION_FAILURE_ALERT };

      const expectedState = { ...initState, alert: undefined, lastApi: defaultLastApi };
      const actualState = transactionsReducer(initState, action);

      expect(actualState).toEqual(expectedState);
    })
  });

  describe("REMOVE_COLUMN_FILTER", () => {
    it("should update the filter in state to remove the passed in column", () => {
      const action = new RemoveColumnFilterAction([ "fromDate", "toDate"]);
      const initState: TransactionsState = {...initialTransactionState, filter: { ...maxFilter } };
  
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fromDate, toDate, ...filter } = maxFilter; 
      const newState = { ...initState, filter };
      const transactionsPage = filterTransactions(newState);
      
      const expectedState = {...initialTransactionState, filter, ...transactionsPage  };
      const actualState = transactionsReducer(initState, action);
      expect(actualState).toEqual(expectedState);
    });

    it("should update the filter in state to remove all columns if empty list passed", () => {
      const action = new RemoveColumnFilterAction([]);
      const initState: TransactionsState = {...initialTransactionState, filter: { ...maxFilter } };
  
      const newState = { ...initState, filter: emptyFilter };
      const transactionsPage = filterTransactions(newState);
      
      const expectedState = {...initialTransactionState, filter: emptyFilter, ...transactionsPage  };
      const actualState = transactionsReducer(initState, action);
      expect(actualState).toEqual(expectedState);
    });
  });
});
