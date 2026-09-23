import { ServiceAccountCredentials } from '../types/admin';

let accessTokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Read Firebase Service Account settings directly from Vite environment variables.
 */
export function getServiceAccount(): ServiceAccountCredentials {
  return {
    type: 'service_account',
    project_id: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hydrate-6c9b6',
    client_email: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL || '',
    private_key_id: import.meta.env.VITE_FIREBASE_PRIVATE_KEY_ID || '',
    client_id: import.meta.env.VITE_FIREBASE_CLIENT_ID || '',
    private_key: import.meta.env.VITE_FIREBASE_PRIVATE_KEY || '',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: '',
  };
}

export function getProjectId(): string {
  return import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hydrate-6c9b6';
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

/**
 * Convert PEM string from Vite .env to CryptoKey in browser Web Crypto
 */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  // Strip PEM headers, footers, whitespace, and any escaped \n or \r
  const cleanBase64 = pem
    .replace(/-----BEGIN[^-]+-----/g, '')
    .replace(/-----END[^-]+-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\\r/g, '')
    .replace(/\s+/g, '')
    .replace(/[^A-Za-z0-9+/=]/g, '');

  const binaryString = window.atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return await window.crypto.subtle.importKey(
    'pkcs8',
    bytes.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
}

/**
 * Generate Google OAuth2 access token for Service Account directly in browser
 */
export async function getAccessToken(): Promise<string> {
  if (accessTokenCache && Date.now() < accessTokenCache.expiresAt) {
    return accessTokenCache.token;
  }

  const creds = getServiceAccount();
  if (!creds.private_key || !creds.client_email) {
    throw new Error('Missing VITE_FIREBASE_PRIVATE_KEY or VITE_FIREBASE_CLIENT_EMAIL in .env');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const toSign = new TextEncoder().encode(`${encHeader}.${encPayload}`);

  const key = await importPrivateKey(creds.private_key);
  const sig = await window.crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, toSign);
  const jwt = `${encHeader}.${encPayload}.${bufferToBase64Url(sig)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to authenticate with Firebase OAuth: ${err}`);
  }

  const data = await res.json();
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

export function decodeFirestoreDoc<T = any>(doc: any): T {
  if (!doc || !doc.fields) return {} as T;
  const res: Record<string, any> = {};

  for (const [key, val] of Object.entries<any>(doc.fields)) {
    res[key] = decodeValue(val);
  }

  if (doc.name) {
    const parts = doc.name.split('/');
    const docId = parts[parts.length - 1];
    if (!res.uid && !res.id && !res.deviceId && !res.date) {
      res.uid = docId;
    }
  }

  return res as T;
}

function decodeValue(val: any): any {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return Boolean(val.booleanValue);
  if ('timestampValue' in val) return new Date(val.timestampValue).getTime();
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(decodeValue);
  }
  if ('mapValue' in val) {
    const obj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = decodeValue(v);
    }
    return obj;
  }
  return null;
}

export function encodeFirestoreDoc(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = encodeValue(v);
    }
  }
  return { fields };
}

function encodeValue(val: any): any {
  if (val === null) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(encodeValue) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = encodeValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}
