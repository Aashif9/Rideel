import {
  User, Trip, Parcel, MatchRequest, Delivery, Payment,
  WalletTransaction, Review, Message, AppNotification, Dispute,
  BusinessAccount, BulkShipment, KYCVerification, Vehicle
} from '@/types';

const STORAGE_KEY = 'rideel_app_db_v3';

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

export function getInitialDatabase(): AppDatabase {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Remove old mock data
          if (Array.isArray(parsed.users)) {
            parsed.users = parsed.users.filter((u: any) => u.id && !u.id.startsWith('usr_sender') && !u.id.startsWith('usr_traveler') && !u.id.startsWith('usr_business') && !u.id.startsWith('a0000000'));
          }
          return parsed;
        }
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

export function clearLocalClientStorage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('rideel_app_db_v2');
    localStorage.removeItem('rideel_app_db');
    localStorage.removeItem('rideel_app_database');
  }
}
