"use client";

import Link from "next/link";
import { Printer } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employeeDisplayName } from "@/lib/employees";
import { cn } from "@/lib/utils";
import type { Employee } from "@/lib/types";

export function ExportList({
  title,
  subtitle,
  backHref,
  customerNumber,
  locationNumber,
  eventName,
  employees,
}: {
  title: string;
  subtitle: string;
  backHref: string;
  customerNumber?: string;
  locationNumber?: string;
  eventName?: string;
  employees: Employee[];
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        customerNumber={customerNumber}
        locationNumber={locationNumber}
        eventName={eventName}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={backHref}
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
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm">{subtitle}</p>
        </div>

        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Scan ID</TableHead>
                <TableHead>Customer #</TableHead>
                <TableHead>Location #</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Employee ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  key={`${employee.customerNumber}:${employee.locationNumber}:${employee.id}`}
                >
                  <TableCell className="font-medium">
                    {employeeDisplayName(employee)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {employee.scanId}
                  </TableCell>
                  <TableCell>{employee.customerNumber}</TableCell>
                  <TableCell>{employee.locationNumber}</TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
                    {employee.id}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
