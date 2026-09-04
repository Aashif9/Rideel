import { OTPProvider, OTPProviderSendParams } from './otp-provider.interface';
import { env } from '../../config/env';

export class DevelopmentOTPProvider implements OTPProvider {
  name = 'development';

  async sendOTP(params: OTPProviderSendParams): Promise<{ success: boolean; message: string }> {
    // Only log OTP in backend console if NOT in production AND OTP_PROVIDER is development
    if (env.NODE_ENV !== 'production' && env.OTP_PROVIDER === 'development') {
      console.log('==================================================');
      console.log('[DEV OTP]');
      console.log(`Phone: ${params.phone}`);
      console.log(`OTP: ${params.otp}`);
      console.log('Expires: 5 minutes');
      console.log('==================================================');
    }
    return {
      success: true,
      message: 'OTP sent successfully (Development Mode)'
    };
  }

  async resendOTP(params: OTPProviderSendParams): Promise<{ success: boolean; message: string }> {
    return this.sendOTP(params);
  }
}
