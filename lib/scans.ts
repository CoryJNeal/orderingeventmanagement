import { SCAN_TYPES, type Employee, type ScanRecord, type ScanType } from "@/lib/types";

export const SCAN_LABELS: Record<ScanType, string> = {
  "footwear-sizing": "Footwear sizing",
  "footwear-pressure": "Footwear pressure",
  "face-pd": "Face and PD scan",
};

export const SCAN_BLURBS: Record<ScanType, string> = {
  "footwear-sizing":
    "Opens the sizing app so the employee can complete a foot scan.",
  "footwear-pressure":
    "Shows a QR code the pressure-scan vendor uses to pick up this employee.",
  "face-pd":
    "Opens the eyewear app so the employee can complete a face and PD scan.",
};

const STORAGE_KEY = "event-scan-overrides-v1";

export type ScanOverrides = Record<
  string,
  Partial<Record<ScanType, ScanRecord>>
>;

export function overrideKey(
  customerNumber: string,
  locationNumber: string,
  employeeId: string
) {
  return `${customerNumber}:${locationNumber}:${employeeId}`;
}

export function completedCount(employee: Employee) {
  return SCAN_TYPES.filter(
    (type) => employee.scans[type].status === "complete"
  ).length;
}

export function latestScanDate(employee: Employee) {
  const dates = SCAN_TYPES.map((type) => employee.scans[type].lastScanDate)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime());

  if (dates.length === 0) return null;
  return new Date(Math.max(...dates)).toISOString();
}

export function formatScanDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function scanSummaryLabel(employee: Employee) {
  const completed = completedCount(employee);
  if (completed === 0) return "No scans";
  if (completed === SCAN_TYPES.length) return "All scans complete";
  return `${completed} of ${SCAN_TYPES.length} complete`;
}

export function readOverrides(): ScanOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScanOverrides) : {};
  } catch {
    return {};
  }
}

export function applyOverrides(
  employee: Employee,
  overrides: ScanOverrides = readOverrides()
): Employee {
  const stored = overrides[
    overrideKey(
      employee.customerNumber,
      employee.locationNumber,
      employee.id
    )
  ];
  if (!stored) return employee;

  return {
    ...employee,
    scans: {
      "footwear-sizing":
        stored["footwear-sizing"] ?? employee.scans["footwear-sizing"],
      "footwear-pressure":
        stored["footwear-pressure"] ?? employee.scans["footwear-pressure"],
      "face-pd": stored["face-pd"] ?? employee.scans["face-pd"],
    },
  };
}

export function completeScan(
  customerNumber: string,
  locationNumber: string,
  employeeId: string,
  scanType: ScanType
) {
  const overrides = readOverrides();
  const key = overrideKey(customerNumber, locationNumber, employeeId);
  const next: ScanRecord = {
    status: "complete",
    lastScanDate: new Date().toISOString(),
  };

  overrides[key] = {
    ...overrides[key],
    [scanType]: next,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event("event-scan-updated"));
  return next;
}
