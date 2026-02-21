import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin, Navigation, Ambulance, Plus, Minus, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RealisticMapProps {
  progress: number;
}

export const RealisticMap: React.FC<RealisticMapProps> = ({ progress }) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const routePath = "M 50 50 L 150 50 L 150 150 L 300 150 L 300 250 L 450 250";

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1));
  const resetView = () => {
    setZoom(1);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] bg-[#e5e7eb] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner group cursor-grab active:cursor-grabbing"
    >
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.1}
        style={{
          x: springX,
          y: springY,
          scale: zoom,
          width: "100%",
          height: "100%",
          transformOrigin: "center center",
        }}
        className="relative"
      >
        <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f6dfc0f?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale-[20%]" />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 500 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <text x="60" y="45" fontSize="10" fill="#94a3b8" fontWeight="bold" opacity="0.6">W 5TH AVE</text>
          <text x="160" y="145" fontSize="10" fill="#94a3b8" fontWeight="bold" opacity="0.6" transform="rotate(90 160 145)">BROADWAY</text>
          <text x="310" y="145" fontSize="10" fill="#94a3b8" fontWeight="bold" opacity="0.6">E 12TH ST</text>
          <text x="440" y="240" fontSize="10" fill="#94a3b8" fontWeight="bold" opacity="0.6">GRAND AVE</text>

          <g stroke="#cbd5e1" strokeWidth="2" fill="none">
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i * 50} y1="0" x2={i * 50} y2="300" />
                <line x1="0" y1={i * 50} x2="500" y2={i * 50} />
              </React.Fragment>
            ))}
          </g>

          <path d={routePath} fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" />

          <motion.path
            d={routePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          <g transform="translate(450, 250)">
            <motion.circle r="12" fill="#ef444422" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
            <circle r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
            <foreignObject x="-20" y="-45" width="40" height="40">
              <div className="flex justify-center">
                <div className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">YOU</div>
              </div>
            </foreignObject>
          </g>

          <motion.g
            animate={{ offsetDistance: `${progress}%` }}
            transition={{ duration: 1, ease: "linear" }}
            style={{ offsetPath: `path("${routePath}")`, offsetRotate: "auto 90deg" }}
          >
            <motion.circle r="15" fill="#3b82f633" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <g transform="scale(1.2) translate(-10, -10)">
              <rect width="20" height="20" rx="4" fill="#3b82f6" stroke="white" strokeWidth="1" />
              <Ambulance className="w-4 h-4 text-white m-0.5" />
            </g>
            <motion.circle cx="-5" cy="-5" r="2" fill="#ef4444" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }} />
            <motion.circle cx="5" cy="-5" r="2" fill="#3b82f6" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", delay: 0.1 }} />
          </motion.g>
        </svg>
      </motion.div>

      <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow-sm border border-slate-200 flex items-center gap-1.5 transition-all group-hover:bg-white pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Live Traffic Tracking</span>
        </div>
        <div className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm inline-block w-fit pointer-events-auto">
          {(2.4 * (1 - progress / 100)).toFixed(1)} miles away
        </div>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto z-10">
        <Button onClick={handleZoomIn} size="icon" variant="secondary" className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white">
          <Plus className="w-4 h-4 text-slate-600" />
        </Button>
        <Button onClick={handleZoomOut} size="icon" variant="secondary" className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white">
          <Minus className="w-4 h-4 text-slate-600" />
        </Button>
        <div className="mt-2 h-px bg-slate-200 mx-2" />
        <Button onClick={resetView} size="icon" variant="secondary" className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white text-blue-600">
          <LocateFixed className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur p-2 rounded-lg shadow-md border border-slate-200 pointer-events-none">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Current Street</p>
        <p className="text-xs font-black text-slate-800 flex items-center gap-2">
          <Navigation className="w-3 h-3 text-blue-600 rotate-[45deg]" />
          Grand Avenue & 4th Street
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
