# Monorepo: Next.js BFF + Express health demo

This monorepo contains:

- packages/web: Next.js 15 (Pages Router) client + API routes (BFF)
- packages/server: Express.js (kept for health/other services)

Features

- Next.js API routes act as BFF: create a signed JWT and set it as httpOnly cookie.
- Verify endpoint reads cookie, verifies signature, returns user info.
- Logout clears cookie.

Getting Started

1. Install deps at root:
   npm install

2. Create env files for web (JWT secret shared by API routes):
   cp packages/web/.env.local.example packages/web/.env.local

   # Optionally for server if you keep it

   cp packages/server/.env.example packages/server/.env

3. Start apps:
   # Web (BFF) is enough for demo
   npm run -w packages/web dev
   # Optional: also run server
   npm run -w packages/server dev

- Web runs at http://localhost:3000
- Server runs at http://localhost:4000 (health only in this demo)

Notes

- Cookies are httpOnly and sameSite=lax. In production use HTTPS so secure=true.
- JWT_SECRET should be set in packages/web/.env.local for consistent signing and verification.
