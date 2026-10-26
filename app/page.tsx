import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <div className="grid min-h-svh w-full place-items-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Event Scan Desk
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in with password and one-time code to access customer event
            data.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
