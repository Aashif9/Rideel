import {
  User, Trip, Parcel, MatchRequest, Delivery, Payment,
  WalletTransaction, Review, Message, AppNotification, Dispute,
  BusinessAccount, BulkShipment, KYCVerification, Vehicle
} from '@/types';
import { MOCK_USERS, CITY_COORDINATES } from '@/lib/constants';

const STORAGE_KEY = 'rideel_app_db_v1';

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

const INITIAL_TRIPS: Trip[] = [
  {
    id: "trip_101",
    traveler_id: "usr_traveler_1",
    origin: "Vijayawada",
    destination: "Hyderabad",
    origin_coordinates: CITY_COORDINATES["Vijayawada"],
    destination_coordinates: CITY_COORDINATES["Hyderabad"],
    travel_date: "2026-09-02",
    departure_time: "07:30",
    estimated_arrival: "12:00",
    vehicle_id: "veh_1",
    capacity_kg: 15,
    available_capacity_kg: 11.5,
    max_weight_kg: 8,
    pickup_preference: "meet_traveler",
    delivery_preference: "meet_traveler",
    price_per_kg: 30,
    status: "POSTED",
    created_at: new Date().toISOString()
  },
  {
    id: "trip_102",
    traveler_id: "usr_traveler_2",
    origin: "Hyderabad",
    destination: "Bengaluru",
    origin_coordinates: CITY_COORDINATES["Hyderabad"],
    destination_coordinates: CITY_COORDINATES["Bengaluru"],
    travel_date: "2026-09-02",
    departure_time: "09:00",
    estimated_arrival: "17:00",
    vehicle_id: "veh_2",
    capacity_kg: 20,
    available_capacity_kg: 20,
    max_weight_kg: 10,
    pickup_preference: "partner_point",
    delivery_preference: "meet_traveler",
    price_per_kg: 35,
    status: "POSTED",
    created_at: new Date().toISOString()
  },
  {
    id: "trip_103",
    traveler_id: "usr_traveler_1",
    origin: "Delhi",
    destination: "Jaipur",
    origin_coordinates: CITY_COORDINATES["Delhi"],
    destination_coordinates: CITY_COORDINATES["Jaipur"],
    travel_date: "2026-09-03",
    departure_time: "06:00",
    estimated_arrival: "10:30",
    vehicle_id: "veh_1",
    capacity_kg: 12,
    available_capacity_kg: 12,
    max_weight_kg: 6,
    pickup_preference: "meet_traveler",
    delivery_preference: "partner_point",
    price_per_kg: 25,
    status: "POSTED",
    created_at: new Date().toISOString()
  }
];

const INITIAL_PARCELS: Parcel[] = [
  {
    id: "pcl_201",
    sender_id: "usr_sender_1",
    parcel_type: "small",
    description: "Urgent Tax Documents & Laptops Spare Chargers",
    weight_kg: 3.5,
    length_cm: 30,
    width_cm: 20,
    height_cm: 10,
    parcel_photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400",
    declared_value: 4500,
    insurance_selected: true,
    insurance_amount: 10,
    origin: "Vijayawada",
    destination: "Hyderabad",
    travel_date: "2026-09-02",
    pickup_preference: "meet_traveler",
    delivery_preference: "meet_traveler",
    status: "IN_TRANSIT",
    created_at: new Date().toISOString()
  }
];

const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: "RD784521",
    parcel_id: "pcl_201",
    traveler_id: "usr_traveler_1",
    trip_id: "trip_101",
    sender_id: "usr_sender_1",
    pickup_location: "Benz Circle, Vijayawada",
    delivery_location: "Hitech City, Hyderabad",
    pickup_time: "07:45",
    expected_delivery_time: "12:15",
    status: "IN_TRANSIT",
    delivery_fee: 120,
    service_fee: 15,
    insurance_fee: 10,
    total_amount: 145,
    traveler_payout: 120,
    pickup_otp: "482910",
    delivery_otp: "918342",
    pickup_photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400",
    current_location: [16.85, 79.50],
    created_at: new Date().toISOString()
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "pay_1001",
    delivery_id: "RD784521",
    sender_id: "usr_sender_1",
    traveler_id: "usr_traveler_1",
    amount: 145,
    platform_fee: 15,
    insurance_fee: 10,
    traveler_payout: 120,
    status: "ESCROW_HELD",
    provider: "DEMO_SIMULATION",
    transaction_reference: "RD-TXN-98421049",
    created_at: new Date().toISOString()
  }
];

