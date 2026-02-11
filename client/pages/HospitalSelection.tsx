import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Star, Navigation, Search, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface Hospital {
  id: string;
  name: string;
  type: "private" | "government";
  location: string;
  distance: string;
  rating: number;
  openingTime: string;
  closingTime: string;
}

const HospitalSelection = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("/api/hospitals");
        const data = await response.json();
        if (data.success) {
          setHospitals(data.data);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectHospital = (hospitalId: string) => {
    // Store selected hospital in session/local storage for the dashboard
    localStorage.setItem("selectedHospitalId", hospitalId);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              H
            </div>
            <h1 className="text-2xl font-bold text-foreground">MediQueue</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Select a Hospital</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the nearest medical facility to view real-time queue status and book your spot.
          </p>
        </div>

        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHospitals.map((hospital) => (
              <Card 
                key={hospital.id} 
                className="overflow-hidden hover-elevate border-border cursor-pointer group"
                onClick={() => handleSelectHospital(hospital.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <Badge variant={hospital.type === "private" ? "default" : "secondary"} className="capitalize">
                      {hospital.type}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{hospital.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{hospital.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 shrink-0 text-primary" />
                      <span className="font-medium text-foreground">
                        {hospital.openingTime === "24 Hours" ? "Open 24/7" : `${hospital.openingTime} - ${hospital.closingTime}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-4 h-4 text-primary" />
                        <span className="font-medium">{hospital.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-medium">{hospital.rating}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full gap-2">
                    Select Hospital
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredHospitals.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No hospitals found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalSelection;