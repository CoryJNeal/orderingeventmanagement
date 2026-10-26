import { expandEventAccounts } from "@/lib/events";
import { applyOverrides, readOverrides } from "@/lib/scans";
import { generateScanId } from "@/lib/scan-id";
import type { Employee, ScanEvent, ScanRecord } from "@/lib/types";

type SeedEmployee = Omit<
  Employee,
  "customerNumber" | "locationNumber" | "scanId"
>;

function scan(
  status: ScanRecord["status"],
  lastScanDate: string | null
): ScanRecord {
  return { status, lastScanDate };
}

const none = scan("not-started", null);

const SEED: SeedEmployee[] = [
  {
    id: "E-10482",
    firstName: "Maya",
    lastName: "Rivera",
    email: "maya.rivera@example.com",
    scans: {
      "footwear-sizing": scan("complete", "2026-09-18T14:22:00.000Z"),
      "footwear-pressure": scan("complete", "2026-09-18T14:41:00.000Z"),
      "face-pd": scan("complete", "2026-09-18T15:05:00.000Z"),
    },
  },
  {
    id: "E-11027",
    firstName: "James",
    lastName: "Chen",
    email: "james.chen@example.com",
    scans: {
      "footwear-sizing": scan("complete", "2026-08-04T11:12:00.000Z"),
      "footwear-pressure": scan("complete", "2026-08-04T11:28:00.000Z"),
      "face-pd": scan("complete", "2026-10-02T09:16:00.000Z"),
    },
  },
  {
    id: "E-11890",
    firstName: "Priya",
    lastName: "Nair",
    email: "priya.nair@example.com",
    scans: {
      "footwear-sizing": scan("complete", "2026-07-21T16:03:00.000Z"),
      "footwear-pressure": scan("complete", "2026-07-21T16:19:00.000Z"),
      "face-pd": scan("complete", "2026-07-22T08:44:00.000Z"),
    },
  },
  {
    id: "E-12114",
    firstName: "Owen",
    lastName: "Blake",
    email: "owen.blake@example.com",
    scans: {
      "footwear-sizing": scan("complete", "2026-10-01T13:08:00.000Z"),
      "footwear-pressure": none,
      "face-pd": none,
    },
  },
  {
    id: "E-12503",
    firstName: "Sofia",
    lastName: "Alvarez",
    email: "sofia.alvarez@example.com",
    scans: {
      "footwear-sizing": none,
      "footwear-pressure": scan("complete", "2026-09-09T10:36:00.000Z"),
      "face-pd": scan("complete", "2026-09-09T10:58:00.000Z"),
    },
  },
  {
    id: "E-13088",
    firstName: "Malik",
    lastName: "Johnson",
    email: "malik.johnson@example.com",
    scans: {
      "footwear-sizing": scan("complete", "2026-06-12T15:47:00.000Z"),
      "footwear-pressure": scan("complete", "2026-06-12T16:02:00.000Z"),
      "face-pd": none,
    },
  },
  {
    id: "E-13441",
    firstName: "Hannah",
    lastName: "Patel",
    email: "hannah.patel@example.com",
    scans: {
      "footwear-sizing": none,
      "footwear-pressure": none,
      "face-pd": scan("complete", "2026-10-07T12:25:00.000Z"),
    },
  },
  {
    id: "E-14016",
    firstName: "Luca",
    lastName: "Romano",
    email: "luca.romano@example.com",
    scans: {
      "footwear-sizing": none,
      "footwear-pressure": none,
      "face-pd": none,
    },
  },
  {
    id: "E-14672",
    firstName: "Elena",
    lastName: "Brooks",
    email: "elena.brooks@example.com",
    scans: {
      "footwear-sizing": none,
      "footwear-pressure": none,
      "face-pd": none,
    },
  },
  {
    id: "E-15209",
    firstName: "Noah",
    lastName: "Kim",
    email: "noah.kim@example.com",
    scans: {
      "footwear-sizing": none,
      "footwear-pressure": none,
      "face-pd": none,
    },
  },
];

export function getEmployees(
  customerNumber: string,
  locationNumber: string
): Employee[] {
  return SEED.map((person) => ({
    ...person,
    customerNumber,
    locationNumber,
    scanId: generateScanId(person.id, customerNumber, locationNumber),
    scans: {
      "footwear-sizing": { ...person.scans["footwear-sizing"] },
      "footwear-pressure": { ...person.scans["footwear-pressure"] },
      "face-pd": { ...person.scans["face-pd"] },
    },
  }));
}

export function getLiveEmployees(
  customerNumber: string,
  locationNumber: string
): Employee[] {
  const overrides = readOverrides();
  return getEmployees(customerNumber, locationNumber).map((employee) =>
    applyOverrides(employee, overrides)
  );
}

export function getLiveEmployee(
  customerNumber: string,
  locationNumber: string,
  employeeId: string
) {
  return (
    getLiveEmployees(customerNumber, locationNumber).find(
      (employee) => employee.id === employeeId
    ) ?? null
  );
}

export function getEmployeesForPairs(
  pairs: Array<{ customerNumber: string; locationNumber: string }>
): Employee[] {
  return pairs.flatMap(({ customerNumber, locationNumber }) =>
    getEmployees(customerNumber, locationNumber)
  );
}

export function getLiveEmployeesForPairs(
  pairs: Array<{ customerNumber: string; locationNumber: string }>
): Employee[] {
  const overrides = readOverrides();
  return getEmployeesForPairs(pairs).map((employee) =>
    applyOverrides(employee, overrides)
  );
}

export function getEmployeesForEvent(event: ScanEvent): Employee[] {
  return getEmployeesForPairs(expandEventAccounts(event.accounts));
}

export function getLiveEmployeesForEvent(event: ScanEvent): Employee[] {
  return getLiveEmployeesForPairs(expandEventAccounts(event.accounts));
}

export function employeeDisplayName(employee: Pick<Employee, "firstName" | "lastName">) {
  return `${employee.firstName} ${employee.lastName}`;
}
