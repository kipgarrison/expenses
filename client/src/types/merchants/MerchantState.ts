import type { ActionWithPayload } from '../../actions/ActionWithPayload';
import type { AlertType, SortType } from '../TransactionsState';
import type { ModalType } from '../unionTypes';
import type { Merchant } from './Merchant';

export type MerchantsState = {
  merchants: Merchant[],
  pageNumber: number,
  pageSize: number,
  currentMerchant?: Merchant,
  backupMerchant?: Merchant,
  merchantPage: Merchant[],
  lastAction?: ActionWithPayload,
  apiStatus?: "NOT_RUNNING" | "RUNNING" | "INITIAL",
  alert?: AlertType,
  sort: SortType,
  modal: ModalType,
}

export const InitialMerchantState: MerchantsState = {
  merchants: [],
  pageNumber: 1,
  pageSize: 10,
  merchantPage: [],
  apiStatus: "INITIAL",
  sort: { column: "name", direction: "asc" },
  modal: 'None'
};