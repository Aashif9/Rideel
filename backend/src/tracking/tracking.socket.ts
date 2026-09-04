import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env';
import { trackingService } from './tracking.service';
import { validateLocationPayload } from './tracking.validation';
import {
  LocationPayload,
  TrackingEvents,
  TrackingSocketJoinPayload,
  TrackingSocketStartPayload,
  TrackingSocketStopPayload,
} from './tracking.types';

let ioServer: Server | null = null;

export function initializeTrackingSocket(httpServer: HttpServer): Server {
  ioServer = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  ioServer.on('connection', (socket: Socket) => {
    console.log(`🔌 New client connected to Socket.IO tracking server: ${socket.id}`);

    // Event 1: Join Delivery Room (Traveler, Sender, Receiver, or Admin)
    socket.on(TrackingEvents.CLIENT_JOIN, async (data: TrackingSocketJoinPayload) => {
      try {
        const { deliveryId, userId, role } = data || {};
        if (!deliveryId) {
          socket.emit(TrackingEvents.SERVER_ERROR, {
            deliveryId: '',
            message: 'deliveryId is required to join room',
            code: 'INVALID_ROOM',
          });
          return;
        }

        const roomName = `delivery:${deliveryId}`;
        await socket.join(roomName);
        console.log(`👤 Client ${socket.id} (user: ${userId || 'guest'}, role: ${role || 'subscriber'}) joined room: ${roomName}`);

        // Send latest known location immediately if available
        const latestLoc = await trackingService.getLatestLocation(deliveryId);
        if (latestLoc) {
          socket.emit(TrackingEvents.SERVER_LOCATION, latestLoc);
        }
      } catch (err: any) {
        socket.emit(TrackingEvents.SERVER_ERROR, {
          deliveryId: data?.deliveryId || '',
          message: err.message || 'Failed to join tracking room',
          code: 'JOIN_FAILED',
        });
      }
    });

    // Event 2: Start Trip Tracking (Traveler)
    socket.on(TrackingEvents.CLIENT_START, async (data: TrackingSocketStartPayload) => {
      try {
        const { deliveryId, travelerId } = data || {};
        if (!deliveryId) return;

        const auth = await trackingService.verifyTravelerAuthorization(deliveryId, travelerId);
        if (!auth.authorized) {
          socket.emit(TrackingEvents.SERVER_ERROR, {
            deliveryId,
            message: auth.reason || 'Unauthorized to start tracking for this delivery',
            code: 'UNAUTHORIZED',
          });
          return;
        }

        const roomName = `delivery:${deliveryId}`;
        ioServer?.to(roomName).emit(TrackingEvents.SERVER_STARTED, {
          deliveryId,
          travelerId,
          timestamp: new Date().toISOString(),
        });
        console.log(`🟢 Tracking started for delivery ${deliveryId} by traveler ${travelerId}`);
      } catch (err: any) {
        socket.emit(TrackingEvents.SERVER_ERROR, {
          deliveryId: data?.deliveryId || '',
          message: err.message,
          code: 'START_FAILED',
        });
      }
    });

    // Event 3: GPS Location Broadcast (Traveler -> Server -> Room)
    socket.on(TrackingEvents.CLIENT_LOCATION, async (rawPayload: any) => {
      try {
        // 1. Validate payload structure
        const validation = validateLocationPayload(rawPayload);
        if (!validation.valid || !validation.data) {
          socket.emit(TrackingEvents.SERVER_ERROR, {
            deliveryId: rawPayload?.deliveryId || '',
            message: validation.error || 'Invalid location payload',
            code: 'INVALID_PAYLOAD',
          });
          return;
        }

        const payload = validation.data;
        const { deliveryId, travelerId } = payload;

        // 2. Verify Traveler Authorization against DB
        const auth = await trackingService.verifyTravelerAuthorization(deliveryId, travelerId || '');
        if (!auth.authorized) {
          socket.emit(TrackingEvents.SERVER_ERROR, {
            deliveryId,
            message: auth.reason || 'Unauthorized: Only assigned traveler can publish location',
            code: 'UNAUTHORIZED_PUBLISHER',
          });

          if (auth.status === 'DELIVERED') {
            socket.emit(TrackingEvents.SERVER_STOPPED, {
              deliveryId,
              reason: 'Delivery completed',
            });
          }
          return;
        }

        // 3. Save to Postgres (throttled) and Memory Cache
        const savedPayload = await trackingService.saveLocation(payload);

        // 4. Broadcast to Socket Room
        const roomName = `delivery:${deliveryId}`;
        ioServer?.to(roomName).emit(TrackingEvents.SERVER_LOCATION, savedPayload);
      } catch (err: any) {
        console.error('Socket tracking:location error:', err);
        socket.emit(TrackingEvents.SERVER_ERROR, {
          deliveryId: rawPayload?.deliveryId || '',
          message: 'Internal server error processing location update',
          code: 'SERVER_ERROR',
        });
      }
    });

    // Event 4: Stop Tracking
    socket.on(TrackingEvents.CLIENT_STOP, async (data: TrackingSocketStopPayload) => {
      try {
        const { deliveryId, travelerId, reason } = data || {};
        if (!deliveryId) return;

        const roomName = `delivery:${deliveryId}`;
        ioServer?.to(roomName).emit(TrackingEvents.SERVER_STOPPED, {
          deliveryId,
          travelerId,
          reason: reason || 'Traveler manually stopped tracking',
          timestamp: new Date().toISOString(),
        });
        console.log(`🛑 Tracking stopped for delivery ${deliveryId}`);
      } catch (err: any) {
        console.error('Socket tracking:stop error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected from Socket.IO: ${socket.id}`);
    });
  });

  return ioServer;
}

export function getSocketServer(): Server | null {
  return ioServer;
}
