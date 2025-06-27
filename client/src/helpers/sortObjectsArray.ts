import type { Indexable } from "../types/Indexable";
import type { SortType } from "../types/TransactionsState";

export function sortObjectsArray<T>(objects: T[], primarySort: SortType, secondaryColumn?: string): T[] {
  secondaryColumn = secondaryColumn || primarySort.column;
  const arrayCopy = objects.map(o => o as Indexable);
  const sortCol = primarySort.column || "date";
  const direction = primarySort.direction || "asc";
  
  const ascSorter = (a: Indexable, b: Indexable) => a[sortCol] > b[sortCol] ? 1 : (a[secondaryColumn] > b[secondaryColumn] ? 1 : -1);
  const descSorter = (a: Indexable, b: Indexable) => a[sortCol] > b[sortCol] ? -1 : (a[secondaryColumn] > b[secondaryColumn] ? -1 : 1);
  const sorter = direction === "asc" ? ascSorter : descSorter;

  // don't want to mutate the original array so...
  return arrayCopy.sort(sorter) as Array<T>;
}