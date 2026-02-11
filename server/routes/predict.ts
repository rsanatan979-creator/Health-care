import { RequestHandler } from "express";
import { db } from "../db";

interface PredictionResponse {
  patientId: string;
  estimatedWaitTime: number;
  confidence: number;
  explanation: {
    baseWaitTime: number;
    emergencyFactor: number;
    severityFactor: number;
    doctorUtilizationFactor: number;
    totalFactors: string[];
  };
  recommendation: string;
  suggestedDoctor?: {
    id: string;
    name: string;
    specialization: string;
  };
}

/**
 * Predict wait time for a patient
 * GET /api/predict/wait-time/:patientId
 *
 * AI-driven prediction using:
 * - Current queue length
 * - Patient severity
 * - Emergency status
 * - Doctor utilization
 * - Average consultation time
 */
export const predictWaitTime: RequestHandler = (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = db.getPatientById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    // Get current queue state
    const allPatients = db.getPatients();
    const doctors = db.getDoctors();
    const waitingPatients = allPatients.filter((p) => p.status === "waiting");

    // Calculate base wait time (average of current queue)
    const baseWaitTime =
      waitingPatients.length > 0
        ? Math.ceil(
            waitingPatients.reduce((sum, p) => sum + p.estimatedWait, 0) /
              waitingPatients.length
          )
        : 5;

    // Emergency factor: if patient is emergency, reduce expected wait (priority)
    const emergencyFactor = patient.isEmergency ? -5 : 0;

    // Severity factor: severe cases take longer
    const severityMap = { mild: 1, moderate: 1.2, severe: 1.5 };
    const severityFactor = (severityMap[patient.severity] || 1.2) - 1;

    // Doctor utilization factor: consider if doctors are busy
    const busyDoctors = doctors.filter((d) => d.status === "busy").length;
    const totalDoctors = doctors.length;
    const utilizationRate = busyDoctors / totalDoctors;
    const doctorUtilizationFactor = Math.ceil(utilizationRate * 8);

    // Calculate final wait time
    let estimatedWait = Math.max(
      2,
      Math.round(
        baseWaitTime +
          emergencyFactor +
          severityFactor * 5 +
          doctorUtilizationFactor
      )
    );

    // Add some random variation for realism (±2 minutes)
    estimatedWait += Math.floor(Math.random() * 5) - 2;

    // Calculate confidence (0-100%)
    // Higher confidence when we have more data
    let confidence = 65 + Math.min(35, waitingPatients.length * 2);
    confidence = Math.min(95, confidence); // Cap at 95%

    // Find the best doctor for this patient
    const availableDoctors = db.getAvailableDoctors();
    let suggestedDoctor = null;
    if (availableDoctors.length > 0) {
      // Simple strategy: pick doctor with lowest current patients
      const bestDoctor = availableDoctors.reduce((prev, current) =>
        prev.currentPatients < current.currentPatients ? prev : current
      );
      suggestedDoctor = {
        id: bestDoctor.id,
        name: bestDoctor.name,
        specialization: bestDoctor.specialization,
      };
    }

    // Generate explanation
    const explanation = {
      baseWaitTime,
      emergencyFactor,
      severityFactor: Math.round(severityFactor * 100) / 100,
      doctorUtilizationFactor,
      totalFactors: [
        `Queue length: ${waitingPatients.length} patients`,
        `Doctor utilization: ${Math.round(utilizationRate * 100)}%`,
        `Patient severity: ${patient.severity.toUpperCase()}`,
        patient.isEmergency ? "Priority: EMERGENCY" : "Standard priority",
      ],
    };

    // Generate recommendation
    let recommendation = "";
    if (patient.isEmergency) {
      recommendation = `⚠️ EMERGENCY CASE: Allocate to nearest available doctor immediately. Patient: ${patient.firstName} ${patient.lastName} - ${patient.symptom}`;
    } else if (estimatedWait > 30) {
      recommendation = `Consider calling backup doctors. Current wait time is higher than target (${estimatedWait}min > 30min target).`;
    } else if (utilizationRate > 0.8) {
      recommendation = `Doctor capacity at ${Math.round(utilizationRate * 100)}%. Consider scheduling less urgent cases later.`;
    } else {
      recommendation = `Optimal allocation ready. Assign to ${suggestedDoctor?.name || "available doctor"}.`;
    }

    const response: PredictionResponse = {
      patientId,
      estimatedWaitTime: estimatedWait,
      confidence,
      explanation,
      recommendation,
      suggestedDoctor: suggestedDoctor || undefined,
    };

    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to predict wait time",
    });
  }
};

