"use client";

import Link from "next/link";
import { CalendarPlus, Search } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEvents } from "@/hooks/use-events";
import { createEventPath, eventPath, lookupPath } from "@/lib/account";
import { formatEventDateRange } from "@/lib/events";
import { cn } from "@/lib/utils";

export function HomeDashboard() {
  const { session } = useAuth();
  const events = useEvents();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome{session?.email ? `, ${session.email.split("@")[0]}` : ""}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Create a field event or look up employees by event or customer
            location. Pressure scans use each employee’s Scan ID in the vendor
            app.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link href={createEventPath()} className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/40">
              <CardHeader>
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <CalendarPlus className="size-4" />
                </span>
                <CardTitle>Create an event</CardTitle>
                <CardDescription>
                  Add a name, customer accounts, locations, and start/end dates.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href={lookupPath()} className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/40">
              <CardHeader>
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Search className="size-4" />
                </span>
                <CardTitle>Employee look up</CardTitle>
                <CardDescription>
                  Select an event or enter a customer and location number.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent events
            </h2>
            <Link
              href={createEventPath()}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              New event
            </Link>
          </div>
          {events.length === 0 ? (
            <p className="rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              No events saved yet. Create one to group accounts for a clinic or
              onsite day.
            </p>
          ) : (
            <ul className="divide-y overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
              {events.slice(0, 6).map((event) => (
                <li key={event.id}>
                  <Link
                    href={eventPath(event.id)}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/40"
                  >
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatEventDateRange(event)} · {event.accounts.length}{" "}
                        account
                        {event.accounts.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="text-sm text-primary">Open</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
