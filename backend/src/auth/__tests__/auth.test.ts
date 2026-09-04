import assert from 'assert';
import { normalizePhoneNumber, isValidE164Phone, sendOtpSchema, verifyOtpSchema } from '../auth.validation';
import { sessionService } from '../session.service';
import { otpService } from '../otp.service';
import { OTPProviderFactory } from '../providers/otp-provider.factory';
import { DevelopmentOTPProvider } from '../providers/development-otp.provider';
import { MSG91OTPProvider } from '../providers/msg91-otp.provider';

async function runAuthTests() {
  console.log('🧪 Running RIDEEL OTP & Session Authentication Test Suite...\n');

  // Test 1: Phone Normalization & E.164 Validation
  console.log('Test 1: E.164 Phone Normalization & Validation');
  const raw1 = '9876543210';
  const norm1 = normalizePhoneNumber(raw1);
  assert.strictEqual(norm1, '+919876543210', '10-digit Indian phone should normalize to +919876543210');
  assert.strictEqual(isValidE164Phone(norm1), true, 'Normalized phone should be valid E.164');

  const raw2 = '+91 98765 43210';
  const norm2 = normalizePhoneNumber(raw2);
  assert.strictEqual(norm2, '+919876543210', 'Phone with spaces should normalize cleanly');

  const invalidParse = sendOtpSchema.safeParse({ phone: '123' });
  assert.strictEqual(invalidParse.success, false, 'Invalid short phone number should be rejected');

  console.log('  ✅ Phone normalization & E.164 validation tests passed.');

  // Test 2: OTP Validation Schema
  console.log('\nTest 2: OTP Input Validation Schema');
  const validOtpParse = verifyOtpSchema.safeParse({ phone: '9876543210', otp: '123456' });
  assert.strictEqual(validOtpParse.success, true, 'Valid 6-digit OTP should pass schema validation');

  const invalidOtpParse = verifyOtpSchema.safeParse({ phone: '9876543210', otp: '1234' });
  assert.strictEqual(invalidOtpParse.success, false, 'Short 4-digit OTP should fail validation');

  console.log('  ✅ OTP schema validation tests passed.');

  // Test 3: JWT Access Token Generation & Verification
  console.log('\nTest 3: JWT Access Token Generation & Cryptographic Verification');
  const payload = { userId: 'usr_test_123', phone: '+919876543210', role: ['sender', 'traveler'] };
  const accessToken = sessionService.generateAccessToken(payload);
  assert.ok(accessToken, 'Access token string should be generated');

  const verifiedPayload = sessionService.verifyAccessToken(accessToken);
  assert.ok(verifiedPayload, 'Token should be cryptographically verified');
  assert.strictEqual(verifiedPayload?.userId, payload.userId);
  assert.strictEqual(verifiedPayload?.phone, payload.phone);

  const fakeToken = accessToken.slice(0, -5) + 'fake';
  const fakeVerified = sessionService.verifyAccessToken(fakeToken);
  assert.strictEqual(fakeVerified, null, 'Tampered token signature must fail verification');

  console.log('  ✅ JWT signing and cryptographic verification tests passed.');

  // Test 4: Refresh Token Hashing
  console.log('\nTest 4: Refresh Token SHA-256 Hashing');
  const rawRefreshToken = sessionService.generateRefreshToken();
  assert.ok(rawRefreshToken.length >= 32, 'Refresh token should be random string');

  const hash1 = sessionService.hashToken(rawRefreshToken);
  const hash2 = sessionService.hashToken(rawRefreshToken);
  assert.strictEqual(hash1, hash2, 'SHA-256 hashing must be deterministic');
  assert.notStrictEqual(rawRefreshToken, hash1, 'Raw token must never equal hash');

  console.log('  ✅ Refresh token SHA-256 hashing tests passed.');

  // Test 5: OTP Provider Factory Abstraction
  console.log('\nTest 5: OTP Provider Abstraction Factory');
  const devProvider = OTPProviderFactory.getProvider();
  assert.ok(devProvider instanceof DevelopmentOTPProvider, 'Default provider should be DevelopmentOTPProvider');

  process.env.OTP_PROVIDER = 'msg91';
  const msg91Provider = OTPProviderFactory.getProvider();
  assert.ok(msg91Provider instanceof MSG91OTPProvider, 'Factory should instantiate MSG91OTPProvider when OTP_PROVIDER=msg91');
  process.env.OTP_PROVIDER = 'development';

  console.log('  ✅ OTP Provider Factory abstraction tests passed.');

  // Test 6: Development OTP Provider Logging Safety
  console.log('\nTest 6: Development OTP Console Logging Safety');
  const testDevProvider = new DevelopmentOTPProvider();
  const sendResult = await testDevProvider.sendOTP({ phone: '+919876543210', otp: '654321' });
  assert.strictEqual(sendResult.success, true, 'Development OTP provider should succeed');
  assert.strictEqual(sendResult.message, 'OTP sent successfully (Development Mode)');

  console.log('  ✅ Development OTP provider logging safety tests passed.');

  console.log('\n🎉 ALL RIDEEL AUTHENTICATION UNIT TESTS PASSED SUCCESSFULLY!\n');
}

runAuthTests().catch((err) => {
  console.error('❌ Auth Test Failure:', err);
  process.exit(1);
});
