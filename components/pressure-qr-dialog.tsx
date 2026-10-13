"use client";

import { EmployeeQr } from "@/components/employee-qr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildQrPayload } from "@/lib/qr";
import type { Employee } from "@/lib/types";

export function PressureQrDialog({
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
  const payload = buildQrPayload(employee);
  const fields = [
    ["Last name", payload.lastName],
    ["Employee ID", payload.employeeId],
    ["Email", payload.email],
    ["Customer #", payload.customerNumber],
    ["Location #", payload.locationNumber],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Footwear pressure</DialogTitle>
          <DialogDescription>
            The vendor scans this code to pick up last name, employee ID, email,
            customer number, and location number.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <EmployeeQr employee={employee} size={180} />
          <dl className="grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {fields.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium break-all">{value}</dd>
              </div>
            ))}
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
