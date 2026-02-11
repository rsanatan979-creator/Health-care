import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/hospital-selection");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    try {
      await login("demo@hospital.com", "demo123");
      navigate("/hospital-selection");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <Card className="p-8 shadow-xl border-border">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                H
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">MediQueue</h1>
              <p className="text-muted-foreground">Hospital Queue Management</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-sm text-accent font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 bg-background border-border focus:border-primary"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 bg-background border-border focus:border-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 gap-2 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Demo Login Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full h-11 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Demo Login
                </>
              )}
            </Button>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Use any email and password for demo. Your data is local only.
            </p>
          </Card>

          {/* Benefits Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border border-border shadow-sm hover:shadow-md transition">
              <p className="text-2xl font-bold text-primary mb-1">25%</p>
              <p className="text-xs text-muted-foreground">Wait time reduced</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-border shadow-sm hover:shadow-md transition">
              <p className="text-2xl font-bold text-success mb-1">92%</p>
              <p className="text-xs text-muted-foreground">AI accuracy rate</p>
            </div>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            New to MediQueue?{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              Learn more
            </Link>
          </p>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default SignIn;
