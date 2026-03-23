import CryptoJS from 'crypto-js';

const SECRET_KEY = 'zhiming-mingli-2026';

export function encrypt(data: unknown): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

export function decrypt<T>(encryptedData: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString) as T;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  const encrypted = encrypt(data);
  localStorage.setItem(key, encrypted);
}

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return decrypt<T>(encrypted);
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.clear();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function maskBirthInfo(date: string, location: string): string {
  const dateParts = date.split('-');
  const maskedDate = `${dateParts[0]}年**月**日`;
  const maskedLocation = location.replace(/市|区|县/, '**');
  return `${maskedDate} ${maskedLocation}`;
}
