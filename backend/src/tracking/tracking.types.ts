export interface LocationPayload {
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

export interface TrackingSocketJoinPayload {
  deliveryId: string;
  userId?: string;
  role?: 'traveler' | 'sender' | 'receiver' | 'admin';
}

export interface TrackingSocketStartPayload {
  deliveryId: string;
  travelerId: string;
}

export interface TrackingSocketStopPayload {
  deliveryId: string;
  travelerId: string;
  reason?: string;
}

export interface TrackingErrorPayload {
  deliveryId: string;
  message: string;
  code: string;
}

export enum TrackingEvents {
  // Client -> Server
  CLIENT_JOIN = 'tracking:join',
  CLIENT_START = 'tracking:start',
  CLIENT_LOCATION = 'tracking:location',
  CLIENT_STOP = 'tracking:stop',

  // Server -> Client
  SERVER_LOCATION = 'tracking:location',
  SERVER_STARTED = 'tracking:started',
  SERVER_STOPPED = 'tracking:stopped',
  SERVER_ERROR = 'tracking:error',
}
