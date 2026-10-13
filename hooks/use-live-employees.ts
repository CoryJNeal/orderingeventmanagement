"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getEmployees,
  getLiveEmployee,
  getLiveEmployees,
} from "@/lib/employees";
import { completeScan } from "@/lib/scans";
import type { Employee, ScanType } from "@/lib/types";

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
