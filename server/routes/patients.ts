import { RequestHandler } from "express";
import { db, Patient } from "../db";

interface PatientRequest {
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
}

/**
 * Get all patients
 * GET /api/patients
 */
export const getPatients: RequestHandler = (_req, res) => {
  try {
    const patients = db.getPatients();
    res.json({
      success: true,
      data: patients,
      count: patients.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch patients",
    });
  }
};

/**
 * Get patient by ID
 * GET /api/patients/:id
 */
export const getPatientById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const patient = db.getPatientById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch patient",
    });
  }
};

/**
 * Create a new patient
 * POST /api/patients
 */
export const createPatient: RequestHandler = (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, symptom, severity, isEmergency, notes } = req.body as PatientRequest;

    // Validation
    if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender || !symptom) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const newPatient = db.addPatient({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      symptom,
      severity: severity || "moderate",
      isEmergency: isEmergency || false,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      data: newPatient,
      message: `Patient ${firstName} ${lastName} added successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create patient",
    });
  }
};

/**
 * Update patient
 * PUT /api/patients/:id
 */
export const updatePatient: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPatient = db.updatePatient(id, updates);

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    res.json({
      success: true,
      data: updatedPatient,
      message: "Patient updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update patient",
    });
  }
};
