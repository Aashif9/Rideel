'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Search, Navigation, X, Check, Globe, Crosshair,
  Loader2, Map, CheckCircle2, ArrowRight
} from 'lucide-react';

interface LocationItem {
  name: string;
  city: string;
  state: string;
  fullAddress: string;
  lat?: number;
  lng?: number;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationItem) => void;
  initialValue?: string;
  title?: string;
}

const POPULAR_CITIES: LocationItem[] = [
  { name: 'Ongole Town', city: 'Ongole', state: 'Andhra Pradesh', fullAddress: 'Ongole, Prakasam District, Andhra Pradesh, 523001, India', lat: 15.5057, lng: 80.0499 },
  { name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', fullAddress: 'Chennai Central, Park Town, Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', fullAddress: 'Vijayawada Railway Station, Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Hyderabad Hitec City', city: 'Hyderabad', state: 'Telangana', fullAddress: 'Hitec City, Madhapur, Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Bangalore Indiranagar', city: 'Bangalore', state: 'Karnataka', fullAddress: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai BKC', city: 'Mumbai', state: 'Maharashtra', fullAddress: 'Bandra Kurla Complex, Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi Connaught Place', city: 'Delhi', state: 'Delhi', fullAddress: 'Connaught Place, New Delhi, Delhi', lat: 28.6139, lng: 77.2090 },
];

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialValue = 'Chennai, TN',
  title = 'Select Your Exact Location'
}: LocationPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'map'>('search');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationItem | null>(null);
  const [selectedMapCoords, setSelectedMapCoords] = useState<{ lat: number; lng: number }>({ lat: 15.5057, lng: 80.0499 }); // Ongole / AP default
  const [mapAddress, setMapAddress] = useState<string>('Ongole, Prakasam, Andhra Pradesh, India');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [mapAddressDetails, setMapAddressDetails] = useState<{ city: string; state: string; name: string }>({
    city: 'Ongole',
    state: 'Andhra Pradesh',
    name: 'Ongole Town'
  });

  // Debounced Place Search (Photon / OpenStreetMap Geocoding matching Google Maps places)
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&bbox=68,6,97,36`
        );
        const data = await response.json();

        if (data && data.features && data.features.length > 0) {
          const results: LocationItem[] = data.features.map((feat: any) => {
            const props = feat.properties;
            const coords = feat.geometry?.coordinates;
            const cityName = props.city || props.county || props.state || 'India';
            const name = props.name || props.street || cityName;
            const state = props.state || '';
            const fullAddress = [name, props.district, cityName, state].filter(Boolean).join(', ');
            return {
              name,
              city: cityName,
              state,
              fullAddress,
              lat: coords ? coords[1] : undefined,
              lng: coords ? coords[0] : undefined,
            };
          });
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Place search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle GPS Current Location Detection
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode lat/lng to exact place name
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.address || {};
          const cityName = address.city || address.town || address.village || address.suburb || 'Current Location';
          const placeName = address.road || address.neighbourhood || cityName;
          const stateName = address.state || 'India';
          const fullAddress = data.display_name || `${placeName}, ${cityName}, ${stateName}`;

          const locItem: LocationItem = {
            name: placeName,
            city: cityName,
            state: stateName,
            fullAddress: fullAddress,
            lat: latitude,
            lng: longitude
          };

          setDetectedLocation(locItem);
          onSelectLocation(locItem);
          setIsDetectingLocation(false);
          onClose();
        } catch (err) {
          setIsDetectingLocation(false);
          // Fallback location on error
          const fallback: LocationItem = {
            name: 'Current Location',
            city: 'Chennai',
            state: 'TN',
            fullAddress: 'Current Detected Location, Chennai, TN',
            lat: latitude,
            lng: longitude
          };
          onSelectLocation(fallback);
          onClose();
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        alert('Could not access current location. Please grant location permissions or pick on map.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };


  // Reverse Geocode when map coordinates change
  const fetchMapAddress = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data) {
        const addr = data.address || {};
        const extractedCity = addr.city || addr.town || addr.village || addr.city_district || addr.suburb || addr.county || addr.state_district || 'Selected Location';
        const extractedState = addr.state || 'India';
        const placeName = addr.road || addr.neighbourhood || addr.suburb || extractedCity;
        const fullAddr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        setMapAddress(fullAddr);
        setMapAddressDetails({
          city: extractedCity,
          state: extractedState,
          name: placeName
        });
      } else {
        setMapAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      setMapAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleConfirmLocation = (locItem: LocationItem) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rideel_selected_location', JSON.stringify(locItem));
    }
    onSelectLocation(locItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] border border-slate-100 animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Mobile Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 sm:hidden shrink-0"></div>

        {/* MODAL HEADER */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#002b5c] flex items-center justify-center border border-blue-100 shadow-xs">
              <MapPin className="w-4 h-4 text-[#002b5c]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight leading-tight">{title}</h2>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Search • GPS • Google Maps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition font-bold active:scale-95"
            aria-label="Close Location Picker"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'search'
                ? 'bg-[#002b5c] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Google Places</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('map');
              fetchMapAddress(selectedMapCoords.lat, selectedMapCoords.lng);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'map'
                ? 'bg-[#002b5c] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Pick on Map</span>
          </button>
        </div>

        {/* TAB CONTENT: SEARCH PLACES */}
        {activeTab === 'search' && (
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            
            {/* Auto Detect Location Button */}
            <button
              onClick={handleAutoLocate}
              disabled={isDetectingLocation}
              className="w-full bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 p-3.5 rounded-2xl flex items-center justify-between text-left transition group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#002b5c] text-white flex items-center justify-center shadow-xs">
                  {isDetectingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Crosshair className="w-4 h-4 text-sky-300" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#002b5c]">Use Current Location (GPS)</div>
                  <div className="text-[10px] text-slate-500 font-medium">Auto-detect exact city & address</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#002b5c] group-hover:translate-x-1 transition" />
            </button>

            {/* Google Places Search Input */}
            <div className="relative">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Search City or Address
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type city (e.g. Bangalore, Hyderabad, Anna Nagar)..."
                  className="w-full pl-10 pr-9 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c] focus:ring-1 focus:ring-[#002b5c]"
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 absolute right-3 text-[#002b5c] animate-spin" />
                )}
              </div>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                  Matching Locations
                </span>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleConfirmLocation(item)}
                      className="w-full p-3 text-left hover:bg-blue-50/50 transition flex items-start gap-2.5 group"
                    >
                      <MapPin className="w-4 h-4 text-[#002b5c] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate group-hover:text-[#002b5c]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">
                          {item.fullAddress}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Cities Quick Selection */}
            {!query && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                  Popular Hub Cities
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_CITIES.map((cityItem, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleConfirmLocation(cityItem)}
                      className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/70 rounded-xl text-left transition flex items-center gap-2 group"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#002b5c] shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold text-slate-800 group-hover:text-[#002b5c]">
                          {cityItem.city}
                        </div>
                        <div className="text-[9px] text-slate-400 font-semibold">{cityItem.state}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: PICK ON MAP */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3.5 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
              <div className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                <span>Google Maps Location Pin</span>
                <span className="text-[10px] font-bold text-[#002b5c] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Interactive Map Pin
                </span>
              </div>

              {/* Interactive Google Maps Embed Canvas */}
              <div className="w-full h-40 sm:h-48 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner bg-slate-900 shrink-0">
                <iframe
                  title="Google Maps Location Picker"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://maps.google.com/maps?q=${selectedMapCoords.lat},${selectedMapCoords.lng}&z=14&output=embed`}
                  className="w-full h-full opacity-100"
                />

                {/* Map Center Location Pin Marker */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center pb-6">
                  <div className="flex flex-col items-center animate-bounce">
                    <div className="w-8 h-8 rounded-full bg-[#002b5c] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="w-2.5 h-1.5 rounded-full bg-slate-900/50 blur-[1px] mt-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Selected Location Address Details */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  SELECTED LOCATION ADDRESS
                </span>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {isReverseGeocoding ? (
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#002b5c]" /> Fetching location details...
                    </span>
                  ) : (
                    mapAddress
                  )}
                </div>
              </div>

              {/* Preset City Quick Coordinates */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  JUMP TO QUICK CITY:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { name: 'Ongole', lat: 15.5057, lng: 80.0499 },
                    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
                    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
                    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
                    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
                    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 }
                  ].map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedMapCoords({ lat: c.lat, lng: c.lng });
                        fetchMapAddress(c.lat, c.lng);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 shrink-0 active:scale-95 transition"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Sticky Confirmation Footer */}
            <div className="p-3.5 bg-white border-t border-slate-100 shrink-0 shadow-lg">
              <button
                onClick={() => {
                  handleConfirmLocation({
                    name: mapAddressDetails.name || 'Map Location',
                    city: mapAddressDetails.city || 'Selected City',
                    state: mapAddressDetails.state || 'India',
                    fullAddress: mapAddress,
                    lat: selectedMapCoords.lat,
                    lng: selectedMapCoords.lng
                  });
                }}
                className="w-full bg-[#002b5c] hover:bg-[#001f44] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Confirm Map Location</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
