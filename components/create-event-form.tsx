"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
import { eventPath, isCustomerNumber, isLocationNumber } from "@/lib/account";
import {
  DEMO_CUSTOMER_LOCATIONS,
  isValidEventAccount,
  saveEvent,
} from "@/lib/events";
import type { EventAccount } from "@/lib/types";

type DraftAccount = {
  key: string;
  customerNumber: string;
  locationNumber: string;
  allLocations: boolean;
};

function newDraft(): DraftAccount {
  return {
    key: crypto.randomUUID(),
    customerNumber: "",
    locationNumber: "",
    allLocations: false,
  };
}

export function CreateEventForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [accounts, setAccounts] = useState<DraftAccount[]>([newDraft()]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateAccount(key: string, patch: Partial<DraftAccount>) {
    setAccounts((current) =>
      current.map((account) =>
        account.key === key ? { ...account, ...patch } : account
      )
    );
  }

  function toEventAccounts(): EventAccount[] | null {
    const mapped: EventAccount[] = [];
    for (const account of accounts) {
      if (!isCustomerNumber(account.customerNumber)) return null;
      if (account.allLocations) {
        mapped.push({
          customerNumber: account.customerNumber,
          locationNumber: null,
        });
        continue;
      }
      if (!isLocationNumber(account.locationNumber)) return null;
      mapped.push({
        customerNumber: account.customerNumber,
        locationNumber: account.locationNumber,
      });
    }
    return mapped.length > 0 && mapped.every(isValidEventAccount)
      ? mapped
      : null;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);

    if (!name.trim()) {
      setError("Enter an event name.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Choose a start and end date.");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    const eventAccounts = toEventAccounts();
    if (!eventAccounts) {
      setError(
        "Each row needs a 6-digit customer number, and either a 5-digit location or “all locations.”"
      );
      return;
    }

    const saved = saveEvent({
      name: name.trim(),
      startDate,
      endDate,
      accounts: eventAccounts,
    });
    router.push(eventPath(saved.id));
  }

  return (
    <Card className="w-full max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Create an event</CardTitle>
        <CardDescription>
          Name the event, attach one or more customer accounts, and set the
          field dates. Leave location blank and choose all locations to include
          every site on the parent account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="event-name">Event name</Label>
            <Input
              id="event-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Spring footwear clinic"
              className="h-10"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="h-10"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="h-10"
                required
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <Label>Accounts</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add customer and location pairs, or customer only for all
                  demo locations ({DEMO_CUSTOMER_LOCATIONS.join(", ")}).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAccounts((current) => [...current, newDraft()])}
              >
                <Plus data-icon="inline-start" />
                Add account
              </Button>
            </div>

            <div className="grid gap-3">
              {accounts.map((account, index) => {
                const customerInvalid =
                  submitted && !isCustomerNumber(account.customerNumber);
                const locationInvalid =
                  submitted &&
                  !account.allLocations &&
                  !isLocationNumber(account.locationNumber);

                return (
                  <div
                    key={account.key}
                    className="grid gap-3 rounded-xl border border-border p-3"
                  >
                    <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <div className="grid gap-2">
                        <Label htmlFor={`customer-${account.key}`}>
                          Customer #{index + 1}
                        </Label>
                        <Input
                          id={`customer-${account.key}`}
                          inputMode="numeric"
                          maxLength={6}
                          value={account.customerNumber}
                          aria-invalid={customerInvalid || undefined}
                          placeholder="123456"
                          className="h-10"
                          onChange={(event) =>
                            updateAccount(account.key, {
                              customerNumber: event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6),
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`location-${account.key}`}>
                          Location #
                        </Label>
                        <Input
                          id={`location-${account.key}`}
                          inputMode="numeric"
                          maxLength={5}
                          value={account.locationNumber}
                          disabled={account.allLocations}
                          aria-invalid={locationInvalid || undefined}
                          placeholder="00142"
                          className="h-10"
                          onChange={(event) =>
                            updateAccount(account.key, {
                              locationNumber: event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 5),
                            })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="justify-self-end sm:mb-0.5"
                        disabled={accounts.length === 1}
                        aria-label="Remove account"
                        onClick={() =>
                          setAccounts((current) =>
                            current.filter((item) => item.key !== account.key)
                          )
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={account.allLocations}
                        onChange={(event) =>
                          updateAccount(account.key, {
                            allLocations: event.target.checked,
                            locationNumber: event.target.checked
                              ? ""
                              : account.locationNumber,
                          })
                        }
                      />
                      All locations on this customer
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Save event
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
