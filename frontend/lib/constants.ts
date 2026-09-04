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

export const MOCK_USERS: any[] = [];
export const DEMO_PRESETS: any[] = [];
