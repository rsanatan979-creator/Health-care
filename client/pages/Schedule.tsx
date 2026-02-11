import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AppointmentSlot {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  time: string;
  patient?: string;
  isBooked: boolean;
  aiConfidence?: number;
  remainingSeconds?: number;
}

interface DoctorSchedule {
  id: string;
  name: string;
  specialization: string;
  shifts: {
    time: string;
    status: "available" | "break" | "off";
  }[];
  slots: AppointmentSlot[];
}

const Schedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<DoctorSchedule[]>([
    {
      id: "D001",
      name: "Dr. Sarah Williams",
      specialization: "Emergency Medicine",
      shifts: [
        { time: "08:00 - 10:00", status: "available" },
        { time: "10:00 - 12:00", status: "available" },
        { time: "12:00 - 13:00", status: "break" },
        { time: "13:00 - 15:00", status: "available" },
        { time: "15:00 - 17:00", status: "available" },
      ],
      slots: [
        { id: "S001", doctorId: "D001", doctorName: "Dr. Sarah Williams", specialization: "Emergency Medicine", time: "08:00", patient: "John Smith", isBooked: true },
        { id: "S002", doctorId: "D001", doctorName: "Dr. Sarah Williams", specialization: "Emergency Medicine", time: "08:30", isBooked: false, remainingSeconds: 1800 },
        { id: "S003", doctorId: "D001", doctorName: "Dr. Sarah Williams", specialization: "Emergency Medicine", time: "09:00", patient: "Emma Johnson", isBooked: true, aiConfidence: 92 },
        { id: "S004", doctorId: "D001", doctorName: "Dr. Sarah Williams", specialization: "Emergency Medicine", time: "09:30", isBooked: false, remainingSeconds: 3600 },
      ],
    },
    {
      id: "D002",
      name: "Dr. Michael Chen",
      specialization: "Cardiology",
      shifts: [
        { time: "08:00 - 10:00", status: "available" },
        { time: "10:00 - 12:00", status: "available" },
        { time: "12:00 - 13:00", status: "break" },
        { time: "13:00 - 15:00", status: "off" },
        { time: "15:00 - 17:00", status: "available" },
      ],
      slots: [
        { id: "S101", doctorId: "D002", doctorName: "Dr. Michael Chen", specialization: "Cardiology", time: "08:00", patient: "Robert Brown", isBooked: true, aiConfidence: 85 },
        { id: "S102", doctorId: "D002", doctorName: "Dr. Michael Chen", specialization: "Cardiology", time: "08:30", isBooked: false, remainingSeconds: 900 },
        { id: "S103", doctorId: "D002", doctorName: "Dr. Michael Chen", specialization: "Cardiology", time: "09:00", isBooked: false, remainingSeconds: 2700 },
      ],
    },
    {
      id: "D003",
      name: "Dr. Jennifer Lee",
      specialization: "Orthopedics",
      shifts: [
        { time: "09:00 - 11:00", status: "available" },
        { time: "11:00 - 13:00", status: "available" },
        { time: "13:00 - 14:00", status: "break" },
        { time: "14:00 - 16:00", status: "available" },
        { time: "16:00 - 18:00", status: "available" },
      ],
      slots: [
        { id: "S201", doctorId: "D003", doctorName: "Dr. Jennifer Lee", specialization: "Orthopedics", time: "09:00", isBooked: false, remainingSeconds: 1200 },
        { id: "S202", doctorId: "D003", doctorName: "Dr. Jennifer Lee", specialization: "Orthopedics", time: "09:30", patient: "Lisa Davis", isBooked: true, aiConfidence: 78 },
        { id: "S203", doctorId: "D003", doctorName: "Dr. Jennifer Lee", specialization: "Orthopedics", time: "10:00", isBooked: false, remainingSeconds: 3000 },
      ],
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) => ({
          ...doctor,
          slots: doctor.slots.map((slot) => {
            if (slot.remainingSeconds && slot.remainingSeconds > 0) {
              return { ...slot, remainingSeconds: slot.remainingSeconds - 1 };
            }
            return slot;
          }),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSchedule = (doctorId: string, doctorName: string, slotId: string, slotTime: string) => {
    navigate(`/book-patient?doctorId=${doctorId}&doctorName=${encodeURIComponent(doctorName)}&slotTime=${encodeURIComponent(slotTime)}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success/20 text-success border-success/30";
      case "break":
        return "bg-warning/20 text-warning border-warning/30";
      case "off":
        return "bg-muted/20 text-muted-foreground border-muted/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getTotalCapacity = () => {
    return doctors.reduce((sum, doc) => sum + doc.slots.length, 0);
  };

  const getBookedSlots = () => {
    return doctors.reduce(
      (sum, doc) => sum + doc.slots.filter((slot) => slot.isBooked).length,
      0
    );
  };

  const getAvailableSlots = () => {
    return getTotalCapacity() - getBookedSlots();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Doctor Schedule</h1>
            <p className="text-sm text-muted-foreground">Manage appointments and availability</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Slots
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {getTotalCapacity()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Today's capacity</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Booked
                </p>
                <p className="text-3xl font-bold text-success">{getBookedSlots()}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((getBookedSlots() / getTotalCapacity()) * 100)}% occupied
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-accent">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Available
                </p>
                <p className="text-3xl font-bold text-accent">{getAvailableSlots()}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((getAvailableSlots() / getTotalCapacity()) * 100)}% free
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Doctor Schedules */}
        <Tabs defaultValue={doctors[0].id} className="space-y-6">
          <div className="flex gap-2 overflow-x-auto">
            <TabsList>
              {doctors.map((doctor) => (
                <TabsTrigger key={doctor.id} value={doctor.id} className="whitespace-nowrap">
                  {doctor.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {doctors.map((doctor) => (
            <TabsContent key={doctor.id} value={doctor.id} className="space-y-6">
              {/* Doctor Info Card */}
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {doctor.name}
                    </h2>
                    <p className="text-muted-foreground mb-4">{doctor.specialization}</p>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground text-sm">
                        Today's Shifts
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.shifts.map((shift, idx) => (
                          <span
                            key={idx}
                            className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(
                              shift.status
                            )}`}
                          >
                            {shift.time}
                            <span className="ml-2 capitalize">({shift.status})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Slot Status</p>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-primary">
                            {doctor.slots.filter((s) => s.isBooked).length} /{" "}
                            {doctor.slots.length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Booked slots
                          </p>
                        </div>
                        <div className="w-24 h-20 rounded">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="8"
                              className="text-muted"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="8"
                              strokeDasharray={`${
                                (doctor.slots.filter((s) => s.isBooked).length /
                                  doctor.slots.length) *
                                251.2
                              } 251.2`}
                              className="text-success"
                              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-info/10 rounded-lg">
                      <p className="text-sm font-medium text-info flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        AI Optimization Suggestion
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.slots.filter((s) => s.isBooked).length >
                        doctor.slots.length * 0.7
                          ? `${doctor.name} is running high capacity. Consider scheduling patients with other specialists.`
                          : `${doctor.name} has good availability. Good time to schedule complex cases.`}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Appointment Slots */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Appointment Slots
                </h3>
                <div className="space-y-2">
                  {doctor.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-lg border transition-all ${
                        slot.isBooked
                          ? "bg-primary/5 border-primary/30"
                          : "bg-success/5 border-success/30 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-sm font-bold text-foreground">
                              {slot.time}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {slot.isBooked ? "Booked" : "Available"}
                            </p>
                          </div>
                          {slot.isBooked ? (
                            <div>
                              <p className="font-medium text-foreground flex items-center gap-2">
                                {slot.patient}
                                <CheckCircle2 className="w-4 h-4 text-success" />
                              </p>
                              {slot.aiConfidence && (
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    AI Confidence:
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-success rounded-full"
                                        style={{ width: `${slot.aiConfidence}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-medium text-success">
                                      {slot.aiConfidence}%
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            slot.remainingSeconds !== undefined && (
                              <div className="flex items-center gap-2 text-warning">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs font-mono font-medium">
                                  Expiring in: {formatTime(slot.remainingSeconds)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        {!slot.isBooked && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSchedule(doctor.id, doctor.name, slot.id, slot.time)}
                            className="hover-elevate"
                          >
                            Schedule
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Schedule;
