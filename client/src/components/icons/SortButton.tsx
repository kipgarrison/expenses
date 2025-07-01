// @ts-expect-error("The following line complains that the svg file is not found when it's there")
import ShevronUp from './shevron-up.svg?react';
// @ts-expect-error("The following line complains that the svg file is not found when it's there")
import ShevronDown from './shevron-down.svg?react';
import "./SortButton.css";
import type { SortButtonProps } from '../../types/SortButtonProps';
export function SortButton({ sortDir, column, children, onSort }: SortButtonProps) {
  switch (sortDir) {
    case "asc":
      return <button onClick={() => onSort(column)} data-testid="sort-asc">{children}<ShevronUp height={14} width={14}/></button>;
    case "desc":
      return <button onClick={() => onSort(column)}  data-testid="sort-desc">{children}<ShevronDown height={14} width={14} /></button>;
    case "none":
      return <button onClick={() => onSort(column)} data-testid="sort-none">{children}</button>;
  }
}