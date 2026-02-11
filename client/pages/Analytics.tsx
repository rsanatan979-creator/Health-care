import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsData {
  overview: {
    totalPatients: number;
    averageWaitTime: number;
    urgentCases: number;
    completedCases: number;
  };
  doctorUtilization: Array<{
    name: string;
    specialization: string;
    utilization: number;
    status: string;
    currentPatients: number;
    maxCapacity: number;
  }>;
  symptomDistribution: Record<string, number>;
  severityDistribution: {
    mild: number;
    moderate: number;
    severe: number;
  };
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/queue/analytics");
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const SimpleBarChart = ({ data, max }: { data: number; max: number }) => {
    const percentage = (data / max) * 100;
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-foreground">{Math.round(percentage)}%</span>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-success";
      case "busy":
        return "text-primary";
      case "break":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-foreground">Queue Analytics</h1>
              <p className="text-sm text-muted-foreground">Real-time performance metrics</p>
            </div>
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            size="sm"
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Patients</p>
            <p className="text-3xl font-bold text-foreground">
              {analytics.overview.totalPatients}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Today</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Avg Wait Time</p>
            <p className="text-3xl font-bold text-success">
              {analytics.overview.averageWaitTime}m
            </p>
            <p className="text-xs text-muted-foreground mt-2">Minutes</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Urgent Cases</p>
            <p className="text-3xl font-bold text-accent">
              {analytics.overview.urgentCases}
            </p>
            <p className="text-xs text-muted-foreground mt-2">In queue</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Completed</p>
            <p className="text-3xl font-bold text-primary">
              {analytics.overview.completedCases}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Today</p>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="doctors">Doctor Utilization</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="severity">Severity</TabsTrigger>
          </TabsList>

          {/* Doctor Utilization */}
          <TabsContent value="doctors">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Doctor Capacity & Utilization
              </h3>
              <div className="space-y-6">
                {analytics.doctorUtilization.map((doctor) => (
                  <div key={doctor.name} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {doctor.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getStatusColor(doctor.status)}`}>
                          {doctor.status === "available"
                            ? "Available"
                            : doctor.status === "busy"
                              ? "Busy"
                              : "Break"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.currentPatients}/{doctor.maxCapacity}
                        </p>
                      </div>
                    </div>
                    <SimpleBarChart data={doctor.currentPatients} max={doctor.maxCapacity} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Symptom Distribution */}
          <TabsContent value="symptoms">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Patient Symptoms Distribution
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.symptomDistribution).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No symptoms data available
                  </p>
                ) : (
                  Object.entries(analytics.symptomDistribution).map(([symptom, count]) => {
                    const total = Object.values(analytics.symptomDistribution).reduce(
                      (a, b) => a + b,
                      0
                    );
                    return (
                      <div key={symptom} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{symptom}</span>
                          <span className="text-sm text-muted-foreground">
                            {count} patient{count !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <SimpleBarChart data={count} max={total} />
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Severity Distribution */}
          <TabsContent value="severity">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Case Severity Distribution
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-success"></span>
                      Mild
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {analytics.severityDistribution.mild} cases
                    </span>
                  </div>
                  <SimpleBarChart
                    data={analytics.severityDistribution.mild}
                    max={
                      analytics.severityDistribution.mild +
                      analytics.severityDistribution.moderate +
                      analytics.severityDistribution.severe
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-warning"></span>
                      Moderate
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {analytics.severityDistribution.moderate} cases
                    </span>
                  </div>
                  <SimpleBarChart
                    data={analytics.severityDistribution.moderate}
                    max={
                      analytics.severityDistribution.mild +
                      analytics.severityDistribution.moderate +
                      analytics.severityDistribution.severe
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-accent"></span>
                      Severe
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {analytics.severityDistribution.severe} cases
                    </span>
                  </div>
                  <SimpleBarChart
                    data={analytics.severityDistribution.severe}
                    max={
                      analytics.severityDistribution.mild +
                      analytics.severityDistribution.moderate +
                      analytics.severityDistribution.severe
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
