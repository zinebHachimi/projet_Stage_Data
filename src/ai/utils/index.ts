/**
 * Sanitizes input text to prevent script injection and basic security issues.
 */
export function sanitizeInput(text: string): string {
  if (!text) return "";
  return text
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
    .trim();
}

/**
 * Standard debounce helper function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Timing tracker utility.
 */
export class Timer {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  reset() {
    this.startTime = Date.now();
  }

  getElapsedMs(): number {
    return Date.now() - this.startTime;
  }
}
