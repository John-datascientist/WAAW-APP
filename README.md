# WAAW Investor — Mobile App

React Native / Expo app for the WAAW diaspora investment platform.
Built for iOS (App Store) and Android (Google Play).

---

## Screens

| Screen | Description |
|--------|-------------|
| Home | Portfolio snapshot, hero total, stat tiles, commitments list |
| Startups | Verified deals with raise progress, sector tags, location |
| Startup Detail | Full deal view — pitch, stats, founder bio, commit CTA |
| Commit Flow | Preset + custom amount, review step, escrow confirmation |
| Portfolio | Holdings list, escrow status, empty state with explainer |
| Inbox | Founder conversations, unread badge, safety notice |
| Profile | KYC status, account rows, escrow total |

---

## Design tokens

| Token | Value | Use |
|-------|-------|-----|
| `bg` | `#211f1c` | App background |
| `text` | `#f4f2ee` | Primary text |
| `muted` | `#a29e97` | Secondary text |
| `line` | `#454239` | Borders / dividers |
| `accent` | `#e0a83d` | Gold — CTAs, active tab, highlights |
| `card` | `#282521` | Card surfaces |
| `deeper` | `#1a1815` | Inset / avatar backgrounds |

Fonts: Newsreader (serif display), IBM Plex Mono (labels/data), Inter (body).

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npm start

# 3. Run on device / simulator
npm run ios      # iOS simulator
npm run android  # Android emulator
```

Scan the QR code with Expo Go on your phone to preview immediately.

---

## Build for stores

### Prerequisites
- Install EAS CLI: `npm install -g eas-cli`
- Log in: `eas login`
- Configure: replace placeholders in `eas.json` with your Apple ID, team ID, and Google Play service account

### iOS (App Store)
```bash
# Build production IPA
npm run build:ios

# Submit to App Store Connect
npm run submit:ios
```

You need:
- Apple Developer account ($99/year)
- App record created in App Store Connect
- Distribution certificate and provisioning profile (EAS handles this)

### Android (Google Play)
```bash
# Build production AAB
npm run build:android

# Submit to Play Store
npm run submit:android
```

You need:
- Google Play Developer account ($25 one-time)
- App created in Play Console
- Google Play service account JSON key (download from Play Console → Setup → API access)

---

## Project structure

```
waaw-app/
├── App.tsx                    # Root — state, navigation, screen routing
├── app.json                   # Expo config (bundle IDs, permissions)
├── eas.json                   # EAS build + submit config
├── src/
│   ├── theme/index.ts         # Colors, fonts, spacing, radius
│   ├── data/index.ts          # Types, mock data
│   ├── components/index.tsx   # Shared UI components
│   ├── navigation/TabBar.tsx  # Bottom tab bar
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── StartupsScreen.tsx
│       ├── StartupDetailScreen.tsx
│       ├── CommitScreen.tsx
│       ├── PortfolioScreen.tsx
│       ├── MessagesScreen.tsx
│       └── ProfileScreen.tsx
```

---

## Connecting to your backend

Replace mock data in `src/data/index.ts` with API calls to your WAAW backend.
Commitments and KYC state should be fetched from the same data source as the web app.

Key integration points:
- `MOCK_STARTUPS` → fetch from `/api/startups?status=verified`
- `Commitment[]` in `App.tsx` → fetch from `/api/commitments?userId=...`
- KYC state → fetch from `/api/kyc?userId=...`
- Loca8tor postcode API → call during KYC verification screen

---

## Store listing copy (ready to paste)

**App name:** WAAW Investor

**Short description (80 chars):**
Connect with verified African startups. Invest via protected escrow.

**Full description:**
WAAW (We Are All We've Got) connects African diaspora investors with
verified, early-stage African startups raising capital now.

Browse deals across AgriTech, FinTech, HealthTech, EdTech, and more.
Commit to invest through a fully protected escrow flow. Track your
portfolio, monitor escrow status in real time, and communicate directly
with founders.

Every startup on WAAW is verified before appearing in the deal flow.
Your capital is protected from commitment through to release.

Features:
- Browse verified African startups raising now
- Commit to invest via protected escrow
- Track portfolio and escrow status in real time
- Message founders directly
- Identity verification built in

**Keywords:** diaspora, africa, investment, startup, escrow, fintech, agritech

**Category:** Finance

**Age rating:** 17+ (financial content)
