import type { Transaction } from "../types/Transaction";
import type { TransactionSearchFilter } from "../types/TransactionSeachFilter";
import type { AlertType } from "../types/TransactionsState";
import type { ModalType } from "../types/unionTypes";
import { ActionTypes } from "./Action_Types";
import { ActionWithPayload } from "./ActionWithPayload";

// export class SetTransactionsAction extends ActionWithPayload {
//   constructor(payload: Transaction[]) {
//     super(ActionTypes.SET_TRANSACTIONS, payload);
//   }
// }

export class UpdatePageNumberAction extends ActionWithPayload {
  constructor(payload: number) {
    super(ActionTypes.SET_PAGE_NUMBER, payload);
  }
} 

export class AddTransactionAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.ADD_TRANSACTION, "ADD_TRANSACTION");
  }
} 

export class UpdateTransactionAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.UPDATE_TRANSACTION, payload);
  }
}

export class CreateTransactionInitAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.CREATE_TRANSACTION_INIT, payload);
  }
}

export class CreateTransactionSuccessAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.CREATE_TRANSACTION_SUCCESS, payload);
  }
}

export class CreateTransactionFailureAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.CREATE_TRANSACTION_FAILURE);
  }
}

export class UpdateTransactionInitAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.UPDATE_TRANSACTION_INIT, payload);
  }
}

export class UpdateTransactionSuccessAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.UPDATE_TRANSACTION_SUCCESS, payload);
  }
}

export class UpdateTransactionFailureAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.UPDATE_TRANSACTION_FAILURE);
  }
}

export class DeleteTransactionInitAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.DELETE_TRANSACTION_INIT, payload);
  }
}

export class DeleteTransactionSuccessAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.DELETE_TRANSACTION_SUCCESS);
  }
}

export class DeleteTransactionFailureAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.DELETE_TRANSACTION_FAILURE);
  }
}

export class SetCurrentTransactionAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.SET_CURRENT_TRANSACTION, payload);
  }
}

export class ClearCurrentTransactionAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.CLEAR_CURRENT_TRANSACTION);
  }
}

export class RollbackAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.ROLLBACK);
  }
}

export class EditTransactionAction extends ActionWithPayload {
  constructor(payload: Transaction) {
    super(ActionTypes.EDIT_TRANSACTION, payload);
  }
}

export class HideAlertAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.HIDE_ALERT);
  }
}

export class ShowAlertAction extends ActionWithPayload {
  constructor(alert: AlertType) {
    super(ActionTypes.SHOW_ALERT, alert);
  }
}

export class SetSortAction extends ActionWithPayload {
  constructor(payload: string) {
    super(ActionTypes.SET_SORT, payload);
  }
}

export class SetModalAction extends ActionWithPayload {
  constructor(payload: ModalType) {
    super(ActionTypes.SET_MODAL, payload);
  }
}

export class SetSearchFilterAction extends ActionWithPayload {
  constructor(payload: TransactionSearchFilter) {
    super(ActionTypes.SET_SEARCH_FILTER, payload);
  }
}

export class LoadTransactionsInitAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.LOAD_TRANSACTIONS_INIT);
  }
}

export class LoadTransactionsSuccessAction extends ActionWithPayload {
  constructor(payload: Transaction[]) {
    super(ActionTypes.LOAD_TRANSACTIONS_SUCCESS, payload);
  }
}

export class LoadTransactionsFailureAction extends ActionWithPayload {
  constructor() {
    super(ActionTypes.LOAD_TRANSACTIONS_FAILURE);
  }
}