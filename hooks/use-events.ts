"use client";

import { useSyncExternalStore } from "react";

import { getEvent, readEvents, subscribeEvents } from "@/lib/events";
import type { ScanEvent } from "@/lib/types";

export function useEvents() {
  return useSyncExternalStore(subscribeEvents, readEvents, () => [] as ScanEvent[]);
}

export function useEvent(eventId: string) {
  return useSyncExternalStore(
    subscribeEvents,
    () => getEvent(eventId),
    () => null as ScanEvent | null
  );
}
