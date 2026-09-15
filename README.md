# Pau-Nafeesah Beauty Room

Professional salon site built with Next.js, TypeScript, and Material UI.

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

`npm start` builds the site and serves it, so it is the one command to run the studio site
day to day. Use `npm run dev` instead while editing code — it starts instantly and reloads on
save. `npm run serve` skips the build and serves the last one.

- **Home** — studio story, services, hours
- **Past Customers** — live photo gallery
- **Book Appointment** — calendar + available times, name and phone, confirmation texts, add to calendar
- **Staff studio** — `/admin` (password `beautyroom` unless `ADMIN_PASSWORD` is set). Block or reopen appointment hours, and publish gallery photos.

Update phone, hours, and copy in `lib/business.ts`.

## Where data is stored

On this computer, everything lives under `data/` — appointments and blocked hours as JSON in
`data/collections`, gallery photos in `data/uploads/gallery`. Photos are served through
`/api/gallery/photo/<file>` rather than from `public/`, because Next.js only serves files that
were in `public/` at build time. Back up the `data/` folder to keep them.

On Cloudflare the same code uses **D1** for appointments and hours and **R2** for photos. Local
commands never touch those; only `npm run preview` and `npm run deploy` do.

## Deploying

See [DEPLOY.md](DEPLOY.md) for Cloudflare, a custom domain, and a cost breakdown. Typical
hosting is $0–5/month. Guest and studio SMS through Twilio is optional and billed separately.

## Confirmation texts

SMS is not free. Without Twilio, bookings still save and guests get a confirmation page with
calendar buttons. If you add Twilio later, texts go to the guest and to the studio number
`(787) 464-2599`.

```
OWNER_PHONE=+17874642599
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://pau-nafeesahbr.com
```

The appointment is still saved if texts are not configured yet. Each confirmation page includes Google, Outlook, and Apple `.ics` calendar buttons; those same links are included in the texts.
