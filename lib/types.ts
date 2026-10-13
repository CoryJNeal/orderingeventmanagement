export const SCAN_TYPES = [
  "footwear-sizing",
  "footwear-pressure",
  "face-pd",
] as const;

export type ScanType = (typeof SCAN_TYPES)[number];

export type ScanStatus = "not-started" | "complete";

export type ScanRecord = {
  status: ScanStatus;
  lastScanDate: string | null;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customerNumber: string;
  locationNumber: string;
  scans: Record<ScanType, ScanRecord>;
};

export type QrPayload = {
  lastName: string;
  employeeId: string;
  email: string;
  customerNumber: string;
  locationNumber: string;
};
