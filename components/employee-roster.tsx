"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { QrCode, Search } from "lucide-react";

import { RosterStatusBadge } from "@/components/scan-status-badge";
import { SiteHeader } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLiveEmployees } from "@/hooks/use-live-employees";
import { employeePath, exportPath } from "@/lib/account";
import { employeeDisplayName } from "@/lib/employees";
import { formatScanDate, latestScanDate } from "@/lib/scans";
import { searchEmployees } from "@/lib/search";
import type { Employee } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EmployeeRoster({
  customerNumber,
  locationNumber,
  initialEmployees,
}: {
  customerNumber: string;
  locationNumber: string;
  initialEmployees: Employee[];
}) {
  const router = useRouter();
  const liveEmployees = useLiveEmployees(customerNumber, locationNumber);
  const employees =
    liveEmployees.length > 0 ? liveEmployees : initialEmployees;
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => searchEmployees(employees, query),
    [employees, query]
  );

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        customerNumber={customerNumber}
        locationNumber={locationNumber}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Employee roster
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Search by name, employee ID, email, customer number, or location
              number. Open a person to run scans, or export the full list with
              pressure-scan QR codes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Change account
            </Link>
            <Link
              href={exportPath(customerNumber, locationNumber)}
              className={cn(buttonVariants())}
            >
              <QrCode data-icon="inline-start" />
              Export full list
            </Link>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="roster-search">Search employees</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="roster-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Last name, employee ID, email…"
              className="h-10 pl-8"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {results.length} of {employees.length} employees
            {query.trim() ? ` matching “${query.trim()}”` : ""}. Export always
            includes the full account list.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          {results.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <p className="font-medium">No employees match those fields</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a last name, employee ID, or email, or clear the search to
                see the full roster.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setQuery("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Scan status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Last scan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((employee) => {
                  const href = employeePath(
                    customerNumber,
                    locationNumber,
                    employee.id
                  );
                  return (
                  <TableRow
                    key={employee.id}
                    className="cursor-pointer"
                    onClick={() => router.push(href)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(href);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={href}
                        className="block hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {employeeDisplayName(employee)}
                      </Link>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {employee.email}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm">
                      {employee.id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {employee.email}
                    </TableCell>
                    <TableCell>
                      <RosterStatusBadge employee={employee} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {formatScanDate(latestScanDate(employee))}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
