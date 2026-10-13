import { Badge } from "@/components/ui/badge";
import { completedCount, scanSummaryLabel } from "@/lib/scans";
import { SCAN_TYPES, type Employee, type ScanRecord } from "@/lib/types";

export function ScanStatusBadge({ record }: { record: ScanRecord }) {
  if (record.status === "complete") {
    return <Badge>Complete</Badge>;
  }
  return <Badge variant="outline">Not started</Badge>;
}

export function RosterStatusBadge({ employee }: { employee: Employee }) {
  const completed = completedCount(employee);
  if (completed === 0) {
    return <Badge variant="outline">{scanSummaryLabel(employee)}</Badge>;
  }
  if (completed === SCAN_TYPES.length) {
    return <Badge>{scanSummaryLabel(employee)}</Badge>;
  }
  return <Badge variant="secondary">{scanSummaryLabel(employee)}</Badge>;
}
