export function coerceArray(params: any | any[]) {
  return Array.isArray(params) ? params : [params];
}
