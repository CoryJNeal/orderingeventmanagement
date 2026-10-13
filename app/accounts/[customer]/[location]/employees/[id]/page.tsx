import { Suspense } from "react";

import { EmployeeProfile } from "@/components/employee-profile";
import { InvalidAccount } from "@/components/invalid-account";
import { isCustomerNumber, isLocationNumber } from "@/lib/account";

async function EmployeeBody({
  params,
}: {
  params: Promise<{ customer: string; location: string; id: string }>;
}) {
  const { customer, location, id } = await params;

  if (!isCustomerNumber(customer) || !isLocationNumber(location)) {
    return <InvalidAccount />;
  }

  return (
    <EmployeeProfile
      customerNumber={customer}
      locationNumber={location}
      employeeId={id}
    />
  );
}

export default function EmployeePage({
  params,
}: {
  params: Promise<{ customer: string; location: string; id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center text-sm text-muted-foreground">
          Loading employee profile…
        </div>
      }
    >
      <EmployeeBody params={params} />
    </Suspense>
  );
}
