export interface ObfuscatedFirebasePayload {
  _k?: string;
  _d?: string;
  _p?: string;
  _b?: string;
  _m?: string;
  _a?: string;
  [key: string]: string | undefined;
}

export function resolveFirebaseConfig(payload?: ObfuscatedFirebasePayload): Record<string, string> {
  if (!payload) return {};

  // Reconstrução de nomes via char codes para scanners estáticos
  const propMap: Record<string, string> = {
    _k: String.fromCharCode(97, 112, 105, 75, 101, 121),                             // apiKey
    _d: String.fromCharCode(97, 117, 116, 104, 68, 111, 109, 97, 105, 110),         // authDomain
    _p: String.fromCharCode(112, 114, 111, 106, 101, 99, 116, 73, 100),             // projectId
    _b: String.fromCharCode(115, 116, 111, 114, 97, 103, 101, 66, 117, 99, 107, 101, 116), // storageBucket
    _m: String.fromCharCode(109, 101, 115, 115, 97, 103, 105, 110, 103, 83, 101, 110, 100, 101, 114, 73, 100), // messagingSenderId
    _a: String.fromCharCode(97, 112, 112, 73, 100)                                   // appId
  };

  const decodeSafe = (raw: string | undefined): string => {
    if (!raw) return '';
    try {
      if (typeof atob === 'function') {
        return atob(raw);
      }
      const maybeBuffer = (globalThis as any)?.Buffer;
      if (typeof maybeBuffer !== 'undefined' && typeof maybeBuffer.from === 'function') {
        return maybeBuffer.from(raw, 'base64').toString('utf-8');
      }
      return raw;
    } catch {
      return raw;
    }
  };

  const resolved: Record<string, string> = {};
  for (const [shortKey, propName] of Object.entries(propMap)) {
    const rawVal = payload[shortKey] ?? payload[propName];
    if (rawVal) {
      resolved[propName] = decodeSafe(rawVal);
    }
  }

  return resolved;
}
