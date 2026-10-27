# User flows

Demo credentials (also in `README.md` and `lib/auth.ts`):

- Email: `rep@example.com`
- Password: `scan-desk`
- OTP: `123456`

Suggested lookup: customer `123456`, location `00142`.

## 1. Sign in

1. Open `/`.
2. Submit email + password (`verifyPassword`).
3. Enter OTP (`verifyOtp`). Login pre-fills OTP after a valid password.
4. Session written; navigate to `/home`.

Sign out is in `SiteHeader` and calls `clearSession`.

## 2. Create an event

1. From `/home`, open Create an event (`/events/new`).
2. Enter name, start date, end date.
3. Add one or more customer/location pairs. Location may be omitted (stored as `null`) to include every demo location for that customer.
4. `saveEvent` prepends the event to localStorage and the user is taken to the event roster.

## 3. Look up employees

`/lookup` has two modes:

- **Event** — pick a saved event → `/events/:eventId`
- **Account** — 6-digit customer + 5-digit location → `/accounts/:customer/:location`

Invalid account format is rejected in the form. Unknown-format routes can still render `InvalidAccount`.

## 4. Roster and search

Event and account rosters share `EmployeeRoster`. Search (`lib/search.ts`) is AND over whitespace tokens against:

first name, last name, combined names, employee ID, Scan ID, email, customer number, location number.

Each row links to `/accounts/:customer/:location/employees/:id` (even when the user arrived via an event).

## 5. Complete scans

On the employee profile:

1. **Footwear sizing** — mock StrideFit. Completing marks `footwear-sizing` complete and returns to the profile.
2. **Footwear pressure** — dialog shows the large Scan ID for the vendor app. Confirming marks `footwear-pressure` complete.
3. **Face and PD** — mock OptiFrame. Completing marks `face-pd` complete.

Roster badges (`scanSummaryLabel`) update immediately because overrides are in localStorage.

## 6. Export Scan IDs

- Location: `/accounts/:customer/:location/export`
- Event: `/events/:eventId/export`

Printable list of Scan ID, customer number, and location number for vendor search. Not an HR export.

## Empty / error states

- No events on home: dashed empty card
- Lookup with no event selected: “Select an event.”
- Bad customer/location digits: validation message
- Unknown employee ID on a valid account: “Employee not found”
- Mock scan missing query params: employee is null; finish is disabled
