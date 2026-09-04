import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required in backend/.env'),
  JWT_SECRET: z.string().optional().default('rideel_default_access_secret_key_2026_change_in_prod'),
  OTP_PROVIDER: z.enum(['development', 'msg91']).default('development'),
  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_TEMPLATE_ID: z.string().optional(),
  MSG91_OTP_EXPIRY: z.string().optional().default('300'),
});

export const env = envSchema.parse(process.env);