/**
 * Get optimized queue order recommendation
 * GET /api/predict/optimize-queue
 *
 * AI analyzes current queue and recommends optimal ordering
 */
export const optimizeQueue: RequestHandler = (_req, res) => {
  try {
    const patients = db.getPatients().filter((p) => p.status === "waiting");
    const doctors = db.getDoctors();

    // Score patients for priority (higher score = higher priority)
    const scoredPatients = patients.map((patient) => {
      let score = 50; // Base score

      // Emergency boost
      if (patient.isEmergency) score += 50;

      // Severity boost
      const severityBoost = {
        severe: 30,
        moderate: 15,
        mild: 5,
      };
      score += severityBoost[patient.severity] || 0;

      // Wait time boost (been waiting longer = higher priority)
      const baseLongWait = 30;
      if (patient.estimatedWait > baseLongWait) {
        score += 10;
      }

      return {
        ...patient,
        priority_score: score,
      };
    });

    // Sort by priority score
    const optimizedQueue = scoredPatients.sort(
      (a, b) => b.priority_score - a.priority_score
    );

    // Allocate doctors
    const allocations = optimizedQueue.map((patient) => {
      const availableDoctors = doctors.filter(
        (d) => d.status === "available" && d.currentPatients < d.maxCapacity
      );

      let assignedDoctor = availableDoctors[0];
      if (!assignedDoctor) {
        assignedDoctor = doctors.reduce((prev, current) =>
          prev.currentPatients < current.currentPatients ? prev : current
        );
      }

      return {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        symptom: patient.symptom,
        priority: patient.priority_score,
        isEmergency: patient.isEmergency,
        severity: patient.severity,
        recommendedDoctor: {
          id: assignedDoctor.id,
          name: assignedDoctor.name,
          specialization: assignedDoctor.specialization,
        },
        reason: patient.isEmergency
          ? "Emergency priority"
          : patient.severity === "severe"
            ? "Severe case"
            : `Waiting for ${patient.estimatedWait} minutes`,
      };
    });

    res.json({
      success: true,
      data: {
        currentQueueLength: patients.length,
        optimizedAllocations: allocations,
        totalWaitTimeReduction: Math.ceil(
          allocations.length * 2 // Estimate ~2 min reduction per optimized allocation
        ),
        recommendation:
          "Follow this queue order to minimize overall wait times and improve patient outcomes.",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to optimize queue",
    });
  }
};

/**
 * Predict peak hours
 * GET /api/predict/peak-hours
 *
 * Predict when peak hours will occur
 */
export const predictPeakHours: RequestHandler = (_req, res) => {
  try {
    // Simulate peak hour prediction based on current trends
    const patients = db.getPatients();
    
    const peakPrediction = {
      nextPeakHour: "11:00 AM - 12:00 PM",
      expectedPatientCount: patients.length + 5,
      confidence: 82,
      reason: "Typical lunch hour surge in urgent care visits",
      recommendations: [
        "Call backup staff for peak hour",
        "Reduce appointment duration for non-emergency cases",
        "Have emergency protocols ready",
      ],
    };

    res.json({
      success: true,
      data: peakPrediction,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to predict peak hours",
    });
  }
};
