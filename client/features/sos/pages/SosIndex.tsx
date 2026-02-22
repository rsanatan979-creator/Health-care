import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  MapPin,
  User,
  Clock,
  Heart,
  Info,
  Ambulance,
  PhoneCall,
  Activity,
  Droplets,
  ShieldAlert,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RealisticMap } from "@/components/RealisticMap";
import { ROUTES } from "@shared/routes";

type AppState = "idle" | "locating" | "dispatched" | "arriving";

export default function SosIndex() {
  const [state, setState] = useState<AppState>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredByHoldRef = useRef(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const triggerSOS = useCallback(() => {
    setState("locating");
    toast({
      title: "SOS Triggered",
      description: "Getting your location and alerting nearest emergency services...",
      variant: "destructive",
    });
    setTimeout(() => {
      setState("dispatched");
      setTimeLeft(480);
    }, 2000);
  }, [toast]);

  const handleSOSPressStart = useCallback(() => {
    triggeredByHoldRef.current = false;
    holdTimerRef.current = setInterval(() => {
      setHoldProgress((p) => {
        if (p >= 100) {
          if (holdTimerRef.current) clearInterval(holdTimerRef.current);
          holdTimerRef.current = null;
          triggeredByHoldRef.current = true;
          triggerSOS();
          return 0;
        }
        return p + 5;
      });
    }, 50);
  }, [triggerSOS]);

  const handleSOSPressEnd = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  }, []);

  const handleSOSClick = useCallback(() => {
    if (triggeredByHoldRef.current) return;
    triggerSOS();
  }, [triggerSOS]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "dispatched" || state === "arriving") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setState("arriving");
            return 0;
          }
          return prev - 1;
        });
        setProgress((prev) => (prev < 100 ? prev + 0.1 : 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="p-4 flex justify-between items-center bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight">MediSOS</span>
        </div>
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
          Emergency Mode
        </Badge>
      </header>

      <main className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center text-center gap-8 w-full"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">Need Help?</h2>
                <p className="text-slate-500">Press and hold the button for immediate assistance</p>
              </div>

              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 bg-red-400 rounded-full"
                />
                <button
                  onMouseDown={handleSOSPressStart}
                  onMouseUp={handleSOSPressEnd}
                  onMouseLeave={handleSOSPressEnd}
                  onTouchStart={handleSOSPressStart}
                  onTouchEnd={handleSOSPressEnd}
                  onClick={handleSOSClick}
                  className="relative w-64 h-64 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl shadow-red-200 flex flex-col gap-2 items-center justify-center transition-transform active:scale-95 select-none touch-none"
                >
                  {holdProgress > 0 && holdProgress < 100 && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${holdProgress * 2.83} 283`}
                        className="transition-all duration-75"
                      />
                    </svg>
                  )}
                  <AlertCircle className="w-20 h-20 text-white relative z-10" />
                  <span className="text-3xl font-black text-white uppercase tracking-widest relative z-10">SOS</span>
                  <span className="text-xs text-white/80 relative z-10">Tap or hold 1 sec</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-24 flex flex-col gap-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                      <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">Medical ID</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-t-0 p-0 overflow-hidden">
                    <div className="h-full bg-slate-50">
                      <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto my-4" />
                      <ScrollArea className="h-full px-6 pb-20">
                        <SheetHeader className="text-left mb-6">
                          <SheetTitle className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Activity className="text-red-600" /> Medical Profile
                          </SheetTitle>
                          <SheetDescription className="text-lg">
                            Critical health information for emergency responders
                          </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-red-50 border-red-100">
                              <CardContent className="p-4 space-y-1">
                                <div className="flex items-center gap-2 text-red-600">
                                  <Droplets className="w-4 h-4 fill-current" />
                                  <span className="text-xs font-bold uppercase tracking-wider">Blood Type</span>
                                </div>
                                <p className="text-3xl font-black text-red-700">O Positive</p>
                              </CardContent>
                            </Card>
                            <Card className="bg-blue-50 border-blue-100">
                              <CardContent className="p-4 space-y-1">
                                <div className="flex items-center gap-2 text-blue-600">
                                  <User className="w-4 h-4" />
                                  <span className="text-xs font-bold uppercase tracking-wider">Age / Sex</span>
                                </div>
                                <p className="text-3xl font-black text-blue-700">32 / M</p>
                              </CardContent>
                            </Card>
                          </div>
                          <section className="space-y-3">
                            <h4 className="font-bold text-slate-500 uppercase text-xs tracking-widest flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4" /> Critical Conditions
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-red-600 hover:bg-red-600 px-3 py-1 text-sm font-bold">Asthmatic</Badge>
                              <Badge className="bg-red-600 hover:bg-red-600 px-3 py-1 text-sm font-bold">Peanut Allergy</Badge>
                              <Badge variant="outline" className="border-slate-300 text-slate-500 px-3 py-1 text-sm">No Heart Conditions</Badge>
                            </div>
                          </section>
                          <Separator />
                          <section className="space-y-3">
                            <h4 className="font-bold text-slate-500 uppercase text-xs tracking-widest flex items-center gap-2">
                              <Stethoscope className="w-4 h-4" /> Active Medications
                            </h4>
                            <div className="space-y-2">
                              {["Ventolin Inhaler (as needed)", "Loratadine 10mg (daily)"].map((med) => (
                                <div key={med} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  <span className="font-semibold text-slate-800">{med}</span>
                                </div>
                              ))}
                            </div>
                          </section>
                          <section className="space-y-3">
                            <h4 className="font-bold text-slate-500 uppercase text-xs tracking-widest flex items-center gap-2">
                              <Users className="w-4 h-4" /> Emergency Contacts
                            </h4>
                            <div className="space-y-3">
                              {[
                                { name: "Sarah Roy", role: "Spouse", phone: "+1 (555) 902-3421" },
                                { name: "Dr. Michael Chen", role: "Primary Physician", phone: "+1 (555) 123-4567" },
                              ].map((contact) => (
                                <div key={contact.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                  <div>
                                    <p className="font-bold text-slate-800">{contact.name}</p>
                                    <p className="text-xs text-slate-500">{contact.role}</p>
                                  </div>
                                  <Button size="icon" variant="ghost" className="text-blue-600 rounded-full bg-blue-50">
                                    <PhoneCall className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>
                      </ScrollArea>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                  onClick={() => {
                    const num = "+18882221111";
                    navigator.clipboard?.writeText(num);
                    toast({ title: "Ambulance Driver", description: "Johnathan Doe: +1 888 222 1111 — number copied. Use Call for direct dial.", variant: "default" });
                    window.location.href = `tel:${num}`;
                  }}
                >
                  <div className="bg-red-50 p-2 rounded-full text-red-600">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">Assistance</span>
                </Button>
              </div>
            </motion.div>
          )}

          {state === "locating" && (
            <motion.div key="locating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center gap-12 w-full">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360], borderColor: ["#ef4444", "#3b82f6", "#ef4444"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 rounded-full border-4 border-dashed border-red-500 flex items-center justify-center"
                >
                  <MapPin className="w-16 h-16 text-red-600 animate-bounce" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-2 border-slate-100 animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-800 animate-pulse">Locating You...</h2>
                <div className="space-y-2 max-w-xs mx-auto">
                  <p className="text-slate-500 font-medium">Pinpointing GPS coordinates and alerting nearest response team.</p>
                  <div className="flex items-center justify-center gap-2 text-red-600 font-bold">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    Connecting to MediNet
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state !== "idle" && state !== "locating" && (
            <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full space-y-6">
              <Card className="overflow-hidden border-2 border-red-100 shadow-xl">
                <div className="bg-red-600 p-6 text-white text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    <Ambulance className="w-12 h-12 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold">Ambulance Dispatched</h3>
                  <p className="opacity-90">Estimated arrival in</p>
                  <div className="text-5xl font-black font-mono tracking-tighter">{formatTime(timeLeft)}</div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium">Driver</p>
                        <p className="font-bold text-slate-800">Johnathan Doe</p>
                        <p className="text-[10px] text-blue-600 font-semibold">+1 888 222 1111</p>
                      </div>
                      <Button size="icon" variant="secondary" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                        <PhoneCall className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="bg-green-100 p-2 rounded-full">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium">Vehicle ID</p>
                        <p className="font-bold text-slate-800">AMB-992 (Advanced Life Support)</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>Live Response Map</span>
                      <span className="text-blue-600 animate-pulse">● Live GPS</span>
                    </div>
                    <RealisticMap progress={progress} />
                  </div>
                </CardContent>
              </Card>
              <Button
                variant="ghost"
                className="w-full text-slate-500 hover:text-red-600"
                onClick={() => {
                  if (confirm("Are you sure you want to cancel the emergency?")) {
                    setState("idle");
                    setProgress(0);
                  }
                }}
              >
                Cancel Emergency
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t p-2 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button variant="ghost" className="flex flex-col h-12 gap-1 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold">SOS</span>
        </Button>
        <Button variant="ghost" asChild className="flex flex-col h-12 gap-1 text-slate-400 hover:text-primary">
          <Link to={ROUTES.DASHBOARD} className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              H
            </div>
            <span className="text-[10px] font-medium">Queue</span>
          </Link>
        </Button>
        <Button variant="ghost" className="flex flex-col h-12 gap-1 text-slate-400">
          <Info className="w-5 h-5" />
          <span className="text-[10px] font-medium">Guide</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-12 gap-1 text-slate-400">
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-medium">History</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-12 gap-1 text-slate-400">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Button>
      </nav>
    </div>
  );
}
