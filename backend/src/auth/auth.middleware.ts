import { Request, Response, NextFunction } from 'express';
import { sessionService } from './session.service';
import { JWTPayload } from './auth.types';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * Express middleware protecting endpoints requiring active JWT authentication
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required. Please provide Authorization: Bearer <token>.',
    });
  }

  const decoded = sessionService.verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token. Please refresh your session.',
    });
  }

  req.user = decoded;
  next();
}

/**
 * Lightweight sliding window IP rate limiter
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 15;
const WINDOW_MS = 60 * 1000; // 1 minute

export function authRateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
  const now = Date.now();

  const record = rateLimitMap.get(clientIp);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please wait 1 minute before retrying.',
    });
  }

  record.count += 1;
  next();
}
