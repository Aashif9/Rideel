import crypto from 'crypto';
import { query } from '../config/database';
import { AuthSession, JWTPayload, AuthTokens } from './auth.types';

export class SessionService {
  private JWT_SECRET = process.env.JWT_SECRET || 'rideel_default_access_secret_key_2026_change_in_prod';
  private ACCESS_TOKEN_EXPIRY_MINUTES = 15;
  private REFRESH_TOKEN_EXPIRY_DAYS = 30;

  /**
   * Hashes a raw refresh token using SHA-256 before storing in PostgreSQL
   */
  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a signed JWT Access Token (valid for 15 minutes)
   */
  public generateAccessToken(payload: { userId: string; phone: string; role: string[] }): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.ACCESS_TOKEN_EXPIRY_MINUTES * 60;

    const fullPayload: JWTPayload = {
      ...payload,
      iat,
      exp,
    };

    const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

    const signatureInput = `${base64Header}.${base64Payload}`;
    const signature = crypto
      .createHmac('sha256', this.JWT_SECRET)
      .update(signatureInput)
      .digest('base64url');

    return `${signatureInput}.${signature}`;
  }

  /**
   * Verifies and decodes a signed JWT Access Token
   */
  public verifyAccessToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [headerB64, payloadB64, signatureB64] = parts;
      const signatureInput = `${headerB64}.${payloadB64}`;

      const expectedSignature = crypto
        .createHmac('sha256', this.JWT_SECRET)
        .update(signatureInput)
        .digest('base64url');

      if (!crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSignature))) {
        return null;
      }

      const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
      const payload: JWTPayload = JSON.parse(payloadJson);

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null; // Expired
      }

      return payload;
    } catch (err) {
      return null;
    }
  }

  /**
   * Generates a cryptographically random Refresh Token string
   */
  public generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Creates a new session entry in PostgreSQL database with hashed refresh token
   */
  public async createSession(
    userId: string,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<{ session: AuthSession; rawRefreshToken: string }> {
    const rawRefreshToken = this.generateRefreshToken();
    const tokenHash = this.hashToken(rawRefreshToken);
    const sessionId = `sess_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

    const sql = `
      INSERT INTO auth_sessions 
      (id, user_id, refresh_token_hash, device_info, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const res = await query(sql, [
      sessionId,
      userId,
      tokenHash,
      deviceInfo || 'web',
      ipAddress || 'unknown',
      expiresAt.toISOString(),
    ]);

    return {
      session: res.rows[0],
      rawRefreshToken,
    };
  }

  /**
   * Validates refresh token, rotates tokens, and issues new token pair
   */
  public async rotateSession(
    rawRefreshToken: string,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<{ tokens: AuthTokens; userId: string } | null> {
    const tokenHash = this.hashToken(rawRefreshToken);

    const findSql = `
      SELECT * FROM auth_sessions 
      WHERE refresh_token_hash = $1 
        AND revoked_at IS NULL 
        AND expires_at > CURRENT_TIMESTAMP;
    `;

    const res = await query(findSql, [tokenHash]);
    if (res.rows.length === 0) {
      return null; // Invalid, revoked, or expired
    }

    const currentSession: AuthSession = res.rows[0];

    // Revoke old session (Rotation)
    const revokeSql = `
      UPDATE auth_sessions 
      SET revoked_at = CURRENT_TIMESTAMP 
      WHERE id = $1;
    `;
    await query(revokeSql, [currentSession.id]);

    // Lookup user roles
    const userRes = await query(`SELECT phone, role FROM users WHERE id = $1;`, [currentSession.user_id]);
    if (userRes.rows.length === 0) return null;

    const userObj = userRes.rows[0];
    const rolesArray = Array.isArray(userObj.role) ? userObj.role : ['sender', 'traveler'];

    // Generate new token pair & new session
    const newAccessToken = this.generateAccessToken({
      userId: currentSession.user_id,
      phone: userObj.phone,
      role: rolesArray,
    });

    const { rawRefreshToken: newRefreshToken } = await this.createSession(
      currentSession.user_id,
      deviceInfo || currentSession.device_info || undefined,
      ipAddress || currentSession.ip_address || undefined
    );

    return {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: this.ACCESS_TOKEN_EXPIRY_MINUTES * 60,
      },
      userId: currentSession.user_id,
    };
  }

  /**
   * Revokes a session (Logout)
   */
  public async revokeSession(rawRefreshToken: string): Promise<boolean> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const sql = `
      UPDATE auth_sessions 
      SET revoked_at = CURRENT_TIMESTAMP 
      WHERE refresh_token_hash = $1 AND revoked_at IS NULL;
    `;
    const res = await query(sql, [tokenHash]);
    return (res.rowCount || 0) > 0;
  }
}

export const sessionService = new SessionService();
