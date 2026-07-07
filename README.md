# ClientVault

A private, single-admin credential manager for a digital marketing freelancer. Store every client's profile plus all of their login credentials — website, hosting, domain, social, Google accounts, and unlimited custom accounts — in one searchable dashboard.

Built with React (Vite), Tailwind CSS, shadcn/ui-style components, React Router, Lucide icons, and Supabase (Auth + Postgres).

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → **New query**, paste the contents of `supabase/schema.sql`, and run it. This creates the `clients` and `credentials` tables, indexes, triggers, and Row Level Security policies.
3. Go to **Authentication → Providers** and make sure **Email** is enabled.
4. (Recommended) Go to **Authentication → Settings** and turn **off** "Allow new users to sign up" — this app is single-admin, so accounts should only be created by you.
5. Go to **Authentication → Users → Add user** and create your one admin account (email + password). Confirm the email if required.
6. Go to **Project Settings → API** and copy the **Project URL** and **anon public key**.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run it

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and log in with the admin account you created in Supabase.

## 4. Build for production

```bash
npm run build
npm run preview   # optional, to test the production build locally
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.) and set the same two environment variables there.

## How data is organized

- **`clients`** — one row per client (company name, contact, phone, email, website, address, notes).
- **`credentials`** — one flexible table that holds every credential type:
  - Fixed categories (Website, WordPress, Hosting, Domain, Business Email, Gmail, Facebook, Instagram, LinkedIn, X, YouTube, WhatsApp Business, Meta Business Manager, the five Google account types, Canva, ChatGPT) — each client can have **at most one** row per fixed category (enforced by a partial unique index), and the UI upserts into it.
  - **Custom accounts** (`category = 'custom'`) — unlimited rows per client, for anything not covered above (Zoom, Slack, Hostinger, GitHub, AWS, etc.).
- Row Level Security restricts every row to `auth.uid() = user_id`, so only your logged-in admin account can ever read or write the data.

## Features implemented

- Email/password login via Supabase Auth, persistent session, logout
- Dashboard: total client count, live search, add-client button
- Client cards with company, contact, phone, website, edit/delete
- Full client details page with collapsible credential sections grouped by type
- Show/hide password, copy username/password to clipboard, open login URL in a new tab
- Add / edit / delete for clients and every credential category
- Unlimited custom credential entries per client
- Success/error toast notifications
- Dark mode with persisted preference
- Fully responsive layout

## Folder structure

```
client-vault/
├── supabase/
│   └── schema.sql           # Run once in Supabase SQL editor
├── src/
│   ├── components/
│   │   ├── ui/               # button, input, card, dialog, badge, etc.
│   │   ├── ClientCard.jsx
│   │   ├── ClientFormDialog.jsx
│   │   ├── CredentialSection.jsx
│   │   ├── CredentialFormDialog.jsx
│   │   ├── CustomCredentials.jsx
│   │   ├── SecretField.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/
│   │   └── useTheme.js
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   ├── credentialCategories.js  # single source of truth for all sections/fields
│   │   ├── api.js                   # Supabase CRUD helpers
│   │   └── utils.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ClientDetails.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── tailwind.config.js
└── vite.config.js
```

## Notes on security

- The anon key is safe to expose in the frontend — access is enforced by Postgres RLS, not by hiding the key.
- Credentials are stored as plain text columns in Postgres, protected by RLS and Supabase's encryption at rest/in transit. If you want an extra layer of client-side encryption on top of that, consider encrypting the `password`/`pin` values before they hit Supabase with a passphrase only you know — that would be a good next iteration.
- Because sign-ups are disabled and RLS scopes rows to `auth.uid()`, only your one admin account can ever see this data, even though the schema itself doesn't hard-code a specific user ID.
