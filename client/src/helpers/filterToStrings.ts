import type { TransactionSearchFilterType } from "../types/TransactionSeachFilterType";
import { formatCurrency } from "./currencyFormatter";
import { elipsis } from "./elipsis";

export type FilterMessage = { columns: string[], message: string };
export function filterToStrings(filter: TransactionSearchFilterType): FilterMessage[] {
  const { fromDate, toDate, fromAmount, toAmount, comments, merchants, types } = filter;
  let messages: FilterMessage[] = [];

  if (fromDate && toDate) messages = [{ columns: ['fromDate', 'toDate'], message: `Date between ${fromDate} and ${toDate}` }];
  else if (fromDate) messages = [{ columns: ['fromDate' ], message: `Date after ${fromDate}`}];
  else if (toDate) messages = [{ columns: ['toDate'], message: `Date before ${toDate}` }];

  if (fromAmount && toAmount) messages = [ ...messages, { columns: ['fromAmount', 'toAmount'], message: `Amount between ${formatCurrency(fromAmount)} and ${formatCurrency(toAmount)}` }];
  else if (fromAmount) messages = [ ...messages, { columns: ['fromAmount' ], message: `Amount above ${formatCurrency(fromAmount)}` } ];
  else if (toAmount) messages = [ ...messages, { columns: ['toAmount'], message: `Amount below ${formatCurrency(toAmount)}`}];

  if (comments) messages = [ ...messages, { columns: ['comments'], message: `Comments contains ${elipsis(comments, 10)}` }];

  const limitedMerchants = merchants.length <=2 ? merchants : [ ...merchants.slice(0, 2), "..." ];
  if (merchants && merchants.length) messages = [ ...messages, { columns: ['merchants'],  message: `Merchants are ${limitedMerchants.join(", ")}` }];
  const limitedTypes = types.length <= 2 ? types : [ ...types.slice(0, 2), "..." ];
  if (types && types.length) messages = [ ...messages, { columns: ['types'], message: `Types are ${limitedTypes.join(", ")}` }];

  return messages;  
}

  
  