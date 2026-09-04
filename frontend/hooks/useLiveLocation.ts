'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { trackingSocketService } from '@/services/trackingSocket';

export interface LocationData {
  deliveryId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
  travelerId?: string;
  travelerName?: string;
}

interface UseLiveLocationOptions {
  deliveryId: string;
  travelerId?: string;
  role?: 'traveler' | 'sender' | 'receiver' | 'admin';
  isTraveler?: boolean;
  autoSubscribe?: boolean;
}

export function useLiveLocation({
  deliveryId,
  travelerId,
  role = 'sender',
  isTraveler = false,
  autoSubscribe = true,
}: UseLiveLocationOptions) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [lastUpdatedAgo, setLastUpdatedAgo] = useState<string>('Never');
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const watchIdRef = useRef<number | null>(null);
  const lastEmitTimeRef = useRef<number>(0);
  const lastEmittedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Helper to calculate distance in meters (Haversine formula)
  const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // 1. Subscribe via trackingSocketService
  useEffect(() => {
    if (!deliveryId || !autoSubscribe) return;

    // Join Socket room
    trackingSocketService.joinRoom(deliveryId, travelerId, role);
    setIsConnected(true);

    // Register listeners
    trackingSocketService.onLocationUpdate((data: LocationData) => {
      if (data && data.deliveryId === deliveryId) {
        setCurrentLocation(data);
        setIsLive(true);
        setIsStale(false);
        setError(null);
      }
    });

    trackingSocketService.onTrackingStarted(() => {
      setIsLive(true);
      setIsTracking(true);
    });

    trackingSocketService.onTrackingStopped((res: any) => {
      setIsLive(false);
      setIsTracking(false);
      if (res?.reason) {
        setError(`Tracking stopped: ${res.reason}`);
      }
    });

    trackingSocketService.onError((err: any) => {
      console.error('Tracking socket error:', err);
      setError(err?.message || 'Tracking socket error');
    });

    // REST fallback for initial location
    trackingSocketService.fetchLatestLocationRest(deliveryId).then((loc) => {
      if (loc) {
        setCurrentLocation((prev) => prev || loc);
        setIsLive(true);
      }
    });

    return () => {
      trackingSocketService.disconnect();
    };
  }, [deliveryId, travelerId, role, autoSubscribe]);

  // 2. Timer to calculate "Last updated X ago" and Stale status (> 2 mins)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentLocation?.timestamp) {
        setLastUpdatedAgo('Never');
        return;
      }

      const diffSec = Math.floor((Date.now() - new Date(currentLocation.timestamp).getTime()) / 1000);
      if (diffSec < 5) {
        setLastUpdatedAgo('Just now');
        setIsStale(false);
      } else if (diffSec < 60) {
        setLastUpdatedAgo(`${diffSec} seconds ago`);
        setIsStale(false);
      } else {
        const mins = Math.floor(diffSec / 60);
        setLastUpdatedAgo(`${mins} minute${mins > 1 ? 's' : ''} ago`);
        if (mins >= 2) {
          setIsStale(true);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentLocation]);

  // 3. Real Geolocation Acquisition (navigator.geolocation.watchPosition)
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser/device.');
      return;
    }

    if (!deliveryId) {
      setError('Delivery ID is required to start tracking.');
      return;
    }

    setIsTracking(true);
    setError(null);

    // Notify backend socket transport
    trackingSocketService.startTracking(deliveryId, travelerId);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 3000,
    };

    const handlePosition = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed, heading } = position.coords;
      const now = Date.now();

      // Client-side throttling: emit every 3s OR if moved > 5 meters
      const lastEmitTime = lastEmitTimeRef.current;
      const lastCoords = lastEmittedCoordsRef.current;
      const dist = lastCoords
        ? calculateDistanceMeters(lastCoords.lat, lastCoords.lng, latitude, longitude)
        : 999;

      if (now - lastEmitTime >= 3000 || dist >= 5) {
        lastEmitTimeRef.current = now;
        lastEmittedCoordsRef.current = { lat: latitude, lng: longitude };

        const payload: LocationData = {
          deliveryId,
          travelerId,
          latitude,
          longitude,
          accuracy: accuracy || undefined,
          speed: speed ? Math.round(speed * 3.6) : undefined, // m/s -> km/h
          heading: heading || undefined,
          timestamp: new Date(position.timestamp).toISOString(),
        };

        setCurrentLocation(payload);
        setIsLive(true);
        setIsStale(false);

        // Emit through transport service
        trackingSocketService.emitLocation(payload);
      }
    };

    const handleError = (err: GeolocationPositionError) => {
      let msg = 'Failed to acquire GPS position';
      if (err.code === err.PERMISSION_DENIED) {
        msg = 'GPS permission denied. Please allow location access in browser settings.';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        msg = 'GPS position unavailable. Please check location settings.';
      } else if (err.code === err.TIMEOUT) {
        msg = 'GPS position request timed out.';
      }
      setError(msg);
    };

    const watchId = navigator.geolocation.watchPosition(handlePosition, handleError, options);
    watchIdRef.current = watchId;
  }, [deliveryId, travelerId]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(false);

    if (deliveryId) {
      trackingSocketService.stopTracking(deliveryId, travelerId);
    }
  }, [deliveryId, travelerId]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    currentLocation,
    isTracking,
    isLive,
    isStale,
    isConnected,
    lastUpdatedAgo,
    error,
    startTracking,
    stopTracking,
    setCurrentLocation,
  };
}
