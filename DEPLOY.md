# Deploying to Cloudflare

Yes — for this site Cloudflare is cheaper than AWS, and that is now the supported path.

**What runs where:** the site runs as a **Cloudflare Worker** (via the OpenNext adapter).
Appointments, blocked hours, and rate-limit counters live in **D1** (SQLite). Gallery photos
live in **R2**. Nothing is kept on a server disk, so a deploy never wipes bookings or photos.

**Why the bill is lower:** a salon this size stays inside Cloudflare's free allowances for D1
and R2. Custom domains and HTTPS are included. The realistic hosting cost is **$0–5/month**:

- **Free Workers** if the built Worker stays under 3 MB. Next.js + Material UI often does
  not, in which case you need **Workers Paid at $5/month** (10 MB scripts, far more
  requests).
- **D1 and R2** stay on the free tier at salon traffic (D1: 5 million reads/day; R2: 10 GB
  storage and no egress fee).
- **Twilio texts are separate** and cost the same on any host.

Compare that to the previous AWS plan: Lightsail Containers was about $10/month before
DynamoDB, S3, and a domain. Amplify does not officially host Next.js 16. App Runner is closed
to new customers.

**Local vs production:** `npm start` / `npm run dev` still store data in the `data/` folder
on this computer. Cloudflare storage is used only when the Worker is running (`npm run
preview` or `npm run deploy`).

---

## 1. Put the code in a git repo

Not required for a one-off `npx wrangler` deploy, but you want it as a backup and so
Cloudflare can rebuild from GitHub later.

```bash
git init
git add .
git commit -m "Pau-Nafeesah Beauty Room site"
```

Create an empty **private** repo on GitHub, then:

```bash
git remote add origin https://github.com/<you>/pau-nafeesah-beauty-room.git
git branch -M main
git push -u origin main
```

`.env.local` and `.dev.vars` are gitignored. Secrets go into Cloudflare, not into git.

## 2. Create a Cloudflare account and log in

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up)
2. On this computer:

```bash
npx wrangler login
```

That opens a browser; approve Wrangler. You only do this once.

If the first deploy says the Worker is too large for the free plan, add **Workers Paid**
($5/month) under **Workers & Pages → Plans**. Do that before you go live rather than after
the first booking.

## 3. Create the D1 database

```bash
npx wrangler d1 create pau-nafeesah
```

The command prints a `database_id`. Paste that id into `wrangler.jsonc` in place of
`REPLACE_WITH_YOUR_D1_DATABASE_ID`.

Then create the tables:

```bash
npx wrangler d1 execute pau-nafeesah --remote --file=./schema.sql
```

## 4. Create the R2 bucket for photos

R2 is off on new accounts until you accept it once: Cloudflare dashboard → **R2 Object
Storage** → enable. Then:

```bash
npx wrangler r2 bucket create pau-nafeesah-photos
```

Leave the bucket **private**. Photos are served through `/api/gallery/photo/...`, not as
public R2 URLs.

## 5. Set secrets

These never go in `wrangler.jsonc`. Generate a secret with `openssl rand -hex 32`.

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SECRET
npx wrangler secret put NEXT_PUBLIC_SITE_URL
npx wrangler secret put SALON_TIMEZONE
npx wrangler secret put OWNER_PHONE
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_PHONE_NUMBER
```

Use the real public URL for `NEXT_PUBLIC_SITE_URL` (for example `https://paunafeesah.com`)
so texts and calendar invites do not point at localhost. `SALON_TIMEZONE` is typically
`America/New_York`.

`NEXT_PUBLIC_SITE_URL` is also read at **build** time. Before you deploy, either export it
in the shell or put it in `.env.production` (that file is gitignored):

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 6. Deploy

```bash
npm run deploy
```

That builds Next.js, packages it for Workers, and uploads it. The first successful deploy
prints a URL like `https://pau-nafeesah-beauty-room.<account>.workers.dev`. Open it and
confirm the home page loads before attaching a domain.

To try the Worker on this computer without publishing:

```bash
cp .dev.vars.example .dev.vars
npx wrangler d1 execute pau-nafeesah --local --file=./schema.sql
npm run preview
```

## 7. Point your domain at it

**If the domain's DNS already lives on Cloudflare** (the nameservers are Cloudflare's):

Workers & Pages → `pau-nafeesah-beauty-room` → **Settings → Domains** → **Add** → enter
`your-domain.com` and `www.your-domain.com`. HTTPS is issued automatically.

**If the domain is at another registrar:** either change the nameservers to Cloudflare's
(dashboard → add site → copy the two nameservers to the registrar), or add a CNAME for
`www` to the `workers.dev` hostname. An apex domain (`your-domain.com` with no `www`) needs
Cloudflare DNS or an ALIAS/ANAME record; a plain CNAME at the apex is not valid.

After the domain works, set `NEXT_PUBLIC_SITE_URL` to it (secret + `.env.production`) and
run `npm run deploy` again so messages and calendar links use the real URL.

## 8. Check it end to end

On the live domain:

- Book a real appointment; you and the guest both get a text
- The confirmation page loads and Add to Calendar produces a correct invite
- Sign in at `/admin` with the new password; `beautyroom` must no longer work
- Block an hour, reload `/book`, and confirm that hour is gone
- Upload a gallery photo and confirm it appears on Past Customers
- Run `npm run deploy` again and confirm the photo and the booking are **still there** —
  that is the check that storage is D1/R2, not the Worker's memory

## Later deploys

```bash
git add .
git commit -m "Describe the change"
git push
npm run deploy
```

Optional: in the Cloudflare dashboard, connect the GitHub repo so every push to `main`
deploys without running the command locally. The build command is `npx opennextjs-cloudflare
build`, and the deploy command is `npx opennextjs-cloudflare deploy`.

## Backups and maintenance

D1: dashboard → D1 → `pau-nafeesah` → backups / export. Take a copy before any schema change.

R2: dashboard → R2 → `pau-nafeesah-photos`. Enable object versioning if you want deleted
photos to be recoverable.

There is no operating system to patch. Changing `ADMIN_SECRET` signs every staff session out
immediately.

## Security notes

Bookings are capped at 5 per hour per client IP, and staff sign-in at 10 attempts per 15
minutes. Both counters live in D1 so they hold across Cloudflare locations. The IP comes
from `cf-connecting-ip`, which visitors cannot spoof. Treat the cap as a Twilio cost guard,
not as airtight protection.

Staff sessions are signed tokens with a random value and a 14-day expiry. Each sign-in
issues a different token; old ones expire on their own.
