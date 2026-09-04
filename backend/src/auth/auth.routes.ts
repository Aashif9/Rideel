import { Router, Request, Response } from 'express';
import { sendOtpSchema, verifyOtpSchema, resendOtpSchema, refreshTokenSchema } from './auth.validation';
import { authService } from './auth.service';
import { sessionService } from './session.service';
import { authenticateToken, authRateLimiter, AuthenticatedRequest } from './auth.middleware';

const router = Router();

/**
 * POST /api/auth/send-otp
 * Dispatches an OTP code via MSG91 to normalized E.164 phone number
 */
router.post('/send-otp', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = sendOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || 'Invalid input parameters.';
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { phone } = parseResult.data;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
    const result = await authService.requestOTP(phone, clientIp);

    if (!result.success) {
      return res.status(429).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      phone,
    });
  } catch (err: any) {
    console.error('[Auth API Error] send-otp failure');
    return res.status(500).json({ success: false, message: 'Internal server authentication error.' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies MSG91 OTP, finds/creates PostgreSQL user, and returns JWT tokens
 */
router.post('/verify-otp', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = verifyOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || 'Invalid input parameters.';
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { phone, otp } = parseResult.data;
    const deviceInfo = req.headers['user-agent'] || 'web';
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';

    const result = await authService.verifyOTPAndLogin(phone, otp, deviceInfo, clientIp);

    if (!result.success) {
      return res.status(401).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      isNewUser: result.isNewUser,
      user: result.user,
      tokens: result.tokens,
    });
  } catch (err: any) {
    console.error('[Auth API Error] verify-otp failure:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      constraint: err.constraint,
    });
    return res.status(500).json({ success: false, message: 'Internal server authentication error.' });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resends MSG91 OTP respecting the 60-second cooldown
 */
router.post('/resend-otp', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = resendOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || 'Invalid input parameters.';
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { phone } = parseResult.data;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
    const result = await authService.resendOTP(phone, clientIp);

    if (!result.success) {
      return res.status(429).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      phone,
    });
  } catch (err: any) {
    console.error('[Auth API Error] resend-otp failure');
    return res.status(500).json({ success: false, message: 'Internal server authentication error.' });
  }
});

/**
 * POST /api/auth/refresh
 * Validates refresh token, rotates tokens in PostgreSQL, and returns new access token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const parseResult = refreshTokenSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Refresh token is required.' });
    }

    const { refreshToken } = parseResult.data;
    const deviceInfo = req.headers['user-agent'] || 'web';
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';

    const rotated = await sessionService.rotateSession(refreshToken, deviceInfo, clientIp);
    if (!rotated) {
      return res.status(401).json({ success: false, message: 'Invalid, expired, or revoked refresh session.' });
    }

    const userProfile = await authService.getProfile(rotated.userId);

    return res.status(200).json({
      success: true,
      tokens: rotated.tokens,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('[Auth API Error] refresh token failure');
    return res.status(500).json({ success: false, message: 'Internal server authentication error.' });
  }
});

/**
 * POST /api/auth/logout
 * Revokes current refresh session in PostgreSQL
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await sessionService.revokeSession(refreshToken);
    }

    return res.status(200).json({
      success: true,
      message: 'Session revoked and logged out successfully.',
    });
  } catch (err: any) {
    console.error('[Auth API Error] logout failure');
    return res.status(500).json({ success: false, message: 'Internal server logout error.' });
  }
});

/**
 * GET /api/auth/me
 * Returns authenticated safe user profile
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const profile = await authService.getProfile(req.user.userId);
    if (!profile) {
      return res.status(444).json({ success: false, message: 'User profile not found.' });
    }

    return res.status(200).json({
      success: true,
      user: profile,
    });
  } catch (err: any) {
    console.error('[Auth API Error] /me failure');
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;
