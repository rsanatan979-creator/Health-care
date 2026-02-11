import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PatientForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  symptom: string;
  severity: string;
  isEmergency: boolean;
  notes: string;
}

const BookPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const doctorId = searchParams.get("doctorId");
  const doctorName = searchParams.get("doctorName");
  const slotTime = searchParams.get("slotTime");

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<PatientForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    symptom: "",
    severity: "moderate",
    isEmergency: false,
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<PatientForm>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<PatientForm> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.symptom.trim()) newErrors.symptom = "Symptom is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          doctorAssigned: doctorName,
          status: "waiting", // Initially waiting, will be updated to "in-progress" if doctor is free
          scheduledTime: slotTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        toast({
          title: "Appointment Booked",
          description: `Patient ${formData.firstName} scheduled with ${doctorName} at ${slotTime}`,
        });
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setErrors({ firstName: data.error || "Failed to submit form" });
      }
    } catch (error) {
      setErrors({ firstName: "Network error. Please try again." });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Appointment with {doctorName} at {slotTime} has been scheduled.
          </p>
          <Button asChild className="w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/schedule" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Complete Booking</h1>
            <p className="text-sm text-muted-foreground">Register patient for {doctorName} at {slotTime}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? "border-error" : ""} />
                  {errors.firstName && <p className="text-sm text-error">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? "border-error" : ""} />
                  {errors.lastName && <p className="text-sm text-error">{errors.lastName}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? "border-error" : ""} />
                  {errors.email && <p className="text-sm text-error">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? "border-error" : ""} />
                  {errors.phone && <p className="text-sm text-error">{errors.phone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? "border-error" : ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
                    <SelectTrigger className={errors.gender ? "border-error" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Medical Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptom">Primary Symptom *</Label>
                  <Input id="symptom" name="symptom" value={formData.symptom} onChange={handleChange} className={errors.symptom ? "border-error" : ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={formData.severity} onValueChange={(v) => handleSelectChange("severity", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-border">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/schedule">Cancel</Link>
              </Button>
              <Button type="submit" className="flex-1">Confirm Booking</Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default BookPatient;
