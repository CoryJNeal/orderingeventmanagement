import { AuthGuard } from "@/components/auth-guard";
import { EmployeeLookupForm } from "@/components/employee-lookup-form";
import { SiteHeader } from "@/components/site-header";

export default function LookupPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
          <EmployeeLookupForm />
        </main>
      </div>
    </AuthGuard>
  );
}
