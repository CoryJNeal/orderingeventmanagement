import type { Employee } from "@/lib/types";

function haystack(employee: Employee) {
  return [
    employee.firstName,
    employee.lastName,
    `${employee.firstName} ${employee.lastName}`,
    `${employee.lastName}, ${employee.firstName}`,
    employee.id,
    employee.scanId,
    employee.email,
    employee.customerNumber,
    employee.locationNumber,
  ]
    .join(" ")
    .toLowerCase();
}

export function searchEmployees(employees: Employee[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return employees;

  const tokens = normalized.split(/\s+/);
  return employees.filter((employee) => {
    const text = haystack(employee);
    return tokens.every((token) => text.includes(token));
  });
}
