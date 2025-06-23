export type TransactionSearchFilter = {
  fromDate?: Date,
  toDate?: Date,
  merchants: string[],
  fromAmount?: number,
  toAmount?: number,
  comments?: string,
  types: string[]
}

export type MaxTransactionSearchFilter = {
  fromDate: Date,
  toDate: Date,
  merchants: string[],
  fromAmount: number,
  toAmount: number,
  comments: string,
  types: string[]
}

export const maxFilter: MaxTransactionSearchFilter = {
  fromDate: new Date("1/1/1970"),
  toDate: new Date("12/31/2050"),
  fromAmount: 0,
  toAmount: 1000000000,
  merchants: [],
  types: [],
  comments: ''
}
