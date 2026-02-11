import { Link } from "react-router-dom";
import {
  Activity,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              H
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediQueue</h1>
              <p className="text-xs text-muted-foreground">Smart Hospital Queue</p>
            </div>
          </div>
          <Button asChild className="gap-2">
            <Link to="/signin">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              AI-Powered Healthcare Innovation
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Smart Hospital Queue{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Management
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Reduce patient wait times by 25% with AI-driven queue optimization. Real-time monitoring,
            intelligent scheduling, and data-driven insights for modern hospitals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gap-2">
              <Link to="/signin">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#features">Learn More</a>
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <p className="text-2xl font-bold text-success">25%</p>
              <p className="text-xs text-muted-foreground">Wait Time Reduction</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-2xl font-bold text-primary">92%</p>
              <p className="text-xs text-muted-foreground">AI Accuracy</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-2xl font-bold text-accent">40%</p>
              <p className="text-xs text-muted-foreground">Emergency Response</p>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Why Choose MediQueue?</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Real-Time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Live queue status and automatic updates every second
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">AI-Powered Predictions</h3>
                  <p className="text-sm text-muted-foreground">
                    Machine learning algorithms predict wait times with 92% accuracy
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Emergency Priority</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic prioritization of critical cases
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive insights and performance metrics
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 border border-primary/30">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Live Monitoring</p>
                  <p className="text-sm text-muted-foreground">Monitor all queues in real-time</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-success" />
                <div>
                  <p className="font-semibold text-foreground">Smart Optimization</p>
                  <p className="text-sm text-muted-foreground">Reduce wait times automatically</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">Advanced Analytics</p>
                  <p className="text-sm text-muted-foreground">Data-driven insights for decisions</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-warning" />
                <div>
                  <p className="font-semibold text-foreground">Secure & Compliant</p>
                  <p className="text-sm text-muted-foreground">HIPAA-ready healthcare solution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize hospital operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Smart Scheduling",
                description: "Intelligent appointment scheduling with automatic optimization",
              },
              {
                icon: Users,
                title: "Doctor Management",
                description: "Track doctor availability and workload in real-time",
              },
              {
                icon: Zap,
                title: "AI Predictions",
                description: "Predict wait times and optimize queue order with AI",
              },
              {
                icon: TrendingUp,
                title: "Analytics",
                description: "Comprehensive dashboards and performance metrics",
              },
              {
                icon: Activity,
                title: "Live Alerts",
                description: "Real-time notifications for critical situations",
              },
              {
                icon: BarChart3,
                title: "Reports",
                description: "Detailed reports for performance analysis",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border bg-white hover:shadow-lg transition-all hover:border-primary/50"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Optimize Your Hospital?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join leading hospitals that have improved patient satisfaction and reduced wait times with
            MediQueue.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/signin">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-muted/20">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="mb-4">© 2024 MediQueue. All rights reserved.</p>
          <div className="flex gap-4 justify-center text-sm">
            <a href="#" className="hover:text-foreground transition">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
