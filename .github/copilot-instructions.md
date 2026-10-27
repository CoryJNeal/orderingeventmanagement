# Copilot instructions — Event Scan Desk

This repository is a **Next.js 16 client-side prototype** for field reps running footwear and eyewear scans at customer events. There is **no backend, database, or API**. Employee data is a seeded in-memory roster; auth, events, and scan completions persist in `localStorage`.

## Stack and conventions

- Next.js App Router (`app/`), React 19, TypeScript, Tailwind CSS 4, shadcn/Base UI components in `components/ui/`.
- Path alias `@/` maps to the repo root.
- Prefer client components (`"use client"`) for anything that reads `localStorage` or `window`.
- Route helpers live in `lib/account.ts`. Domain types live in `lib/types.ts`.
- UI copy uses US English. Customer numbers are 6 digits; location numbers are 5 digits.

## Product rules (do not violate)

- **Scan ID** (`SC-XXXXXX`) is for the vendor pressure-scan app. It is **not** the HR employee ID (`E-#####`). Generate it with `generateScanId` in `lib/scan-id.ts` (FNV-1a over `employeeId:customer:location`).
- Completing a scan only writes an override via `completeScan` in `lib/scans.ts`. Do not mutate the seed roster in `lib/employees.ts`.
- Auth is demo-only: `rep@example.com` / `scan-desk` / OTP `123456`. Session key `event-scan-auth-v1`.
- Events key `event-scan-events-v1`. Scan overrides key `event-scan-overrides-v1`.
- If an event account has `locationNumber: null`, expand to demo locations `00142`, `00143`, `00201`.
- Protected pages wrap content in `AuthGuard`, which redirects unauthenticated users to `/`.
- Footwear pressure is an in-page dialog (large Scan ID + confirm). Footwear sizing and face/PD navigate to mock apps at `/scans/sizing` and `/scans/face-pd`.

## When changing code

- Keep roster identity as `(customerNumber, locationNumber, employee.id)`. The same seed people exist at every valid account; Scan IDs differ by account.
- Subscribe to storage via existing hooks (`useAuth`, `useEvents`, `useLiveEmployees*`) rather than adding a new store.
- Search tokens must match first name, last name, employee ID, Scan ID, email, customer number, and location number (`lib/search.ts`).
- Do not introduce a real backend unless explicitly asked. This is a demo.

## Docs for Copilot knowledge

Load every markdown file under `docs/` plus `README.md` into the Copilot knowledge base. Start with `docs/COPILOT-KNOWLEDGE.md` if you can attach only one file.
