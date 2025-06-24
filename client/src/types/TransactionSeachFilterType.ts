export type TransactionSearchFilterType = {
  fromDate?: string,
  toDate?: string,
  merchants: string[],
  fromAmount?: number,
  toAmount?: number,
  comments?: string,
  types: string[]
}

// export type MaxTransactionSearchFilter = {
//   fromDate: Date,
//   toDate: Date,
//   merchants: string[],
//   fromAmount: number,
//   toAmount: number,
//   comments: string,
//   types: string[]
// }

export const emptyFilter: TransactionSearchFilterType = {
  merchants: [],
  types: []
};

export const maxFilter: TransactionSearchFilterType = {
  fromDate: "1/1/1970",
  toDate: "12/31/2050",
  fromAmount: 0,
  toAmount: 1000000000,
  merchants: [],
  types: [],
  comments: ''
};