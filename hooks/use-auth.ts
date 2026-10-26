"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  clearSession,
  readSession,
  subscribeAuth,
  writeSession,
} from "@/lib/auth";
import type { AuthSession } from "@/lib/types";

export function useAuth() {
  const session = useSyncExternalStore(
    subscribeAuth,
    readSession,
    () => null as AuthSession | null
  );

  const signIn = useCallback((email: string) => writeSession(email), []);
  const signOut = useCallback(() => clearSession(), []);

  return {
    session,
    isAuthenticated: Boolean(session),
    signIn,
    signOut,
  };
}
