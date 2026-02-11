import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Activity, LogOut, ChevronLeft, UserPlus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import type { Doctor } from "@shared/api";

const DoctorsPage = () => {
  const { logout } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorData = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg hover-elevate">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Doctor Management</h1>
              <p className="text-xs text-muted-foreground">Staff availability and workload</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
             <Button asChild variant="default" size="sm" className="gap-2">
              <Link to="/add-patient">
                <UserPlus className="w-4 h-4" />
                Add Patient
              </Link>
            </Button>
            <Button onClick={() => logout()} variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Activity className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover-elevate border-border">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(doctor.status)}`}>
                      {doctor.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{doctor.specialization}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Workload</span>
                        <span className="font-medium">{Math.round((doctor.currentPatients / doctor.maxCapacity) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            doctor.currentPatients >= doctor.maxCapacity ? 'bg-destructive' : 'bg-primary'
                          }`}
                          style={{ width: `${(doctor.currentPatients / doctor.maxCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Patients</span>
                      </div>
                      <span className="font-bold text-foreground">{doctor.currentPatients} / {doctor.maxCapacity}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorsPage;