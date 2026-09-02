'use client';

import React, { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MapPin, Navigation, AlertCircle, CheckCircle2, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MapsDebugPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // Diagnostic State
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');
  const [loaderStarted, setLoaderStarted] = useState(false);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Route & Places Data
  const [distanceText, setDistanceText] = useState<string>('');
  const [durationText, setDurationText] = useState<string>('');
  const [fromPlace, setFromPlace] = useState<{ id: string; lat: number; lng: number; address: string } | null>(null);
  const [toPlace, setToPlace] = useState<{ id: string; lat: number; lng: number; address: string } | null>(null);

  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  // Step 1: Ensure API Key is resolved (check process.env or fallback to /api/config)
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.googleMapsApiKey) {
          setApiKey(data.googleMapsApiKey);
        }
      })
      .catch(err => {
        console.error('Diagnostic: Error fetching /api/config:', err);
      });
  }, []);

  // Step 2: Initialize Google Maps using @googlemaps/js-api-loader functional API (setOptions & importLibrary)
  useEffect(() => {
    if (!apiKey) return;

    console.log('Diagnostic: Maps loader started');
    setLoaderStarted(true);
    setInitError(null);

    try {
      setOptions({
        key: apiKey,
        v: 'weekly'
      });

      Promise.all([
        importLibrary('maps'),
        importLibrary('routes'),
        importLibrary('places'),
        importLibrary('geometry')
      ])
        .then(([mapsLib, routesLib, placesLib]) => {
          console.log('Diagnostic: Maps API loaded');
          setMapsApiLoaded(true);

          if (!mapRef.current) return;

          console.log('Diagnostic: Maps initialization started');

          // Vijayawada Coordinates
          const vijayawada = { lat: 16.5062, lng: 80.6480 };
          // Hyderabad Coordinates
          const hyderabad = { lat: 17.3850, lng: 78.4867 };

          const { Map } = mapsLib;
          const { DirectionsService, DirectionsRenderer } = routesLib;
          const { Autocomplete } = placesLib;

          const map = new Map(mapRef.current, {
            center: { lat: (vijayawada.lat + hyderabad.lat) / 2, lng: (vijayawada.lng + hyderabad.lng) / 2 },
            zoom: 7,
            zoomControl: true,
            streetViewControl: false,
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

          // Add Markers for Vijayawada and Hyderabad
          if (window.google && window.google.maps && window.google.maps.Marker) {
            new window.google.maps.Marker({
              position: vijayawada,
              map,
              title: 'Origin: Vijayawada',
              label: { text: 'A', color: '#ffffff', fontWeight: 'bold' }
            });

            new window.google.maps.Marker({
              position: hyderabad,
              map,
              title: 'Destination: Hyderabad',
              label: { text: 'B', color: '#ffffff', fontWeight: 'bold' }
            });
          }

          // Initialize Directions Service & Renderer
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
          directionsRendererRef.current = directionsRenderer;

          // Calculate Default Vijayawada -> Hyderabad Route
          directionsService.route(
            {
              origin: vijayawada,
              destination: hyderabad,
              travelMode: (window.google?.maps?.TravelMode?.DRIVING) || 'DRIVING'
            },
            (result: any, status: any) => {
              if (status === 'OK' && result) {
                directionsRenderer.setDirections(result);
                const route = result.routes[0]?.legs[0];
                if (route) {
                  setDistanceText(route.distance?.text || '');
                  setDurationText(route.duration?.text || '');
                }
              } else {
                console.warn('Directions request failed:', status);
              }
            }
          );

          // Setup Places Autocomplete for From Input
          if (fromInputRef.current) {
            const fromAutocomplete = new Autocomplete(fromInputRef.current, {
              componentRestrictions: { country: 'in' },
              fields: ['place_id', 'geometry', 'formatted_address', 'name']
            });

            fromAutocomplete.addListener('place_changed', () => {
              const place = fromAutocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setFromPlace({
                  id: place.place_id || 'unknown_id',
                  lat,
                  lng,
                  address: place.formatted_address || place.name || ''
                });

                if (window.google && window.google.maps && window.google.maps.Marker) {
                  new window.google.maps.Marker({
                    position: { lat, lng },
                    map,
                    title: place.name
                  });
                }
              }
            });
          }

          // Setup Places Autocomplete for To Input
          if (toInputRef.current) {
            const toAutocomplete = new Autocomplete(toInputRef.current, {
              componentRestrictions: { country: 'in' },
              fields: ['place_id', 'geometry', 'formatted_address', 'name']
            });

            toAutocomplete.addListener('place_changed', () => {
              const place = toAutocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setToPlace({
                  id: place.place_id || 'unknown_id',
                  lat,
                  lng,
                  address: place.formatted_address || place.name || ''
                });

                if (window.google && window.google.maps && window.google.maps.Marker) {
                  new window.google.maps.Marker({
                    position: { lat, lng },
                    map,
                    title: place.name
                  });
                }
              }
            });
          }

          console.log('Diagnostic: Maps initialization successful');
          setMapInitialized(true);
        })
        .catch((err: any) => {
          console.error('Diagnostic: Maps importLibrary failed. Error:', err);
          setInitError(err?.message || 'Google Maps importLibrary failed to load.');
        });
    } catch (err: any) {
      console.error('Diagnostic: setOptions error:', err);
      setInitError(err?.message || 'Google Maps setOptions error.');
    }
  }, [apiKey]);

  // Recalculate Route when both From & To Places are selected via Autocomplete
  useEffect(() => {
    if (fromPlace && toPlace && window.google && window.google.maps && mapInstanceRef.current) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: fromPlace.lat, lng: fromPlace.lng },
          destination: { lat: toPlace.lat, lng: toPlace.lng },
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result: any, status: any) => {
          if (status === 'OK' && result && directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
            const route = result.routes[0]?.legs[0];
            if (route) {
              setDistanceText(route.distance?.text || '');
              setDurationText(route.duration?.text || '');
            }
          }
        }
      );
    }
  }, [fromPlace, toPlace]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in p-4">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Google Maps Diagnostic & Testing Suite</h1>
        <p className="text-xs text-slate-500 mt-1">
          Verification of Google Maps JavaScript API, Places Autocomplete, and Directions Routing.
        </p>
      </div>

      {/* 1. Development Diagnostic Panel */}
      <div className="rideel-card p-5 space-y-3 bg-slate-900 text-white">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 border-b border-slate-700 pb-2">
          Google Maps Configuration & Status
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">API Key Detected</span>
            <span className={`font-bold ${apiKey ? 'text-emerald-400' : 'text-rose-400'}`}>
              {apiKey ? 'YES' : 'NO'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Key Length</span>
            <span className="font-bold text-white">{apiKey ? apiKey.length : 0}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Loader Started</span>
            <span className={`font-bold ${loaderStarted ? 'text-emerald-400' : 'text-slate-400'}`}>
              {loaderStarted ? 'YES' : 'NO'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Maps API Loaded</span>
            <span className={`font-bold ${mapsApiLoaded ? 'text-emerald-400' : 'text-slate-400'}`}>
              {mapsApiLoaded ? 'YES' : 'NO'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Map Initialized</span>
            <span className={`font-bold ${mapInitialized ? 'text-emerald-400' : 'text-slate-400'}`}>
              {mapInitialized ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      {/* Explicit Failure Error Banner (Simulated fallback disabled) */}
      {initError && (
        <div className="p-6 bg-rose-50 border-2 border-rose-500 rounded-2xl text-rose-900 space-y-2">
          <div className="font-extrabold text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>GOOGLE MAPS INITIALIZATION FAILED</span>
          </div>
          <p className="text-xs text-rose-800 font-mono">Error: {initError}</p>
        </div>
      )}

      {/* 2. Real Google Map Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
          <span>Real Google Map Canvas View</span>
          {distanceText && (
            <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Route Distance: {distanceText} | Est Duration: {durationText}
            </span>
          )}
        </div>

        <div className="w-full h-96 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>

      {/* 3. Google Places Autocomplete & Dynamic Routes Test */}
      <div className="rideel-card p-6 space-y-6">
        <h3 className="text-base font-extrabold text-primary border-b pb-2">
          Google Places Autocomplete & Dynamic Routes Test
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">From (Origin Autocomplete):</label>
            <input
              ref={fromInputRef}
              type="text"
              placeholder="Type city or location in India..."
              className="w-full bg-surface-container-low border rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-primary"
            />
            {fromPlace && (
              <div className="mt-2 p-3 bg-surface-container rounded-xl text-[11px] font-mono space-y-1">
                <div><strong>Place ID:</strong> {fromPlace.id}</div>
                <div><strong>Lat/Lng:</strong> {fromPlace.lat.toFixed(4)}, {fromPlace.lng.toFixed(4)}</div>
                <div><strong>Formatted Address:</strong> {fromPlace.address}</div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">To (Destination Autocomplete):</label>
            <input
              ref={toInputRef}
              type="text"
              placeholder="Type destination city in India..."
              className="w-full bg-surface-container-low border rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-primary"
            />
            {toPlace && (
              <div className="mt-2 p-3 bg-surface-container rounded-xl text-[11px] font-mono space-y-1">
                <div><strong>Place ID:</strong> {toPlace.id}</div>
                <div><strong>Lat/Lng:</strong> {toPlace.lat.toFixed(4)}, {toPlace.lng.toFixed(4)}</div>
                <div><strong>Formatted Address:</strong> {toPlace.address}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
