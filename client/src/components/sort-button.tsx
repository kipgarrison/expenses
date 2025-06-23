import type { SortButtonProps } from '../types/SortButtonProps';
// @ts-ignore
import ShevronUp from './shevron-up.svg?react';
// @ts-ignore
import ShevronDown from './shevron-down.svg?react';

export function SortButton({ sortDir, column, children, onSort }: SortButtonProps) {
  switch (sortDir) {
    case "asc":
      return <button onClick={() => onSort(column)}>{children} <ShevronUp height={14} width={14}/></button>;
    case "desc":
      return <button onClick={() => onSort(column)}>{children} <ShevronDown height={14} width={14}/></button>;
    case "none":
      return <button onClick={() => onSort(column)}>{children}</button>;
  }
}