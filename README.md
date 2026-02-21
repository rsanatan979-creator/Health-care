# MediSOS + MediQueue — Unified App

Single full-stack application. **Project 1** owns the shell (Landing, Login); **Project 2** (healthcare) is a protected feature module.

## Flow

1. **Landing** (/) — Main front page
2. **Login** (/login) — Auth, then → hospital-selection
3. **SOS** (/sos) — Emergency map + SOS UI
4. **Healthcare** (/dashboard, /add-patient, etc.) — Protected, requires login

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:8080

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing — main entry |
| `/login` | Login |
| `/sos` | Emergency SOS + map |
| `/hospital-selection` | Hospital selection (protected) |
| `/dashboard` | Queue dashboard (protected) |
| `/add-patient`, `/schedule`, `/doctors`, `/analytics`, etc. | Healthcare features (protected) |

## Build & Run

```bash
pnpm build
pnpm start
```
