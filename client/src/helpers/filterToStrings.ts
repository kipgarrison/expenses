import type { TransactionSearchFilterType } from "../types/TransactionSeachFilterType";
import { formatCurrency } from "./currencyFormatter";
import { elipsis } from "./elipsis";
import { formatDateFromISOString } from "./formatDate";


export type FilterMessage = { columns: string[], message: string };
export function filterToStrings(filter: TransactionSearchFilterType): FilterMessage[] {
  const { fromDate, toDate, fromAmount, toAmount, comments, merchants, categories } = filter;
  let messages: FilterMessage[] = [];
  const fd = formatDateFromISOString;

  if (fromDate && toDate) messages = [{ columns: ['fromDate', 'toDate'], message: `Date between ${fd(fromDate)} and ${fd(toDate)}` }];
  else if (fromDate) messages = [{ columns: ['fromDate' ], message: `Date after ${fd(fromDate)}`}];
  else if (toDate) messages = [{ columns: ['toDate'], message: `Date before ${fd(toDate)}` }];

  if (fromAmount && toAmount) messages = [ ...messages, { columns: ['fromAmount', 'toAmount'], message: `Amount between ${formatCurrency(fromAmount)} and ${formatCurrency(toAmount)}` }];
  else if (fromAmount) messages = [ ...messages, { columns: ['fromAmount' ], message: `Amount above ${formatCurrency(fromAmount)}` } ];
  else if (toAmount) messages = [ ...messages, { columns: ['toAmount'], message: `Amount below ${formatCurrency(toAmount)}`}];

  if (comments) messages = [ ...messages, { columns: ['comments'], message: `Comments contains ${elipsis(comments, 10)}` }];

  const merchantNames = merchants.map(m => m.name);
  const categoryNames = categories.map(c => c.name);
  const limitedMerchants = merchantNames.length <= 2 ? merchantNames : [ ...merchantNames.slice(0, 2), '...' ];
  if (merchants && merchants.length) messages = [ ...messages, { columns: ['merchants'],  message: `Merchants are ${limitedMerchants.join(", ")}` }];
  const limitedCatorgies = categoryNames.length <= 2 ? categoryNames : [ ...categoryNames.slice(0, 2), "..." ];
  if (categories && categories.length) messages = [ ...messages, { columns: ['categories'], message: `Categories are ${limitedCatorgies.join(", ")}` }];

  return messages;  
}

  
  