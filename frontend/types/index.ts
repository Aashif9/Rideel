export type UserRole = 'sender' | 'traveler' | 'business' | 'admin';

export type UserMode = 'sender' | 'traveler' | 'business';

export type KYCStatus = 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export type VehicleStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type TripStatus = 'POSTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type ParcelType = 'document' | 'small' | 'medium' | 'large';

export type DeliveryStatus = 
  | 'BOOKED'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'PICKUP_PENDING'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERY_PENDING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'DISPUTED';

export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type OTPType = 'PICKUP' | 'DELIVERY';

export type PaymentStatus = 
  | 'PENDING'
  | 'ESCROW_HELD'
  | 'RELEASED'
  | 'REFUNDED'
  | 'DISPUTED'
  | 'FAILED';

export type TransactionType = 
  | 'ESCROW_HOLD'
  | 'EARNING_CREDIT'
  | 'WITHDRAWAL'
  | 'REFUND'
  | 'SERVICE_FEE';

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

export interface User {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  profile_photo: string;
  city: string;
  rating: number;
  completed_deliveries: number;
  role: UserRole[];
  active_mode: UserMode;
  account_status: 'active' | 'suspended' | 'pending';
  is_kyc_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface KYCVerification {
  id: string;
  user_id: string;
  document_type: 'aadhaar' | 'pan' | 'passport' | 'voter_id';
  document_number: string;
  document_url: string;
  selfie_url: string;
  status: KYCStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  vehicle_type: 'car' | 'bike' | 'suv' | 'truck' | 'train_traveler' | 'flight';
  registration_number: string;
  license_document: string;
  registration_document: string;
  verification_status: VehicleStatus;
}

export interface Trip {
  id: string;
  traveler_id: string;
  origin: string;
  destination: string;
  origin_coordinates: [number, number]; // [lat, lng]
  destination_coordinates: [number, number];
  travel_date: string; // YYYY-MM-DD
  departure_time: string; // HH:mm
  estimated_arrival: string; // HH:mm
  vehicle_id: string;
  capacity_kg: number;
  available_capacity_kg: number;
  max_weight_kg: number;
  pickup_preference: 'meet_traveler' | 'partner_point';
  delivery_preference: 'meet_traveler' | 'partner_point';
  price_per_kg: number;
  status: TripStatus;
  created_at: string;
  traveler?: User;
  vehicle?: Vehicle;
}

export interface Parcel {
  id: string;
  sender_id: string;
  parcel_type: ParcelType;
  description: string;
  weight_kg: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  parcel_photo: string;
  declared_value: number;
  insurance_selected: boolean;
  insurance_amount: number;
  origin: string;
  destination: string;
  travel_date: string;
  pickup_preference: 'meet_traveler' | 'partner_point';
  delivery_preference: 'meet_traveler' | 'partner_point';
  status: 'DRAFT' | 'SEARCHING' | 'BOOKED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
  sender?: User;
}

export interface MatchRequest {
  id: string;
  parcel_id: string;
  trip_id: string;
  sender_id: string;
  traveler_id: string;
  match_score: number;
  status: MatchStatus;
  created_at: string;
  parcel?: Parcel;
  trip?: Trip;
  sender?: User;
  traveler?: User;
}

export interface Delivery {
  id: string; // e.g. RD784521
  parcel_id: string;
  traveler_id: string;
  trip_id: string;
  sender_id: string;
  pickup_location: string;
  delivery_location: string;
  pickup_time?: string;
  expected_delivery_time?: string;
  actual_delivery_time?: string;
  status: DeliveryStatus;
  delivery_fee: number;
  service_fee: number;
  insurance_fee: number;
  total_amount: number;
  traveler_payout: number;
  pickup_otp: string;
  delivery_otp: string;
  pickup_photo?: string;
  delivery_photo?: string;
  current_location?: [number, number];
  created_at: string;
  parcel?: Parcel;
  trip?: Trip;
  traveler?: User;
  sender?: User;
}

export interface OTPVerification {
  id: string;
  delivery_id: string;
  type: OTPType;
  otp_code: string;
  expires_at: string;
  verified_at?: string;
  attempts: number;
}

export interface Payment {
  id: string;
  delivery_id: string;
  sender_id: string;
  traveler_id: string;
  amount: number;
  platform_fee: number;
  insurance_fee: number;
  traveler_payout: number;
  status: PaymentStatus;
  provider: 'DEMO_SIMULATION' | 'RAZORPAY';
  transaction_reference: string;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  delivery_id?: string;
  type: TransactionType;
  amount: number;
  status: 'PENDING' | 'ESCROW' | 'RELEASED' | 'REFUNDED' | 'WITHDRAWN';
  description: string;
  created_at: string;
}

export interface Review {
  id: string;
  delivery_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number; // 1-5
  review: string;
  tags: string[];
  created_at: string;
  reviewer?: User;
}

export interface Message {
  id: string;
  delivery_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  attachment_url?: string;
  location_share?: { lat: number; lng: number; title: string };
  created_at: string;
  sender?: User;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'MATCH_REQUEST' | 'TRIP_UPDATE' | 'OTP_ALERT' | 'PAYMENT' | 'KYC' | 'SYSTEM';
  read: boolean;
  delivery_id?: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  delivery_id: string;
  reported_by: string;
  issue_type: 'Lost Parcel' | 'Damaged Parcel' | 'Wrong Receiver' | 'Traveler Problem' | 'Sender Problem' | 'Payment Issue' | 'Other';
  description: string;
  evidence_url?: string;
  status: DisputeStatus;
  resolution?: string;
  created_at: string;
  reporter?: User;
  delivery?: Delivery;
}

export interface BusinessAccount {
  id: string;
  user_id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  tax_id: string;
  status: 'active' | 'pending';
  billing_information: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  created_at: string;
}

export interface BulkShipment {
  id: string;
  business_id: string;
  shipment_count: number;
  origin: string;
  destination: string;
  pickup_date: string;
  total_weight_kg: number;
  total_cost: number;
  status: 'DRAFT' | 'PROCESSING' | 'PARTIALLY_MATCHED' | 'DISPATCHED' | 'DELIVERED';
  created_at: string;
}
