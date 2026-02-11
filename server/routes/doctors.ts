import { RequestHandler } from "express";
import { db } from "../db";

/**
 * Get all doctors
 * GET /api/doctors
 */
export const getDoctors: RequestHandler = (_req, res) => {
  try {
    const doctors = db.getDoctors();
    res.json({
      success: true,
      data: doctors,
      count: doctors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch doctors",
    });
  }
};

/**
 * Get doctor by ID
 * GET /api/doctors/:id
 */
export const getDoctorById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const doctor = db.getDoctorById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch doctor",
    });
  }
};

/**
 * Get available doctors (not at max capacity and available status)
 * GET /api/doctors/available
 */
export const getAvailableDoctors: RequestHandler = (_req, res) => {
  try {
    const availableDoctors = db.getAvailableDoctors();
    res.json({
      success: true,
      data: availableDoctors,
      count: availableDoctors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch available doctors",
    });
  }
};

/**
 * Update doctor status
 * PUT /api/doctors/:id
 */
export const updateDoctorStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentPatients } = req.body;

    if (!status || !["available", "busy", "break"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be 'available', 'busy', or 'break'",
      });
    }

    const updates: Record<string, string | number> = { status };
    if (currentPatients !== undefined) {
      updates.currentPatients = currentPatients;
    }

    const updatedDoctor = db.updateDoctor(id, updates as any);

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: updatedDoctor,
      message: "Doctor status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update doctor",
    });
  }
};
