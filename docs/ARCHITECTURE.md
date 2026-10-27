# Architecture

Event Scan Desk is a single-page-style Next.js App Router app. All durable demo state lives in the browser.

```
Browser
  ├── /                  Login (password + OTP)
  ├── /home              Dashboard: create event, lookup, recent events
  ├── /lookup            Lookup by event or customer+location
  ├── /events/new        Create event
  ├── /events/:id        Event roster (all expanded account pairs)
  ├── /events/:id/export Printable Scan ID list for the event
  ├── /accounts/:c/:l    Location roster
  ├── /accounts/:c/:l/employees/:id  Employee profile + scan actions
  ├── /accounts/:c/:l/export         Printable Scan ID list for the location
  ├── /scans/sizing      Mock StrideFit sizing app
  └── /scans/face-pd     Mock OptiFrame face/PD app
```

## Layers

| Layer | Location | Role |
| --- | --- | --- |
| Routes | `app/**/page.tsx` | Thin pages. Authenticated routes wrap UI in `AuthGuard`. |
| Feature UI | `components/*.tsx` | Forms, roster, profile, mock scan apps, header. |
| Primitives | `components/ui/*` | shadcn / Base UI. |
| Hooks | `hooks/*` | `useSyncExternalStore` over localStorage helpers. |
| Domain | `lib/*` | Types, seed employees, events, scans, Scan IDs, search, paths. |

There is no server data fetching. `getEmployees` clones the same 10 seed people onto whatever customer/location pair the UI requested.

## Auth

1. `/` shows `LoginForm`.
2. `verifyPassword` then `verifyOtp` in `lib/auth.ts`.
3. `writeSession` stores `{ email, authenticatedAt }` under `event-scan-auth-v1`.
4. `AuthGuard` redirects to `/` when `readSession()` is null.
5. Signed-in users hitting `/` are sent to `/home`.

This is not production auth. Credentials are hardcoded demo constants.

## Live data

Scan completions dispatch `event-scan-updated`. Event writes dispatch `event-scan-events-updated`. Auth writes dispatch `event-scan-auth-updated`. Hooks also listen to the `storage` event so other tabs stay in sync.

`useLiveEmployees` caches snapshots keyed by a version counter that increments on those events.

## Scan actions

| Scan | UI | Completion |
| --- | --- | --- |
| Footwear sizing | Navigate to `/scans/sizing?customer=&location=&employeeId=` | `completeScan(..., "footwear-sizing")` then return to profile |
| Footwear pressure | `PressureScanDialog` on the profile | Confirm vendor completion → `completeScan(..., "footwear-pressure")` |
| Face and PD | Navigate to `/scans/face-pd?...` | `completeScan(..., "face-pd")` then return to profile |

## UI stack

- Next.js 16.4.3, React 19, TypeScript
- Tailwind CSS 4 (`@tailwindcss/turbopack`)
- Lucide icons
- Dev server: `npm run dev` → `0.0.0.0:43145`
