import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, AlertCircle, User, Phone, Mail, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Patient } from "@shared/api";

const PatientDetails = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patients/${patientId}`);
      const data = await response.json();

      if (data.success) {
        setPatient(data.data);
        // Fetch AI prediction for this patient
        fetchPrediction(data.data.id);
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrediction = async (pId: string) => {
    try {
      const response = await fetch(`/api/predict/wait-time/${pId}`);
      const data = await response.json();
      if (data.success) {
        setPrediction(data.data);
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading patient details...</p>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Patient not found</p>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-success/20 text-success border-success/30";
      case "moderate":
        return "bg-warning/20 text-warning border-warning/30";
      case "severe":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-warning/20 text-warning border-warning/30";
      case "in-progress":
        return "bg-primary/20 text-primary border-primary/30";
      case "completed":
        return "bg-success/20 text-success border-success/30";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
              <p className="text-sm text-muted-foreground">Complete patient information & AI insights</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {patient.firstName} {patient.lastName}
                    </h2>
                    <p className="text-muted-foreground mt-1">Patient ID: {patient.id}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <span className={`inline-block px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status === "waiting"
                      ? "Waiting"
                      : patient.status === "in-progress"
                        ? "In Progress"
                        : "Completed"}
                  </span>
                  {patient.isEmergency && (
                    <div className="flex items-center gap-2 text-accent justify-end">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Emergency</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Wait Time</p>
                  <p className="text-2xl font-bold text-primary">{patient.estimatedWait}m</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Arrival</p>
                  <p className="text-xl font-bold text-foreground">{patient.arrivalTime}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Severity</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(patient.severity)}`}>
                    {patient.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gender</p>
                    <p className="font-medium text-foreground capitalize">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                    <p className="font-medium text-foreground">{patient.dateOfBirth}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-foreground">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium text-foreground">{patient.phone}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Medical Information */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Medical Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Primary Symptom</p>
                  <p className="text-lg font-semibold text-foreground">{patient.symptom}</p>
                </div>
                {patient.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
                    <p className="text-foreground bg-muted/50 p-3 rounded-lg">{patient.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - AI Insights */}
          <div className="space-y-6">
            {/* Doctor Assignment */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Doctor Assignment</h3>
              {patient.doctorAssigned ? (
                <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                  <p className="font-semibold text-success mb-1">✓ Assigned</p>
                  <p className="text-foreground font-medium">{patient.doctorAssigned}</p>
                </div>
              ) : (
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/30">
                  <p className="font-semibold text-warning">Waiting for assignment</p>
                  <p className="text-sm text-muted-foreground mt-1">Will be assigned soon based on availability</p>
                </div>
              )}
            </Card>

            {/* AI Predictions */}
            {prediction && (
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  AI Insights
                </h3>

                {/* Wait Time Prediction */}
                <div className="p-4 bg-white/50 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Predicted Wait Time</p>
                  <p className="text-3xl font-bold text-primary">{prediction.estimatedWaitTime}m</p>
                </div>

                {/* Confidence */}
                <div className="p-4 bg-white/50 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Confidence</p>
                    <p className="text-sm font-bold text-success">{prediction.confidence}%</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Recommendation</p>
                  <p className="text-sm font-medium text-foreground">{prediction.recommendation}</p>
                </div>

                {/* Suggested Doctor */}
                {prediction.suggestedDoctor && (
                  <div className="mt-4 p-4 bg-white/50 rounded-lg border-l-4 border-l-success">
                    <p className="text-sm text-muted-foreground mb-2">Suggested Doctor</p>
                    <p className="font-semibold text-foreground">{prediction.suggestedDoctor.name}</p>
                    <p className="text-xs text-muted-foreground">{prediction.suggestedDoctor.specialization}</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDetails;
