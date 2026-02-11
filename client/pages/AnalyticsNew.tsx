import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, BarChart3, PieChart, Activity, TrendingUp, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePie, Pie, Cell, LineChart, Line, AreaChart, Area 
} from "recharts";

const AnalyticsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/queue/analytics");
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ["#0ea5e9", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

  const symptomData = data?.symptomDistribution ? Object.entries(data.symptomDistribution).map(([name, value]) => ({ name, value })) : [];
  const severityData = data?.severityDistribution ? Object.entries(data.severityDistribution).map(([name, value]) => ({ name, value })) : [];
  
  // Mock time-series data for the demonstration
  const waitTimeTrends = [
    { time: "08:00", wait: 15 },
    { time: "09:00", wait: 25 },
    { time: "10:00", wait: 40 },
    { time: "11:00", wait: 35 },
    { time: "12:00", wait: 20 },
    { time: "13:00", wait: 30 },
    { time: "14:00", wait: 45 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg hover-elevate">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Advanced Analytics</h1>
              <p className="text-xs text-muted-foreground">Hospital performance and queue metrics</p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              History
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
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 flex flex-col items-center justify-center text-center border-border">
                <Users className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Total Today</p>
                <p className="text-2xl font-bold">{data?.overview.totalPatients || 0}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center justify-center text-center border-border">
                <Clock className="w-8 h-8 text-success mb-2" />
                <p className="text-sm text-muted-foreground">Avg Wait</p>
                <p className="text-2xl font-bold">{data?.overview.averageWaitTime || 0}m</p>
              </Card>
              <Card className="p-4 flex flex-col items-center justify-center text-center border-border">
                <TrendingUp className="w-8 h-8 text-warning mb-2" />
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{data?.overview.completedCases || 0}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center justify-center text-center border-border">
                <Activity className="w-8 h-8 text-destructive mb-2" />
                <p className="text-sm text-muted-foreground">Emergency</p>
                <p className="text-2xl font-bold">{data?.overview.urgentCases || 0}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Wait Time Trends */}
              <Card className="p-6 border-border">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Hourly Wait Time Trends
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waitTimeTrends}>
                      <defs>
                        <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="wait" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorWait)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Symptom Distribution */}
              <Card className="p-6 border-border">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Symptom Distribution
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePie>
                      <Pie
                        data={symptomData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {symptomData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePie>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {symptomData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-muted-foreground truncate">{item.name}</span>
                      <span className="font-bold ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Severity Analysis */}
              <Card className="p-6 border-border lg:col-span-2">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Case Severity Distribution
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'severe' ? '#ef4444' : entry.name === 'moderate' ? '#f59e0b' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Users = ({ className }: { className?: string }) => <UsersIcon className={className} />;
const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default AnalyticsPage;