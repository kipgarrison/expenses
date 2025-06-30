// import type { Indexable } from "../types/Indexable";
import type { SortType } from "../types/TransactionsState";
import * as _ from "lodash";


export function sortObjectsArray(objects: unknown[], primarySort: SortType, secondaryColumn?: string): unknown[] {
  if (!primarySort || !primarySort.column || !primarySort.direction) throw new Error("Primary Sort is invalid");
  const cols = secondaryColumn ? [ primarySort.column, secondaryColumn ] : [ primarySort.column ];
  return primarySort.direction === "asc" 
    ? _.sortBy(objects, cols) 
    : _.reverse(_.sortBy(objects, cols));
}