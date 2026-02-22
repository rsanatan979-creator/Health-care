import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Clock, Users, Activity, Plus, TrendingUp, Zap, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import type { Patient, Doctor } from "@shared/api";

const CountdownTimer = ({ minutes, status }: { minutes: number; status?: string }) => {
  const [seconds, setSeconds] = useState(minutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (status === "in-progress") {
          return prev + 1; // Count up for patients in checking
        }
        return prev > 0 ? prev - 1 : 0; // Count down for waiting
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const displayTime = useMemo(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [seconds]);

  return (
    <div className="text-2xl font-bold text-primary flex items-center justify-end gap-1 font-mono">
      {displayTime}
      <Clock className="w-5 h-5 animate-pulse text-primary/50" />
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [queue, setQueue] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [avgWaitTime, setAvgWaitTime] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<{ title: string; description: string } | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fetch queue data from API
  const fetchQueueData = async () => {
    try {
      const response = await fetch("/api/queue");
      const data = await response.json();
      if (data.success) {
        const waitingPatients = data.data.patients.filter(
          (p: Patient) => p.status === "waiting" || p.status === "in-progress"
        );
        setQueue(waitingPatients);
        setTotalPatients(data.data.totalPatients);
        setAvgWaitTime(data.data.avgWaitTime);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  // Fetch doctor data from API
  const fetchDoctorData = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Fetch AI insights
  const fetchAiInsights = async () => {
    try {
      const response = await fetch("/api/predict/peak-hours");
      const data = await response.json();
      if (data.success) {
        setAiInsight({
          title: `Peak Hour: ${data.data.nextPeakHour}`,
          description: data.data.reason,
        });
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchQueueData(), fetchDoctorData(), fetchAiInsights()]);
      setLoading(false);
    };

    loadData();

    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(async () => {
      try {
        await fetch("/api/queue/update", { method: "POST" });
        fetchQueueData();
        fetchDoctorData();
      } catch (error) {
        console.error("Error updating queue simulation:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success/20 text-success border-success/30";
      case "busy":
        return "bg-primary/20 text-primary border-primary/30";
      case "break":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted";
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchQueueData(), fetchDoctorData()]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              H
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MediQueue</h1>
              <p className="text-xs text-muted-foreground">AI-Driven Queue Optimization</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/sos" className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                <AlertCircle className="w-4 h-4" />
                SOS
              </Link>
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/alerts">
                <AlertCircle className="w-4 h-4" />
                Alerts
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/optimization">
                <Zap className="w-4 h-4" />
                Optimize
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/doctors">
                <Users className="w-4 h-4" />
                Doctors
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/analytics">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Link>
            </Button>
            <Button asChild variant="default" size="sm" className="gap-2">
              <Link to="/add-patient">
                <Plus className="w-4 h-4" />
                Add Patient
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/schedule">
                <Clock className="w-4 h-4" />
                Schedule
              </Link>
            </Button>

            {/* User Menu */}
            <div className="ml-4 pl-4 border-l border-border flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-foreground">{totalPatients}</p>
                <p className="text-xs text-muted-foreground mt-2">In queue today</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Avg Wait Time
                </p>
                <p className="text-3xl font-bold text-foreground">{avgWaitTime}m</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  ↓ 5% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-accent">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Emergencies
                </p>
                <p className="text-3xl font-bold text-accent">
                  {queue.filter((p) => p.isEmergency).length}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {queue.filter((p) => p.isEmergency).length > 0 ? "Urgent cases" : "No emergencies"}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center ${queue.filter((p) => p.isEmergency).length > 0 ? "animate-pulse-custom" : ""}`}>
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Doctors Available
                </p>
                <p className="text-3xl font-bold text-success">
                  {doctors.filter((d) => d.status === "available").length}/{doctors.length}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Ready to assist</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Live Queue Status
                </h2>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse-custom"></span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading queue data...</p>
                    </div>
                  </div>
                ) : queue.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No patients in queue
                  </p>
                ) : (
                  queue.map((patient, index) => (
                    <div
                      key={patient.id}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        patient.isEmergency
                          ? "bg-accent/10 border-accent/30 border-l-4 border-l-accent"
                          : "bg-card border-border hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold text-foreground">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            {patient.isEmergency && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                Emergency
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Arrival</p>
                              <p className="font-medium text-foreground">
                                {patient.arrivalTime}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Symptom</p>
                              <p className="font-medium text-foreground">
                                {patient.symptom}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <CountdownTimer minutes={patient.estimatedWait} status={patient.status} />
                          <p className="text-xs text-muted-foreground">
                            {patient.status === "in-progress" ? "time elapsed" : "remaining time"}
                          </p>
                          {patient.doctorAssigned && (
                            <div className="mt-2">
                              <p className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 justify-end ${
                                patient.status === "in-progress" 
                                  ? "bg-primary/20 text-primary border border-primary/30" 
                                  : "bg-success/10 text-success"
                              }`}>
                                {patient.status === "in-progress" && <Activity className="w-3 h-3 animate-pulse" />}
                                {patient.doctorAssigned}
                                {patient.status === "in-progress" && <span className="ml-1">(In Checking)</span>}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Doctors & Predictions */}
          <div className="space-y-6">
            {/* Doctor Status */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Doctor Status</h3>
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.specialization}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(
                          doctor.status
                        )}`}
                      >
                        {doctor.status === "available"
                          ? "Available"
                          : doctor.status === "busy"
                            ? "Busy"
                            : "On Break"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Current patients: {doctor.currentPatients}
                      </span>
                      {doctor.status === "available" && (
                        <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse-custom"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI Insights
              </h3>
              <div className="space-y-3 text-sm">
                {aiInsight && (
                  <div className="p-3 bg-white/50 rounded-lg">
                    <p className="font-medium text-foreground mb-1">{aiInsight.title}</p>
                    <p className="text-muted-foreground">{aiInsight.description}</p>
                  </div>
                )}
                <div className="p-3 bg-white/50 rounded-lg">
                  <p className="font-medium text-foreground mb-1">
                    {queue.filter((p) => p.isEmergency).length > 0
                      ? "Emergency Cases"
                      : "Current Status"}
                  </p>
                  <p className="text-muted-foreground">
                    {queue.filter((p) => p.isEmergency).length > 0
                      ? `${queue.filter((p) => p.isEmergency).length} emergency case(s) require immediate attention`
                      : "All queue conditions are optimal"}
                  </p>
                </div>
                <div className="p-3 bg-white/50 rounded-lg">
                  <p className="font-medium text-foreground mb-1">Doctor Availability</p>
                  <p className="text-muted-foreground">
                    {doctors.filter((d) => d.status === "available").length} out of{" "}
                    {doctors.length} doctors available
                  </p>
                </div>
                <div className="p-3 bg-white/50 rounded-lg">
                  <p className="font-medium text-foreground mb-1">System Confidence</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">92% confidence</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
