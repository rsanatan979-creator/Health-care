import { RequestHandler } from "express";
import { db } from "../db";

/**
 * Get queue status and statistics
 * GET /api/queue
 */
export const getQueueStatus: RequestHandler = (_req, res) => {
  try {
    const stats = db.getQueueStats();
    const patients = db.getPatients().filter((p) => p.status === "waiting" || p.status === "in-progress");
    
    res.json({
      success: true,
      data: {
        ...stats,
        patients,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch queue status",
    });
  }
};

/**
 * Simulate queue update (for real-time updates)
 * POST /api/queue/update
 */
export const updateQueue: RequestHandler = (_req, res) => {
  try {
    db.simulateQueueUpdate();
    const stats = db.getQueueStats();

    res.json({
      success: true,
      data: stats,
      message: "Queue updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update queue",
    });
  }
};

/**
 * Get queue analytics
 * GET /api/queue/analytics
 */
export const getQueueAnalytics: RequestHandler = (_req, res) => {
  try {
    const patients = db.getPatients();
    const doctors = db.getDoctors();

    // Calculate metrics
    const totalPatients = patients.length;
    const averageWaitTime = patients.length > 0
      ? Math.round(
          patients.reduce((sum, p) => sum + p.estimatedWait, 0) / patients.length
        )
      : 0;

    const urgentCases = patients.filter((p) => p.isEmergency).length;
    const completedCases = patients.filter((p) => p.status === "completed").length;
    
    // Doctor utilization
    const doctorUtilization = doctors.map((d) => ({
      name: d.name,
      specialization: d.specialization,
      utilization: (d.currentPatients / d.maxCapacity) * 100,
      status: d.status,
      currentPatients: d.currentPatients,
      maxCapacity: d.maxCapacity,
    }));

    // Symptom distribution
    const symptomDistribution = patients.reduce(
      (acc, patient) => {
        acc[patient.symptom] = (acc[patient.symptom] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Severity distribution
    const severityDistribution = {
      mild: patients.filter((p) => p.severity === "mild").length,
      moderate: patients.filter((p) => p.severity === "moderate").length,
      severe: patients.filter((p) => p.severity === "severe").length,
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalPatients,
          averageWaitTime,
          urgentCases,
          completedCases,
        },
        doctorUtilization,
        symptomDistribution,
        severityDistribution,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics",
    });
  }
};
