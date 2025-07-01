import type { ActionWithPayload } from '../../actions/ActionWithPayload';
import { NullAction } from '../../actions/app/AppActions';
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
  lastAction: ActionWithPayload,
  apiStatus?: "NOT_RUNNING" | "RUNNING" | "INITIAL",
  alert?: AlertType,
  sort: SortType,
  modal: ModalType,
  showFailureMessage?: boolean,
  filterRange: number
 }

 export const filterRangeValues: Record<string, number> = {
  'All Time': 0,
  'Last 7 Days': 7,
  'Last 30 Days': 30,
  'Last 90 Days': 90,
  'Last 180 Days': 180,
  'Last 365 Days': 365
 };

export const InitialMerchantState: MerchantsState = {
  merchants: [],
  pageNumber: 1,
  pageSize: 10,
  merchantPage: [],
  apiStatus: "INITIAL",
  sort: { column: "name", direction: "asc" },
  modal: 'None',
  lastAction: new NullAction(),
  filterRange: 0
};