"use client";

import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { EventEmployeeRoster } from "@/components/employee-roster";
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
import { createEventPath, lookupPath } from "@/lib/account";
import { getEmployeesForEvent } from "@/lib/employees";
import { cn } from "@/lib/utils";

export function EventRosterPage({ eventId }: { eventId: string }) {
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
                  That event is not saved in this browser. Create one or look up
                  a customer location instead.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2">
                <Link href={createEventPath()} className={cn(buttonVariants())}>
                  Create an event
                </Link>
                <Link
                  href={lookupPath()}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
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
      <EventEmployeeRoster
        event={event}
        initialEmployees={getEmployeesForEvent(event)}
      />
    </AuthGuard>
  );
}
