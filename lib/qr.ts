import type { Employee, QrPayload } from "@/lib/types";

export function buildQrPayload(employee: Employee): QrPayload {
  return {
    lastName: employee.lastName,
    employeeId: employee.id,
    email: employee.email,
    customerNumber: employee.customerNumber,
    locationNumber: employee.locationNumber,
  };
}

export function qrValue(employee: Employee) {
  return JSON.stringify(buildQrPayload(employee));
}
