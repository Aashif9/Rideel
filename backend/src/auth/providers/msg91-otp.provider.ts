import { OTPProvider, OTPProviderSendParams } from './otp-provider.interface';
import { env } from '../../config/env';

export class MSG91OTPProvider implements OTPProvider {
  name = 'msg91';

  async sendOTP(params: OTPProviderSendParams): Promise<{ success: boolean; message: string }> {
    const authKey = env.MSG91_AUTH_KEY;
    const templateId = env.MSG91_TEMPLATE_ID;
    const expiry = env.MSG91_OTP_EXPIRY || '300';

    if (!authKey || !templateId) {
      console.error('[MSG91 Error] Missing MSG91_AUTH_KEY or MSG91_TEMPLATE_ID in environment.');
      throw new Error('OTP provider configuration error');
    }

    // Format phone without leading + for MSG91 REST API
    const formattedPhone = params.phone.replace(/^\+/, '');

    const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(formattedPhone)}&authkey=${encodeURIComponent(authKey)}&otp=${encodeURIComponent(params.otp)}&otp_expiry=${encodeURIComponent(expiry)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data && data.type === 'error')) {
      console.error('[MSG91 API Error]', data?.message || response.statusText);
      throw new Error('Unable to send OTP. Please try again.');
    }

    return {
      success: true,
      message: 'OTP sent successfully'
    };
  }

  async resendOTP(params: OTPProviderSendParams): Promise<{ success: boolean; message: string }> {
    const authKey = env.MSG91_AUTH_KEY;
    const formattedPhone = params.phone.replace(/^\+/, '');

    if (!authKey) {
      throw new Error('OTP provider configuration error');
    }

    const url = `https://control.msg91.com/api/v5/otp/retry?authkey=${encodeURIComponent(authKey)}&mobile=${encodeURIComponent(formattedPhone)}&retrytype=text`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data && data.type === 'error')) {
      // Fall back to sendOTP with generated OTP if retry fails
      return this.sendOTP(params);
    }

    return {
      success: true,
      message: 'OTP resent successfully'
    };
  }
}
