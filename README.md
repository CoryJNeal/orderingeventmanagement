# Event Scan Desk

Prototype of the field process for footwear and eyewear scans at customer events. A rep looks up a location by customer number and location number, searches a spoofed employee roster, runs three scan actions, and exports pressure-scan QR codes.

This is a demo. Employee records are generated in the browser. Completing a scan updates status in `localStorage` so the roster stays consistent during the session.

## What you can do

1. Enter any **6-digit customer number** and **5-digit location number**.
2. Browse 10 spoofed employees tagged with those account numbers.
3. Search by first name, last name, employee ID, email, customer number, or location number.
4. Open an employee to see scan status, last scan date, and the three scan actions:
   - **Footwear sizing** — fake StrideFit app. Completing the scan marks it done.
   - **Footwear pressure** — QR code with last name, employee ID, email, customer #, and location #. Confirming vendor completion marks it done.
   - **Face and PD scan** — fake OptiFrame app. Completing the scan marks it done.
5. Export the full roster as a printable page with a QR code on every employee ID.

The seed roster mixes people with all scans complete, some scans complete, and no scans.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43145](http://127.0.0.1:43145).

Try customer `123456` and location `00142`. Open Maya Rivera (all scans), Owen Blake (sizing only), or Luca Romano (no scans), then complete a scan and return to the roster.
