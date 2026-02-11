/**
 * Shared types between client and server
 * Used for healthcare appointment and queue management system
 */

// ==================== PATIENT ====================
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  isEmergency: boolean;
  notes: string;
  arrivalTime: string;
  estimatedWait: number;
  doctorAssigned?: string;
  status: "waiting" | "in-progress" | "completed";
}

export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  symptom: string;
  severity?: "mild" | "moderate" | "severe";
  isEmergency?: boolean;
  notes?: string;
}

export interface PatientsResponse {
  success: boolean;
  data: Patient[];
  count: number;
}

// ==================== DOCTOR ====================
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  status: "available" | "busy" | "break";
  currentPatients: number;
  maxCapacity: number;
}

export interface DoctorsResponse {
  success: boolean;
  data: Doctor[];
  count: number;
}

// ==================== QUEUE ====================
export interface QueueStats {
  totalPatients: number;
  waitingPatients: number;
  avgWaitTime: number;
  emergencyCount: number;
  completedToday: number;
}

export interface QueueStatusResponse {
  success: boolean;
  data: {
    totalPatients: number;
    waitingPatients: number;
    avgWaitTime: number;
    emergencyCount: number;
    completedToday: number;
    patients: Patient[];
    timestamp: string;
  };
}

export interface QueueAnalyticsResponse {
  success: boolean;
  data: {
    overview: {
      totalPatients: number;
      averageWaitTime: number;
      urgentCases: number;
      completedCases: number;
    };
    doctorUtilization: Array<{
      name: string;
      specialization: string;
      utilization: number;
      status: string;
      currentPatients: number;
      maxCapacity: number;
    }>;
    symptomDistribution: Record<string, number>;
    severityDistribution: {
      mild: number;
      moderate: number;
      severe: number;
    };
    timestamp: string;
  };
}

// ==================== PREDICTION (AI) ====================
export interface PredictionResponse {
  success: boolean;
  data: {
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
  };
  timestamp: string;
}

export interface OptimizeQueueResponse {
  success: boolean;
  data: {
    currentQueueLength: number;
    optimizedAllocations: Array<{
      patientId: string;
      patientName: string;
      symptom: string;
      priority: number;
      isEmergency: boolean;
      severity: string;
      recommendedDoctor: {
        id: string;
        name: string;
        specialization: string;
      };
      reason: string;
    }>;
    totalWaitTimeReduction: number;
    recommendation: string;
  };
  timestamp: string;
}

// ==================== DEMO ====================
export interface DemoResponse {
  message: string;
}
