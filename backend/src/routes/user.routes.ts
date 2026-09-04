import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

// POST /api/auth/register-or-login
// Creates new user in PostgreSQL users table if phone does not exist, or returns existing user
router.post('/auth/register-or-login', async (req: Request, res: Response) => {
  try {
    const { phone, full_name, email, city, role } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Check if user exists in PostgreSQL DB
    const existingUserRes = await query('SELECT * FROM users WHERE phone = $1', [cleanPhone]);

    if (existingUserRes.rows.length > 0) {
      const user = existingUserRes.rows[0];

      // If full_name or email supplied on update
      if (full_name || email || city) {
        const updatedRes = await query(
          `UPDATE users 
           SET full_name = COALESCE($1, full_name),
               email = COALESCE($2, email),
               city = COALESCE($3, city),
               role = COALESCE($4, role),
               updated_at = CURRENT_TIMESTAMP
           WHERE phone = $5
           RETURNING *`,
          [full_name || null, email || null, city || null, role ? (Array.isArray(role) ? role : [role]) : null, cleanPhone]
        );
        return res.json({
          success: true,
          message: 'User profile updated in PostgreSQL database!',
          user: updatedRes.rows[0],
        });
      }

      return res.json({
        success: true,
        message: 'User authenticated from PostgreSQL database!',
        user,
      });
    }

    // Insert new user into PostgreSQL users table
    const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const name = full_name || 'New User';
    const userRole = role ? (Array.isArray(role) ? role : [role]) : ['sender', 'traveler'];
    const photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

    const insertRes = await query(
      `INSERT INTO users (id, full_name, phone, email, profile_photo, city, role, active_mode, is_kyc_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, name, cleanPhone, email || null, photo, city || 'Chennai', userRole, 'sender', true]
    );

    res.json({
      success: true,
      message: 'New user registered and saved to PostgreSQL database successfully!',
      user: insertRes.rows[0],
    });
  } catch (error: any) {
    console.error('PostgreSQL Register/Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process user registration in PostgreSQL database.',
      error: error.message,
    });
  }
});

// GET /api/users/:phone
router.get('/users/phone/:phone', async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const cleanPhone = phone.replace(/\D/g, '');
    const userRes = await query('SELECT * FROM users WHERE phone = $1', [cleanPhone]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found in database' });
    }

    res.json({ success: true, user: userRes.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
