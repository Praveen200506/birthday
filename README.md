This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# 🌸 Birthday App & Private Journal — Complete Guide

A personalized, interactive birthday celebration web app dedicated to Sharmila, featuring interactive memories, love letter, candle-blowing cake, and a private personal journal/blog with PostgreSQL database persistence.

---

## 🧭 Routes Overview

| Route | Description | Protection |
|---|---|---|
| `/` | Landing page with Polaroid photo wall & parallax | Global PIN (`1910`) |
| `/memories` | Draggable photo memory cards with lightbox & shuffle | Global PIN (`1910`) |
| `/letter` | Handwritten typewriter letter | Global PIN (`1910`) |
| `/surprise` | Interactive cake with blowable candles & confetti | Global PIN (`1910`) |
| `/blog` | Personal journal & stories feed | Separate Blog PIN (`BLOG_PIN_HASH`) |
| `/blog/[slug]` | Individual story article view | Separate Blog PIN (`BLOG_PIN_HASH`) |
| `/blog/write` | Author writing desk (compose, edit, publish, draft) | Author Password (`BLOG_ADMIN_PASSWORD_HASH`) |
| `/blog/write/login` | Author desk login portal | Public |

---

## 🗄️ Database Setup (PostgreSQL)

The blog uses **Prisma ORM** with **PostgreSQL**. You can use any free-tier or local PostgreSQL provider:

### Option A: Free Hosted PostgreSQL (Recommended for Vercel)
1. **Neon** (https://neon.tech) or **Supabase** (https://supabase.com) or **Vercel Postgres**.
2. Create a free PostgreSQL database and copy the connection string (`DATABASE_URL`).
3. Set `DATABASE_URL` in your `.env` file and Vercel Environment Variables.

### Option B: Local Docker PostgreSQL
To run PostgreSQL locally with Docker:
```bash
docker run --name birthday-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=birthday_db \
  -p 5432:5432 -d postgres:16-alpine
```
Then set in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/birthday_db?schema=public"
```

### Prisma Commands:
```bash
# Generate Prisma Client types
npx prisma generate

# Push schema directly to your database (without migration files)
npx prisma db push

# Or create a migration
npx prisma migrate dev --name init
```

---

## 🔐 Generating Hashes for Secrets

To generate SHA-256 hashes for your PIN and Author Password:

```bash
# Generate Blog PIN hash (e.g. 4-digit PIN)
node scripts/generate-pin-hash.mjs 1910

# Generate Author Password hash
node scripts/generate-pin-hash.mjs yourSecretPassword
```

Copy the generated hash values into `.env`:
```env
BLOG_PIN_HASH="<generated_pin_hash>"
BLOG_ADMIN_PASSWORD_HASH="<generated_password_hash>"
```

---

## 📧 Visitor Email Notifications (Resend)

1. Sign up for free at [Resend](https://resend.com).
2. Generate an API Key and set it in `.env`:
   ```env
   RESEND_API_KEY="re_..."
   NOTIFICATION_EMAIL="your-email@example.com"
   RESEND_FROM="Birthday App <onboarding@resend.dev>"
   ```
3. Whenever someone visits the website, an email is dispatched with device, browser, OS, and approximate location.
4. Notifications are automatically rate-limited and deduplicated per visitor session (30-minute window) so you won't receive spam on page refreshes.
5. Email dispatching is non-blocking and will never disrupt or slow down the visitor's browsing experience.

---

## 🚀 Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into **Vercel**.
3. Add the following **Environment Variables** in Vercel Project Settings:
   - `DATABASE_URL`: Your PostgreSQL connection string (Neon, Supabase, or Vercel Postgres).
   - `BLOG_PIN_HASH`: SHA-256 hash of your 4-digit reader PIN.
   - `BLOG_SESSION_SECRET`: Random 32+ character string for reader session signing.
   - `BLOG_ADMIN_PASSWORD_HASH`: SHA-256 hash of your author password.
   - `BLOG_ADMIN_SESSION_SECRET`: Random 32+ character string for admin session signing.
   - `RESEND_API_KEY`: Your Resend API key (optional for visitor alerts).
   - `NOTIFICATION_EMAIL`: Your email address for visitor alerts.
   - `RESEND_FROM`: (Optional) Verified sender email or `onboarding@resend.dev`.
4. Ensure the Build Command is `prisma generate && next build` or standard `npm run build` (Prisma will automatically generate on build).
5. Deploy! Vercel Analytics and Speed Insights will automatically be active.

