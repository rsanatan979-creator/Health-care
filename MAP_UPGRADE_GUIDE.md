# Live Map & SOS Upgrade — Implementation Guide

## 1. Recommended Map Library

**Leaflet** + **react-leaflet** — recommended because:
- No API key required
- Lightweight (~40KB)
- OpenStreetMap tiles (free)
- Strong React bindings
- Works well on mobile
- No usage limits

**Alternative:** Google Maps (`@react-google-maps/api`) if you need satellite imagery or Places API — requires API key and billing.

---

## 2. Folder Structure

```
medisos-unified/
├── client/
│   ├── components/
│   │   ├── map/
│   │   │   ├── MapComponent.tsx      # Main Leaflet map container
│   │   │   ├── UserMarker.tsx        # User location marker
│   │   │   ├── AmbulanceMarker.tsx   # Ambulance marker
│   │   │   ├── SOSMapPanel.tsx       # ETA, status panel overlay
│   │   │   └── useGeolocation.ts     # Geolocation hook
│   │   └── RealisticMap.tsx          # (deprecated or fallback)
│   ├── hooks/
│   │   └── useSocket.ts              # Socket.io client hook
│   └── features/sos/
│       └── pages/SosIndex.tsx        # Uses new map
├── server/
│   ├── index.ts                      # Express + Socket.io
│   ├── routes/
│   │   └── sos.ts                    # POST /api/sos
│   ├── services/
│   │   └── ambulanceSimulator.ts     # Simulates ambulance movement
│   └── socket.ts                     # Socket.io setup
└── shared/
    └── types.ts                      # SOS, Ambulance types
```

---

## 3. Dependencies

```bash
pnpm add leaflet react-leaflet socket.io-client
pnpm add -D @types/leaflet
```

---

## 4. Shared Types

```typescript
// shared/types.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export type SOSStatus = "pending" | "dispatched" | "en_route" | "arrived" | "cancelled";

export interface SOSRequest {
  id: string;
  userId?: string;
  userLocation: Coordinates;
  status: SOSStatus;
  ambulanceId?: string;
  ambulanceLocation?: Coordinates;
  etaSeconds?: number;
  createdAt: string;
}

export interface AmbulanceUpdate {
  requestId: string;
  ambulanceId: string;
  location: Coordinates;
  status: SOSStatus;
  etaSeconds?: number;
}
```

---

## 5. Backend Implementation

### 5.1 Install

```bash
pnpm add socket.io
```

### 5.2 server/socket.ts

```typescript
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" }, // Restrict in production
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("[Socket] Client connected:", socket.id);
    socket.on("disconnect", () => console.log("[Socket] Client disconnected:", socket.id));
  });

  return io;
}
```

### 5.3 server/services/ambulanceSimulator.ts

```typescript
import type { Coordinates } from "@shared/types";

// Haversine distance (km) — exported for use in sos routes
export function haversine(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Move point toward target by fraction (0–1)
function interpolate(start: Coordinates, target: Coordinates, fraction: number): Coordinates {
  return {
    lat: start.lat + (target.lat - start.lat) * fraction,
    lng: start.lng + (target.lng - start.lng) * fraction,
  };
}

export interface SimulatorState {
  requestId: string;
  ambulanceLocation: Coordinates;
  userLocation: Coordinates;
  status: "en_route" | "arrived";
}

const activeSimulations = new Map<string, NodeJS.Timeout>();

export function startAmbulanceSimulation(
  requestId: string,
  ambulanceStart: Coordinates,
  userLocation: Coordinates,
  onUpdate: (state: SimulatorState) => void,
  emitIntervalMs = 2000
) {
  if (activeSimulations.has(requestId)) return;

  const distanceKm = haversine(ambulanceStart, userLocation);
  const totalSteps = Math.max(10, Math.ceil(distanceKm * 4)); // ~4 steps per km
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const fraction = Math.min(1, step / totalSteps);
    const ambulanceLocation = interpolate(ambulanceStart, userLocation, fraction);
    const status: SimulatorState["status"] = fraction >= 0.99 ? "arrived" : "en_route";
    const remainingKm = haversine(ambulanceLocation, userLocation);
    const etaSeconds = Math.round((remainingKm / 0.5) * 3600); // assume 30 km/h

    onUpdate({
      requestId,
      ambulanceLocation,
      userLocation,
      status,
    });

    if (status === "arrived") {
      clearInterval(interval);
      activeSimulations.delete(requestId);
    }
  }, emitIntervalMs);

  activeSimulations.set(requestId, interval);
}

export function stopSimulation(requestId: string) {
  const interval = activeSimulations.get(requestId);
  if (interval) {
    clearInterval(interval);
    activeSimulations.delete(requestId);
  }
}
```

### 5.4 server/routes/sos.ts

