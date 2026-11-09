# Routes and files

## App routes

| Path | File | Guarded | Primary component |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | No (login) | `LoginForm` |
| `/home` | `app/home/page.tsx` | Yes | `HomeDashboard` |
| `/lookup` | `app/lookup/page.tsx` | Yes | `EmployeeLookupForm` |
| `/events/new` | `app/events/new/page.tsx` | Yes | `CreateEventForm` |
| `/events/[eventId]` | `app/events/[eventId]/page.tsx` | Yes | `EventRosterPage` |
| `/events/[eventId]/export` | `app/events/[eventId]/export/page.tsx` | Yes | `EventExportPage` |
| `/accounts/[customer]/[location]` | `app/accounts/[customer]/[location]/page.tsx` | Yes | `EmployeeRoster` |
| `/accounts/[customer]/[location]/employees/[id]` | `.../employees/[id]/page.tsx` | Yes | `EmployeeProfile` |
| `/accounts/[customer]/[location]/export` | `.../export/page.tsx` | Yes | `ExportList` |
| `/scans/sizing` | `app/scans/sizing/page.tsx` | No* | `MockScanApp` |
| `/scans/face-pd` | `app/scans/face-pd/page.tsx` | No* | `MockScanApp` |

\* Mock scan pages are not wrapped in `AuthGuard`. They still need valid query params (`customer`, `location`, `employeeId`) to load an employee and complete a scan.

Path builders: `lib/account.ts`.

## Domain modules (`lib/`)

| File | Responsibility |
| --- | --- |
| `types.ts` | Shared types |
| `auth.ts` | Demo credentials, session CRUD |
| `employees.ts` | Seed roster, clone onto accounts/events |
| `events.ts` | Event CRUD, location expansion |
| `scans.ts` | Labels, overrides, `completeScan` |
| `scan-id.ts` | `SC-` IDs |
| `account.ts` | Validation + URLs |
| `search.ts` | Roster filter |
| `utils.ts` | `cn()` |

## Hooks

| Hook | Backing store |
| --- | --- |
| `useAuth` | `lib/auth.ts` |
| `useEvents` / `useEvent` | `lib/events.ts` |
| `useLiveEmployees*` / `useLiveEmployee` | seed + `lib/scans.ts` overrides |

## Scripts

```bash
npm install
npm run dev      # 0.0.0.0:43145
npm run build
npm run start    # 0.0.0.0:43145
npm run lint
```
