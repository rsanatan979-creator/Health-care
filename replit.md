# MediQueue - AI Hospital Queue Optimization

## Overview

MediQueue is a healthcare queue management system that uses AI-driven wait time predictions to optimize hospital patient flow. It provides real-time queue monitoring, doctor workload management, patient registration, appointment scheduling, and interactive analytics dashboards.

The application follows a monorepo structure with a React frontend and Express backend served through Vite during development. It currently uses an **in-memory database** for demo purposes (see `server/db.ts`), with Drizzle ORM configured for PostgreSQL migration when a real database is provisioned.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite with SWC (via `@vitejs/plugin-react-swc`) for fast compilation
- **Routing**: React Router DOM with protected routes and public landing/sign-in pages
- **State Management**: TanStack React Query for server state; React Context for auth state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Charts**: Recharts for analytics visualizations (bar, pie, line, area charts)
- **Styling**: Tailwind CSS with HSL-based CSS custom properties for a healthcare-themed color palette
- **Path aliases**: `@/*` maps to `./client/*`, `@shared/*` maps to `./shared/*`

### Backend Architecture
- **Framework**: Express 5 (TypeScript)
- **Integration with Vite**: During development, Express is mounted as Vite middleware via a custom plugin (`expressPlugin` in `vite.config.ts`). In production, it serves the built SPA from `dist/spa/`.
- **API Design**: RESTful JSON API under `/api/` prefix with routes for:
  - `GET /api/patients`, `GET /api/patients/:id`, `POST /api/patients`, `PUT /api/patients/:id`
  - `GET /api/doctors`, `GET /api/doctors/:id`, `GET /api/doctors/available`, `PUT /api/doctors/:id/status`
  - `GET /api/queue`, `POST /api/queue/update`, `GET /api/queue/analytics`
  - `GET /api/predict/wait-time/:patientId`, `GET /api/predict/optimize-queue`, `GET /api/predict/peak-hours`
  - `GET /api/hospitals`
- **AI/Prediction**: Wait time predictions computed server-side using heuristic factors (queue length, severity, emergency status, doctor utilization). Not calling external AI APIs currently.

### Data Layer
- **Current**: In-memory data store in `server/db.ts` with interfaces for Patient, Doctor, Appointment, Prediction, and Hospital entities
- **Future/Production**: Drizzle ORM configured with PostgreSQL (`drizzle.config.ts` reads `DATABASE_URL`). Schema defined in `shared/schema.ts`. Migrations output to `./migrations/`
- **Shared Types**: `shared/api.ts` contains TypeScript interfaces shared between client and server

### Authentication
- **Current**: Client-side only authentication using React Context (`client/context/AuthContext.tsx`). Accepts any email/password for demo purposes. User state persisted in localStorage.
- **Protected Routes**: `ProtectedRoute` component wraps authenticated pages and redirects to `/signin` if not logged in
- **User Flow**: Landing → Sign In → Hospital Selection → Dashboard

### Build & Deployment
- **Dev**: `npm run dev` starts Vite dev server on port 5000 with Express middleware
- **Build**: Two-step build — `vite build` for client SPA (output: `dist/spa/`), then esbuild for server (output: `dist/server/`)
- **Production**: `npm start` runs `node dist/server/node-build.mjs` which serves the SPA and API
- **Testing**: Vitest for unit tests (see `client/lib/utils.spec.ts`)

### Key Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Public marketing page |
| `/signin` | SignIn | Login form with demo credentials |
| `/hospital-selection` | HospitalSelection | Choose hospital after login |
| `/dashboard` | Index | Main dashboard with queue overview |
| `/dashboard/add-patient` | AddPatient | Patient registration form |
| `/dashboard/schedule` | Schedule | Doctor scheduling and appointments |
| `/dashboard/analytics` | AnalyticsNew | Charts and analytics dashboard |
| `/dashboard/doctors` | Doctors | Doctor list and status management |
| `/dashboard/patient/:patientId` | PatientDetails | Individual patient view with AI prediction |
| `/dashboard/optimization` | Optimization | AI queue optimization recommendations |
| `/dashboard/alerts` | Alerts | Real-time system alerts |

## External Dependencies

### Core Libraries
- **Express 5**: Backend HTTP server
- **Vite**: Frontend build tool and dev server
- **React 18**: UI framework
- **TypeScript**: Type safety across the stack

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled accessible component primitives (dialog, select, tabs, tooltip, etc.)
- **shadcn/ui**: Pre-built component library on top of Radix UI
- **Lucide React**: Icon library
- **Recharts**: Charting library for analytics
- **class-variance-authority (CVA)**: Component variant management
- **tailwind-merge + clsx**: Utility for merging Tailwind classes

### Data & Forms
- **TanStack React Query**: Server state management and data fetching
- **React Hook Form + @hookform/resolvers**: Form management
- **Zod**: Schema validation (shared between client and server)

### Database (configured but not actively used yet)
- **Drizzle ORM**: SQL query builder and ORM
- **drizzle-kit**: Migration tooling
- **PostgreSQL**: Target database (requires `DATABASE_URL` environment variable)

### Other
- **dotenv**: Environment variable loading
- **sonner**: Toast notifications
- **embla-carousel-react**: Carousel component
- **react-day-picker**: Date picker component
- **react-router-dom**: Client-side routing
- **vaul**: Drawer component