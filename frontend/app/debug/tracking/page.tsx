'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import MapComponent from '@/components/tracking/MapComponent';
import { Navigation, Play, Pause, RotateCcw, MapPin, Signal, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CITY_COORDINATES } from '@/lib/constants';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const PRESET_ROUTES = [
  {
    id: 'RD399812',
    name: 'Jaipur → Chennai',
    origin: 'Jaipur',
    destination: 'Chennai',
    waypoints: [
      { lat: 26.9124, lng: 75.7873 }, // Jaipur
      { lat: 23.2599, lng: 77.4126 }, // Bhopal
      { lat: 21.1458, lng: 79.0882 }, // Nagpur
      { lat: 17.3850, lng: 78.4867 }, // Hyderabad
      { lat: 14.4426, lng: 79.9865 }, // Nellore
      { lat: 13.0827, lng: 80.2707 }, // Chennai
    ],
  },
  {
    id: 'RD702599',
    name: 'Vijayawada → Hyderabad',
    origin: 'Vijayawada',
    destination: 'Hyderabad',
    waypoints: [
      { lat: 16.5062, lng: 80.6480 }, // Vijayawada
      { lat: 16.7850, lng: 80.8488 }, // Nandigama
      { lat: 17.0500, lng: 79.2667 }, // Nalgonda
      { lat: 17.3850, lng: 78.4867 }, // Hyderabad
    ],
  },
];

export default function DebugTrackingSimulatorPage() {
  const [selectedRoute, setSelectedRoute] = useState(PRESET_ROUTES[0]);
  const [deliveryId, setDeliveryId] = useState('RD399812');
  const [travelerId, setTravelerId] = useState('a0000000-0000-4000-a000-000000000002');
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentCoord, setCurrentCoord] = useState<{ lat: number; lng: number }>(PRESET_ROUTES[0].waypoints[0]);
  const [speedKmH, setSpeedKmH] = useState(55);
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      addLog(`Connected to Socket.IO tracking server (${socket.id})`);
      socket.emit('tracking:join', { deliveryId, userId: travelerId, role: 'traveler' });
    });

    socket.on('disconnect', () => {
      setConnected(false);
      addLog('Socket disconnected');
    });

    socket.on('tracking:location', (data: any) => {
      addLog(`Broadcast received: Lat ${data.latitude.toFixed(4)}, Lng ${data.longitude.toFixed(4)}`);
    });

    socket.on('tracking:error', (err: any) => {
      addLog(`Error: ${err.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [deliveryId, travelerId]);

  const addLog = (msg: string) => {
    setLogs((prev) => [ `[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19) ]);
  };

  const handleStartSimulation = () => {
    if (!socketRef.current?.connected) {
      alert('Socket server not connected. Check if backend is running on http://localhost:4000');
      return;
    }

    setIsSimulating(true);
    addLog(`Started GPS simulation for delivery ${deliveryId}`);

    socketRef.current.emit('tracking:start', { deliveryId, travelerId });

    // Interpolate between waypoints
    let currentIdx = stepIndex;
    const waypoints = selectedRoute.waypoints;

    intervalRef.current = setInterval(() => {
      if (currentIdx >= waypoints.length - 1) {
        setIsSimulating(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        addLog(`Simulation arrived at destination (${selectedRoute.destination})`);
        return;
      }

      currentIdx += 1;
      setStepIndex(currentIdx);
      const pos = waypoints[currentIdx];
      setCurrentCoord(pos);

      const payload = {
        deliveryId,
        travelerId,
        latitude: pos.lat,
        longitude: pos.lng,
        accuracy: 8,
        speed: speedKmH,
        heading: 180,
        timestamp: new Date().toISOString(),
      };

      if (socketRef.current) {
        socketRef.current.emit('tracking:location', payload);
        addLog(`Emitted GPS step ${currentIdx + 1}/${waypoints.length}: ${pos.lat}, ${pos.lng}`);
      }
    }, 2500);
  };

  const handlePauseSimulation = () => {
    setIsSimulating(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    addLog('Simulation paused');
  };

  const handleResetSimulation = () => {
    handlePauseSimulation();
    setStepIndex(0);
    const startPos = selectedRoute.waypoints[0];
    setCurrentCoord(startPos);
    addLog('Simulation reset to origin');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in p-2 sm:p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition shadow-xs border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
              Development Debug Mode Only
            </span>
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight mt-0.5">
              Live GPS Route Simulator
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          <span className="text-xs font-mono font-bold text-slate-700">
            {connected ? 'Socket Connected (4000)' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Simulator Control Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
              Select Preset Route
            </label>
            <select
              value={selectedRoute.id}
              onChange={(e) => {
                const found = PRESET_ROUTES.find((r) => r.id === e.target.value);
                if (found) {
                  setSelectedRoute(found);
                  setDeliveryId(found.id);
                  setStepIndex(0);
                  setCurrentCoord(found.waypoints[0]);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            >
              {PRESET_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
              Target Delivery ID
            </label>
            <input
              type="text"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
              Simulated Speed (km/h)
            </label>
            <input
              type="number"
              value={speedKmH}
              onChange={(e) => setSpeedKmH(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!isSimulating ? (
            <button
              onClick={handleStartSimulation}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 active:scale-95 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Start GPS Broadcast Simulation</span>
            </button>
          ) : (
            <button
              onClick={handlePauseSimulation}
              className="bg-rose-500 hover:bg-rose-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition flex items-center gap-2"
            >
              <Pause className="w-4 h-4 text-white fill-white" />
              <span>Pause Simulation</span>
            </button>
          )}

          <button
            onClick={handleResetSimulation}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-3 rounded-2xl text-xs transition active:scale-95 flex items-center gap-1.5 border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Position</span>
          </button>

          <Link
            href={`/deliveries/${deliveryId}`}
            target="_blank"
            className="bg-[#002b5c] text-white font-extrabold px-5 py-3 rounded-2xl text-xs hover:bg-[#001d40] transition flex items-center gap-1.5 ml-auto"
          >
            <span>Open Sender View in New Tab ↗</span>
          </Link>
        </div>
      </div>

      {/* Map View */}
      <MapComponent
        origin={selectedRoute.origin}
        destination={selectedRoute.destination}
        travelerName="Simulator Courier"
        status="IN_TRANSIT"
        eta="12:15 PM"
        currentLat={currentCoord.lat}
        currentLng={currentCoord.lng}
        isLive={true}
        speed={speedKmH}
        accuracy={8}
        lastUpdatedAgo="Just now"
      />

      {/* Live Socket Logs Console */}
      <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-bold flex items-center gap-1.5 text-amber-400">
            <Signal className="w-4 h-4" /> Live Socket.IO Telemetry Logs
          </span>
          <span className="text-[10px]">Step {stepIndex + 1} of {selectedRoute.waypoints.length}</span>
        </div>
        <div className="h-40 overflow-y-auto space-y-1 text-[11px] leading-relaxed">
          {logs.map((log, idx) => (
            <div key={idx} className={log.includes('Error') ? 'text-rose-400' : log.includes('Emitted') ? 'text-emerald-400' : 'text-slate-300'}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
