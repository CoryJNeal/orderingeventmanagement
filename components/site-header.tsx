"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Glasses, Footprints } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  createEventPath,
  homePath,
  lookupPath,
} from "@/lib/account";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  customerNumber?: string;
  locationNumber?: string;
  eventName?: string;
  showNav?: boolean;
};

export function SiteHeader({
  customerNumber,
  locationNumber,
  eventName,
  showNav = true,
}: SiteHeaderProps) {
  const router = useRouter();
  const { session, isAuthenticated, signOut } = useAuth();

  function handleSignOut() {
    signOut();
    router.replace("/");
  }

  return (
    <header className="border-b bg-card/80 print:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={isAuthenticated ? homePath() : "/"}
            className="flex items-center gap-3"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="flex -space-x-1">
                <Footprints className="size-3.5" />
                <Glasses className="size-3.5" />
              </span>
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">
                Event Scan Desk
              </span>
              <span className="block text-xs text-muted-foreground">
                Footwear and eyewear field scans
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {eventName ? (
              <div className="hidden text-right text-xs sm:block sm:text-sm">
                <p className="font-medium">{eventName}</p>
                <p className="text-muted-foreground">Event roster</p>
              </div>
            ) : customerNumber && locationNumber ? (
              <div className="hidden text-right text-xs sm:block sm:text-sm">
                <p className="font-medium">Customer {customerNumber}</p>
                <p className="text-muted-foreground">Location {locationNumber}</p>
              </div>
            ) : null}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-muted-foreground md:inline">
                  {session?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {showNav && isAuthenticated ? (
          <nav className="flex flex-wrap gap-1 border-t pt-3">
            <Link
              href={homePath()}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Home
            </Link>
            <Link
              href={createEventPath()}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Create an event
            </Link>
            <Link
              href={lookupPath()}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Employee look up
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
