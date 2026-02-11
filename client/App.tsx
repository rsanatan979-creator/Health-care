import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import HospitalSelection from "./pages/HospitalSelection";
import Index from "./pages/Index";
import AddPatient from "./pages/AddPatient";
import Schedule from "./pages/Schedule";
import BookPatient from "./pages/BookPatient";
import Analytics from "./pages/AnalyticsNew";
import Doctors from "./pages/Doctors";
import PatientDetails from "./pages/PatientDetails";
import Optimization from "./pages/Optimization";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Protected Routes */}
            <Route
              path="/hospital-selection"
              element={
                <ProtectedRoute>
                  <HospitalSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-patient"
              element={
                <ProtectedRoute>
                  <AddPatient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-patient"
              element={
                <ProtectedRoute>
                  <BookPatient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:patientId"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/optimization"
              element={
                <ProtectedRoute>
                  <Optimization />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
