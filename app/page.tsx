import { LookupForm } from "@/components/lookup-form";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:gap-16 lg:py-16">
        <section className="max-w-xl space-y-4">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Customer event intake
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Pull a location roster and run footwear and eyewear scans.
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Reps look up a customer by 6-digit customer number and 5-digit
            location number, search the employee list, complete sizing, pressure,
            or face-and-PD scans, and export QR codes for the pressure vendor.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Search by name, employee ID, email, customer, or location.</li>
            <li>Individual profiles expose the three scan actions.</li>
            <li>
              Export the full list with a pressure-scan QR code on every ID.
            </li>
          </ul>
        </section>
        <LookupForm />
      </main>
    </div>
  );
}
