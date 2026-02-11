import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Clock, TrendingUp, Bell, CheckCircle2, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Alert {
  id: string;
  type: "emergency" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  actionable?: boolean;
  action?: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    // Simulate real-time alerts
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(false);
      const response = await fetch("/api/queue");
      const data = await response.json();

      if (data.success) {
        generateAlerts(data.data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const generateAlerts = (queueData: any) => {
    const newAlerts: Alert[] = [];

    // Emergency alert
    if (queueData.emergencyCount > 0) {
      newAlerts.push({
        id: "emergency-" + Date.now(),
        type: "emergency",
        title: `${queueData.emergencyCount} Emergency Case${queueData.emergencyCount > 1 ? "s" : ""}`,
        message: `${queueData.emergencyCount} urgent patient(s) require immediate attention`,
        timestamp: new Date().toLocaleTimeString(),
        actionable: true,
        action: "View Queue",
      });
    }

    // High wait time alert
    if (queueData.avgWaitTime > 25) {
      newAlerts.push({
        id: "wait-time-" + Date.now(),
        type: "warning",
        title: "High Average Wait Time",
        message: `Average wait time is ${queueData.avgWaitTime} minutes. Consider calling backup staff.`,
        timestamp: new Date().toLocaleTimeString(),
        actionable: true,
        action: "View Analytics",
      });
    }

    // Queue full alert
    if (queueData.totalPatients > 8) {
      newAlerts.push({
        id: "queue-full-" + Date.now(),
        type: "warning",
        title: "Queue at High Capacity",
        message: `${queueData.totalPatients} patients in system. Optimize queue order to improve efficiency.`,
        timestamp: new Date().toLocaleTimeString(),
        actionable: true,
        action: "Optimize Queue",
      });
    }

    // Completed cases success
    if (queueData.completedToday > 0) {
      newAlerts.push({
        id: "completed-" + Date.now(),
        type: "success",
        title: `${queueData.completedToday} Cases Completed`,
        message: `${queueData.completedToday} patient(s) have successfully completed their visit today.`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // System info
    newAlerts.push({
      id: "system-info-" + Date.now(),
      type: "info",
      title: "System Status: Normal",
      message: `All systems operational. Queue last updated at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toLocaleTimeString(),
    });

    setAlerts(newAlerts);
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-accent/10 border-accent/30 border-l-4 border-l-accent text-accent";
      case "warning":
        return "bg-warning/10 border-warning/30 border-l-4 border-l-warning text-warning";
      case "success":
        return "bg-success/10 border-success/30 border-l-4 border-l-success text-success";
      case "info":
        return "bg-primary/10 border-primary/30 border-l-4 border-l-primary text-primary";
      default:
        return "bg-muted/10 border-muted/30 border-l-4 border-l-muted text-muted-foreground";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <Clock className="w-5 h-5" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
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
              <h1 className="text-2xl font-bold text-foreground">Live Alerts</h1>
              <p className="text-sm text-muted-foreground">Real-time system notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {alerts.length > 0 && (
              <div className="relative">
                <Bell className="w-6 h-6 text-primary animate-bounce" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {alerts.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Bell className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Loading alerts...</p>
            </div>
          </div>
        ) : alerts.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">All Clear!</h3>
            <p className="text-muted-foreground">No active alerts. Everything is running smoothly.</p>
          </Card>
        ) : (
          <>
            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Alerts</p>
                <p className="text-3xl font-bold text-foreground">{alerts.length}</p>
              </Card>

              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Critical</p>
                <p className="text-3xl font-bold text-accent">
                  {alerts.filter((a) => a.type === "emergency").length}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Warnings</p>
                <p className="text-3xl font-bold text-warning">
                  {alerts.filter((a) => a.type === "warning").length}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Success</p>
                <p className="text-3xl font-bold text-success">
                  {alerts.filter((a) => a.type === "success").length}
                </p>
              </Card>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-6 rounded-lg border flex items-start justify-between gap-4 ${getAlertColor(
                    alert.type
                  )}`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">{alert.title}</h4>
                      <p className="text-sm opacity-90 mb-3">{alert.message}</p>
                      <p className="text-xs opacity-75">{alert.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {alert.actionable && alert.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="whitespace-nowrap"
                        asChild
                      >
                        <Link to={`/${alert.action.toLowerCase().replace(/\s+/g, "-")}`}>
                          {alert.action}
                        </Link>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAlert(alert.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Alert Legend */}
            <Card className="p-6 mt-8 bg-muted/30">
              <h3 className="font-bold text-foreground mb-4">Alert Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Emergency - Immediate action needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-foreground">Warning - Monitor closely</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Success - Goal achieved</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Info - System status</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Alerts;
