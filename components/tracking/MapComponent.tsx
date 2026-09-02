'use client';

import React, { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Navigation, MapPin, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { CITY_COORDINATES } from '@/lib/constants';

interface MapProps {
  origin: string;
  destination: string;
  travelerName?: string;
  status?: string;
  eta?: string;
  currentLat?: number;
  currentLng?: number;
}

export default function MapComponent({
  origin = 'Vijayawada',
  destination = 'Hyderabad',
  travelerName = 'Vikram Singh',
  status = 'IN_TRANSIT',
  eta = '12:15 PM'
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');
  const [loaderStarted, setLoaderStarted] = useState(false);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Fetch API key dynamically from server route if client-side environment variable is not inlined
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          if (data.googleMapsApiKey) {
            setApiKey(data.googleMapsApiKey);
          } else {
            setInitError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined in environment variables.');
          }
        })
        .catch(err => setInitError('Failed to fetch API key from /api/config.'));
    }
  }, [apiKey]);

  // Load Google Maps using official @googlemaps/js-api-loader functional API
  useEffect(() => {
    if (!apiKey) return;

    console.log('Maps loader started');
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
          console.log('Maps API loaded');
          setMapsApiLoaded(true);

          if (!mapRef.current) return;

          console.log('Maps initialization started');

          const originCoords = CITY_COORDINATES[origin] || [16.5062, 80.6480];
          const destCoords = CITY_COORDINATES[destination] || [17.3850, 78.4867];

          const { Map } = mapsLib;
          const { DirectionsService, DirectionsRenderer } = routesLib;

          const map = new Map(mapRef.current, {
            center: { lat: (originCoords[0] + destCoords[0]) / 2, lng: (originCoords[1] + destCoords[1]) / 2 },
            zoom: 7,
            disableDefaultUI: true,
            zoomControl: true,
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

          // Add Markers for Pickup (A), Destination (B), and Traveler Courier
          if (window.google && window.google.maps && window.google.maps.Marker) {
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

            // Midpoint Traveler Marker
            const travelerLat = originCoords[0] + (destCoords[0] - originCoords[0]) * 0.45;
            const travelerLng = originCoords[1] + (destCoords[1] - originCoords[1]) * 0.45;

            new window.google.maps.Marker({
              position: { lat: travelerLat, lng: travelerLng },
              map,
              title: `Traveler: ${travelerName}`
            });
          }

          // Directions Route
          const directionsService = new DirectionsService();
          const directionsRenderer = new DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#00b27b',
              strokeWeight: 6,
              strokeOpacity: 0.9
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
              }
            }
          );

          console.log('Maps initialization successful');
          setMapInitialized(true);
        })
        .catch((err: any) => {
          console.error('Maps importLibrary failed. Error:', err);
          setInitError(err?.message || 'Google Maps JS API failed to initialize.');
        });
    } catch (err: any) {
      console.error('Maps setOptions error:', err);
      setInitError(err?.message || 'Google Maps setOptions error.');
    }
  }, [apiKey, origin, destination, travelerName]);

  return (
    <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner">
      {/* Real Google Map Canvas Node */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Explicit Failure Screen (Fallback disabled as per debug rules) */}
      {initError && (
        <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center space-y-3 z-30">
          <AlertCircle className="w-12 h-12 text-rose-500" />
          <h3 className="text-lg font-black text-rose-400">GOOGLE MAPS INITIALIZATION FAILED</h3>
          <p className="text-xs text-slate-300 max-w-md font-mono">{initError}</p>
          <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-[11px] font-mono text-slate-400 text-left space-y-1">
            <div>API Key Detected: {apiKey ? 'YES' : 'NO'}</div>
            <div>Key Length: {apiKey ? apiKey.length : 0}</div>
            <div>Maps Loader Started: {loaderStarted ? 'YES' : 'NO'}</div>
            <div>Maps API Loaded: {mapsApiLoaded ? 'YES' : 'NO'}</div>
          </div>
        </div>
      )}

      {/* Top Floating Route Badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{origin} → {destination}</span>
        </div>
        <div className="bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-slate-950 font-bold text-xs flex items-center gap-1 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
          <span>GOOGLE MAPS GPS</span>
        </div>
      </div>

      {/* Bottom Floating Delivery Status Card */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-surface-container-high shadow-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
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
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Arrival</div>
          <div className="text-sm font-extrabold text-primary">{eta}</div>
        </div>
      </div>
    </div>
  );
}
