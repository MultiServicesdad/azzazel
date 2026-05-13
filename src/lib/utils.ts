import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeForPrisma<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') {
      // Remove null bytes and invalid unicode escapes that break JSONB in Postgres
      // Also stripping non-printable ASCII characters (0-31) except newline/tab
      return obj
        .replace(/\0/g, '')
        .replace(/\u0000/g, '')
        .replace(/\\u0000/g, '')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') as unknown as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForPrisma) as unknown as T;
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeForPrisma(value);
  }
  return result;
}
