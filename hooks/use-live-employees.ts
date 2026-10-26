"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getEmployees,
  getEmployeesForEvent,
  getEmployeesForPairs,
  getLiveEmployee,
  getLiveEmployees,
  getLiveEmployeesForEvent,
  getLiveEmployeesForPairs,
} from "@/lib/employees";
import { completeScan } from "@/lib/scans";
import type { Employee, ScanEvent, ScanType } from "@/lib/types";

let version = 0;
const rosterCache = new Map<string, Employee[]>();
const employeeCache = new Map<string, Employee | null>();
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  rosterCache.clear();
  employeeCache.clear();
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  const shouldBind = listeners.size === 0;
  listeners.add(onStoreChange);
  if (shouldBind) {
    window.addEventListener("event-scan-updated", emit);
    window.addEventListener("storage", emit);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      window.removeEventListener("event-scan-updated", emit);
      window.removeEventListener("storage", emit);
    }
  };
}

function rosterSnapshot(customerNumber: string, locationNumber: string) {
  const key = `${version}:${customerNumber}:${locationNumber}`;
  const cached = rosterCache.get(key);
  if (cached) return cached;
  const employees = getLiveEmployees(customerNumber, locationNumber);
  rosterCache.set(key, employees);
  return employees;
}

function pairsSnapshot(
  pairs: Array<{ customerNumber: string; locationNumber: string }>
) {
  const key = `${version}:pairs:${pairs
    .map((pair) => `${pair.customerNumber}:${pair.locationNumber}`)
    .join("|")}`;
  const cached = rosterCache.get(key);
  if (cached) return cached;
  const employees = getLiveEmployeesForPairs(pairs);
  rosterCache.set(key, employees);
  return employees;
}

function eventSnapshot(event: ScanEvent) {
  const key = `${version}:event:${event.id}:${event.accounts
    .map((account) => `${account.customerNumber}:${account.locationNumber ?? "*"}`)
    .join("|")}`;
  const cached = rosterCache.get(key);
  if (cached) return cached;
  const employees = getLiveEmployeesForEvent(event);
  rosterCache.set(key, employees);
  return employees;
}

function employeeSnapshot(
  customerNumber: string,
  locationNumber: string,
  employeeId: string
) {
  const key = `${version}:${customerNumber}:${locationNumber}:${employeeId}`;
  if (employeeCache.has(key)) {
    return employeeCache.get(key) ?? null;
  }
  const employee = getLiveEmployee(
    customerNumber,
    locationNumber,
    employeeId
  );
  employeeCache.set(key, employee);
  return employee;
}

const seedRosterCache = new Map<string, Employee[]>();
const seedEmployeeCache = new Map<string, Employee | null>();

function seedRoster(customerNumber: string, locationNumber: string) {
  const key = `${customerNumber}:${locationNumber}`;
  const cached = seedRosterCache.get(key);
  if (cached) return cached;
  const employees = getEmployees(customerNumber, locationNumber);
  seedRosterCache.set(key, employees);
  return employees;
}

function seedPairs(
  pairs: Array<{ customerNumber: string; locationNumber: string }>
) {
  const key = `pairs:${pairs
    .map((pair) => `${pair.customerNumber}:${pair.locationNumber}`)
    .join("|")}`;
  const cached = seedRosterCache.get(key);
  if (cached) return cached;
  const employees = getEmployeesForPairs(pairs);
  seedRosterCache.set(key, employees);
  return employees;
}

function seedEvent(event: ScanEvent) {
  const key = `event:${event.id}`;
  const cached = seedRosterCache.get(key);
  if (cached) return cached;
  const employees = getEmployeesForEvent(event);
  seedRosterCache.set(key, employees);
  return employees;
}

function seedEmployee(
  customerNumber: string,
  locationNumber: string,
  employeeId: string
) {
  const key = `${customerNumber}:${locationNumber}:${employeeId}`;
  if (seedEmployeeCache.has(key)) {
    return seedEmployeeCache.get(key) ?? null;
  }
  const employee =
    seedRoster(customerNumber, locationNumber).find(
      (person) => person.id === employeeId
    ) ?? null;
  seedEmployeeCache.set(key, employee);
  return employee;
}

export function useLiveEmployees(
  customerNumber: string,
  locationNumber: string
) {
  return useSyncExternalStore(
    subscribe,
    () => rosterSnapshot(customerNumber, locationNumber),
    () => seedRoster(customerNumber, locationNumber)
  );
}

export function useLiveEmployeesForPairs(
  pairs: Array<{ customerNumber: string; locationNumber: string }>
) {
  return useSyncExternalStore(
    subscribe,
    () => pairsSnapshot(pairs),
    () => seedPairs(pairs)
  );
}

const EMPTY_EMPLOYEES: Employee[] = [];

export function useLiveEmployeesForEvent(event: ScanEvent | null) {
  return useSyncExternalStore(
    subscribe,
    () => (event ? eventSnapshot(event) : EMPTY_EMPLOYEES),
    () => (event ? seedEvent(event) : EMPTY_EMPLOYEES)
  );
}

export function useLiveEmployee(
  customerNumber: string,
  locationNumber: string,
  employeeId: string
) {
  const employee = useSyncExternalStore(
    subscribe,
    () => employeeSnapshot(customerNumber, locationNumber, employeeId),
    () => seedEmployee(customerNumber, locationNumber, employeeId)
  );

  const markComplete = useCallback(
    (scanType: ScanType) => {
      completeScan(customerNumber, locationNumber, employeeId, scanType);
    },
    [customerNumber, employeeId, locationNumber]
  );

  return { employee, markComplete };
}
