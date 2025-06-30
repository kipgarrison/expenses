import type { ReferenceData } from "./app/ReferenceData";

export type TransactionSearchFilterType = {
  fromDate?: string,
  toDate?: string,
  merchants: ReferenceData[],
  fromAmount?: number,
  toAmount?: number,
  comments?: string,
  categories: ReferenceData[]
}

export const emptyFilter: TransactionSearchFilterType = {
  merchants: [],
  categories: []
};

export const maxFilter: TransactionSearchFilterType = {
  fromDate: "1/1/1970",
  toDate: "12/31/2050",
  fromAmount: 0,
  toAmount: 1000000000,
  merchants: [],
  categories: [],
  comments: ''
};