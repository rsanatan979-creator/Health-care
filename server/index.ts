import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./db";
import { handleDemo } from "./routes/demo";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
} from "./routes/patients";
import { getDoctors, getDoctorById, getAvailableDoctors, updateDoctorStatus } from "./routes/doctors";
import { getQueueStatus, updateQueue, getQueueAnalytics } from "./routes/queue";
import { predictWaitTime, optimizeQueue, predictPeakHours } from "./routes/predict";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, _res, next) => {
    if (req.path.startsWith("/api")) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check
  app.get("/api/ping", (_req, res, _next) => {
    try {
      const ping = process.env.PING_MESSAGE ?? "pong";
      res.json({ message: ping });
    } catch (error) {
      console.error("Error in /api/ping:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Example demo route
  app.get("/api/demo", (req, res, next) => {
    try {
      handleDemo(req, res, next);
    } catch (error) {
      console.error("Error in /api/demo:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // ==================== PATIENT ROUTES ====================
  /**
   * Get all patients: GET /api/patients
   * Get specific patient: GET /api/patients/:id
   * Create patient: POST /api/patients
   * Update patient: PUT /api/patients/:id
   */
  app.get("/api/patients", (req, res, next) => {
    try {
      getPatients(req, res, next);
    } catch (error) {
      console.error("Error in /api/patients:", error);
      res.status(500).json({ success: false, error: "Failed to fetch patients" });
    }
  });
  app.get("/api/patients/:id", (req, res, next) => {
    try {
      getPatientById(req, res, next);
    } catch (error) {
      console.error("Error in /api/patients/:id:", error);
      res.status(500).json({ success: false, error: "Failed to fetch patient" });
    }
  });
  app.post("/api/patients", (req, res, next) => {
    try {
      createPatient(req, res, next);
    } catch (error) {
      console.error("Error in POST /api/patients:", error);
      res.status(500).json({ success: false, error: "Failed to create patient" });
    }
  });
  app.put("/api/patients/:id", (req, res, next) => {
    try {
      updatePatient(req, res, next);
    } catch (error) {
      console.error("Error in PUT /api/patients/:id:", error);
      res.status(500).json({ success: false, error: "Failed to update patient" });
    }
  });

  // ==================== DOCTOR ROUTES ====================
  /**
   * Get all doctors: GET /api/doctors
   * Get specific doctor: GET /api/doctors/:id
   * Get available doctors: GET /api/doctors/available
   * Update doctor status: PUT /api/doctors/:id
   */
  app.get("/api/doctors", (req, res, next) => {
    try {
      getDoctors(req, res, next);
    } catch (error) {
      console.error("Error in /api/doctors:", error);
      res.status(500).json({ success: false, error: "Failed to fetch doctors" });
    }
  });
  app.get("/api/doctors/available", (req, res, next) => {
    try {
      getAvailableDoctors(req, res, next);
    } catch (error) {
      console.error("Error in /api/doctors/available:", error);
      res.status(500).json({ success: false, error: "Failed to fetch available doctors" });
    }
  });
  app.get("/api/doctors/:id", (req, res, next) => {
    try {
      getDoctorById(req, res, next);
    } catch (error) {
      console.error("Error in /api/doctors/:id:", error);
      res.status(500).json({ success: false, error: "Failed to fetch doctor" });
    }
  });
  app.put("/api/doctors/:id", (req, res, next) => {
    try {
      updateDoctorStatus(req, res, next);
    } catch (error) {
      console.error("Error in PUT /api/doctors/:id:", error);
      res.status(500).json({ success: false, error: "Failed to update doctor" });
    }
  });

  // ==================== QUEUE ROUTES ====================
  /**
   * Get queue status: GET /api/queue
   * Update queue: POST /api/queue/update
   * Get analytics: GET /api/queue/analytics
   */
  app.get("/api/queue", (req, res, next) => {
    try {
      getQueueStatus(req, res, next);
    } catch (error) {
      console.error("Error in /api/queue:", error);
      res.status(500).json({ success: false, error: "Failed to fetch queue" });
    }
  });
  app.post("/api/queue/update", (req, res, next) => {
    try {
      updateQueue(req, res, next);
    } catch (error) {
      console.error("Error in /api/queue/update:", error);
      res.status(500).json({ success: false, error: "Failed to update queue" });
    }
  });
  app.get("/api/queue/analytics", (req, res, next) => {
    try {
      getQueueAnalytics(req, res, next);
    } catch (error) {
      console.error("Error in /api/queue/analytics:", error);
      res.status(500).json({ success: false, error: "Failed to fetch analytics" });
    }
  });

  // ==================== PREDICTION ROUTES (AI) ====================
  /**
   * Predict wait time: GET /api/predict/wait-time/:patientId
   * Optimize queue: GET /api/predict/optimize-queue
   * Predict peak hours: GET /api/predict/peak-hours
   */
  app.get("/api/predict/wait-time/:patientId", (req, res, next) => {
    try {
      predictWaitTime(req, res, next);
    } catch (error) {
      console.error("Error in /api/predict/wait-time:", error);
      res.status(500).json({ success: false, error: "Failed to predict wait time" });
    }
  });
  app.get("/api/predict/optimize-queue", (req, res, next) => {
    try {
      optimizeQueue(req, res, next);
    } catch (error) {
      console.error("Error in /api/predict/optimize-queue:", error);
      res.status(500).json({ success: false, error: "Failed to optimize queue" });
    }
  });
  app.get("/api/predict/peak-hours", (req, res, next) => {
    try {
      predictPeakHours(req, res, next);
    } catch (error) {
      console.error("Error in /api/predict/peak-hours:", error);
      res.status(500).json({ success: false, error: "Failed to predict peak hours" });
    }
  });

  // ==================== HOSPITAL ROUTES ====================
  app.get("/api/hospitals", (_req, res) => {
    try {
      const hospitalList = db.getHospitals();
      res.json({ success: true, data: hospitalList });
    } catch (error) {
      console.error("Error in /api/hospitals:", error);
      res.status(500).json({ success: false, error: "Failed to fetch hospitals" });
    }
  });

  // Error handling middleware
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message || "Unknown error",
    });
  });

  return app;
}
