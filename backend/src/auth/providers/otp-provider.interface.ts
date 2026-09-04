export interface OTPProviderSendParams {
  phone: string;
  otp: string;
}

export interface OTPProvider {
  name: string;
  sendOTP(params: OTPProviderSendParams): Promise<{ success: boolean; message: string }>;
  verifyOTP?(phone: string, otp: string): Promise<{ success: boolean; message: string }>;
  resendOTP?(params: OTPProviderSendParams): Promise<{ success: boolean; message: string }>;
}
