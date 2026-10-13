"use client";

import Link from "next/link";
import { Printer } from "lucide-react";

import { EmployeeQr } from "@/components/employee-qr";
import { SiteHeader } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { accountPath } from "@/lib/account";
import { employeeDisplayName } from "@/lib/employees";
import { buildQrPayload } from "@/lib/qr";
import { cn } from "@/lib/utils";
import type { Employee } from "@/lib/types";

export function ExportList({
  customerNumber,
  locationNumber,
  employees,
}: {
  customerNumber: string;
  locationNumber: string;
  employees: Employee[];
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        customerNumber={customerNumber}
        locationNumber={locationNumber}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Pressure scan export
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Full roster for customer {customerNumber}, location{" "}
              {locationNumber}. Each employee has a QR code with last name,
              employee ID, email, customer number, and location number.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={accountPath(customerNumber, locationNumber)}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to roster
            </Link>
            <Button onClick={() => window.print()}>
              <Printer data-icon="inline-start" />
              Print or save as PDF
            </Button>
          </div>
        </div>

        <div className="hidden print:block">
          <h1 className="text-xl font-semibold">
            Footwear pressure QR codes
          </h1>
          <p className="text-sm">
            Customer {customerNumber} · Location {locationNumber}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => {
            const payload = buildQrPayload(employee);
            return (
              <article
                key={employee.id}
                className="break-inside-avoid rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">
                      {employeeDisplayName(employee)}
                    </h2>
                    <p className="font-mono text-xs text-muted-foreground">
                      {employee.id}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <EmployeeQr employee={employee} size={148} />
                </div>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
                  <dt className="text-muted-foreground">Last name</dt>
                  <dd>{payload.lastName}</dd>
                  <dt className="text-muted-foreground">Employee ID</dt>
                  <dd className="font-mono">{payload.employeeId}</dd>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="break-all">{payload.email}</dd>
                  <dt className="text-muted-foreground">Customer #</dt>
                  <dd>{payload.customerNumber}</dd>
                  <dt className="text-muted-foreground">Location #</dt>
                  <dd>{payload.locationNumber}</dd>
                </dl>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
