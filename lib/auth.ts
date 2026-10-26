import type { AuthSession } from "@/lib/types";

export const DEMO_EMAIL = "rep@example.com";
export const DEMO_PASSWORD = "scan-desk";
export const DEMO_OTP = "123456";

const SESSION_KEY = "event-scan-auth-v1";
const AUTH_EVENT = "event-scan-auth-updated";

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
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.email || !parsed?.authenticatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(email: string): AuthSession {
  const session: AuthSession = {
    email: email.trim().toLowerCase(),
    authenticatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT));
  return session;
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
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
