import { redirect } from "next/navigation";

import { LookupForm } from "@/components/lookup-form";
import {
  accountPath,
  isCustomerNumber,
  isLocationNumber,
} from "@/lib/account";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string; location?: string }>;
}) {
  const query = await searchParams;
  const customer = query.customer?.trim() ?? "";
  const location = query.location?.trim() ?? "";

  if (isCustomerNumber(customer) && isLocationNumber(location)) {
    redirect(accountPath(customer, location));
  }

  return (
    <div className="grid min-h-svh w-full place-items-center px-4">
      <LookupForm />
    </div>
  );
}
