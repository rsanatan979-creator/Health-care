# MediSOS + MediQueue — Unified App

Single full-stack application combining:

- **MediSOS** (/) — Emergency SOS interface with map
- **MediQueue** (/healthcare) — Hospital queue management tool

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:8080

## Routes

| Path | Description |
|------|-------------|
| `/` | MediSOS — main entry, map + SOS |
| `/healthcare` | MediQueue landing |
| `/healthcare/signin` | Sign in |
| `/healthcare/dashboard` | Queue dashboard |
| `/healthcare/*` | All healthcare tool routes |

## Build & Run

```bash
pnpm build
pnpm start
```

## Structure

```
medisos-unified/
├── client/
│   ├── features/
│   │   └── sos/pages/    # SOS + map UI
│   ├── pages/            # Healthcare pages
│   └── components/
├── server/               # Express API
├── shared/               # Types, routes
```
