"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { useAuth } from "@/hooks/use-auth";

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const ready = useIsClient();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, ready, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="grid min-h-svh place-items-center px-4 text-sm text-muted-foreground">
        Checking sign-in…
      </div>
    );
  }

  return <>{children}</>;
}
