"use client";

import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { isCustomerNumber, isLocationNumber } from "@/lib/account";
import { cn } from "@/lib/utils";

export function LookupForm() {
  const [customerNumber, setCustomerNumber] = useState("");
  const [locationNumber, setLocationNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const customerValid = isCustomerNumber(customerNumber);
  const locationValid = isLocationNumber(locationNumber);
  const customerError = submitted && !customerValid
    ? "Enter the 6-digit customer number."
    : null;
  const locationError = submitted && !locationValid
    ? "Enter the 5-digit location number."
    : null;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    setSubmitted(true);
    if (!customerValid || !locationValid) {
      event.preventDefault();
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-sm">
      <CardHeader className="border-b">
        <CardTitle>Open a customer event</CardTitle>
        <CardDescription>
          Enter the account numbers from the event brief. This prototype loads a
          spoofed 10-person roster for any valid customer and location.
        </CardDescription>
      </CardHeader>
      <form action="/" method="get" onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="customer-number">Customer number</Label>
            <input
              id="customer-number"
              name="customer"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              placeholder="123456"
              value={customerNumber}
              aria-invalid={Boolean(customerError) || undefined}
              className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-base outline-none md:text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              onChange={(event) =>
                setCustomerNumber(
                  event.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
            />
            {customerError ? (
              <p className="text-sm text-destructive">{customerError}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Exactly 6 digits.</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location-number">Location number</Label>
            <input
              id="location-number"
              name="location"
              inputMode="numeric"
              autoComplete="off"
              maxLength={5}
              placeholder="00142"
              value={locationNumber}
              aria-invalid={Boolean(locationError) || undefined}
              className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-base outline-none md:text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              onChange={(event) =>
                setLocationNumber(
                  event.target.value.replace(/\D/g, "").slice(0, 5)
                )
              }
            />
            {locationError ? (
              <p className="text-sm text-destructive">{locationError}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Exactly 5 digits.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
          >
            Load employee roster
          </button>
        </CardFooter>
      </form>
    </Card>
  );
}
