import { z } from 'zod';

/**
 * Normalizes any Indian / international phone string to strict E.164 format (+919876543210)
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const digitsOnly = rawPhone.replace(/\D/g, '');
  
  // If 10 digits (e.g., 9876543210), prepend default India country code +91
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }
  
  // If 12 digits starting with 91 (e.g., 919876543210)
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }
  
  // Generic fallback: prepend '+' to digits
  return `+${digitsOnly}`;
}

/**
 * Validates whether normalized phone meets E.164 specifications
 */
export function isValidE164Phone(phone: string): boolean {
  const e164Regex = /^\+[1-9]\d{9,14}$/;
  return e164Regex.test(phone);
}

export const sendOtpSchema = z.object({
  phone: z.string().transform((val) => normalizePhoneNumber(val)).refine((val) => isValidE164Phone(val), {
    message: 'Invalid phone number format. Please provide a valid 10-digit mobile number.',
  }),
});

export const verifyOtpSchema = z.object({
  phone: z.string().transform((val) => normalizePhoneNumber(val)).refine((val) => isValidE164Phone(val), {
    message: 'Invalid phone number format.',
  }),
  otp: z.string().trim().length(6, 'OTP must be exactly 6 numeric digits.').regex(/^\d{6}$/, 'OTP must contain digits only.'),
});

export const resendOtpSchema = z.object({
  phone: z.string().transform((val) => normalizePhoneNumber(val)).refine((val) => isValidE164Phone(val), {
    message: 'Invalid phone number format.',
  }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required.'),
});
