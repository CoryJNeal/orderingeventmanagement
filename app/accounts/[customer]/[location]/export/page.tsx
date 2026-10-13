import { ExportList } from "@/components/export-list";
import { InvalidAccount } from "@/components/invalid-account";
import { isCustomerNumber, isLocationNumber } from "@/lib/account";
import { getEmployees } from "@/lib/employees";

export default async function ExportPage({
  params,
}: {
  params: Promise<{ customer: string; location: string }>;
}) {
  const { customer, location } = await params;

  if (!isCustomerNumber(customer) || !isLocationNumber(location)) {
    return <InvalidAccount />;
  }

  return (
    <ExportList
      customerNumber={customer}
      locationNumber={location}
      employees={getEmployees(customer, location)}
    />
  );
}
