"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { homePath } from "@/lib/account";
import {
  DEMO_EMAIL,
  DEMO_OTP,
  DEMO_PASSWORD,
  verifyOtp,
  verifyPassword,
} from "@/lib/auth";

type Step = "credentials" | "otp";

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function LoginForm() {
  const router = useRouter();
  const { isAuthenticated, signIn } = useAuth();
  const ready = useIsClient();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace(homePath());
    }
  }, [isAuthenticated, ready, router]);

  function submitCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verifyPassword(email, password)) {
      setError("Email or password is incorrect.");
      return;
    }
    setError(null);
    setStep("otp");
  }

  function submitOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verifyOtp(otp)) {
      setError("That one-time code is not valid.");
      return;
    }
    signIn(email);
    router.push(homePath());
  }

  if (!ready || isAuthenticated) {
    return (
      <div className="text-sm text-muted-foreground">Opening Event Scan Desk…</div>
    );
  }

  return (
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader>
        <CardTitle>
          {step === "credentials" ? "Sign in" : "Enter one-time code"}
        </CardTitle>
        <CardDescription>
          {step === "credentials"
            ? "Use your Event Scan Desk account to access customer event data."
            : `We sent a 6-digit code to ${email.trim().toLowerCase()}.`}
        </CardDescription>
      </CardHeader>

      {step === "credentials" ? (
        <form onSubmit={submitCredentials}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={DEMO_EMAIL}
                required
                className="h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-10"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Demo login: {DEMO_EMAIL} / {DEMO_PASSWORD}
            </p>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full">
              Continue
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={submitOtp}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">One-time code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="******"
                required
                className="h-10 tracking-[0.35em]"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Demo OTP: {DEMO_OTP}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep("credentials");
                setOtp("");
                setError(null);
              }}
            >
              Back
            </Button>
            <Button type="submit" size="lg" className="w-full">
              Verify and continue
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
