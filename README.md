# AFG Tech — CMS website

Production-ready Next.js 14 + TypeScript + Prisma + Postgres + NextAuth v5 CMS for **AFG Tech**, a software development agency in Grapevine, TX serving automotive, healthcare, sports, and nonprofit industries since 2009.

- **Public site** — marketing pages, services, portfolio case studies, blog, contact form (ISR, 60s)
- **Admin CMS** at `/admin` — full CRUD over Projects, Services, Posts, Testimonials, Submissions inbox, Media library, Site settings
- **Stack** — Next.js 14 App Router · TypeScript strict · Tailwind · Prisma + Postgres · NextAuth v5 (Auth.js beta) · TanStack Query · React Hook Form + Zod · Zustand · Framer Motion · TipTap · AWS S3 · bcrypt

---

## 1. Setup

```bash
unzip afgtech.zip
cd afgtech
npm install
```

Node 18.18+ recommended (Node 20 LTS is best). The `postinstall` script will run `prisma generate` automatically.

## 2. Environment variables

Copy the example and fill in real values:

```bash
cp .env.example .env
```

Minimum required to boot:

| Var | What it is |
|---|---|
| `DATABASE_URL` | Postgres connection string (local, Neon, Supabase, RDS, etc.) |
| `AUTH_SECRET` | 32-byte random string. Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Public URL of the app (e.g. `http://localhost:3000`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used by the seed script to create the first admin user |

S3 vars (`AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_PUBLIC_BASE_URL`) are required only when you start uploading images. The app will boot without them; uploads will fail with a clear error until they're set.

## 3. Database

Run the initial migration and seed:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

The seed creates: the admin user (from env), site settings, 6 services, 4 industries, 3 testimonials, 4 sample case studies, and 1 blog post.

To explore the data visually:

```bash
npx prisma studio
```

## 4. Run locally

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login> (use the seeded credentials)

## 5. Project structure

```
src/
  app/
    (public)/        — public pages (ISR, 60s)
    (admin)/admin/   — CMS, protected by middleware
    api/
      auth/[...nextauth]/  — Auth.js handler
      admin/...      — protected admin endpoints
      contact/       — public contact-form endpoint
    sitemap.ts, robots.ts
  components/{ui,layout,sections}
  features/admin/{editors,tables,media,schemas}
  features/contact
  hooks, lib, services, store, types, utils
  middleware.ts      — protects /admin/* and /api/admin/*
prisma/{schema.prisma, seed.ts}
```

## 6. How content updates reach the public site

Every admin mutation (create/update/delete) calls `revalidatePath()` on the relevant public routes, so changes appear instantly without a redeploy. Public pages also use ISR (`revalidate = 60`) as a safety net.

## 7. Security notes

- All `/admin/*` and `/api/admin/*` routes are guarded by `src/middleware.ts`. Pages redirect unauthenticated users to `/admin/login`; APIs return `401`.
- Sessions are JWT in an HTTP-only cookie named `afg-session`, `secure` in production, `sameSite=lax`.
- Passwords are stored as `bcrypt` hashes (cost 12).
- Security headers (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy) are set globally in `next.config.ts`.
- The contact API validates input with Zod and stores submissions in `ContactSubmission` for review in the admin Inbox.

## 8. Deploy to Vercel + Neon

1. Create a Postgres database on **[Neon](https://neon.tech)** (free tier is fine to start). Copy the connection string with `?sslmode=require`.
2. Push this repo to GitHub.
3. On **Vercel**, *Import Project*. Set the Framework preset to **Next.js**.
4. Add the environment variables from `.env.example` in **Vercel → Settings → Environment Variables**. Make sure `AUTH_URL` is your production URL (e.g. `https://www.afgtech.com`).
5. Add a **build command override**: `prisma migrate deploy && prisma generate && next build`. Or run migrations from your machine with `DATABASE_URL=... npx prisma migrate deploy`.
6. Deploy. After the first deploy, run the seed once: `DATABASE_URL=... npm run db:seed`.

## 9. Customizing

- **Brand tokens**: `tailwind.config.ts` (colors, fonts, animations) and `src/app/globals.css` (gradients, glass, scrollbar).
- **Site config**: `src/lib/site-config.ts` and the **Settings** page in admin.
- **Industries / Services / Testimonials / Projects / Posts**: managed entirely from `/admin`.

## 10. Scripts

| Command | What |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with Next/ESLint |
| `npm run typecheck` | Strict TypeScript check |
| `npm run db:seed` | Re-run the seed script |
| `npm run prisma:migrate` | Create + apply a new migration locally |
| `npm run prisma:deploy` | Apply migrations in CI / production |
| `npm run prisma:studio` | Open Prisma Studio |

---

© AFG Tech · Grapevine, TX · Est. 2009
