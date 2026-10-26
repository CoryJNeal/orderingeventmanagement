import { AuthGuard } from "@/components/auth-guard";
import { ExportList } from "@/components/export-list";
import { InvalidAccount } from "@/components/invalid-account";
import {
  accountPath,
  isCustomerNumber,
  isLocationNumber,
} from "@/lib/account";
import { getEmployees } from "@/lib/employees";

export default async function ExportPage({
  params,
}: {
  params: Promise<{ customer: string; location: string }>;
}) {
  const { customer, location } = await params;

  if (!isCustomerNumber(customer) || !isLocationNumber(location)) {
    return (
      <AuthGuard>
        <InvalidAccount />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ExportList
        title="Scan ID export"
        subtitle={`Customer ${customer}, location ${location}. Scan ID, customer number, and location number for the vendor app.`}
        backHref={accountPath(customer, location)}
        customerNumber={customer}
        locationNumber={location}
        employees={getEmployees(customer, location)}
      />
    </AuthGuard>
  );
}
