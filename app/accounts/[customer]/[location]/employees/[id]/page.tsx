import { AuthGuard } from "@/components/auth-guard";
import { EmployeeProfile } from "@/components/employee-profile";
import { InvalidAccount } from "@/components/invalid-account";
import { isCustomerNumber, isLocationNumber } from "@/lib/account";
import { getEmployees } from "@/lib/employees";

export default async function EmployeePage({
  params,
}: {
  params: Promise<{ customer: string; location: string; id: string }>;
}) {
  const { customer, location, id } = await params;

  if (!isCustomerNumber(customer) || !isLocationNumber(location)) {
    return (
      <AuthGuard>
        <InvalidAccount />
      </AuthGuard>
    );
  }

  const initialEmployee =
    getEmployees(customer, location).find((person) => person.id === id) ?? null;

  return (
    <AuthGuard>
      <EmployeeProfile
        customerNumber={customer}
        locationNumber={location}
        employeeId={id}
        initialEmployee={initialEmployee}
      />
    </AuthGuard>
  );
}
