import { midnightToday } from "./midnightToday";

export function midnightTomorrow() {
  const d = new Date(midnightToday());
  d.setDate(d.getDate() + 1);
  return d;
}