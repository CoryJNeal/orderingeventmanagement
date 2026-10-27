# Data model

Source of truth for TypeScript types: `lib/types.ts`.

## ScanType

`"footwear-sizing" | "footwear-pressure" | "face-pd"`

Each employee has a `scans` record for all three.

## ScanRecord

| Field | Type | Meaning |
| --- | --- | --- |
| `status` | `"not-started" \| "complete"` | Demo has no in-progress state |
| `lastScanDate` | ISO string or `null` | Set when marked complete |

## Employee

| Field | Example | Notes |
| --- | --- | --- |
| `id` | `E-10482` | HR-style employee ID from seed |
| `scanId` | `SC-1A2B3C` | Vendor lookup ID; derived, not stored on seed |
| `firstName`, `lastName`, `email` | Maya Rivera | Seeded |
| `customerNumber` | `123456` | 6 digits; applied when cloning seed onto an account |
| `locationNumber` | `00142` | 5 digits |
| `scans` | map of ScanType → ScanRecord | Seed defaults plus localStorage overrides |

The seed list in `lib/employees.ts` has **10 people**. The same 10 appear at every valid customer/location. Scan IDs change with the account because `generateScanId(id, customer, location)` hashes all three.

Walkthrough fixtures:

- Maya Rivera (`E-10482`) — all scans complete
- Owen Blake (`E-12114`) — sizing only
- Luca Romano (`E-14016`) — no scans

## ScanEvent

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `EVT-XXXXXXXX` | First 8 chars of a UUID, uppercased |
| `name` | string | Required, trimmed |
| `startDate`, `endDate` | `YYYY-MM-DD` | Displayed in en-US |
| `accounts` | `EventAccount[]` | One or more |
| `createdAt` | ISO datetime | |

### EventAccount

- `customerNumber`: 6-digit string
- `locationNumber`: 5-digit string **or `null`**

`null` location means “all demo locations for this customer”: `00142`, `00143`, `00201` (`DEMO_CUSTOMER_LOCATIONS` in `lib/events.ts`). Expansion is deduped.

## AuthSession

```ts
{ email: string; authenticatedAt: string }
```

## localStorage keys

| Key | Payload |
| --- | --- |
| `event-scan-auth-v1` | `AuthSession` |
| `event-scan-events-v1` | `ScanEvent[]` (newest first) |
| `event-scan-overrides-v1` | `Record<customer:location:employeeId, Partial<Record<ScanType, ScanRecord>>>` |

Override keys are built by `overrideKey` in `lib/scans.ts`. Completing a scan never edits seed data; it only writes this map.

## Scan ID algorithm

`lib/scan-id.ts`: FNV-1a 32-bit hash of `employeeId:customerNumber:locationNumber`, encoded as 6 uppercase base36 chars, prefixed with `SC-`. Stable for a given triple.

## Validation

- Customer: `/^\d{6}$/`
- Location: `/^\d{5}$/`
