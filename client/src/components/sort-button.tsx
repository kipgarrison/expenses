import type { SortButtonProps } from '../types/SortButtonProps';
// @ts-expect-error("The following line complains that the svg file is not found when it's there")
import ShevronUp from './shevron-up.svg?react';
// @ts-expect-error("The following line complains that the svg file is not found when it's there")
import ShevronDown from './shevron-down.svg?react';
import "./sort-button.css";
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