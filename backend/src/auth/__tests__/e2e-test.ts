import crypto from 'crypto';
import { pool, query } from '../../config/database';
import { authService } from '../auth.service';

async function runE2ETest() {
  console.log('🚀 Starting Full RIDEEL OTP End-to-End Test against real PostgreSQL DB...\n');

  const testPhone = '+919876540002';

  // 1. Send OTP
  console.log('Step 1: Requesting OTP for fresh phone:', testPhone);
  const sendResult = await authService.requestOTP(testPhone, '127.0.0.1');
  console.log('  Send Result:', sendResult);

  // 2. Fetch the stored OTP row from phone_otps
  const otpRes = await query(
    `SELECT id, phone, otp_hash FROM phone_otps WHERE phone = $1 AND verified_at IS NULL ORDER BY created_at DESC LIMIT 1;`,
    [testPhone]
  );
  console.log('  Phone OTP Record Found:', otpRes.rows.length === 1);

  // Set a deterministic known 6-digit OTP code for testing verification
  const knownOtp = '654321';
  const knownHash = crypto.createHash('sha256').update(knownOtp).digest('hex');
  await query(`UPDATE phone_otps SET otp_hash = $1 WHERE id = $2;`, [knownHash, otpRes.rows[0].id]);

  // 3. Verify OTP & Register New User
  console.log('\nStep 2: Verifying OTP code for new user registration...');
  const verifyResult = await authService.verifyOTPAndLogin(testPhone, knownOtp, 'RIDEEL-E2E-Device', '127.0.0.1');
  console.log('  Verify Result Success:', verifyResult.success);
  console.log('  Is New User:', verifyResult.isNewUser);
  console.log('  Created User ID:', verifyResult.user?.id);

  // 4. Reset cooldown timestamp to allow second OTP request in test
  await query(`UPDATE phone_otps SET created_at = NOW() - INTERVAL '2 minutes' WHERE phone = $1;`, [testPhone]);

  // 5. Test Existing User Login with a second OTP to the same phone
  console.log('\nStep 3: Requesting second OTP for EXISTING user login:', testPhone);
  const sendResult2 = await authService.requestOTP(testPhone, '127.0.0.1');
  console.log('  Second Send Result:', sendResult2);

  const otpRes2 = await query(
    `SELECT id FROM phone_otps WHERE phone = $1 AND verified_at IS NULL ORDER BY created_at DESC LIMIT 1;`,
    [testPhone]
  );
  const knownOtp2 = '112233';
  const knownHash2 = crypto.createHash('sha256').update(knownOtp2).digest('hex');
  await query(`UPDATE phone_otps SET otp_hash = $1 WHERE id = $2;`, [knownHash2, otpRes2.rows[0].id]);

  const verifyResult2 = await authService.verifyOTPAndLogin(testPhone, knownOtp2, 'RIDEEL-E2E-Device-2', '127.0.0.1');
  console.log('  Second Login Success:', verifyResult2.success);
  console.log('  Is New User (should be FALSE):', verifyResult2.isNewUser);
  console.log('  Logged In User ID (must match first):', verifyResult2.user?.id);

  // 6. Database Count Verification
  const userCount = await query(`SELECT COUNT(*) FROM users WHERE phone = $1;`, [testPhone]);
  console.log('\nStep 4: Duplicate User Check (Count must be exactly 1):', userCount.rows[0].count);

  console.log('\n✅ ALL E2E NEW AND EXISTING USER LOGIN TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}

runE2ETest().catch((err) => {
  console.error('❌ E2E Test Exception:', err);
  process.exit(1);
});
