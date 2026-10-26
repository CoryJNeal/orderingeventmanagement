"use client";

import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { ExportList } from "@/components/export-list";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEvent } from "@/hooks/use-events";
import { eventPath, lookupPath } from "@/lib/account";
import { getEmployeesForEvent } from "@/lib/employees";
import { formatEventDateRange } from "@/lib/events";
import { cn } from "@/lib/utils";

export function EventExportPage({ eventId }: { eventId: string }) {
  const event = useEvent(eventId);

  if (!event) {
    return (
      <AuthGuard>
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
            <Card>
              <CardHeader>
                <CardTitle>Event not found</CardTitle>
                <CardDescription>
                  That event is not saved in this browser.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={lookupPath()} className={cn(buttonVariants())}>
                  Employee look up
                </Link>
              </CardFooter>
            </Card>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ExportList
        title="Scan ID export"
        subtitle={`${event.name} · ${formatEventDateRange(event)}. Scan ID, customer number, and location number for the vendor app.`}
        backHref={eventPath(event.id)}
        eventName={event.name}
        employees={getEmployeesForEvent(event)}
      />
    </AuthGuard>
  );
}
