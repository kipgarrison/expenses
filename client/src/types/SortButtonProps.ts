export type SortButtonProps = 
{
  sortDir: "asc" | "desc" | "none",
  column: string,
  onSort: (column: string) => void
  children: string
};
