import { Suspense } from "react";

import { EmployeeRoster } from "@/components/employee-roster";
import { InvalidAccount } from "@/components/invalid-account";
import { isCustomerNumber, isLocationNumber } from "@/lib/account";

async function RosterBody({
  params,
}: {
  params: Promise<{ customer: string; location: string }>;
}) {
  const { customer, location } = await params;

  if (!isCustomerNumber(customer) || !isLocationNumber(location)) {
    return <InvalidAccount />;
  }

  return (
    <EmployeeRoster customerNumber={customer} locationNumber={location} />
  );
}

export default function RosterPage({
  params,
}: {
  params: Promise<{ customer: string; location: string }>;
}) {
  return (
    <Suspense fallback={<PageFallback label="Loading employee roster…" />}>
      <RosterBody params={params} />
    </Suspense>
  );
}

function PageFallback({ label }: { label: string }) {
  return (
    <div className="flex min-h-full items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
