import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { withTransaction } from '../config/db.js';
const toPublicUser = ({ password_hash, ...rest }) => rest;

const SELF_REGISTER_ROLES = new Set(['customer', 'salon_manager'])

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const sendArtistInvitation = async (senderEmail, recipientEmail, firstName, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: 'Complete registration as a Nail Artist',
    text: `Hi ${firstName},\n\nYou have been invited to join a salon on NailBabe. Open this link to finish setting up your account:\n\nhttp://localhost:5173/accept-invitation?token=${token}\n\nThe link expires in 24 hours.`  };

  return transporter.sendMail(mailOptions);
};

export const register = async function (req, res) {
    const { email, password, role: requestedRole, first_name, last_name, default_region, display_name, notes } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res
            .status(400)
            .json({message: 'Email, password, role and name are required'})
    }

    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof first_name !== 'string' ||
        typeof last_name !== 'string'
    ) {
        return res.status(400).json({ message: 'Invalid field types' })
    }

    if (!EMAIL_RE.test(email)){
        return res.status(400).json({message: 'Invalid email format'})
    }

    if (password.length < 8){
        return res
            .status(400)
            .json({message: 'Password must be at least 8 characters'})
    }

    const role = requestedRole === undefined ? 'customer' : requestedRole
    if (!SELF_REGISTER_ROLES.has(role)) {
        return res.status(400).json({ message: 'Invalid role for self-registration' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const trimmedFirst = first_name.trim()
    const trimmedLast = last_name.trim()

    const defaultRegion = role === 'customer' && typeof default_region === 'string'
      ? default_region.trim() || null
      : null;
    const managerDisplayName = role === 'salon_manager' && typeof display_name === 'string'
      ? display_name.trim()
      : '';
    if (role === 'salon_manager' && !managerDisplayName) {
        return res.status(400).json({ message: 'Display name is required for salon managers' });
    }
    const notesValue = notes ? notes.trim() : null;


    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await req.db.query(
            `INSERT INTO "user" (email, password_hash, role, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, first_name, last_name, created_at`,
            [normalizedEmail, hashedPassword, role, trimmedFirst, trimmedLast ]
        )

        const resultRole = role === 'customer'
          ? await req.db.query(
              `INSERT INTO customer (user_id, default_region, notes)
              VALUES ($1, $2, $3)
              RETURNING user_id`,
              [result.rows[0].id, defaultRegion, notesValue]
            )
          : await req.db.query(
              `INSERT INTO salon_manager (user_id, display_name)
              VALUES ($1, $2)
              RETURNING user_id, display_name`,
              [result.rows[0].id, managerDisplayName]
            )

        return res.status(201).json({
            message: 'User registrated successfully',
            user: toPublicUser(result.rows[0]),
            role: resultRole.rows[0]
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Email already exists' });
        }

        console.error(error);
        return res.status(500).json({message: 'Internal server error'})
    }


}

export const login = async function (req, res) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Invalid field types' })
    }
  
    try {
      const result = await req.db.query(
        `SELECT id, email, password_hash, first_name, last_name, is_active, role
           FROM "user"
          WHERE email = $1`,
        [email]
      );
  
      if (result.rows.length === 0 || !result.rows[0].is_active || !result.rows[0].password_hash) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const payload = { id: user.id, email: user.email };
  
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m',
      });
  
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });
  
      const refreshTokenHash = hashToken(refreshToken);
  
      await req.db.query(
        `UPDATE "user"
            SET refresh_token_hash = $1
          WHERE id = $2`,
        [refreshTokenHash, user.id]
      );
  
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/users',          
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
  
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        accessToken, 
      });
    } catch (error) {
      console.error('login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

export const refresh = async function (req, res) {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const result = await req.db.query(
      `SELECT id, email, refresh_token_hash, role
         FROM "user"
        WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = result.rows[0];
    const tokenHash = hashToken(token);
    
    if (tokenHash !== user.refresh_token_hash) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const payload = { id: user.id, email: user.email };

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    await req.db.query(
      `UPDATE "user"
          SET refresh_token_hash = $1
        WHERE id = $2`,
      [hashToken(newRefreshToken), user.id]
    );

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/users',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('refresh error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const logout = async function (req, res) {
    const token = req.cookies?.refresh_token;
  
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await req.db.query(
          `UPDATE "user" SET refresh_token_hash = NULL WHERE id = $1`,
          [decoded.id]
        );
      } catch {
        // ignoring
      }
    }
  
    res.clearCookie('refresh_token', { path: '/api/v1/users' });
    return res.status(200).json({ message: 'Logged out' });
};

export const createSalon = async function (req, res) {
  const {
    name, description, region, address, city, postal_code,
    phone, email, instagram
  } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!name || !description || !region || !address || !city ||
      !postal_code || !phone || !email || !instagram) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const manager = await req.db.query(
      `SELECT id FROM salon_manager WHERE user_id = $1`,
      [userId]
    );

    if (!manager.rows.length) {
      return res.status(403).json({ message: 'Only salon managers can create a salon' });
    }

    const result = await req.db.query(
      `INSERT INTO salon
         (manager_id, name, description, region, address, city, postal_code, phone, email, instagram)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, description, region, address, city, postal_code, phone, email, instagram`,
      [
        manager.rows[0].id, name, description, region, address, city,
        postal_code, phone, email, instagram
      ]
    );

    return res.status(201).json({
      message: 'Salon added successfully',
      salon: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Salon with these details already exists' });
    }
    console.error('addSalon error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const inviteNailArtist = async function (req, res) {

  const { email, first_name, last_name } = req.body;

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim()) ||
      typeof first_name !== 'string' || !first_name.trim() ||
      typeof last_name !== 'string' || !last_name.trim()) {

    return res.status(400).json({ message: 'Valid email, first name and last name are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = hashToken(token);

  try {

    const manager = await req.db.query(
      `SELECT s.id AS salon_id FROM "user" u
       JOIN salon_manager sm ON sm.user_id = u.id
       JOIN salon s ON s.manager_id = sm.id
       WHERE u.id = $1 AND u.role = 'salon_manager' AND u.is_active = true`,
      [req.user.id]
    );

    if (!manager.rows.length) return res.status(403).json({ message: 'Only a salon manager with a salon can invite nail artists' });

    const existing = await req.db.query('SELECT id FROM "user" WHERE email = $1', [normalizedEmail]);

    if (existing.rows.length) return res.status(409).json({ message: 'An account with this email already exists' });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const artistUser = await withTransaction(async (client) => {

      const inserted = await client.query(
        `INSERT INTO "user" (email, password_hash, role, first_name, last_name, is_active, activation_token, activation_expires_at)
         VALUES ($1, NULL, 'nail_artist', $2, $3, false, $4, $5)
         RETURNING id, email`,
        [normalizedEmail, first_name.trim(), last_name.trim(), tokenHash, expiresAt]
      );

      await client.query(
        `INSERT INTO nail_artist (user_id, salon_id, display_name)
         VALUES ($1, $2, $3)`,
        [inserted.rows[0].id, manager.rows[0].salon_id, `${first_name.trim()} ${last_name.trim()}`]
      );
      return inserted.rows[0];
    });

    try {

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP_USER and SMTP_PASS must be configured');
      }
      await sendArtistInvitation(process.env.SMTP_USER, artistUser.email, first_name.trim(), token);

    } catch (mailError) {

      await req.db.query('DELETE FROM "user" WHERE id = $1', [artistUser.id]);

      console.error('Invitation email error:', mailError.message);

      return res.status(503).json({ message: 'Could not send invitation email. Check SMTP configuration and try again.' });
    }

    return res.status(201).json({ message: 'Invitation sent', email: artistUser.email, expires_at: expiresAt });

  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'An account with this email already exists' });

    console.error('invite nail artist error:', error);

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const acceptInvitation = async function (req, res) {
  const { token, password, display_name, bio, experience_years, specialty } = req.body;

  if (typeof token !== 'string' || typeof password !== 'string' || password.length < 8 ||
      typeof display_name !== 'string' || !display_name.trim()) {

    return res.status(400).json({ message: 'Token, password (at least 8 characters) and display name are required' });
  }
  if (experience_years !== undefined && (!Number.isInteger(experience_years) || experience_years < 0)) {
    return res.status(400).json({ message: 'experience_years must be a non-negative integer' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const accepted = await withTransaction(async (client) => {

      const result = await client.query(
        `UPDATE "user" SET password_hash = $1, is_active = true,
             activation_token = NULL, activation_expires_at = NULL
         WHERE activation_token = $2 AND activation_expires_at > NOW() AND is_active = false
         RETURNING id`,
        [passwordHash, hashToken(token)]
      );

      if (!result.rows.length) return false;

      await client.query(
        `UPDATE nail_artist SET display_name = $1, bio = $2, experience_years = $3, specialty = $4, is_active = true
         WHERE user_id = $5`,
        [display_name.trim(), bio?.trim() || null, experience_years ?? null, specialty?.trim() || null, result.rows[0].id]
      );
      return true;
    });
    if (!accepted) return res.status(400).json({ message: 'Invitation is invalid or expired' });

    return res.status(200).json({ message: 'Account setup complete. You can now log in.' });
  } catch (error) {

    console.error('accept invitation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




