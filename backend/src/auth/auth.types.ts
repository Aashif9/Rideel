export interface SendOtpDTO {
  phone: string;
}

export interface VerifyOtpDTO {
  phone: string;
  otp: string;
}

export interface ResendOtpDTO {
  phone: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SafeUser {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  profile_photo?: string | null;
  city?: string | null;
  rating: number;
  completed_deliveries: number;
  role: string[];
  active_mode: string;
  account_status: string;
  is_kyc_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  device_info?: string | null;
  ip_address?: string | null;
  expires_at: Date;
  created_at: Date;
  revoked_at?: Date | null;
}

export interface JWTPayload {
  userId: string;
  phone: string;
  role: string[];
  iat: number;
  exp: number;
}

export interface MSG91OtpResponse {
  type: string;
  message: string;
}
