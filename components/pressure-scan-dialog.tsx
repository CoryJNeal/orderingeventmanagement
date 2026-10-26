"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { employeeDisplayName } from "@/lib/employees";
import type { Employee } from "@/lib/types";

export function PressureScanDialog({
  employee,
  open,
  onOpenChange,
  onVendorComplete,
}: {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorComplete: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Footwear pressure</DialogTitle>
          <DialogDescription>
            Show this Scan ID on the employee so the vendor can find them in
            their application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <p className="text-sm text-muted-foreground">
            {employeeDisplayName(employee)}
          </p>
          <p className="rounded-xl bg-muted px-6 py-5 font-mono text-3xl font-semibold tracking-[0.18em] sm:text-4xl">
            {employee.scanId}
          </p>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Search for your scan ID and then proceed with scanning.
          </p>
          <dl className="grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Customer #</dt>
            <dd className="font-medium">{employee.customerNumber}</dd>
            <dt className="text-muted-foreground">Location #</dt>
            <dd className="font-medium">{employee.locationNumber}</dd>
          </dl>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onVendorComplete();
              onOpenChange(false);
            }}
          >
            Vendor completed scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
