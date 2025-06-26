export type ColumnType = {
  column: string,
  header: string,
  dir: "asc" | "desc" | "none",
  unsortable?: boolean
}