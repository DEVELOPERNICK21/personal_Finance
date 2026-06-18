import type { FinanceData } from "../core/domain/types";
import type { EncryptedFinanceRecord } from "../core/domain/storage-record";

const PBKDF2_ITERATIONS = 210_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function generateSalt(): Uint8Array {
  const salt = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(salt);
  return salt;
}

export async function deriveVaultKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const saltBytes = new Uint8Array(salt);

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFinanceData(
  data: FinanceData,
  key: CryptoKey,
  salt: Uint8Array
): Promise<EncryptedFinanceRecord> {
  const iv = new Uint8Array(IV_BYTES);
  crypto.getRandomValues(iv);
  const ivBytes = new Uint8Array(iv);

  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: ivBytes }, key, plaintext);

  return {
    v: 1,
    salt: bytesToBase64(salt),
    encrypted: {
      ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
      iv: bytesToBase64(iv),
    },
    lastUpdated: data.lastUpdated,
  };
}

export async function decryptFinanceData(
  record: EncryptedFinanceRecord,
  key: CryptoKey
): Promise<FinanceData> {
  const iv = base64ToBytes(record.encrypted.iv);
  const ciphertext = base64ToBytes(record.encrypted.ciphertext);
  const ivBytes = new Uint8Array(iv);
  const cipherBytes = new Uint8Array(ciphertext);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    cipherBytes
  );

  return JSON.parse(new TextDecoder().decode(plaintext)) as FinanceData;
}

export async function verifyPassphrase(
  record: EncryptedFinanceRecord,
  passphrase: string
): Promise<boolean> {
  try {
    const salt = base64ToBytes(record.salt);
    const key = await deriveVaultKey(passphrase, salt);
    await decryptFinanceData(record, key);
    return true;
  } catch {
    return false;
  }
}
