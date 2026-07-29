# WAAW — Full Stack Setup Guide
## From zero to live on iPhone, App Store, and web

---

## STEP 1 — Preview on your iPhone right now (5 minutes)

No Apple Developer account needed for this step.

```bash
# Install Expo Go on your iPhone from the App Store (free)

# On your computer:
npm install -g expo-cli
npm install
npx expo start
```

Scan the QR code with your iPhone Camera app.
The app opens in Expo Go on your phone.
Every file save on your computer hot-reloads on your phone.

Your iPhone and computer must be on the same WiFi network.

---

## STEP 2 — Set up Supabase (15 minutes)

1. Go to supabase.com and create a free account
2. Click "New project" — name it waaw-production
3. Choose a region close to Nigeria/Ghana/Kenya (Europe West is fine)
4. Set a strong database password and save it
5. Once the project loads, go to Settings → API
6. Copy your Project URL and anon public key into .env:
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxx...

7. Go to SQL Editor → New query
8. Paste the entire contents of supabase/schema.sql
9. Click Run — this creates all your tables, policies, and functions

10. Go to Authentication → Settings:
    - Enable Email confirmations: ON
    - Set Site URL: https://waaw.co
    - Add redirect URLs: exp://your-device-ip:8081, https://waaw.co

---

## STEP 3 — Set up Stripe for the $100 founder fee (20 minutes)

1. Go to dashboard.stripe.com and create account
2. Go to Developers → API keys
3. Copy publishable key and secret key into .env
4. Create a product:
   - Products → Add product → "WAAW Founder Onboarding"
   - Price: $100 one-time
   - Copy the price ID
5. Set up webhook:
   - Developers → Webhooks → Add endpoint
   - URL: https://waaw.co/api/webhooks/stripe
   - Events: checkout.session.completed
   - Copy webhook signing secret into .env as STRIPE_WEBHOOK_SECRET

---

## STEP 4 — Deploy web app to Vercel (10 minutes)

```bash
npm install -g vercel
cd vercel
npm install
vercel login
vercel deploy --prod
```

In the Vercel dashboard → your project → Settings → Environment Variables,
add every key from your .env file.

To connect your domain:
1. Settings → Domains → Add waaw.co
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Add these DNS records:
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
4. SSL is automatic

---

## STEP 5 — Set up Flutterwave for African payments and escrow

1. Go to dashboard.flutterwave.com and create business account
2. Complete KYC for your Workerholics Solutions Limited entity
3. Go to Settings → API → Copy public and secret keys into .env
4. Set up webhook:
   - Settings → Webhooks → https://waaw.co/api/webhooks/flutterwave
5. For escrow: contact Flutterwave enterprise for Escrow API access
   Alternatively use Paystack (paystack.com) which has strong Nigerian coverage

---

## STEP 6 — Set up Loca8tor postcode verification

1. Log into loca8tor.com with your Workerholics credentials
2. Go to API → Generate key
3. Add to .env as EXPO_PUBLIC_LOCA8TOR_API_KEY
4. The KYC screen in the app already calls the verification endpoint

---

## STEP 7 — Build for App Store and Play Store

You need an Apple Developer account ($99/year) for App Store.
You need a Google Play Developer account ($25 one-time) for Play Store.

```bash
npm install -g eas-cli
eas login
eas build:configure

# Build for both stores
eas build --platform all --profile production

# Submit to App Store (after build completes)
eas submit --platform ios

# Submit to Play Store (after build completes)
eas submit --platform android
```

Fill in eas.json with your Apple ID, team ID, and Google Play service account.
Instructions for the service account JSON: bit.ly/google-play-service-account

---

## STEP 8 — App Store requirements checklist

Before submitting to Apple:
- [ ] App icon: 1024x1024px PNG, no transparency, no rounded corners
- [ ] Screenshots: 6.7 inch (iPhone 14 Pro Max) and 6.1 inch (iPhone 14)
- [ ] App name: WAAW Investor
- [ ] Subtitle (30 chars): Invest in African startups
- [ ] Description: see vercel/store-listing.txt
- [ ] Keywords: diaspora, africa, investment, startup, escrow, fintech
- [ ] Category: Finance
- [ ] Age rating: 17+
- [ ] Privacy policy URL: https://waaw.co/privacy
- [ ] Support URL: https://waaw.co/support
- [ ] App Review notes: explain the escrow flow and that test accounts are available

Before submitting to Google Play:
- [ ] Same screenshots as iOS (Play accepts various sizes)
- [ ] Feature graphic: 1024x500px
- [ ] App bundle (.aab not .apk)
- [ ] Data safety form: declare location data (Loca8tor), financial data (commitments)
- [ ] Target API level 34 (Android 14)

---

## Architecture overview

Mobile app (Expo/React Native)
  ↕ Supabase JS client
Supabase (PostgreSQL + Auth + Realtime + Storage)
  ↕ Server-side API calls
Vercel (Next.js)
  ↕ Webhooks
Stripe (payments)
Flutterwave (African payments + escrow)
  ↕ API calls
Loca8tor (postcode/location verification)
Expo (push notifications + OTA updates)

---

## Support

Built by Workerholics Solutions Limited
Johnspeak: workerholics.co.uk
