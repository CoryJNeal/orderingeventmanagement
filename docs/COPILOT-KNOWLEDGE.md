# Event Scan Desk — Copilot knowledge pack

Upload this file (or the whole `docs/` folder plus `README.md`) into GitHub Copilot knowledge, Microsoft 365 Copilot, or Copilot Studio.

## What this product is

Event Scan Desk is a **field-ops prototype** for customer events where reps collect:

1. Footwear sizing (mock **StrideFit**)
2. Footwear pressure (vendor app keyed by **Scan ID**)
3. Face and PD / eyewear (mock **OptiFrame**)

A rep signs in with password + one-time code, creates events, looks up employees by event or by customer+location, runs the three scan actions, and exports Scan IDs for the vendor pressure-scan app.

**This is a demo.** There is no API, database, or identity provider. Employee records are generated in the browser from a 10-person seed. Completing a scan updates status in `localStorage` so the roster stays consistent during the session. Auth session and events are also in `localStorage`.

## Demo credentials

- Email: `rep@example.com`
- Password: `scan-desk`
- OTP: `123456`
- Try customer `123456` and location `00142`
- Maya Rivera = all scans complete; Owen Blake = sizing only; Luca Romano = no scans

## Tech stack

- Next.js 16.4.3 App Router, React 19, TypeScript
- Tailwind CSS 4, shadcn / `@base-ui/react`, Lucide
- Dev/start bind `0.0.0.0:43145`
- Alias `@/` = repository root
- No backend

## Domain language

- **Customer number**: 6 digits. **Location number**: 5 digits.
- **Employee ID** (`E-#####`): HR identifier from seed. Do not show this as the vendor key.
- **Scan ID** (`SC-XXXXXX`): vendor lookup key from `generateScanId(employeeId, customerNumber, locationNumber)`.
- **Event**: named date range plus one or more accounts. A null location on an account means all demo locations: `00142`, `00143`, `00201`.
- **Override**: localStorage patch that marks a scan complete without changing seed data.

## localStorage

- `event-scan-auth-v1` — `{ email, authenticatedAt }`
- `event-scan-events-v1` — `ScanEvent[]`
- `event-scan-overrides-v1` — map keyed by `customer:location:employeeId`

Custom events: `event-scan-auth-updated`, `event-scan-events-updated`, `event-scan-updated`, plus `storage`.

## Scan types

`footwear-sizing` | `footwear-pressure` | `face-pd`

Status is only `not-started` or `complete`. `completeScan` sets `lastScanDate` to now (ISO).

## Routes (happy path)

`/` login → `/home` dashboard → `/events/new` or `/lookup` → event roster `/events/:id` or account roster `/accounts/:c/:l` → employee `/accounts/:c/:l/employees/:id` → mock scans `/scans/sizing` and `/scans/face-pd` (query: `customer`, `location`, `employeeId`). Pressure is a dialog, not a route. Exports at `.../export`.

`AuthGuard` protects home, lookup, events, and accounts. Login redirects authenticated users to `/home`.

## Seed employees (same 10 at every account)

Maya Rivera, James Chen, Priya Nair, Owen Blake, Sofia Alvarez, Malik Johnson, Hannah Patel, Luca Romano, Elena Brooks, Noah Kim. IDs `E-10482` through `E-15209` as listed in `lib/employees.ts`.

## Coding constraints for assistants

- Prefer existing hooks over new state libraries.
- Clone seed onto accounts; never persist a global employee table.
- Keep Scan ID generation in `lib/scan-id.ts`.
- Validate customer/location with `lib/account.ts` helpers.
- Search must remain multi-token AND over name, IDs, email, and account numbers.
- Do not treat this as production-ready security.

## File map (high level)

- `lib/types.ts` types
- `lib/employees.ts` seed + live getters
- `lib/events.ts` events + location expansion
- `lib/scans.ts` labels + overrides
- `lib/auth.ts` demo login
- `hooks/use-live-employees.ts` reactive roster
- `components/employee-profile.tsx` scan actions
- `components/mock-scan-app.tsx` StrideFit / OptiFrame stand-ins
- `components/pressure-scan-dialog.tsx` vendor Scan ID confirm

See `docs/ARCHITECTURE.md`, `docs/DATA-MODEL.md`, `docs/USER-FLOWS.md`, and `docs/ROUTES-AND-FILES.md` for detail.
