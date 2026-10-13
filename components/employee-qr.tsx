"use client";

import { QRCodeSVG } from "qrcode.react";

import { qrValue } from "@/lib/qr";
import type { Employee } from "@/lib/types";

export function EmployeeQr({
  employee,
  size = 168,
}: {
  employee: Employee;
  size?: number;
}) {
  return (
    <div className="inline-flex rounded-lg bg-white p-2 ring-1 ring-border">
      <QRCodeSVG
        value={qrValue(employee)}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#1b2744"
        title={`Pressure scan fields for ${employee.lastName} ${employee.id}`}
      />
    </div>
  );
}
