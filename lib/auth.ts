import type { AuthSession } from "@/lib/types";

export const DEMO_EMAIL = "rep@example.com";
export const DEMO_PASSWORD = "scan-desk";
export const DEMO_OTP = "123456";

const SESSION_KEY = "event-scan-auth-v1";
const AUTH_EVENT = "event-scan-auth-updated";

let cachedRaw: string | null | undefined;
let cachedSession: AuthSession | null = null;

export function verifyPassword(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_EMAIL &&
    password === DEMO_PASSWORD
  );
}

export function verifyOtp(code: string) {
  return code.trim() === DEMO_OTP;
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw === cachedRaw) return cachedSession;
    cachedRaw = raw;
    if (!raw) {
      cachedSession = null;
      return null;
    }
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.email || !parsed?.authenticatedAt) {
      cachedSession = null;
      return null;
    }
    cachedSession = parsed;
    return cachedSession;
  } catch {
    cachedRaw = undefined;
    cachedSession = null;
    return null;
  }
}

export function writeSession(email: string): AuthSession {
  const session: AuthSession = {
    email: email.trim().toLowerCase(),
    authenticatedAt: new Date().toISOString(),
  };
  const raw = JSON.stringify(session);
  window.localStorage.setItem(SESSION_KEY, raw);
  cachedRaw = raw;
  cachedSession = session;
  window.dispatchEvent(new Event(AUTH_EVENT));
  return session;
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
  cachedRaw = null;
  cachedSession = null;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeAuth(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
