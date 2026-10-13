import { Suspense } from "react";

import { MockScanApp } from "@/components/mock-scan-app";

export default function FacePdScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-slate-950 text-slate-200">
          Opening OptiFrame PD…
        </div>
      }
    >
      <MockScanApp scanType="face-pd" />
    </Suspense>
  );
}
