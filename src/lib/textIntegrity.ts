const damagedTextPattern = /[\uFFFD\u0080-\u009F]|锟斤拷|Ã.|Â.|â€|ðŸ/;

export function hasTextEncodingDamage(value: unknown): boolean {
  if (typeof value === "string") return damagedTextPattern.test(value);
  if (Array.isArray(value)) return value.some(hasTextEncodingDamage);
  if (value && typeof value === "object") return Object.values(value).some(hasTextEncodingDamage);
  return false;
}

export function repairEncodingDamage<T>(value: T, fallback: unknown): T {
  if (typeof value === "string") {
    if (!hasTextEncodingDamage(value)) return value;
    return (typeof fallback === "string" ? fallback : "") as T;
  }

  if (Array.isArray(value)) {
    const fallbackItems = Array.isArray(fallback) ? fallback : [];
    return value.map((item, index) => repairEncodingDamage(item, fallbackItems[index])) as T;
  }

  if (value && typeof value === "object") {
    const fallbackRecord = fallback && typeof fallback === "object" ? fallback as Record<string, unknown> : {};
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        repairEncodingDamage(item, fallbackRecord[key])
      ])
    ) as T;
  }

  return value;
}
