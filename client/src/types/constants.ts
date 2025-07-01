import type { AlertType } from "./TransactionsState"

export const API_DELETE_TRANSACTION_SUCESS_ALERT: AlertType = {
  type: 'success',
  message: "Transaction was successfully deleted"
};

export const API_DELETE_TRANSACTION_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occurred while attempting to delete transaction'
};

export const API_LOAD_TRANSACTIONS_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured while attemping to load your transactions list'
};

export const API_LOAD_MERCHANTS_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured while attemping to load your merchant list'
};

export const API_CREATE_TRANSACTION_SUCCESS_ALERT: AlertType = {
  type: 'success',
  message: 'Your transaction was created successfully'
}

export const API_CREATE_TRANSACTION_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured when attempting to create your transaction'
}


export const API_UPDATE_TRANSACTION_SUCCESS_ALERT: AlertType = {
  type: 'success',
  message: 'Your transaction was updated successfully'
}

export const API_UPDATE_TRANSACTION_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured when attempting to update your transaction'
}

export const API_LOAD_BUDGET_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured when attempting to load your budget'
}

export const API_LOAD_MONTH_YEARS_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured when attempting to load your budget'
}


export const API_LOAD_BUDGET_SUMMARY_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured when attempting to load your budget'
}

export const API_LOAD_REFERENCE_LIST_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'An error occured when attempting to load reference data'
}

export const API_CRITICAL_LOAD_FAILURE_ALERT: AlertType = {
  type: 'failure',
  message: 'Unable to load critical applicaion.  Please try again later.'
}

export const BASE_API_URL = "http://localhost:3000/api/v1";  
export const DELETE_URL = `${BASE_API_URL}/transactions` 