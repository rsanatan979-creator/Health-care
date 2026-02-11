import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Allocation {
  patientId: string;
  patientName: string;
  symptom: string;
  priority: number;
  isEmergency: boolean;
  severity: string;
  recommendedDoctor: {
    id: string;
    name: string;
    specialization: string;
  };
  reason: string;
}

const Optimization = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReduction, setTotalReduction] = useState(0);

  useEffect(() => {
    fetchOptimization();
  }, []);

  const fetchOptimization = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/predict/optimize-queue");
      const data = await response.json();

      if (data.success) {
        setAllocations(data.data.optimizedAllocations);
        setTotalReduction(data.data.totalWaitTimeReduction);
      }
    } catch (error) {
      console.error("Error fetching optimization:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (isEmergency: boolean) => {
    if (isEmergency) {
      return <AlertCircle className="w-5 h-5 text-accent" />;
    }
    return null;
  };

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
              <h1 className="text-2xl font-bold text-foreground">Queue Optimization</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Queue Reordering & Doctor Assignments</p>
            </div>
          </div>
          <Button
            onClick={fetchOptimization}
            variant="outline"
            size="sm"
            disabled={loading}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            Recalculate
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Zap className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Calculating optimal queue order...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6 border-l-4 border-l-success">
                <p className="text-sm text-muted-foreground mb-2">Total Patients Reordered</p>
                <p className="text-3xl font-bold text-success">{allocations.length}</p>
              </Card>

              <Card className="p-6 border-l-4 border-l-primary">
                <p className="text-sm text-muted-foreground mb-2">Estimated Wait Time Reduction</p>
                <p className="text-3xl font-bold text-primary">{totalReduction} min</p>
              </Card>

              <Card className="p-6 border-l-4 border-l-info">
                <p className="text-sm text-muted-foreground mb-2">Optimization Score</p>
                <p className="text-3xl font-bold text-info">
                  {allocations.length > 0 ? Math.round((totalReduction / allocations.length) * 10) : 0}
                  <span className="text-lg">/10</span>
                </p>
              </Card>
            </div>

            {/* Recommendation */}
            <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Optimization Recommendation</h3>
                  <p className="text-foreground mb-4">
                    Implement this queue reordering to minimize total wait time while ensuring emergency cases are prioritized. The AI has analyzed current capacity and patient severity to create an optimal assignment plan.
                  </p>
                  <Button className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Apply Optimization
                  </Button>
                </div>
              </div>
            </Card>

            {/* Optimized Allocations */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Optimized Queue Order & Doctor Assignments
              </h2>

              <div className="space-y-4">
                {allocations.map((allocation, index) => (
                  <div
                    key={allocation.patientId}
                    className={`p-4 rounded-lg border transition-all ${
                      allocation.isEmergency
                        ? "bg-accent/10 border-accent/30 border-l-4 border-l-accent"
                        : "bg-card border-border hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Position & Patient Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Position Badge */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg flex-shrink-0">
                          {index + 1}
                        </div>

                        {/* Patient Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">
                              {allocation.patientName}
                            </h4>
                            {allocation.isEmergency && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                                {getStatusIcon(allocation.isEmergency)}
                                Emergency
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Symptom</p>
                              <p className="font-medium text-foreground">{allocation.symptom}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Severity</p>
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(
                                  allocation.severity
                                )}`}
                              >
                                {allocation.severity.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                            <p className="text-xs text-muted-foreground mb-1">Why reordered</p>
                            <p className="text-sm font-medium text-foreground">{allocation.reason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Doctor Assignment */}
                      <div className="bg-success/10 border border-success/30 rounded-lg p-4 w-56 flex-shrink-0">
                        <p className="text-xs text-muted-foreground mb-2 font-semibold">ASSIGNED TO</p>
                        <div className="mb-3">
                          <p className="font-bold text-foreground text-lg">
                            {allocation.recommendedDoctor.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {allocation.recommendedDoctor.specialization}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/patients/${allocation.patientId}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {allocations.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No patients in queue to optimize</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Algorithm Explanation */}
            <Card className="p-6 mt-8">
              <h3 className="text-lg font-bold text-foreground mb-4">How Optimization Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">1. Priority Scoring</p>
                  <p className="text-muted-foreground">
                    Each patient is scored based on emergency status, severity level, and wait time.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">2. Doctor Matching</p>
                  <p className="text-muted-foreground">
                    Patients are matched with best-fit doctors based on specialization and current capacity.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">3. Wait Time Reduction</p>
                  <p className="text-muted-foreground">
                    Optimal ordering reduces total wait time while maintaining quality of care.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Optimization;
