# Event Scan Desk

Prototype of the field process for footwear and eyewear scans at customer events. A rep signs in with password and one-time code, creates events, looks up employees by event or account, runs three scan actions, and exports Scan IDs for the vendor pressure-scan app.

This is a demo. Employee records are generated in the browser. Completing a scan updates status in `localStorage` so the roster stays consistent during the session. Auth session and events are also stored in `localStorage`.

## What you can do

1. Sign in with the demo account, then enter the one-time code.
2. **Create an event** with a name, one or more customer/location pairs (or customer only for all demo locations), and start/end dates.
3. **Employee look up** by event name or by customer number + location number.
4. Browse the spoofed employee roster. Each person has a **Scan ID** used by the vendor app (not their HR employee ID).
5. Search by first name, last name, employee ID, Scan ID, email, customer number, or location number.
6. Open an employee to see scan status, last scan date, and the three scan actions:
   - **Footwear sizing** — fake StrideFit app. Completing the scan marks it done.
   - **Footwear pressure** — large Scan ID display for the vendor search. Confirming vendor completion marks it done.
   - **Face and PD scan** — fake OptiFrame app. Completing the scan marks it done.
7. Export the roster as a printable list of Scan ID, customer number, and location number.

The seed roster mixes people with all scans complete, some scans complete, and no scans.

## Demo credentials

- Email: `rep@example.com`
- Password: `scan-desk`
- OTP: `123456`

Try customer `123456` and location `00142` from Employee look up. Open Maya Rivera (all scans), Owen Blake (sizing only), or Luca Romano (no scans), then complete a scan and return to the roster.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43145](http://127.0.0.1:43145).
