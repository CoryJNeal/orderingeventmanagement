"use client";

import { useSyncExternalStore } from "react";

import { getEvent, readEvents, subscribeEvents } from "@/lib/events";
import type { ScanEvent } from "@/lib/types";

const EMPTY_EVENTS: ScanEvent[] = [];

export function useEvents() {
  return useSyncExternalStore(subscribeEvents, readEvents, () => EMPTY_EVENTS);
}

export function useEvent(eventId: string) {
  return useSyncExternalStore(
    subscribeEvents,
    () => getEvent(eventId),
    () => null as ScanEvent | null
  );
}
