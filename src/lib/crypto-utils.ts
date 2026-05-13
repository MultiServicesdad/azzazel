export function generateRandomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
