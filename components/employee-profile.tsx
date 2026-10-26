"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Glasses, Footprints, ScanLine } from "lucide-react";

import { PressureScanDialog } from "@/components/pressure-scan-dialog";
import { ScanStatusBadge } from "@/components/scan-status-badge";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLiveEmployee } from "@/hooks/use-live-employees";
import { accountPath, mockScanPath } from "@/lib/account";
import { employeeDisplayName } from "@/lib/employees";
import { SCAN_BLURBS, SCAN_LABELS, formatScanDate } from "@/lib/scans";
import { cn } from "@/lib/utils";
import type { Employee, ScanType } from "@/lib/types";

const SCAN_ICONS: Record<ScanType, typeof Footprints> = {
  "footwear-sizing": Footprints,
  "footwear-pressure": ScanLine,
  "face-pd": Glasses,
};

export function EmployeeProfile({
  customerNumber,
  locationNumber,
  employeeId,
  initialEmployee,
}: {
  customerNumber: string;
  locationNumber: string;
  employeeId: string;
  initialEmployee: Employee | null;
}) {
  const { employee: liveEmployee, markComplete } = useLiveEmployee(
    customerNumber,
    locationNumber,
    employeeId
  );
  const [pressureOpen, setPressureOpen] = useState(false);
  const employee = liveEmployee ?? initialEmployee;

  if (!employee) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader
          customerNumber={customerNumber}
          locationNumber={locationNumber}
        />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Employee not found</CardTitle>
              <CardDescription>
                {employeeId} is not on the spoofed roster for this account.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href={accountPath(customerNumber, locationNumber)}
                className={cn(buttonVariants())}
              >
                Back to roster
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  const fields = [
    ["First name", employee.firstName],
    ["Last name", employee.lastName],
    ["Scan ID", employee.scanId],
    ["Employee ID", employee.id],
    ["Email", employee.email],
    ["Customer #", employee.customerNumber],
    ["Location #", employee.locationNumber],
  ];

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        customerNumber={customerNumber}
        locationNumber={locationNumber}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
        <div>
          <Link
            href={accountPath(customerNumber, locationNumber)}
            className={cn(buttonVariants({ variant: "ghost" }), "mb-2 -ml-2")}
          >
            <ArrowLeft data-icon="inline-start" />
            Back to roster
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {employeeDisplayName(employee)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a scan for this employee. Using a scan link updates status
            and last scan date for the demo.
          </p>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Employee profile</CardTitle>
            <CardDescription>
              Scan ID links this person in the vendor pressure-scan app. It is
              not the HR employee ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                    {label}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1 font-medium break-all",
                      label === "Scan ID" && "font-mono tracking-wide"
                    )}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {(["footwear-sizing", "footwear-pressure", "face-pd"] as const).map(
            (scanType) => {
              const Icon = SCAN_ICONS[scanType];
              const record = employee.scans[scanType];
              return (
                <Card key={scanType} className="h-full">
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="size-4" />
                      </span>
                      <ScanStatusBadge record={record} />
                    </div>
                    <CardTitle>{SCAN_LABELS[scanType]}</CardTitle>
                    <CardDescription>{SCAN_BLURBS[scanType]}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto text-sm">
                    <p className="text-muted-foreground">Last scan date</p>
                    <p className="font-medium">
                      {formatScanDate(record.lastScanDate)}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    {scanType === "footwear-pressure" ? (
                      <button
                        type="button"
                        className={cn(buttonVariants(), "w-full")}
                        onClick={() => setPressureOpen(true)}
                      >
                        Show Scan ID
                      </button>
                    ) : (
                      <Link
                        href={mockScanPath(
                          scanType === "footwear-sizing" ? "sizing" : "face-pd",
                          customerNumber,
                          locationNumber,
                          employee.id
                        )}
                        className={cn(buttonVariants(), "w-full")}
                      >
                        {scanType === "footwear-sizing"
                          ? "Open sizing app"
                          : "Open face and PD app"}
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              );
            }
          )}
        </section>
      </main>
      <PressureScanDialog
        employee={employee}
        open={pressureOpen}
        onOpenChange={setPressureOpen}
        onVendorComplete={() => markComplete("footwear-pressure")}
      />
    </div>
  );
}
