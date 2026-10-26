"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
import { useEvents } from "@/hooks/use-events";
import {
  accountPath,
  eventPath,
  isCustomerNumber,
  isLocationNumber,
} from "@/lib/account";
import { formatEventDateRange } from "@/lib/events";

type Mode = "event" | "account";

export function EmployeeLookupForm() {
  const router = useRouter();
  const events = useEvents();
  const [mode, setMode] = useState<Mode>("event");
  const [eventId, setEventId] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [locationNumber, setLocationNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      })),
    [events]
  );

  function onSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setSubmitted(true);
    setError(null);

    if (mode === "event") {
      if (!eventId) {
        setError("Select an event.");
        return;
      }
      router.push(eventPath(eventId));
      return;
    }

    if (!isCustomerNumber(customerNumber) || !isLocationNumber(locationNumber)) {
      setError("Enter a 6-digit customer number and 5-digit location number.");
      return;
    }

    router.push(accountPath(customerNumber, locationNumber));
  }

  return (
    <Card className="w-full max-w-lg shadow-sm">
      <CardHeader>
        <CardTitle>Employee look up</CardTitle>
        <CardDescription>
          Open a roster by event name, or look up a single customer location.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-5">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === "event"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMode("event")}
            >
              By event
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === "account"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMode("account")}
            >
              By account
            </button>
          </div>

          {mode === "event" ? (
            <div className="grid gap-2">
              <Label htmlFor="event-select">Event name</Label>
              {sortedEvents.length === 0 ? (
                <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                  No events yet. Create an event first, then return here to open
                  its employee list.
                </p>
              ) : (
                <select
                  id="event-select"
                  value={eventId}
                  onChange={(event) => setEventId(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Select an event…</option>
                  {sortedEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({formatEventDateRange(event)})
                    </option>
                  ))}
                </select>
              )}
              {submitted && mode === "event" && !eventId ? (
                <p className="text-sm text-destructive">Select an event.</p>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lookup-customer">Customer number</Label>
                <Input
                  id="lookup-customer"
                  inputMode="numeric"
                  maxLength={6}
                  value={customerNumber}
                  placeholder="123456"
                  className="h-10"
                  aria-invalid={
                    (submitted && !isCustomerNumber(customerNumber)) || undefined
                  }
                  onChange={(event) =>
                    setCustomerNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lookup-location">Location number</Label>
                <Input
                  id="lookup-location"
                  inputMode="numeric"
                  maxLength={5}
                  value={locationNumber}
                  placeholder="00142"
                  className="h-10"
                  aria-invalid={
                    (submitted && !isLocationNumber(locationNumber)) || undefined
                  }
                  onChange={(event) =>
                    setLocationNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 5)
                    )
                  }
                />
              </div>
            </div>
          )}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={mode === "event" && sortedEvents.length === 0}
          >
            View employees
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
