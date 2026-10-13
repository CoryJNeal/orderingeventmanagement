import Link from "next/link";

import { Glasses, Footprints } from "lucide-react";

type SiteHeaderProps = {
  customerNumber?: string;
  locationNumber?: string;
};

export function SiteHeader({
  customerNumber,
  locationNumber,
}: SiteHeaderProps) {
  return (
    <header className="border-b bg-card/80 print:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
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
        {customerNumber && locationNumber ? (
          <div className="text-right text-xs sm:text-sm">
            <p className="font-medium">Customer {customerNumber}</p>
            <p className="text-muted-foreground">Location {locationNumber}</p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
