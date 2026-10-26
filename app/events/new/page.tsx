import { AuthGuard } from "@/components/auth-guard";
import { CreateEventForm } from "@/components/create-event-form";
import { SiteHeader } from "@/components/site-header";

export default function CreateEventPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6">
          <CreateEventForm />
        </main>
      </div>
    </AuthGuard>
  );
}
