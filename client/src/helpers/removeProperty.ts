export function removeProperty(obj: Record<string, unknown>, property: string): Record<string, unknown> {
  return Object.keys(obj).reduce((acc, key) => key === property ? acc : { ...acc, [key]: obj[key]}, {});
}