```typescript
import { Request, Response } from "express";
import type { Coordinates } from "@shared/types";
import { startAmbulanceSimulation, haversine } from "../services/ambulanceSimulator";
import type { Server as SocketServer } from "socket.io";

const requests = new Map<string, { userLocation: Coordinates; ambulanceStart: Coordinates }>();

export function createSOSRoutes(io: SocketServer) {
  return {
    createSOS: (req: Request, res: Response) => {
      const { lat, lng } = req.body as { lat?: number; lng?: number };
      if (typeof lat !== "number" || typeof lng !== "number") {
        return res.status(400).json({ success: false, error: "lat and lng required" });
      }

      const userLocation: Coordinates = { lat, lng };
      const requestId = `sos_${Date.now()}`;
      const ambulanceStart: Coordinates = {
        lat: userLocation.lat + 0.02 + Math.random() * 0.02,
        lng: userLocation.lng - 0.02 - Math.random() * 0.02,
      };

      requests.set(requestId, { userLocation, ambulanceStart });

      startAmbulanceSimulation(
        requestId,
        ambulanceStart,
        userLocation,
        (state) => {
          io.emit("ambulance:update", {
            requestId,
            location: state.ambulanceLocation,
            status: state.status,
          });
        },
        2000
      );

      res.json({
        success: true,
        data: {
          requestId,
          status: "dispatched",
          userLocation,
          ambulanceLocation: ambulanceStart,
          etaSeconds: Math.round(haversine(ambulanceStart, userLocation) / 0.5 * 3600),
        },
      });
    },
  };
}

function haversine(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
```

---

## 6. Server Integration

The Express app must run on an HTTP server (not just `app.listen`) so Socket.io can attach. Update your server entry:

```typescript
// server/node-build.ts (conceptual - adapt to your setup)
import http from "http";
import { createServer } from "./index";
import { setupSocket } from "./socket";

const app = createServer();
const httpServer = http.createServer(app);
const io = setupSocket(httpServer);

// Attach io to app for routes
app.set("io", io);

httpServer.listen(process.env.PORT || 8080, () => {
  console.log("Server + Socket.io running");
});
```

---

## 7. Frontend Hooks

### 7.1 useGeolocation.ts

```typescript
import { useState, useEffect, useCallback } from "react";

export type GeolocationState = {
  coords: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useGeolocation(): GeolocationState {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
    const watch = navigator.geolocation?.watchPosition?.(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => watch !== undefined && navigator.geolocation?.clearWatch?.(watch);
  }, [fetchLocation]);

  return { coords, loading, error, refetch: fetchLocation };
}
```

### 7.2 useSocket.ts

```typescript
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket(url?: string): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const base = url ?? (import.meta.env?.VITE_WS_URL ?? window.location.origin);
    const s = io(base, { path: "/socket.io", transports: ["websocket", "polling"] });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [url]);

  return socket;
}
```

---

## 8. Map Components

### 8.1 MapComponent.tsx

```tsx
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";

function FitBounds({ user, ambulance }: { user: [number, number]; ambulance?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const points: LatLngExpression[] = [user];
    if (ambulance) points.push(ambulance);
    if (points.length > 1) {
      map.fitBounds(points as [number, number][], { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(user, 15);
    }
  }, [map, user, ambulance]);
  return null;
}

interface MapComponentProps {
  userPosition: [number, number];
  ambulancePosition?: [number, number] | null;
  children?: React.ReactNode;
}

export function MapComponent({ userPosition, ambulancePosition, children }: MapComponentProps) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden">
      <MapContainer
        center={userPosition}
        zoom={14}
        className="w-full h-full"
        style={{ minHeight: 300 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <FitBounds user={userPosition} ambulance={ambulancePosition ?? undefined} />
        {children}
      </MapContainer>
    </div>
  );
}
```

### 8.2 UserMarker.tsx

```tsx
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "user-marker",
  html: '<div class="w-6 h-6 rounded-full bg-red-600 border-4 border-white shadow-lg"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export function UserMarker({ position }: { position: [number, number] }) {
  return (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
```

### 8.3 AmbulanceMarker.tsx

```tsx
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const ambulanceIcon = L.divIcon({
  className: "ambulance-marker",
  html: `
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 8h-1V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H5c-1.1 0-2 .9-2 2v10h2v-2h14v2h2V10c0-1.1-.9-2-2-2zm-7 10H8v-2h4v2zm0-4H8v-2h4v2zm0-4H8V8h4v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z"/></svg>
      </div>
      <span class="text-xs font-bold text-blue-600 mt-1">AMBULANCE</span>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

export function AmbulanceMarker({ position }: { position: [number, number] }) {
  return (
    <Marker position={position} icon={ambulanceIcon}>
      <Popup>Ambulance en route</Popup>
    </Marker>
  );
}
```

---

## 9. Integration Steps

1. Install deps: `leaflet react-leaflet socket.io socket.io-client @types/leaflet`
2. Refactor server to use `http.createServer(app)` and attach Socket.io.
3. Add `POST /api/sos` with body `{ lat, lng }`.
4. Add `shared/types.ts` for SOS types.
5. Create `useGeolocation` and `useSocket` hooks.
6. Create `MapComponent`, `UserMarker`, `AmbulanceMarker`.
7. Replace `RealisticMap` in `SosIndex` with the new map; on SOS trigger, call `POST /api/sos` and listen for `ambulance:update`.
8. Add `.user-marker` and `.ambulance-marker` CSS so Leaflet default styles don't override.

---

## 10. Deployment

- **Leaflet CSS:** Ensure `leaflet/dist/leaflet.css` is imported in your root CSS or map entry.
- **Socket.io:** Use same origin in production, or set `VITE_WS_URL` for separate WebSocket server.
- **HTTPS:** Geolocation requires secure context (HTTPS or localhost).
- **CORS:** Configure Socket.io CORS for your frontend origin.
- **Horizontal scaling:** Use Redis adapter for Socket.io if running multiple server instances.
