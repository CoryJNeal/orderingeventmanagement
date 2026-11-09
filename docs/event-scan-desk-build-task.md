# Recreate Event Scan Desk in the production environment

**Reference prototype:** this repository (`event-scan-desk`).  
**Audience:** developers implementing the field workflow in the real ordering / event system.  
**Outcome:** a rep at a customer event looks up a location, finds an employee, runs the three scans, and can hand the pressure-scan vendor a QR code for every employee at that location. Scan status stays with the employee after the rep leaves the page.

The prototype is the behavior spec. It is not the production architecture. Employee rows are generated in the browser, completed scans are stored in `localStorage` under `event-scan-overrides-v1`, and the sizing and face/PD screens are stand-ins for external apps.

## Demo path to walk before building

```bash
npm install
npm run dev
```

Open the app and use customer `123456` and location `00142`.

| Employee | ID | Starting state |
| --- | --- | --- |
| Maya Rivera | E-10482 | All three scans complete |
| Owen Blake | E-12114 | Sizing only |
| Luca Romano | E-14016 | No scans |

Complete a scan for Luca, return to the roster, and confirm his status and last scan date changed. Export the list and confirm the printed page still includes every employee, including people hidden by search.

## Screens

### 1. Account lookup (`/`)

Centered form. Two fields:

- Customer number: exactly 6 digits.
- Location number: exactly 5 digits.

Typing strips non-digits and stops at the max length. Submit with invalid values stays on the form and shows “Enter the 6-digit customer number.” and/or “Enter the 5-digit location number.” A valid submit goes to `/accounts/{customer}/{location}`.

A direct URL with the wrong shape shows “Account numbers are not valid” and a link back to lookup. Any 6-digit / 5-digit pair is accepted in the prototype because the roster is spoofed. Production should resolve the pair against real accounts and show a clear not-found state when the location does not exist.

### 2. Employee roster (`/accounts/{customer}/{location}`)

Header shows the product name plus the current customer and location. Actions: change account, export the full list.

Search matches every whitespace-separated token against first name, last name, `"First Last"`, `"Last, First"`, employee ID, email, customer number, and location number. Matching is case-insensitive and substring-based. The page reports “Showing N of M employees.” An empty result offers clear search.

Table columns: employee name, employee ID, email (hidden on small screens; email moves under the name), scan status, last scan date (hidden on the narrowest layout). The whole row opens the employee. Status labels:

- `No scans`
- `1 of 3 complete` or `2 of 3 complete`
- `All scans complete`

Last scan date is the latest of the three scan timestamps, formatted in UTC as `Mon D, YYYY, h:mm AM/PM`. No scans shows `Never`.

### 3. Employee profile (`/accounts/{customer}/{location}/employees/{id}`)

Show first name, last name, employee ID, email, customer number, and location number. Unknown IDs show “Employee not found” and return to the roster.

Three cards, each with status, last scan date, and one action:

| Scan | Action in the prototype | What production must do |
| --- | --- | --- |
| Footwear sizing | Opens `/scans/sizing` (fake “StrideFit Sizing” at `https://stridefit.example/scan`) | Hand the employee off to the real sizing app with customer, location, and employee ID. When that app reports completion, mark `footwear-sizing` complete and set last scan date. |
| Footwear pressure | Dialog with a QR code. “Vendor completed scan” marks it done. | Show the same QR payload. Mark `footwear-pressure` complete only from a real vendor completion signal. The prototype button is a stand-in for that signal. |
| Face and PD scan | Opens `/scans/face-pd` (fake “OptiFrame PD” at `https://optiframe.example/scan`) | Same handoff pattern as sizing, for the real face and PD app. |

Cancel on a fake scan page returns to the profile and does not change status. Complete writes the scan and returns to the profile.

### 4. Pressure export (`/accounts/{customer}/{location}/export`)

Printable cards for the **full** roster. Search on the roster does not filter this page. Each card shows name, employee ID, QR code, and the five payload fields. Screen chrome (header, back, print button) is omitted from print. Print title: “Footwear pressure QR codes” plus customer and location.

## Data the production build has to persist

Per employee, scoped to a customer location:

```ts
type ScanType = "footwear-sizing" | "footwear-pressure" | "face-pd";
type ScanStatus = "not-started" | "complete";

type ScanRecord = {
  status: ScanStatus;
  lastScanDate: string | null; // ISO-8601
};

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customerNumber: string; // 6 digits
  locationNumber: string; // 5 digits
  scans: Record<ScanType, ScanRecord>;
};
```

Prototype storage keys overrides as `{customer}:{location}:{employeeId}`. Seed status is the baseline; a completion replaces that scan only. Completing a scan twice keeps it complete and refreshes `lastScanDate`. There is no “undo” in the prototype.

Production persistence has to survive a new browser, a second rep, and a later event day. `localStorage` is demo-only.

## QR contract

Pressure QR value is compact JSON, error correction level M, of:

```json
{
  "lastName": "Rivera",
  "employeeId": "E-10482",
  "email": "maya.rivera@example.com",
  "customerNumber": "123456",
  "locationNumber": "00142"
}
```

Field names and string types are the contract the vendor scanner reads. The same payload is used in the profile dialog and on every export card. Do not add extra fields unless the vendor confirms their scanner ignores unknown keys.

## Acceptance checks

1. Lookup rejects a short, long, or non-numeric customer or location number and explains which field failed.
2. A real customer/location pair opens that location’s employees. A pair that does not exist does not show another location’s people.
3. Search finds an employee by last name, `Last, First`, employee ID, and email, including multi-word queries where every token must match.
4. Roster status and last scan date match the stored scan records, including a mix of complete and not-started scans.
5. Opening sizing or face/PD passes customer number, location number, and employee ID to the external app. Completing the scan there updates only that scan. Cancel leaves status unchanged.
6. The pressure QR decodes to the five-field JSON above for that employee.
7. Export includes every employee at the location, prints without the app header, and keeps each employee card intact across page breaks.
8. A second device or browser session sees the same completion state.

## Decisions to settle in our environment

These are not answered by the prototype. Pick them before wiring the screens to live data.

1. **Employee source.** Which system returns the roster for a customer number and location number, and which field is the employee ID the vendor already uses?
2. **Who may open a location.** Rep sign-in, and whether a rep can query any valid account or only assigned events.
3. **Completion signal.** How StrideFit, the pressure vendor, and OptiFrame report that a scan finished: redirect back with a signed result, webhook, or a status we poll. The prototype’s “Complete scan” and “Vendor completed scan” buttons exist only because those signals are absent.
4. **Write path.** Where scan status and last scan date are stored, and whether a later event resets `not-started` or keeps history.
5. **QR stability.** Confirm the vendor accepts this JSON. If they already scan a different payload, match that payload and document it here.
6. **Clock.** The prototype formats scan times in UTC so server and browser rendering match. Production can show the event’s local time if the stored value remains a timezone-aware timestamp.

## Suggested build slices

1. Account lookup and real location resolution.
2. Read-only roster and profile from the employee source, with scan status still empty.
3. Persist scan records and show them on the roster and profile.
4. Pressure QR dialog and full-list print export against the QR contract.
5. Replace the fake sizing and face/PD pages with the real app handoff and completion signal.
