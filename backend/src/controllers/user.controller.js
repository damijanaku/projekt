import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
const toPublicUser = ({ password_hash, ...rest }) => rest;

const SELF_REGISTER_ROLES = new Set(['customer', 'salon_manager', 'nail_artist'])

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/



const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const register = async function (req, res) {
    const { email, password, role: requestedRole , first_name, last_name, default_region, notes } = req.body;

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

    const defaultRegion = default_region ? default_region.trim() : null;
    const notesValue = notes ? notes.trim() : null;


    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await req.db.query(
            `INSERT INTO "user" (email, password_hash, role, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, first_name, last_name, created_at`,
            [normalizedEmail, hashedPassword, role, trimmedFirst, trimmedLast ]
        )

        const resultRole = await req.db.query(
          `INSERT INTO ${role} (user_id, default_region, notes)
          VALUES ($1, $2, $3)
          RETURNING user_id`,
          [result.rows[0].id, defaultRegion, notesValue]
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
        `SELECT id, email, password_hash, first_name, last_name
           FROM "user"
          WHERE email = $1`,
        [email]
      );
  
      if (result.rows.length === 0) {
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
      `SELECT id, email, refresh_token_hash
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





