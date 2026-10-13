import { EmployeeRoster } from "@/components/employee-roster";
import { InvalidAccount } from "@/components/invalid-account";
import { isCustomerNumber, isLocationNumber } from "@/lib/account";
import { getEmployees } from "@/lib/employees";

export default async function RosterPage({
  params,
}: {
  params: Promise<{ customer: string; location: string }>;
}) {
  const { customer, location } = await params;

  if (!isCustomerNumber(customer) || !isLocationNumber(location)) {
    return <InvalidAccount />;
  }

  return (
    <EmployeeRoster
      customerNumber={customer}
      locationNumber={location}
      initialEmployees={getEmployees(customer, location)}
    />
  );
}
