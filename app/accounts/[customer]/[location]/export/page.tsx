import { Suspense } from "react";

import { ExportList } from "@/components/export-list";
import { InvalidAccount } from "@/components/invalid-account";
import { isCustomerNumber, isLocationNumber } from "@/lib/account";
import { getEmployees } from "@/lib/employees";

async function ExportBody({
  params,
}: {
  params: Promise<{ customer: string; location: string }>;
}) {
  const { customer, location } = await params;

  if (!isCustomerNumber(customer) || !isLocationNumber(location)) {
    return <InvalidAccount />;
  }

  const employees = getEmployees(customer, location);

  return (
    <ExportList
      customerNumber={customer}
      locationNumber={location}
      employees={employees}
    />
  );
}

export default function ExportPage({
  params,
}: {
  params: Promise<{ customer: string; location: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center text-sm text-muted-foreground">
          Loading pressure scan export…
        </div>
      }
    >
      <ExportBody params={params} />
    </Suspense>
  );
}
