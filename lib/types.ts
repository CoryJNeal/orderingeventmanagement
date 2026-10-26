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
  scanId: string;
  firstName: string;
  lastName: string;
  email: string;
  customerNumber: string;
  locationNumber: string;
  scans: Record<ScanType, ScanRecord>;
};

export type EventAccount = {
  customerNumber: string;
  /** When null, every demo location under the customer is included. */
  locationNumber: string | null;
};

export type ScanEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  accounts: EventAccount[];
  createdAt: string;
};

export type AuthSession = {
  email: string;
  authenticatedAt: string;
};
