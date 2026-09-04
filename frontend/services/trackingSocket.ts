'use client';

import { io, Socket } from 'socket.io-client';
import { LocationData } from '@/hooks/useLiveLocation';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class TrackingSocketService {
  private socket: Socket | null = null;
  private currentDeliveryId: string | null = null;

  public connect(): Socket {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(BACKEND_URL, {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to RIDEEL Tracking Socket Server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.warn('🔌 Tracking Socket disconnected');
      });
    }

    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentDeliveryId = null;
    }
  }

  public joinRoom(deliveryId: string, userId?: string, role?: string) {
    const socket = this.connect();
    this.currentDeliveryId = deliveryId;
    socket.emit('tracking:join', { deliveryId, userId, role });
  }

  public startTracking(deliveryId: string, travelerId?: string) {
    const socket = this.connect();
    socket.emit('tracking:start', { deliveryId, travelerId });
  }

  public emitLocation(payload: LocationData) {
    const socket = this.connect();
    socket.emit('tracking:location', payload);
  }

  public stopTracking(deliveryId: string, travelerId?: string) {
    const socket = this.connect();
    socket.emit('tracking:stop', { deliveryId, travelerId });
  }

  public onLocationUpdate(callback: (location: LocationData) => void) {
    const socket = this.connect();
    socket.off('tracking:location');
    socket.on('tracking:location', callback);
  }

  public onTrackingStarted(callback: (data: any) => void) {
    const socket = this.connect();
    socket.off('tracking:started');
    socket.on('tracking:started', callback);
  }

  public onTrackingStopped(callback: (data: any) => void) {
    const socket = this.connect();
    socket.off('tracking:stopped');
    socket.on('tracking:stopped', callback);
  }

  public onError(callback: (error: any) => void) {
    const socket = this.connect();
    socket.off('tracking:error');
    socket.on('tracking:error', callback);
  }

  public async fetchLatestLocationRest(deliveryId: string): Promise<LocationData | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/deliveries/${deliveryId}/location`);
      const data = await res.json();
      if (data.success && data.location) {
        return data.location;
      }
    } catch (err) {
      console.warn('Failed to fetch REST location fallback:', err);
    }
    return null;
  }
}

export const trackingSocketService = new TrackingSocketService();
