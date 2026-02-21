/**
 * Central route constants.
 * Project 1 shell: Landing (/), Login (/login), SOS (/sos)
 * Project 2 healthcare: protected routes under /
 */
export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  SOS: "/sos",
  DASHBOARD: "/dashboard",
  HOSPITAL_SELECTION: "/hospital-selection",
  ADD_PATIENT: "/add-patient",
  SCHEDULE: "/schedule",
  BOOK_PATIENT: "/book-patient",
  ANALYTICS: "/analytics",
  DOCTORS: "/doctors",
  PATIENT: (id: string) => `/patients/${id}`,
  OPTIMIZATION: "/optimization",
  ALERTS: "/alerts",
} as const;
