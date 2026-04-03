# video-with-ai

A **Next.js (App Router)** app for working with video content, extended from the default `create-next-app` template with **authentication**, **MongoDB**, and **data models** you can build on.

---

## What was added after creating the project

| Area | What it does |
|------|----------------|
| **MongoDB + Mongoose** | `lib/db.ts` connects once and reuses the connection in dev (cached on `global`). |
| **User model** | `models/User.ts` — email + password; password is **hashed with bcrypt** before save. |
| **Video model** | `models/Video.ts` — title, description, URLs, optional transformation defaults (e.g. dimensions). |
| **NextAuth** | `lib/auth.ts` + `app/api/auth/[...nextauth]/route.ts` — session handling for the app. |
| **Sign-in** | **Credentials** provider (email/password against the database). GitHub/Google are in the file but commented out. |
| **Sessions** | **JWT** strategy, 30-day lifetime; `session.user.id` is set via callbacks. |
| **Custom auth pages** | Config points **sign-in** and **errors** to `/login` (add that route when you build the UI). |
| **Registration API** | `POST` `app/api/auth/register/route.ts` — intended for creating accounts (email + password). |
| **TypeScript** | `next-auth.d.ts` extends the session type with `user.id`. `types.d.ts` types the global Mongoose cache used by `lib/db.ts`. |
| **Imports** | `@/` maps to the project root (see `tsconfig.json` → `paths`). |

---

## Tech stack

- **Next.js** 16 · **React** 19 · **TypeScript**
- **Tailwind CSS** v4 (PostCSS)
- **MongoDB** via **Mongoose**
- **NextAuth.js** v4 · **bcryptjs**

---

## Project layout (main pieces)

```
app/
  api/auth/
    [...nextauth]/route.ts   ← NextAuth HTTP handler (GET/POST)
    register/route.ts       ← Register user (POST)
  page.tsx, layout.tsx, …
lib/
  auth.ts                   ← NextAuth options (providers, callbacks, session)
  db.ts                     ← MongoDB connection helper
models/
  User.ts
  Video.ts
```

---

## Environment variables

Create a **`.env`** in the project root (do not commit secrets). Typical values:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URL` | MongoDB connection string (required for DB + credentials login). |
| `NEXTAUTH_SECRET` | Secret used to sign JWT/session data (set a long random string in production). |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000` in dev) — use for OAuth/callbacks when you enable providers. |

Optional (only if you uncomment OAuth in `lib/auth.ts`):

- `GITHUB_ID`, `GITHUB_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

---

## How authentication works (short)

1. **Sign-in:** User sends email/password to NextAuth’s credentials flow.
2. **Authorize:** Server connects to MongoDB, finds the user, compares password with **bcrypt**.
3. **Session:** On success, a **JWT** is issued; callbacks attach **`user.id`** to the token and session.
4. **NextAuth route:** `app/api/auth/[...nextauth]/route.ts` exports GET/POST so all `/api/auth/*` NextAuth endpoints work. The folder name must be **`[...nextauth]`** (catch-all segment), not a literal `...` folder name.

---

## Database connection (revision notes)

- `connectToDatabase()` reads `MONGODB_URL` and avoids opening a new connection on every request by caching on `global.mongoose` (important for serverless/hot reload).

---

## Scripts

```bash
npm install    # install dependencies
npm run dev    # dev server → http://localhost:3000
npm run build  # production build
npm run start  # run production server after build
npm run lint   # ESLint
```

---

## Deploy

Same idea as any Next.js app: set env vars on the host (especially `MONGODB_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`), run `npm run build`, then `npm run start` (or use a platform like Vercel that runs the build for you).

---

## Learn more (Next.js)

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
