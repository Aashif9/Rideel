import crypto from 'crypto';
import { pool, query } from '../config/database';
import { otpService } from './otp.service';
import { sessionService } from './session.service';
import { SafeUser, AuthTokens } from './auth.types';

export class AuthService {
  /**
   * Sanitizes database user record for API responses
   */
  public sanitizeUser(row: any): SafeUser {
    const roles = Array.isArray(row.role)
      ? row.role
      : [typeof row.role === 'string' ? row.role : 'sender'];

    return {
      id: row.id,
      full_name: row.full_name || row.name || `User ${row.phone ? row.phone.slice(-4) : ''}`,
      phone: row.phone,
      email: row.email || null,
      profile_photo: row.profile_photo || null,
      city: row.city || null,
      rating: parseFloat(row.rating || '5.0'),
      completed_deliveries: parseInt(row.completed_deliveries || '0', 10),
      role: roles,
      active_mode: row.active_mode || 'sender',
      account_status: row.is_active === false ? 'suspended' : (row.account_status || 'active'),
      is_kyc_verified: Boolean(row.is_kyc_verified),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /**
   * Dispatches OTP to normalized E.164 phone number via configured provider
   */
  public async requestOTP(phone: string, ip?: string): Promise<{ success: boolean; message: string }> {
    return await otpService.sendOTP(phone, ip);
  }

  /**
   * Resends OTP to normalized E.164 phone number enforcing cooldown and provider abstraction
   */
  public async resendOTP(phone: string, ip?: string): Promise<{ success: boolean; message: string }> {
    return await otpService.resendOTP(phone, ip);
  }

  /**
   * Atomically verifies OTP, finds/creates user, creates session, and marks OTP verified in a PostgreSQL transaction
   */
  public async verifyOTPAndLogin(
    phone: string,
    otp: string,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<{
    success: boolean;
    message: string;
    isNewUser?: boolean;
    user?: SafeUser;
    tokens?: AuthTokens;
  }> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Validate OTP inside transaction without marking verified yet
      const otpRes = await client.query(
        `SELECT id, otp_hash, expires_at, attempts FROM phone_otps 
         WHERE phone = $1 AND verified_at IS NULL 
         ORDER BY created_at DESC LIMIT 1;`,
        [phone]
      );

      if (otpRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, message: 'Invalid OTP' };
      }

      const otpRecord = otpRes.rows[0];

      if (otpRecord.attempts >= 5) {
        await client.query('ROLLBACK');
        return { success: false, message: 'Too many verification attempts' };
      }

      const expiresAt = new Date(otpRecord.expires_at).getTime();
      if (Date.now() > expiresAt) {
        await client.query('ROLLBACK');
        return { success: false, message: 'OTP has expired' };
      }

      const inputHash = crypto.createHash('sha256').update(otp).digest('hex');
      if (inputHash !== otpRecord.otp_hash) {
        await client.query(`UPDATE phone_otps SET attempts = attempts + 1 WHERE id = $1;`, [otpRecord.id]);
        await client.query('COMMIT');
        if (otpRecord.attempts + 1 >= 5) {
          return { success: false, message: 'Too many verification attempts' };
        }
        return { success: false, message: 'Invalid OTP' };
      }

      // 2. Lookup existing user or register new user
      const findRes = await client.query(`SELECT * FROM users WHERE phone = $1;`, [phone]);
      let userRow: any;
      let isNewUser = false;

      if (findRes.rows.length > 0) {
        userRow = findRes.rows[0];
      } else {
        isNewUser = true;
        const defaultName = `User ${phone.slice(-4)}`;
        const defaultEmail = `user_${phone.replace('+', '')}@rideel.in`;
        const defaultPasswordHash = `NOPASSWORD_OTP_USER_${crypto.randomBytes(16).toString('hex')}`;

        const insertRes = await client.query(
          `INSERT INTO users 
           (id, name, full_name, phone, email, password_hash, role, is_active, rating, completed_deliveries, active_mode, is_kyc_verified)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'passenger', true, 5.0, 0, 'sender', false)
           RETURNING *;`,
          [defaultName, defaultName, phone, defaultEmail, defaultPasswordHash]
        );
        userRow = insertRes.rows[0];
      }

      const safeUser = this.sanitizeUser(userRow);

      // 3. Create auth session inside transaction
      const rawRefreshToken = sessionService.generateRefreshToken();
      const refreshTokenHash = sessionService.hashToken(rawRefreshToken);
      const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await client.query(
        `INSERT INTO auth_sessions 
         (user_id, refresh_token_hash, device_info, ip_address, expires_at)
         VALUES ($1, $2, $3, $4, $5);`,
        [safeUser.id, refreshTokenHash, deviceInfo || 'web', ipAddress || '127.0.0.1', sessionExpiresAt]
      );

      // 4. Mark OTP as verified inside transaction
      await client.query(`UPDATE phone_otps SET verified_at = NOW() WHERE id = $1;`, [otpRecord.id]);

      // 5. Commit atomic transaction
      await client.query('COMMIT');

      // 6. Generate access token
      const accessToken = sessionService.generateAccessToken({
        userId: safeUser.id,
        phone: safeUser.phone,
        role: safeUser.role,
      });

      return {
        success: true,
        message: isNewUser ? 'Account registered and logged in successfully.' : 'Logged in successfully.',
        isNewUser,
        user: safeUser,
        tokens: {
          accessToken,
          refreshToken: rawRefreshToken,
          expiresIn: 900,
        },
      };
    } catch (err: any) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[Auth Error] Transactional verifyOTPAndLogin exception:', {
        message: err.message,
        code: err.code,
        detail: err.detail,
        constraint: err.constraint,
      });
      return { success: false, message: 'Internal authentication error. Please try again.' };
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves safe user profile for authenticated session
   */
  public async getProfile(userId: string): Promise<SafeUser | null> {
    const res = await query(`SELECT * FROM users WHERE id = $1;`, [userId]);
    if (res.rows.length === 0) return null;
    return this.sanitizeUser(res.rows[0]);
  }
}

export const authService = new AuthService();
