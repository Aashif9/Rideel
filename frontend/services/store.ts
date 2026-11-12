import {
  User, Trip, Parcel, MatchRequest, Delivery, Payment,
  WalletTransaction, Review, Message, AppNotification, Dispute,
  BusinessAccount, BulkShipment, KYCVerification, Vehicle
} from '@/types';

const STORAGE_KEY = 'rideel_app_db_v4';

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

const DEMO_USERS: User[] = [
  {
    id: 'usr_aarav_sharma',
    full_name: 'Aarav Sharma',
    phone: '+919876543210',
    email: 'aarav@rideel.in',
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    city: 'Chennai',
    rating: 4.9,
    completed_deliveries: 12,
    role: ['sender', 'traveler'],
    active_mode: 'sender',
    account_status: 'active',
    is_kyc_verified: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'usr_vikram_reddy',
    full_name: 'Vikram Reddy',
    phone: '+919812345678',
    email: 'vikram.reddy@rideel.in',
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    city: 'Vijayawada',
    rating: 4.95,
    completed_deliveries: 28,
    role: ['traveler'],
    active_mode: 'traveler',
    account_status: 'active',
    is_kyc_verified: true,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'usr_priya_patel',
    full_name: 'Priya Patel',
    phone: '+919898765432',
    email: 'priya.patel@rideel.in',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    city: 'Hyderabad',
    rating: 4.85,
    completed_deliveries: 19,
    role: ['traveler'],
    active_mode: 'traveler',
    account_status: 'active',
    is_kyc_verified: true,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_TRIPS: Trip[] = [
  {
    id: 'trip_vja_hyd_01',
    traveler_id: 'usr_vikram_reddy',
    origin: 'Vijayawada',
    destination: 'Hyderabad',
    origin_coordinates: [16.5062, 80.6480],
    destination_coordinates: [17.3850, 78.4867],
    travel_date: new Date().toISOString().split('T')[0],
    departure_time: '14:30',
    estimated_arrival: '19:00',
    vehicle_id: 'veh_01',
    capacity_kg: 10.0,
    available_capacity_kg: 8.5,
    max_weight_kg: 5.0,
    pickup_preference: 'meet_traveler',
    delivery_preference: 'meet_traveler',
    price_per_kg: 65,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    traveler: DEMO_USERS[1]
  },
  {
    id: 'trip_blr_chn_02',
    traveler_id: 'usr_priya_patel',
    origin: 'Bangalore',
    destination: 'Chennai',
    origin_coordinates: [12.9716, 77.5946],
    destination_coordinates: [13.0827, 80.2707],
    travel_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departure_time: '08:00',
    estimated_arrival: '13:30',
    vehicle_id: 'veh_02',
    capacity_kg: 12.0,
    available_capacity_kg: 12.0,
    max_weight_kg: 6.0,
    pickup_preference: 'partner_point',
    delivery_preference: 'meet_traveler',
    price_per_kg: 60,
    status: 'POSTED',
    created_at: new Date().toISOString(),
    traveler: DEMO_USERS[2]
  },
  {
    id: 'trip_bvr_chn_03',
    traveler_id: 'usr_vikram_reddy',
    origin: 'Bhimavaram',
    destination: 'Chennai',
    origin_coordinates: [16.5449, 81.5212],
    destination_coordinates: [13.0827, 80.2707],
    travel_date: new Date().toISOString().split('T')[0],
    departure_time: '11:00',
    estimated_arrival: '19:30',
    vehicle_id: 'veh_01',
    capacity_kg: 8.0,
    available_capacity_kg: 6.0,
    max_weight_kg: 4.0,
    pickup_preference: 'meet_traveler',
    delivery_preference: 'meet_traveler',
    price_per_kg: 70,
    status: 'POSTED',
    created_at: new Date().toISOString(),
    traveler: DEMO_USERS[1]
  }
];

const DEMO_DELIVERIES: Delivery[] = [
  {
    id: 'RD849201',
    parcel_id: 'pcl_sample_01',
    trip_id: 'trip_vja_hyd_01',
    traveler_id: 'usr_vikram_reddy',
    sender_id: 'usr_aarav_sharma',
    pickup_location: 'Vijayawada Benz Circle',
    delivery_location: 'Hyderabad Hitech City',
    expected_delivery_time: '19:00',
    status: 'IN_TRANSIT',
    delivery_fee: 175,
    service_fee: 25,
    insurance_fee: 20,
    total_amount: 220,
    traveler_payout: 175,
    pickup_otp: '481920',
    delivery_otp: '739104',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    traveler: DEMO_USERS[1],
    sender: DEMO_USERS[0],
    parcel: {
      id: 'pcl_sample_01',
      sender_id: 'usr_aarav_sharma',
      parcel_type: 'small',
      description: 'Important legal documents and samples',
      weight_kg: 1.5,
      length_cm: 25,
      width_cm: 20,
      height_cm: 5,
      parcel_photo: '',
      declared_value: 3500,
      insurance_selected: true,
      insurance_amount: 20,
      origin: 'Vijayawada',
      destination: 'Hyderabad',
      travel_date: new Date().toISOString().split('T')[0],
      pickup_preference: 'meet_traveler',
      delivery_preference: 'meet_traveler',
      status: 'IN_TRANSIT',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  }
];

export const DEMO_PARCELS: Parcel[] = [
  {
    id: 'pcl_sample_01',
    sender_id: 'usr_aarav_sharma',
    parcel_type: 'small',
    description: 'Important legal documents and samples',
    weight_kg: 1.5,
    length_cm: 25,
    width_cm: 20,
    height_cm: 5,
    parcel_photo: '',
    declared_value: 3500,
    insurance_selected: true,
    insurance_amount: 20,
    origin: 'Vijayawada',
    destination: 'Hyderabad',
    travel_date: new Date().toISOString().split('T')[0],
    pickup_preference: 'meet_traveler',
    delivery_preference: 'meet_traveler',
    status: 'SEARCHING',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export function getInitialDatabase(): AppDatabase {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (!parsed.trips || parsed.trips.length === 0) {
            parsed.trips = DEMO_TRIPS;
          }
          if (!parsed.users || parsed.users.length === 0) {
            parsed.users = DEMO_USERS;
          }
          if (!parsed.currentUser) {
            parsed.currentUser = DEMO_USERS[0];
          }
          if (!parsed.deliveries || parsed.deliveries.length === 0) {
            parsed.deliveries = DEMO_DELIVERIES;
          }
          if (!parsed.parcels || parsed.parcels.length === 0) {
            parsed.parcels = DEMO_PARCELS;
          }
          if (!parsed.matchRequests || parsed.matchRequests.length === 0) {
            parsed.matchRequests = [
              {
                id: 'mr_demo_01',
                parcel_id: 'pcl_sample_01',
                trip_id: 'trip_vja_hyd_01',
                sender_id: 'usr_aarav_sharma',
                traveler_id: 'usr_vikram_reddy',
                match_score: 96,
                status: 'PENDING',
                created_at: new Date().toISOString()
              }
            ];
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse local DB storage:', e);
      }
    }
  }

  const initialDb: AppDatabase = {
    users: DEMO_USERS,
    trips: DEMO_TRIPS,
    parcels: DEMO_PARCELS,
    matchRequests: [
      {
        id: 'mr_demo_01',
        parcel_id: 'pcl_sample_01',
        trip_id: 'trip_vja_hyd_01',
        sender_id: 'usr_aarav_sharma',
        traveler_id: 'usr_vikram_reddy',
        match_score: 96,
        status: 'PENDING',
        created_at: new Date().toISOString()
      }
    ],
    deliveries: DEMO_DELIVERIES,
    payments: [
      {
        id: 'pay_demo_01',
        delivery_id: 'RD849201',
        sender_id: 'usr_aarav_sharma',
        traveler_id: 'usr_vikram_reddy',
        amount: 220,
        platform_fee: 25,
        insurance_fee: 20,
        traveler_payout: 175,
        status: 'ESCROW_HELD',
        provider: 'DEMO_SIMULATION',
        transaction_reference: 'SIM-ESCROW-849201',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString()
      }
    ],
    walletTransactions: [
      {
        id: 'wtx_demo_01',
        user_id: 'usr_vikram_reddy',
        delivery_id: 'RD849201',
        type: 'ESCROW_HOLD',
        amount: 175,
        status: 'ESCROW',
        description: 'Escrow hold for Delivery RD849201',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'wtx_demo_02',
        user_id: 'usr_vikram_reddy',
        type: 'EARNING_CREDIT',
        amount: 320,
        status: 'RELEASED',
        description: 'Completed intercity delivery payout',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    reviews: [],
    messages: [],
    notifications: [
      {
        id: 'notif_01',
        user_id: 'usr_aarav_sharma',
        title: 'Delivery in Progress',
        message: 'Traveler Vikram Reddy has picked up your parcel RD849201 and is en route.',
        type: 'TRIP_UPDATE',
        read: false,
        delivery_id: 'RD849201',
        created_at: new Date().toISOString()
      }
    ],
    disputes: [],
    businessAccounts: [],
    bulkShipments: [],
    kycVerifications: [],
    vehicles: [],
    currentUser: DEMO_USERS[0]
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
    localStorage.removeItem('rideel_app_db_v3');
    localStorage.removeItem('rideel_app_db_v2');
    localStorage.removeItem('rideel_app_db');
  }
}
