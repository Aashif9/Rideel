import crypto from 'crypto';
import { query } from '../config/database';
import { OTPProviderFactory } from './providers/otp-provider.factory';

export class OtpService {
  private COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown
  private MAX_ATTEMPTS = 5;
  private IP_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  private MAX_IP_REQUESTS = 10;
  private ipRequestsMap: Map<string, number[]> = new Map();

  /**
   * Generates a cryptographically secure 6-digit numeric OTP
   */
  private generateOTP(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }

  /**
   * Computes SHA-256 hash of an OTP string
   */
  private hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Enforces IP rate limiting (max 10 requests per minute)
   */
  public checkIpRateLimit(ip?: string): { allowed: boolean; message?: string } {
    if (!ip) return { allowed: true };
    const now = Date.now();
    const timestamps = (this.ipRequestsMap.get(ip) || []).filter(
      (ts) => now - ts < this.IP_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= this.MAX_IP_REQUESTS) {
      return {
        allowed: false,
        message: 'Please wait before requesting another OTP',
      };
    }

    timestamps.push(now);
    this.ipRequestsMap.set(ip, timestamps);
    return { allowed: true };
  }

  /**
   * Checks 60-second cooldown for a given normalized phone number
   */
  public async checkCooldown(phone: string): Promise<{ allowed: boolean; remainingSeconds: number }> {
    try {
      const res = await query(
        `SELECT created_at FROM phone_otps WHERE phone = $1 ORDER BY created_at DESC LIMIT 1;`,
        [phone]
      );

      if (res.rows.length > 0) {
        const lastCreatedAt = new Date(res.rows[0].created_at).getTime();
        const elapsed = Date.now() - lastCreatedAt;

        if (elapsed < this.COOLDOWN_MS) {
          const remainingSeconds = Math.ceil((this.COOLDOWN_MS - elapsed) / 1000);
          return { allowed: false, remainingSeconds };
        }
      }
    } catch (err) {
      console.error('[OTP Cooldown Check Error]', err);
    }

    return { allowed: true, remainingSeconds: 0 };
  }

  /**
   * Generates, persists, and sends an OTP via the configured provider
   */
  public async sendOTP(phone: string, ip?: string): Promise<{ success: boolean; message: string }> {
    // 1. IP rate limit check
    const ipCheck = this.checkIpRateLimit(ip);
    if (!ipCheck.allowed) {
      return { success: false, message: ipCheck.message || 'Please wait before requesting another OTP' };
    }

    // 2. 60s cooldown check
    const cooldown = await this.checkCooldown(phone);
    if (!cooldown.allowed) {
      return {
        success: false,
        message: `Please wait before requesting another OTP`,
      };
    }

    // 3. Invalidate previous unverified OTPs for this phone
    try {
      await query(
        `UPDATE phone_otps SET expires_at = NOW() WHERE phone = $1 AND verified_at IS NULL AND expires_at > NOW();`,
        [phone]
      );
    } catch (err) {
      console.error('[OTP Invalidate Previous Error]', err);
    }

    // 4. Generate secure OTP & SHA-256 hash
    const otp = this.generateOTP();
    const otpHash = this.hashOTP(otp);

    // 5. Persist to PostgreSQL phone_otps table with 5-minute expiration
    try {
      await query(
        `INSERT INTO phone_otps (phone, otp_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '5 minutes');`,
        [phone, otpHash]
      );
    } catch (err) {
      console.error('[OTP Database Insert Error]', err);
      return { success: false, message: 'Unable to send OTP. Please try again.' };
    }

    // 6. Send OTP via abstract provider (Development or MSG91)
    const provider = OTPProviderFactory.getProvider();
    try {
      await provider.sendOTP({ phone, otp });
    } catch (err: any) {
      console.error('[OTP Provider Send Error]', err.message || err);
      return { success: false, message: 'Unable to send OTP. Please try again.' };
    }

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  /**
   * Resends an OTP enforcing cooldown and provider delegation
   */
  public async resendOTP(phone: string, ip?: string): Promise<{ success: boolean; message: string }> {
    // Resend delegates to sendOTP which enforces 60s cooldown & generates a fresh secure OTP
    return this.sendOTP(phone, ip);
  }

  /**
   * Verifies an OTP code against stored SHA-256 hash in PostgreSQL
   */
  public async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Fetch latest active unverified OTP for this phone
      const res = await query(
        `SELECT id, otp_hash, expires_at, attempts FROM phone_otps 
         WHERE phone = $1 AND verified_at IS NULL 
         ORDER BY created_at DESC LIMIT 1;`,
        [phone]
      );

      if (res.rows.length === 0) {
        return { success: false, message: 'Invalid OTP' };
      }

      const otpRecord = res.rows[0];

      // 2. Check maximum verification attempts (max 5)
      if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
        return { success: false, message: 'Too many verification attempts' };
      }

      // 3. Check expiration (5 minutes)
      const expiresAt = new Date(otpRecord.expires_at).getTime();
      if (Date.now() > expiresAt) {
        return { success: false, message: 'OTP has expired' };
      }

      // 4. Increment attempts counter in database
      await query(`UPDATE phone_otps SET attempts = attempts + 1 WHERE id = $1;`, [otpRecord.id]);

      // 5. Compare SHA-256 hash
      const inputHash = this.hashOTP(otp);
      if (inputHash !== otpRecord.otp_hash) {
        if (otpRecord.attempts + 1 >= this.MAX_ATTEMPTS) {
          return { success: false, message: 'Too many verification attempts' };
        }
        return { success: false, message: 'Invalid OTP' };
      }

      // 6. Invalidate OTP after successful verification
      await query(`UPDATE phone_otps SET verified_at = NOW() WHERE id = $1;`, [otpRecord.id]);

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (err) {
      console.error('[OTP Verification Error]', err);
      return { success: false, message: 'Unable to verify OTP. Please try again.' };
    }
  }
}

export const otpService = new OtpService();
