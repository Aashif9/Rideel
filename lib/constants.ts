export const PROHIBITED_ITEMS = [
  "Hazardous materials or explosive substances",
  "Illegal drugs, narcotics, or controlled substances",
  "Weapons, ammunition, or dangerous tactical gear",
  "Flammable liquids, compressed gas, or fireworks",
  "Perishable food items requiring active refrigeration",
  "Stolen goods or uncertified currency/cash",
  "Animals, live insects, or biological specimens"
];

export const POPULAR_ROUTES = [
  { origin: "Vijayawada", destination: "Hyderabad", distance: "275 km", avgTime: "4h 30m", avgPrice: 120 },
  { origin: "Hyderabad", destination: "Bengaluru", distance: "570 km", avgTime: "8h 00m", avgPrice: 220 },
  { origin: "Delhi", destination: "Jaipur", distance: "280 km", avgTime: "4h 15m", avgPrice: 130 },
  { origin: "Mumbai", destination: "Pune", distance: "150 km", avgTime: "2h 45m", avgPrice: 90 },
  { origin: "Chennai", destination: "Bengaluru", distance: "345 km", avgTime: "5h 30m", avgPrice: 150 },
  { origin: "Vijayawada", destination: "Visakhapatnam", distance: "350 km", avgTime: "5h 45m", avgPrice: 140 }
];

export const CITIES = [
  "Vijayawada",
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Mumbai",
  "Pune",
  "Delhi",
  "Jaipur",
  "Visakhapatnam",
  "Kolkata"
];

export const CITY_COORDINATES: Record<string, [number, number]> = {
  "Vijayawada": [16.5062, 80.6480],
  "Hyderabad": [17.3850, 78.4867],
  "Bengaluru": [12.9716, 77.5946],
  "Chennai": [13.0827, 80.2707],
  "Mumbai": [19.0760, 72.8777],
  "Pune": [18.5204, 73.8567],
  "Delhi": [28.6139, 77.2090],
  "Jaipur": [26.9124, 75.7873],
  "Visakhapatnam": [17.6868, 83.2185],
  "Kolkata": [22.5726, 88.3639]
};

export const FEE_CONFIG = {
  SERVICE_FEE_FLAT: 15,
  INSURANCE_BASIC_FEE: 10,
  INSURANCE_RATE_PERCENT: 0.01, // 1% of declared value above ₹1,000
  PLATFORM_COMMISSION_PERCENT: 0.12 // 12% commission
};

export const MOCK_USERS = [
  {
    id: "usr_sender_1",
    full_name: "Aarav Mehta",
    phone: "+91 98765 43210",
    email: "aarav.m@example.com",
    profile_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    city: "Vijayawada",
    rating: 4.9,
    completed_deliveries: 18,
    role: ["sender", "traveler"],
    active_mode: "sender",
    account_status: "active",
    is_kyc_verified: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "usr_traveler_1",
    full_name: "Vikram Singh",
    phone: "+91 98123 45678",
    email: "vikram.singh@example.com",
    profile_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    city: "Hyderabad",
    rating: 4.95,
    completed_deliveries: 42,
    role: ["traveler", "sender"],
    active_mode: "traveler",
    account_status: "active",
    is_kyc_verified: true,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "usr_traveler_2",
    full_name: "Priya Reddy",
    phone: "+91 97654 32109",
    email: "priya.reddy@example.com",
    profile_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    city: "Bengaluru",
    rating: 4.88,
    completed_deliveries: 29,
    role: ["traveler"],
    active_mode: "traveler",
    account_status: "active",
    is_kyc_verified: true,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    id: "usr_business_1",
    full_name: "Ananya Sharma (Apex Logistics)",
    phone: "+91 99887 76655",
    email: "shipping@apexlogistics.in",
    profile_photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    city: "Mumbai",
    rating: 5.0,
    completed_deliveries: 150,
    role: ["business"],
    active_mode: "business",
    account_status: "active",
    is_kyc_verified: true,
    created_at: "2023-11-20T10:00:00Z",
    updated_at: "2023-11-20T10:00:00Z"
  },
  {
    id: "usr_admin_1",
    full_name: "Rideel System Admin",
    phone: "+91 90000 00000",
    email: "admin@rideel.in",
    profile_photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
    city: "Hyderabad",
    rating: 5.0,
    completed_deliveries: 0,
    role: ["admin"],
    active_mode: "sender",
    account_status: "active",
    is_kyc_verified: true,
    created_at: "2023-10-01T10:00:00Z",
    updated_at: "2023-10-01T10:00:00Z"
  }
];

export const DEMO_PRESETS = [
  { id: "usr_sender_1", label: "Demo Sender (Aarav Mehta)", role: "sender" },
  { id: "usr_traveler_1", label: "Demo Traveler (Vikram Singh)", role: "traveler" },
  { id: "usr_business_1", label: "Demo Business (Apex Logistics)", role: "business" },
  { id: "usr_admin_1", label: "Demo Admin (Platform Control)", role: "admin" }
];
