export function requiredString(value: unknown, field: string, max = 200): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new Error(`${field} is required`);
  if (text.length > max) throw new Error(`${field} must be ${max} characters or fewer`);
  return text;
}

export function optionalString(value: unknown, max = 1000): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  if (text.length > max) throw new Error(`Text must be ${max} characters or fewer`);
  return text;
}

export function requiredDate(value: unknown, field: string): Date {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) throw new Error(`${field} must be a valid date`);
  return date;
}

export function requiredInt(value: unknown, field: string): number {
  const number = Number(value);
  if (!Number.isInteger(number)) throw new Error(`${field} must be an integer`);
  return number;
}
