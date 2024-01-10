export function toArray<T>(value: unknown | unknown[]): T[] {
  if (!value)
    return []

  if (Array.isArray(value))
    return value

  return [value] as T[]
}
