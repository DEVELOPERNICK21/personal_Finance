# Personal Finance Dashboard

A modular personal finance dashboard for Next.js that answers the essential money questions in under 2 minutes — and can be plugged into any other Next.js App Router site.

## Features

- **Dashboard** — net worth, runway, allocation mix, emergency fund progress
- **Accounts & Assets** — banks, EPF, PPF, FD, gold, real estate
- **Investments** — mutual funds, stocks, NPS with portfolio mix
- **Monthly Money** — income, expenses, SIPs, remaining cash formula
- **Goals** — emergency fund, vacation, car, house, retirement
- **Insurance** — term, health, vehicle policies with renewal tracking
- **Documents** — PAN, Aadhaar, policies, statements, will
- **Firebase Auth** — email/password sign-in, sign-up, password reset
- **Light / dark theme** — toggle in header, persisted preference
- **PWA** — installable on phone/desktop, offline app shell, cached assets

Data auto-saves to the cloud (Firebase Firestore) when deployed. Local browser cache is kept as a backup.

## Install as an app (PWA)

After deploying (or running `yarn build && yarn start` locally):

1. Open `/finance` in Chrome, Edge, or Safari
2. Use **Install app** / **Add to Home Screen** from the browser menu
3. The app opens standalone at `/finance` with a wallet icon

The service worker caches the app shell and static assets. Finance data still syncs via Firebase when online; if you go offline, you'll see an offline page until connectivity returns.

## Deploy with Permanent Cloud Save

Your data is stored in **Firebase Firestore** and survives across devices, browsers, and redeployments.

### 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project (or use an existing one)
3. Enable **Firestore Database** (production mode)
4. Deploy security rules from this repo:
   ```bash
   npx firebase-tools firestore:rules:set firestore.rules
   ```

### 2. Enable Firebase Authentication

1. Firebase Console → **Authentication** → Sign-in method
2. Enable **Email/Password**
3. Add authorized domains: `localhost` and your Vercel domain

### 3. Get credentials

**Admin SDK** (server):
1. Firebase Console → Project Settings → Service Accounts
2. Click **Generate new private key**
3. Copy `project_id`, `client_email`, and `private_key` from the JSON file

**Web app** (client):
1. Project Settings → General → Your apps → Add Web app
2. Copy `apiKey`, `authDomain`, `projectId`, `appId`

### 4. Set environment variables

Copy `.env.example` to `.env.local` for local dev:

```bash
cp .env.example .env.local
```

Fill in all variables from `.env.example` (admin + `NEXT_PUBLIC_FIREBASE_*` client vars).

For **Vercel deployment**, add the same variables in Project Settings → Environment Variables.

### 5. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

### 6. Sign in

1. Open your deployed URL → `/finance`
2. Create an account or sign in with email/password
3. All edits auto-save to Firestore per user (`users/{uid}/finance`)

### How saving works

| Layer | Purpose |
|-------|---------|
| **Firestore** | Permanent cloud storage (survives deploys & devices) |
| **localStorage** | Instant local cache + offline backup |
| **Debounced sync** | Saves 600ms after you stop typing |

Without Firebase env vars, the app falls back to local-only mode (fine for local dev).

## Security & encryption

Financial data is protected in **layers**:

| Layer | What it does |
|-------|----------------|
| **HTTPS** | Data encrypted in transit between browser and server |
| **Firebase Auth** | Only you can access your `/api/finance` endpoints |
| **Firestore rules** | Direct client database access is blocked (`allow read, write: if false`) |
| **Google at-rest encryption** | Firestore encrypts disks by default (AES-256) |
| **Client-side vault (E2EE)** | Your finance JSON is encrypted with **AES-256-GCM** before upload |

### Vault passphrase (end-to-end encryption)

After sign-in you will:

1. **Create a vault passphrase** (first time) — separate from your login password
2. **Unlock the vault** each browser session

Your passphrase derives an encryption key via **PBKDF2** (210k iterations). Only encrypted ciphertext is stored in Firestore and `localStorage`. The server and Firebase **cannot read** account numbers, balances, or policy details.

**Important:** If you lose your vault passphrase, your encrypted data **cannot be recovered**. Store it safely (password manager, secure note).

Legacy accounts with plaintext cloud data are automatically re-encrypted on the next save after vault setup.

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000/finance](http://localhost:3000/finance)

## Plug Into Another Next.js Site

Copy the entire feature folder into your host project:

```
your-host-app/
  src/
    features/
      personal-finance/    ← copy this folder
    app/
      finance/
        [[...slug]]/
          page.tsx         ← add this route
```

### 1. Copy the module

```bash
cp -r src/features/personal-finance /path/to/host-app/src/features/
```

### 2. Add a catch-all route

Create `src/app/finance/[[...slug]]/page.tsx` in your host app:

```tsx
import { PersonalFinanceMount } from "@/features/personal-finance";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function FinancePage({ params }: Props) {
  const { slug } = await params;
  return (
    <PersonalFinanceMount
      slug={slug}
      config={{ basePath: "/finance" }}
    />
  );
}
```

### 3. Done

Your finance dashboard is now available at `/finance` with all sub-routes:

| Route | Page |
|-------|------|
| `/finance` | Dashboard |
| `/finance/accounts` | Accounts & Assets |
| `/finance/investments` | Investments |
| `/finance/monthly` | Monthly Money |
| `/finance/goals` | Goals |
| `/finance/insurance` | Insurance |
| `/finance/documents` | Documents |
| `/finance/emergency` | Emergency Info |

### Custom base path

Change `basePath` to mount at any URL:

```tsx
<PersonalFinanceMount config={{ basePath: "/my-money" }} />
```

Then create the route at `src/app/my-money/[[...slug]]/page.tsx`.

## Advanced Integration

Import individual pieces for custom layouts:

```tsx
import {
  FinanceProvider,
  FinanceLayout,
  DashboardPage,
  useFinance,
} from "@/features/personal-finance";

export default function CustomFinancePage() {
  return (
    <FinanceProvider config={{ basePath: "/wealth" }}>
      <FinanceLayout>
        <DashboardPage />
      </FinanceLayout>
    </FinanceProvider>
  );
}
```

## Project Structure

```
src/features/personal-finance/
  core/
    domain/                 # Types, calculations, defaults (pure)
    application/            # finance-service use-cases
  infrastructure/           # auth-repository, finance-repository
  presentation/
    providers/              # AuthProvider, FinanceProvider
    components/             # LoginPage, ThemeToggle
  components/               # UI primitives, layout
  pages/                    # 8 page components
  index.ts                  # Public API
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
