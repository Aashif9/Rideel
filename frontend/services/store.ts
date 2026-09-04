import {
  User, Trip, Parcel, MatchRequest, Delivery, Payment,
  WalletTransaction, Review, Message, AppNotification, Dispute,
  BusinessAccount, BulkShipment, KYCVerification, Vehicle
} from '@/types';
import { MOCK_USERS, CITY_COORDINATES } from '@/lib/constants';

const STORAGE_KEY = 'rideel_app_db_v2';

export interface AppDatabase {
  users: User[];
  trips: Trip[];
  parcels: Parcel[];
  matchRequests: MatchRequest[];
  deliveries: Delivery[];
  payments: Payment[];
  walletTransactions: WalletTransaction[];
  reviews: Review[];
  messages: Message[];
  notifications: AppNotification[];
  disputes: Dispute[];
  businessAccounts: BusinessAccount[];
  bulkShipments: BulkShipment[];
  kycVerifications: KYCVerification[];
  vehicles: Vehicle[];
  currentUser: User;
}

const INITIAL_TRIPS: Trip[] = [];
const INITIAL_PARCELS: Parcel[] = [];
const INITIAL_DELIVERIES: Delivery[] = [];
const INITIAL_PAYMENTS: Payment[] = [];
const INITIAL_WALLET: WalletTransaction[] = [];
const INITIAL_NOTIFICATIONS: AppNotification[] = [];
const INITIAL_VEHICLES: Vehicle[] = [];
const INITIAL_KYC: KYCVerification[] = [];
const INITIAL_BUSINESS: BusinessAccount[] = [];
const INITIAL_BULK: BulkShipment[] = [];

export function getInitialDatabase(): AppDatabase {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure no leftover mock user IDs exist
        if (parsed && Array.isArray(parsed.users)) {
          parsed.users = parsed.users.filter((u: any) => u.id && !u.id.startsWith('usr_sender') && !u.id.startsWith('usr_traveler') && !u.id.startsWith('usr_business') && !u.id.startsWith('a0000000'));
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse local DB storage:', e);
      }
    }
  }

  const initialDb: AppDatabase = {
    users: [],
    trips: [],
    parcels: [],
    matchRequests: [],
    deliveries: [],
    payments: [],
    walletTransactions: [],
    reviews: [],
    messages: [],
    notifications: [],
    disputes: [],
    businessAccounts: [],
    bulkShipments: [],
    kycVerifications: [],
    vehicles: [],
    currentUser: null as unknown as User
  };

  return initialDb;
}

export function saveDatabase(db: AppDatabase) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}