const INITIAL_WALLET: WalletTransaction[] = [
  {
    id: "wtx_1",
    user_id: "usr_traveler_1",
    delivery_id: "RD784521",
    type: "ESCROW_HOLD",
    amount: 120,
    status: "ESCROW",
    description: "Escrow Reserved for Delivery RD784521",
    created_at: new Date().toISOString()
  },
  {
    id: "wtx_2",
    user_id: "usr_traveler_1",
    delivery_id: "RD781100",
    type: "EARNING_CREDIT",
    amount: 180,
    status: "RELEASED",
    description: "Payout Completed for Delivery RD781100",
    created_at: "2026-08-30T14:20:00Z"
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_1",
    user_id: "usr_sender_1",
    title: "Parcel Picked Up!",
    message: "Traveler Vikram Singh has verified the OTP and picked up parcel RD784521.",
    type: "OTP_ALERT",
    read: false,
    delivery_id: "RD784521",
    created_at: new Date().toISOString()
  },
  {
    id: "notif_2",
    user_id: "usr_traveler_1",
    title: "Escrow Secured",
    message: "₹145 locked in Escrow for trip Vijayawada -> Hyderabad.",
    type: "PAYMENT",
    read: true,
    delivery_id: "RD784521",
    created_at: new Date().toISOString()
  }
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "veh_1",
    user_id: "usr_traveler_1",
    vehicle_type: "car",
    registration_number: "AP 16 EV 4820",
    license_document: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400",
    registration_document: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400",
    verification_status: "VERIFIED"
  },
  {
    id: "veh_2",
    user_id: "usr_traveler_2",
    vehicle_type: "suv",
    registration_number: "TS 09 AB 9012",
    license_document: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400",
    registration_document: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400",
    verification_status: "VERIFIED"
  }
];

const INITIAL_KYC: KYCVerification[] = [
  {
    id: "kyc_1",
    user_id: "usr_traveler_1",
    document_type: "aadhaar",
    document_number: "XXXX-XXXX-4819",
    document_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400",
    selfie_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    status: "VERIFIED",
    reviewed_by: "usr_admin_1",
    reviewed_at: "2024-01-11T12:00:00Z",
    created_at: "2024-01-10T10:00:00Z"
  }
];

const INITIAL_BUSINESS: BusinessAccount[] = [
  {
    id: "biz_1",
    user_id: "usr_business_1",
    company_name: "Apex Logistics India Pvt Ltd",
    company_email: "corporate@apexlogistics.in",
    company_phone: "+91 99887 76655",
    tax_id: "36AAAAA0000A1Z5",
    status: "active",
    billing_information: {
      address: "102 Industrial Corridor, Plot 45",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400013"
    },
    created_at: "2023-11-20T10:00:00Z"
  }
];

const INITIAL_BULK: BulkShipment[] = [
  {
    id: "blk_101",
    business_id: "biz_1",
    shipment_count: 8,
    origin: "Mumbai",
    destination: "Pune",
    pickup_date: "2026-09-03",
    total_weight_kg: 24,
    total_cost: 1440,
    status: "PROCESSING",
    created_at: new Date().toISOString()
  }
];

export function getInitialDatabase(): AppDatabase {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error('Failed to parse local DB storage:', e);
      }
    }
  }

  const initialDb: AppDatabase = {
    users: MOCK_USERS as User[],
    trips: INITIAL_TRIPS,
    parcels: INITIAL_PARCELS,
    matchRequests: [],
    deliveries: INITIAL_DELIVERIES,
    payments: INITIAL_PAYMENTS,
    walletTransactions: INITIAL_WALLET,
    reviews: [],
    messages: [
      {
        id: "msg_1",
        delivery_id: "RD784521",
        sender_id: "usr_traveler_1",
        receiver_id: "usr_sender_1",
        message: "Hi Aarav! I have started the journey from Vijayawada Benz Circle. On track for 12:15 PM delivery in Hitech City.",
        created_at: new Date().toISOString()
      }
    ],
    notifications: INITIAL_NOTIFICATIONS,
    disputes: [],
    businessAccounts: INITIAL_BUSINESS,
    bulkShipments: INITIAL_BULK,
    kycVerifications: INITIAL_KYC,
    vehicles: INITIAL_VEHICLES,
    currentUser: MOCK_USERS[0] as User
  };

  return initialDb;
}

export function saveDatabase(db: AppDatabase) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}
