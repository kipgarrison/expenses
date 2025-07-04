import type { Transaction } from "../types/Transaction";
import type { TransactionSearchFilterType } from "../types/TransactionSeachFilterType"
import type { CreditCardTransactionType, ModalType } from "../types/unionTypes";
import { TransactionActionTypes } from "./TransactionActionTypes";
import { ActionWithPayload } from "./ActionWithPayload";
import type { ApiError } from "../types/apiError";
export class UpdatePageNumberAction extends ActionWithPayload {
  constructor(payload: number) {
    super(TransactionActionTypes.SET_PAGE_NUMBER, payload);
  }
} 

export class AddTransactionAction extends ActionWithPayload {
  constructor(payload: CreditCardTransactionType) {
    super(TransactionActionTypes.ADD_TRANSACTION, payload);
  }
} 

export class UpdateTransactionAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.UPDATE_TRANSACTION, payload);
  }
}

export class CreateTransactionInitAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.CREATE_TRANSACTION_INIT, payload);
  }
}

export class CreateTransactionSuccessAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.CREATE_TRANSACTION_SUCCESS, payload);
  }
}

export class CreateTransactionFailureAction extends ActionWithPayload {
  constructor(payload: ApiError) {
    super(TransactionActionTypes.CREATE_TRANSACTION_FAILURE, payload);
  }
}

export class UpdateTransactionInitAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.UPDATE_TRANSACTION_INIT, payload);
  }
}

export class UpdateTransactionSuccessAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.UPDATE_TRANSACTION_SUCCESS, payload);
  }
}

export class UpdateTransactionFailureAction extends ActionWithPayload {
  constructor(payload: ApiError) {
    super(TransactionActionTypes.UPDATE_TRANSACTION_FAILURE, payload);
  }
}

export class DeleteTransactionInitAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.DELETE_TRANSACTION_INIT, payload);
  }
}

export class DeleteTransactionSuccessAction extends ActionWithPayload {
  constructor() {
    super(TransactionActionTypes.DELETE_TRANSACTION_SUCCESS);
  }
}

export class DeleteTransactionFailureAction extends ActionWithPayload {
  constructor(payload: ApiError) {
    super(TransactionActionTypes.DELETE_TRANSACTION_FAILURE, payload);
  }
}

export class SetCurrentTransactionAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.SET_CURRENT_TRANSACTION, payload);
  }
}

export class ClearCurrentTransactionAction extends ActionWithPayload {
  constructor() {
    super(TransactionActionTypes.CLEAR_CURRENT_TRANSACTION);
  }
}
export class EditTransactionAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(TransactionActionTypes.EDIT_TRANSACTION, payload);
  }
}

export class SetSortAction extends ActionWithPayload {
  constructor(payload: string) {
    super(TransactionActionTypes.SET_SORT, payload);
  }
}

export class SetModalAction extends ActionWithPayload {
  constructor(payload: ModalType) {
    super(TransactionActionTypes.SET_MODAL, payload);
  }
}

export class SetSearchFilterAction extends ActionWithPayload {
  constructor(payload: TransactionSearchFilterType) {
    super(TransactionActionTypes.SET_SEARCH_FILTER, payload);
  }
}

export class LoadTransactionsInitAction extends ActionWithPayload {
  constructor() {
    super(TransactionActionTypes.LOAD_TRANSACTIONS_INIT);
  }
}

export class LoadTransactionsSuccessAction extends ActionWithPayload {
  constructor(payload: Transaction[]) {
    super(TransactionActionTypes.LOAD_TRANSACTIONS_SUCCESS, payload);
  }
}

export class LoadTransactionsFailureAction extends ActionWithPayload {
  constructor(payload: ApiError) {
    super(TransactionActionTypes.LOAD_TRANSACTIONS_FAILURE, payload);
  }
}

export class RemoveColumnFilterAction extends ActionWithPayload {
  constructor(payload: string[]) {
    super(TransactionActionTypes.REMOVE_COLUMN_FILTER, payload);
  }
}

export class HideAlertAction extends ActionWithPayload {
  constructor() {
    super(TransactionActionTypes.HIDE_ALERT);
  }
}
