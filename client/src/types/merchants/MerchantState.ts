import { NullAction } from '../../actions/app/AppActions';
import { defaultLastApi, type LastApiType } from '../LastApiType';
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
  alert?: AlertType,
  sort: SortType,
  modal: ModalType,
  filterRange: number,
  lastApi: LastApiType
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
  sort: { column: "name", direction: "asc" },
  modal: 'None',
  lastApi: defaultLastApi,
  filterRange: 0
};