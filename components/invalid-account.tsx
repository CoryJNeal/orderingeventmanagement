import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lookupPath } from "@/lib/account";
import { cn } from "@/lib/utils";

export function InvalidAccount() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Account numbers are not valid</CardTitle>
            <CardDescription>
              Customer number must be 6 digits and location number must be 5
              digits.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={lookupPath()} className={cn(buttonVariants())}>
              Return to employee look up
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
