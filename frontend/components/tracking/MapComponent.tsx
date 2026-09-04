'use client';

import React, { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Navigation, MapPin, Truck, ShieldCheck, AlertCircle, Signal, Clock, Gauge } from 'lucide-react';
import { CITY_COORDINATES } from '@/lib/constants';

interface MapProps {
  origin: string;
  destination: string;
  travelerName?: string;
  status?: string;
  eta?: string;
  currentLat?: number;
  currentLng?: number;
  isLive?: boolean;
  isStale?: boolean;
  accuracy?: number;
  speed?: number;
  lastUpdatedAgo?: string;
  onRouteCalculated?: (info: { durationText: string; distanceText: string; calculatedEta: string }) => void;
}

export default function MapComponent({
  origin = 'Vijayawada',
  destination = 'Hyderabad',
  travelerName = 'Vikram Singh',
  status = 'IN_TRANSIT',
  eta = '12:15 PM',
  currentLat,
  currentLng,
  isLive = false,
  isStale = false,
  accuracy,
  speed,
  lastUpdatedAgo = 'Just now',
  onRouteCalculated,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const travelerMarkerRef = useRef<any>(null);

  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');
  const [loaderStarted, setLoaderStarted] = useState(false);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Dynamic Route ETA and Distance from Google Maps
  const [routeInfo, setRouteInfo] = useState<{ durationText: string; distanceText: string; calculatedEta: string } | null>(null);

  // Fetch API key dynamically if not inlined
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          if (data.googleMapsApiKey) {
            setApiKey(data.googleMapsApiKey);
          } else {
            setInitError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined.');
          }
        })
        .catch(() => setInitError('Failed to fetch API key from /api/config.'));
    }
  }, [apiKey]);

  // Load Google Maps & Render Base Map
  useEffect(() => {
    if (!apiKey) return;

    setLoaderStarted(true);

    try {
      setOptions({
        key: apiKey,
        v: 'weekly'
      });

      Promise.all([
        importLibrary('maps'),
        importLibrary('routes')
      ])
        .then(([mapsLib, routesLib]) => {
          setMapsApiLoaded(true);

          if (!mapRef.current) return;

          const originCoords = CITY_COORDINATES[origin] || [16.5062, 80.6480];
          const destCoords = CITY_COORDINATES[destination] || [17.3850, 78.4867];

          const { Map } = mapsLib;
          const { DirectionsService, DirectionsRenderer } = routesLib;

          const initialLat = currentLat || (originCoords[0] + destCoords[0]) / 2;
          const initialLng = currentLng || (originCoords[1] + destCoords[1]) / 2;

          const map = new Map(mapRef.current, {
            center: { lat: initialLat, lng: initialLng },
            zoom: currentLat && currentLng ? 12 : 7,
            disableDefaultUI: false,
            zoomControl: true,
            gestureHandling: "greedy",
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#0b1c30' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1c30' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#799dd6' }] },
              { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#dce9ff' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1f477b' }] },
              { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a5f94' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#001e40' }] }
            ]
          });

          mapInstanceRef.current = map;

          // Add Markers for Pickup (A) & Destination (B)
          if (window.google && window.google.maps) {
            new window.google.maps.Marker({
              position: { lat: originCoords[0], lng: originCoords[1] },
              map,
              title: `Pickup: ${origin}`,
              label: { text: 'A', color: '#ffffff', fontWeight: 'bold' }
            });

            new window.google.maps.Marker({
              position: { lat: destCoords[0], lng: destCoords[1] },
              map,
              title: `Delivery: ${destination}`,
              label: { text: 'B', color: '#ffffff', fontWeight: 'bold' }
            });

            // Initial Traveler Marker
            const travelerLat = currentLat || (originCoords[0] + (destCoords[0] - originCoords[0]) * 0.45);
            const travelerLng = currentLng || (originCoords[1] + (destCoords[1] - originCoords[1]) * 0.45);

            const travelerMarker = new window.google.maps.Marker({
              position: { lat: travelerLat, lng: travelerLng },
              map,
              title: `Live Traveler: ${travelerName}`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#fbbf24',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              }
            });

            travelerMarkerRef.current = travelerMarker;
          }

          // Directions Route Line
          const directionsService = new DirectionsService();
          const directionsRenderer = new DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#00b27b',
              strokeWeight: 5,
              strokeOpacity: 0.85
            }
          });

          directionsService.route(
            {
              origin: { lat: originCoords[0], lng: originCoords[1] },
              destination: { lat: destCoords[0], lng: destCoords[1] },
              travelMode: (window.google?.maps?.TravelMode?.DRIVING) || 'DRIVING'
            },
            (result: any, statusResult: any) => {
              if (statusResult === 'OK' && result) {
                directionsRenderer.setDirections(result);
                const leg = result.routes[0]?.legs[0];
                if (leg) {
                  const durText = leg.duration?.text || '3 hrs 45 mins';
                  const distText = leg.distance?.text || '274 km';
                  const durValSec = leg.duration?.value || 13500;
                  const etaDate = new Date(Date.now() + durValSec * 1000);
                  const calculatedEtaStr = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  const calculatedInfo = {
                    durationText: durText,
                    distanceText: distText,
                    calculatedEta: calculatedEtaStr
                  };

                  setRouteInfo(calculatedInfo);
                  if (onRouteCalculated) {
                    onRouteCalculated(calculatedInfo);
                  }
                }
              }
            }
          );

          setMapInitialized(true);
        })
        .catch((err: any) => {
          setInitError('Error rendering Google Maps instance.');
        });
    } catch (err: any) {
      setInitError('Failed to initialize Google Maps library.');
    }
  }, [apiKey]);

  // Smoothly update Google Maps traveler marker when new GPS coordinates arrive via Socket.IO
  useEffect(() => {
    if (currentLat !== undefined && currentLng !== undefined && travelerMarkerRef.current) {
      const newPos = { lat: currentLat, lng: currentLng };
      travelerMarkerRef.current.setPosition(newPos);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo(newPos);
      }
    }
  }, [currentLat, currentLng]);

  return (
    <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner">
      {/* Real Google Map Canvas Node */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Explicit Failure Screen */}
      {initError && (
        <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center space-y-3 z-30">
          <AlertCircle className="w-12 h-12 text-rose-500" />
          <h3 className="text-lg font-black text-rose-400">GOOGLE MAPS INITIALIZATION FAILED</h3>
          <p className="text-xs text-slate-300 max-w-md font-mono">{initError}</p>
        </div>
      )}

      {/* Top Floating Telemetry & Status Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{origin} → {destination}</span>
          {routeInfo?.distanceText && (
            <span className="text-slate-400 text-[11px] font-normal">({routeInfo.distanceText})</span>
          )}
        </div>

        {/* Live GPS Badge / Stale Warning */}
        {isStale ? (
          <div className="bg-amber-500 text-slate-950 backdrop-blur-md px-3 py-1.5 rounded-full font-black text-[10px] flex items-center gap-1 shadow-lg border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3 text-slate-950" />
            <span>⚠️ Location update delayed ({lastUpdatedAgo})</span>
          </div>
        ) : isLive ? (
          <div className="bg-emerald-500 text-slate-950 backdrop-blur-md px-3 py-1.5 rounded-full font-black text-[10px] flex items-center gap-1.5 shadow-lg uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
            <span>🟢 LIVE GPS ({lastUpdatedAgo})</span>
          </div>
        ) : (
          <div className="bg-slate-800/90 text-slate-300 backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-[10px] flex items-center gap-1 shadow-lg border border-slate-700">
            <Signal className="w-3 h-3 text-slate-400" />
            <span>Connecting GPS...</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Delivery Status Card with Live Google Maps Dynamic ETA */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#002b5c] flex items-center justify-center font-bold shadow-xs">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Traveler on route</div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
              {travelerName} <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
            Google Maps Est. Arrival
          </div>
          <div className="text-sm font-black text-[#002b5c]">
            {routeInfo?.calculatedEta || eta}
          </div>
          {routeInfo?.durationText && (
            <div className="text-[10px] font-bold text-emerald-600">
              ({routeInfo.durationText} left)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
