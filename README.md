# 🧹 CleanPro Manager

A full-stack, production-ready SaaS for cleaning company management.

## Features

- **Dashboard** — stats, today's schedule, revenue charts, audit feed
- **Schedule** — drag-and-drop weekly grid, add/edit/delete jobs
- **Customers** — full CRUD, detail page with job/invoice/payment history, WhatsApp button
- **Staff** — full CRUD, color coding for schedule, role management
- **Invoices** — line items, tax/discount, print-to-PDF, payment tracking
- **Quotes** — manage quote requests, accept/reject, CSV export
- **Payments** — record payments, auto-update invoice status
- **Expenses** — track expenses by category and staff
- **Reports** — 12-month revenue/expense/job analytics with charts
- **Notifications** — in-app alerts, mark read/delete
- **Settings** — company profile, invoice config, user management, password change, theme
- **Daily Report** — staff submit end-of-day cash collection reports
- **Dark/Light mode**, **English/Chinese** language toggle

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes, NextAuth.js JWT authentication
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **State**: Zustand (persisted preferences)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run setup

# 3. Start development server
npm run dev
```

Open http://localhost:3000

## Login Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@cleanpro.com | admin123 | Admin |
| manager@cleanpro.com | staff123 | Manager |
| staff@cleanpro.com | staff123 | Staff |

## Scripts

```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run db:push     # Push schema to database
npm run db:seed     # Seed demo data
npm run db:reset    # Reset and re-seed database
npm run db:studio   # Open Prisma Studio GUI
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` — PostgreSQL connection string (e.g. Supabase, PlanetScale)
   - `NEXTAUTH_SECRET` — random 32-char string (run: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` — your production URL
4. Deploy

## Switching to PostgreSQL

1. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
2. Update `DATABASE_URL` to your PostgreSQL connection string
3. Run `npm run db:push` to create tables
4. Run `npm run db:seed` to add demo data

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          Login page
│   ├── (dashboard)/           All authenticated pages
│   │   ├── dashboard/         Dashboard + charts
│   │   ├── schedule/          Drag-drop weekly calendar
│   │   ├── customers/         Customer CRUD + detail
│   │   ├── staff/             Staff CRUD
│   │   ├── invoices/          Invoice CRUD + print
│   │   ├── quotes/            Quote management
│   │   ├── payments/          Payment recording
│   │   ├── expenses/          Expense tracking
│   │   ├── reports/           Analytics & CSV export
│   │   ├── notifications/     In-app notifications
│   │   ├── settings/          Full settings module
│   │   └── daily-report/      Staff daily reports
│   └── api/                   All API routes
├── components/
│   ├── layout/                Sidebar, MobileHeader, MobileNav
│   └── ui/                    Modal, Toast, SearchBar, etc.
├── lib/                       Prisma, auth, utils, i18n, constants
└── store/                     Zustand state
```
