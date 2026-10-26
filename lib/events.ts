import { isCustomerNumber, isLocationNumber } from "@/lib/account";
import type { EventAccount, ScanEvent } from "@/lib/types";

const STORAGE_KEY = "event-scan-events-v1";
export const EVENTS_UPDATED = "event-scan-events-updated";

/** Demo locations returned when an event includes a whole customer account. */
export const DEMO_CUSTOMER_LOCATIONS = ["00142", "00143", "00201"] as const;

export function locationsForAccount(account: EventAccount): string[] {
  if (account.locationNumber) return [account.locationNumber];
  return [...DEMO_CUSTOMER_LOCATIONS];
}

export function expandEventAccounts(
  accounts: EventAccount[]
): Array<{ customerNumber: string; locationNumber: string }> {
  const pairs: Array<{ customerNumber: string; locationNumber: string }> = [];
  const seen = new Set<string>();

  for (const account of accounts) {
    for (const locationNumber of locationsForAccount(account)) {
      const key = `${account.customerNumber}:${locationNumber}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({
        customerNumber: account.customerNumber,
        locationNumber,
      });
    }
  }

  return pairs;
}

export function readEvents(): ScanEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getEvent(eventId: string) {
  return readEvents().find((event) => event.id === eventId) ?? null;
}

export function saveEvent(
  input: Omit<ScanEvent, "id" | "createdAt"> & { id?: string }
): ScanEvent {
  const events = readEvents();
  const event: ScanEvent = {
    id: input.id ?? `EVT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    name: input.name.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    accounts: input.accounts,
    createdAt: new Date().toISOString(),
  };

  const next = [event, ...events.filter((item) => item.id !== event.id)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENTS_UPDATED));
  return event;
}

export function deleteEvent(eventId: string) {
  const next = readEvents().filter((event) => event.id !== eventId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENTS_UPDATED));
}

export function isValidEventAccount(account: EventAccount) {
  if (!isCustomerNumber(account.customerNumber)) return false;
  if (account.locationNumber === null) return true;
  return isLocationNumber(account.locationNumber);
}

export function formatEventDateRange(event: Pick<ScanEvent, "startDate" | "endDate">) {
  const start = formatDateOnly(event.startDate);
  const end = formatDateOnly(event.endDate);
  if (start === end) return start;
  return `${start} – ${end}`;
}

function formatDateOnly(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function subscribeEvents(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener(EVENTS_UPDATED, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENTS_UPDATED, handler);
    window.removeEventListener("storage", handler);
  };
}
