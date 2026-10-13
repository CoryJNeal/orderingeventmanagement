"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { employeePath, isCustomerNumber, isLocationNumber } from "@/lib/account";
import { employeeDisplayName, getLiveEmployee } from "@/lib/employees";
import { completeScan, SCAN_LABELS } from "@/lib/scans";
import { cn } from "@/lib/utils";
import type { ScanType } from "@/lib/types";

const APP_COPY: Record<
  "footwear-sizing" | "face-pd",
  {
    product: string;
    url: string;
    instruction: string;
    action: string;
  }
> = {
  "footwear-sizing": {
    product: "StrideFit Sizing",
    url: "https://stridefit.example/scan",
    instruction:
      "Have the employee stand in the floor frame. This page stands in for the external sizing app.",
    action: "Complete footwear sizing scan",
  },
  "face-pd": {
    product: "OptiFrame PD",
    url: "https://optiframe.example/scan",
    instruction:
      "Center the employee’s face at eye level. This page stands in for the external face and PD app.",
    action: "Complete face and PD scan",
  },
};

export function MockScanApp({
  scanType,
}: {
  scanType: Extract<ScanType, "footwear-sizing" | "face-pd">;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const copy = APP_COPY[scanType];

  const customerNumber = searchParams.get("customer") ?? "";
  const locationNumber = searchParams.get("location") ?? "";
  const employeeId = searchParams.get("employeeId") ?? "";

  const employee = useMemo(() => {
    if (
      !isCustomerNumber(customerNumber) ||
      !isLocationNumber(locationNumber) ||
      !employeeId
    ) {
      return null;
    }
    return getLiveEmployee(customerNumber, locationNumber, employeeId);
  }, [customerNumber, employeeId, locationNumber]);

  function finish() {
    if (!employee) return;
    setBusy(true);
    completeScan(customerNumber, locationNumber, employee.id, scanType);
    router.push(employeePath(customerNumber, locationNumber, employee.id));
  }

  const backHref =
    employee && isCustomerNumber(customerNumber) && isLocationNumber(locationNumber)
      ? employeePath(customerNumber, locationNumber, employee.id)
      : "/";

  return (
    <div className="flex min-h-full flex-col bg-slate-950 text-slate-50">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-xl items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">
              External app
            </p>
            <h1 className="text-lg font-semibold">{copy.product}</h1>
            <p className="font-mono text-xs text-slate-400">{copy.url}</p>
          </div>
          <p className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
            {SCAN_LABELS[scanType]}
          </p>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-10">
        <Card className="bg-slate-900 text-slate-50 ring-white/10">
          <CardHeader>
            <CardTitle>
              {employee
                ? `Scan ${employeeDisplayName(employee)}`
                : "Missing employee context"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {employee
                ? copy.instruction
                : "This fake scan link needs a customer number, location number, and employee ID."}
            </CardDescription>
          </CardHeader>
          {employee ? (
            <CardContent className="grid gap-3 text-sm">
              <p>
                <span className="text-slate-400">Employee ID</span>
                <span className="mt-0.5 block font-mono">{employee.id}</span>
              </p>
              <p>
                <span className="text-slate-400">Account</span>
                <span className="mt-0.5 block">
                  Customer {employee.customerNumber} · Location{" "}
                  {employee.locationNumber}
                </span>
              </p>
            </CardContent>
          ) : null}
          <CardFooter className="justify-between gap-2 border-white/10 bg-white/5">
            <Link
              href={backHref}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-white/20 bg-transparent text-slate-50 hover:bg-white/10"
              )}
            >
              Cancel
            </Link>
            <Button onClick={finish} disabled={!employee || busy}>
              {copy.action}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
