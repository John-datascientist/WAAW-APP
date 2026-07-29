# WAAW Web — Vercel Deployment

This folder contains the Next.js web app and API routes deployed to Vercel.
The mobile app (Expo) and web app (Next.js) share the same Supabase backend.

---

## What runs on Vercel

1. **Public founder profiles** — waaw.co/p/[slug]
   - Shareable pages visible without an account
   - Shows startup details, raise progress, co-founders
   - CTA to sign up as investor

2. **API routes**
   - /api/webhooks/stripe — handles $100 founder onboarding payment
   - /api/webhooks/flutterwave — handles escrow status updates
   - /api/loca8tor/verify — proxies postcode verification to Loca8tor API
   - /api/notifications/send — sends push notifications via Expo

3. **Web investor portal** — waaw.co/dashboard
   - Same auth as mobile via Supabase
   - Full deal flow accessible on desktop

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# From the vercel/ folder
cd vercel
npm install
vercel deploy --prod
```

## Environment variables to set in Vercel dashboard

Go to: vercel.com → your project → Settings → Environment Variables

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for server-side operations)
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
FLUTTERWAVE_SECRET_KEY=FLWSECK_your-key
LOCA8TOR_API_KEY=your-loca8tor-key
EXPO_ACCESS_TOKEN=your-expo-access-token

---

## Linking custom domain

1. Go to vercel.com → your project → Settings → Domains
2. Add waaw.co
3. Update your DNS at your domain registrar:
   - A record: 76.76.21.21
   - CNAME www: cname.vercel-dns.com
4. Vercel auto-provisions SSL

---

## Key file: /vercel/pages/p/[slug].tsx

This is the public founder profile page.
It fetches startup data from Supabase server-side (SSR) so:
- Google can index it (SEO)
- Open Graph tags work for WhatsApp/LinkedIn previews
- No login required to view
