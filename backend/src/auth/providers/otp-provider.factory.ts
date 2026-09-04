import { OTPProvider } from './otp-provider.interface';
import { DevelopmentOTPProvider } from './development-otp.provider';
import { MSG91OTPProvider } from './msg91-otp.provider';
import { env } from '../../config/env';

export class OTPProviderFactory {
  static getProvider(): OTPProvider {
    const providerType = process.env.OTP_PROVIDER || env.OTP_PROVIDER;

    if (providerType === 'msg91') {
      return new MSG91OTPProvider();
    }

    return new DevelopmentOTPProvider();
  }
}
