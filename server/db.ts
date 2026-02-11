// In-memory database for the demo
// In production, this would use SQLite or another database

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

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  status: "available" | "busy" | "break";
  currentPatients: number;
  maxCapacity: number;
  experience: number; // Years of experience
  bio: string; // Doctor biodata
  feedback: {
    rating: number;
    comment: string;
    patientName: string;
  }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledTime: string;
  duration: number;
  confirmed: boolean;
  notes?: string;
}

export interface Prediction {
  patientId: string;
  estimatedWaitTime: number;
  confidence: number;
  reason: string;
  recommendation?: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: "private" | "government";
  location: string;
  distance: string;
  rating: number;
  openingTime: string;
  closingTime: string;
}

// In-memory storage
let hospitals: Hospital[] = [
  {
    id: "H001",
    name: "City Central Hospital",
    type: "government",
    location: "Downtown, Metro City",
    distance: "2.5 km",
    rating: 4.5,
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
  },
  {
    id: "H002",
    name: "St. Mary's Medical Center",
    type: "private",
    location: "North Wing, Metro City",
    distance: "5.1 km",
    rating: 4.8,
    openingTime: "24 Hours",
    closingTime: "24 Hours",
  },
  {
    id: "H003",
    name: "General Public Health Clinic",
    type: "government",
    location: "South Metro",
    distance: "1.2 km",
    rating: 3.9,
    openingTime: "07:00 AM",
    closingTime: "08:00 PM",
  },
  {
    id: "H004",
    name: "Sunrise Specialty Clinic",
    type: "private",
    location: "East Side Heights",
    distance: "8.4 km",
    rating: 4.6,
    openingTime: "09:00 AM",
    closingTime: "06:00 PM",
  },
];

let patients: Patient[] = [
  {
    id: "P001",
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
    phone: "+1-555-0101",
    dateOfBirth: "1985-03-15",
    gender: "male",
    symptom: "Chest Pain",
    severity: "severe",
    isEmergency: false,
    notes: "Intermittent chest pain for 2 hours",
    arrivalTime: "09:15 AM",
    estimatedWait: 8,
    doctorAssigned: "Dr. Sarah Williams",
    status: "in-progress",
  },
  {
    id: "P002",
    firstName: "Emma",
    lastName: "Johnson",
    email: "emma@example.com",
    phone: "+1-555-0102",
    dateOfBirth: "1992-07-22",
    gender: "female",
    symptom: "Severe Allergic Reaction",
    severity: "severe",
    isEmergency: true,
    notes: "Breathing difficulty, visible swelling",
    arrivalTime: "09:30 AM",
    estimatedWait: 12,
    doctorAssigned: "Dr. Michael Chen",
    status: "in-progress",
  },
  {
    id: "P003",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert@example.com",
    phone: "+1-555-0103",
    dateOfBirth: "1978-11-08",
    gender: "male",
    symptom: "Broken Arm",
    severity: "severe",
    isEmergency: false,
    notes: "Fall from height, left arm broken",
    arrivalTime: "09:45 AM",
    estimatedWait: 22,
    status: "waiting",
  },
  {
    id: "P004",
    firstName: "Sophia",
    lastName: "Garcia",
    email: "sophia@example.com",
    phone: "+1-555-0104",
    dateOfBirth: "1995-12-01",
    gender: "female",
    symptom: "High Fever",
    severity: "moderate",
    isEmergency: false,
    notes: "Fever of 103F for 24 hours",
    arrivalTime: "10:05 AM",
    estimatedWait: 15,
    status: "waiting",
  },
  {
    id: "P005",
    firstName: "David",
    lastName: "Miller",
    email: "david@example.com",
    phone: "+1-555-0105",
    dateOfBirth: "1962-05-20",
    gender: "male",
    symptom: "Shortness of Breath",
    severity: "severe",
    isEmergency: true,
    notes: "COPD exacerbation suspected",
    arrivalTime: "10:15 AM",
    estimatedWait: 5,
    doctorAssigned: "Dr. Sarah Williams",
    status: "in-progress",
  },
];

let doctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Sarah Williams",
    specialization: "Emergency Medicine",
    status: "busy",
    currentPatients: 2,
    maxCapacity: 5,
    experience: 12,
    bio: "Specialist in trauma and acute care with over a decade of experience in high-pressure emergency departments.",
    feedback: [
      { rating: 5, comment: "Incredible doctor, saved my life!", patientName: "John Smith" },
      { rating: 4, comment: "Very professional and calm.", patientName: "Emma Davis" }
    ]
  },
  {
    id: "D002",
    name: "Dr. Michael Chen",
    specialization: "Cardiology",
    status: "busy",
    currentPatients: 1,
    maxCapacity: 4,
    experience: 15,
    bio: "Board-certified cardiologist focusing on preventative heart health and complex cardiovascular conditions.",
    feedback: [
      { rating: 5, comment: "Extremely knowledgeable and caring.", patientName: "Robert Brown" }
    ]
  },
  {
    id: "D003",
    name: "Dr. Jennifer Lee",
    specialization: "Orthopedics",
    status: "available",
    currentPatients: 0,
    maxCapacity: 5,
    experience: 8,
    bio: "Expert in sports medicine and joint replacement surgery, helping patients regain mobility.",
    feedback: [
      { rating: 5, comment: "Back on my feet thanks to Dr. Lee!", patientName: "Sophia Garcia" }
    ]
  },
  {
    id: "D004",
    name: "Dr. Robert Martinez",
    specialization: "General Medicine",
    status: "break",
    currentPatients: 0,
    maxCapacity: 6,
    experience: 20,
    bio: "Family physician dedicated to holistic care and long-term wellness for patients of all ages.",
    feedback: []
  },
  {
    id: "D005",
    name: "Dr. Lisa Wong",
    specialization: "Pediatrics",
    status: "available",
    currentPatients: 0,
    maxCapacity: 4,
    experience: 10,
    bio: "Compassionate pediatrician specializing in childhood development and chronic pediatric conditions.",
    feedback: [
      { rating: 5, comment: "Wonderful with my kids!", patientName: "David Miller" }
    ]
  },
  {
    id: "D006",
    name: "Dr. James Wilson",
    specialization: "Neurology",
    status: "available",
    currentPatients: 0,
    maxCapacity: 3,
    experience: 18,
    bio: "Leading neurologist focused on headache management and neuro-rehabilitation.",
    feedback: []
  },
];

let appointments: Appointment[] = [];

// Patient operations
export const db = {
  // Patient operations
  getPatients: (): Patient[] => patients,

  getPatientById: (id: string): Patient | undefined =>
    patients.find((p) => p.id === id),

  addPatient: (patientData: Omit<Patient, "id" | "arrivalTime" | "estimatedWait" | "status"> & { doctorAssigned?: string; scheduledTime?: string; status?: Patient["status"] }): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: `P${String(patients.length + 1).padStart(3, "0")}`,
      arrivalTime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      estimatedWait: patientData.status === "in-progress" ? 0 : (Math.floor(Math.random() * 30) + 5),
      status: patientData.status || "waiting",
    };
    patients.push(newPatient);
    
    // If a doctor is assigned, update their status
    if (newPatient.doctorAssigned) {
      const doctor = doctors.find(d => d.name === newPatient.doctorAssigned);
      if (doctor) {
        doctor.currentPatients += 1;
        if (doctor.currentPatients >= doctor.maxCapacity) {
          doctor.status = "busy";
        }
      }
    }
    
    return newPatient;
  },

  updatePatient: (id: string, updates: Partial<Patient>): Patient | undefined => {
    const index = patients.findIndex((p) => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      return patients[index];
    }
    return undefined;
  },

  // Doctor operations
  getDoctors: (): Doctor[] => doctors,

  getDoctorById: (id: string): Doctor | undefined =>
    doctors.find((d) => d.id === id),

  updateDoctor: (id: string, updates: Partial<Doctor>): Doctor | undefined => {
    const index = doctors.findIndex((d) => d.id === id);
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...updates };
      return doctors[index];
    }
    return undefined;
  },

  getAvailableDoctors: (): Doctor[] =>
    doctors.filter((d) => d.status === "available" && d.currentPatients < d.maxCapacity),

  // Hospital operations
  getHospitals: (): Hospital[] => hospitals,

  // Appointment operations
  getAppointments: (): Appointment[] => appointments,

  addAppointment: (
    patientId: string,
    doctorId: string,
    scheduledTime: string
  ): Appointment | null => {
    const doctor = db.getDoctorById(doctorId);
    if (!doctor || doctor.currentPatients >= doctor.maxCapacity) {
      return null;
    }

    const appointment: Appointment = {
      id: `A${String(appointments.length + 1).padStart(3, "0")}`,
      patientId,
      doctorId,
      scheduledTime,
      duration: 30,
      confirmed: false,
    };

    appointments.push(appointment);
    return appointment;
  },

  // Queue operations
  getQueueStats: () => {
    const waitingPatients = patients.filter((p) => p.status === "waiting");
    const avgWait =
      waitingPatients.length > 0
        ? waitingPatients.reduce((sum, p) => sum + p.estimatedWait, 0) /
          waitingPatients.length
        : 0;

    return {
      totalPatients: patients.length,
      waitingPatients: waitingPatients.length,
      avgWaitTime: Math.round(avgWait),
      emergencyCount: patients.filter((p) => p.isEmergency).length,
      completedToday: patients.filter((p) => p.status === "completed").length,
    };
  },

  // Simulation - update wait times
  simulateQueueUpdate: () => {
    patients.forEach((patient) => {
      if (patient.estimatedWait > 0) {
        patient.estimatedWait = Math.max(0, patient.estimatedWait - 1);
      }
    });
  },
};
