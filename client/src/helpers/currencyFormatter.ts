export function formatCurrency(number: number): string {
  let num = Math.round((number * 100))/100;
  num = num || 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
}