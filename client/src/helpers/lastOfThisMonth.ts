export const lastOfThisMonth = (): Date => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth()+1, 0);
}