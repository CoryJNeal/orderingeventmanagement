"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { accountPath, isCustomerNumber, isLocationNumber } from "@/lib/account";

export function LookupForm() {
  const router = useRouter();
  const [customerNumber, setCustomerNumber] = useState("");
  const [locationNumber, setLocationNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const customerError =
    submitted && !isCustomerNumber(customerNumber)
      ? "Enter the 6-digit customer number."
      : null;
  const locationError =
    submitted && !isLocationNumber(locationNumber)
      ? "Enter the 5-digit location number."
      : null;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (
      !isCustomerNumber(customerNumber) ||
      !isLocationNumber(locationNumber)
    ) {
      return;
    }
    router.push(accountPath(customerNumber, locationNumber));
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
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="customer-number">Customer number</Label>
            <Input
              id="customer-number"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              placeholder="123456"
              value={customerNumber}
              aria-invalid={Boolean(customerError)}
              onChange={(event) =>
                setCustomerNumber(event.target.value.replace(/\D/g, "").slice(0, 6))
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
            <Input
              id="location-number"
              inputMode="numeric"
              autoComplete="off"
              maxLength={5}
              placeholder="00142"
              value={locationNumber}
              aria-invalid={Boolean(locationError)}
              onChange={(event) =>
                setLocationNumber(event.target.value.replace(/\D/g, "").slice(0, 5))
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
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Load employee roster
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
