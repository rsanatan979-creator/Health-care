import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const AddPatient = () => {
  const navigate = useNavigate();
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
    // Clear error for this field
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          symptom: formData.symptom,
          severity: formData.severity as "mild" | "moderate" | "severe",
          isEmergency: formData.isEmergency,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setErrors({ firstName: data.error || "Failed to submit form" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ firstName: "Network error. Please try again." });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Patient Added Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            {formData.firstName} {formData.lastName} has been added to the queue.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting to dashboard...
          </p>
          <Button asChild className="w-full">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-foreground">Register Patient</h1>
            <p className="text-sm text-muted-foreground">Add a new patient to the queue</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "border-error" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-error">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "border-error" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-error">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-error" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-error">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-medium">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "border-error" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-error">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="font-medium">
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={errors.dateOfBirth ? "border-error" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-error">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="font-medium">
                    Gender *
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger className={errors.gender ? "border-error" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-error">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Medical Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptom" className="font-medium">
                    Primary Symptom *
                  </Label>
                  <Input
                    id="symptom"
                    name="symptom"
                    placeholder="e.g., Chest pain, Headache, Fever"
                    value={formData.symptom}
                    onChange={handleChange}
                    className={errors.symptom ? "border-error" : ""}
                  />
                  {errors.symptom && (
                    <p className="text-sm text-error">{errors.symptom}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity" className="font-medium">
                    Symptom Severity
                  </Label>
                  <Select value={formData.severity} onValueChange={(value) => handleSelectChange("severity", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-medium">
                    Additional Notes
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional medical history or context..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border border-accent/30">
                  <input
                    id="isEmergency"
                    name="isEmergency"
                    type="checkbox"
                    checked={formData.isEmergency}
                    onChange={handleChange}
                    className="w-4 h-4 cursor-pointer accent-accent"
                  />
                  <label htmlFor="isEmergency" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 text-accent font-medium">
                      <AlertCircle className="w-4 h-4" />
                      This is an emergency case
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mark if patient needs immediate priority
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" className="flex-1">
                Register Patient
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddPatient;
