import { uploadSalonImage } from '../middleware/upload.js'
import { withTransaction } from '../config/db.js'

export const getCategories = async function (req, res) {
  try {
    const result = await req.db.query(
      `SELECT id, name FROM category ORDER BY id`
    );

    return res.status(200).json({ categories: result.rows });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRegions = async function (req, res) {
  try {
    const result = await req.db.query(`SELECT id, name FROM regions ORDER BY id`);
    return res.status(200).json({ regions: result.rows });
  } catch (error) {
    console.error('getRegions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMySalon = async function (req, res) {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const manager = await req.db.query(
            `SELECT id FROM salon_manager WHERE user_id = $1`,
            [userId]
        );

        if (!manager.rows.length) {
            return res.status(403).json({ message: 'Only salon managers can view their salon' });
        }

        const result = await req.db.query(
            `SELECT
                s.id, s.name, s.description, s.category_id, c.name AS category_name,
                s.region_id, r.name AS region_name, s.address, s.city, s.postal_code, s.phone, s.email, s.instagram, s.image_url
            FROM salon s
            JOIN category c ON c.id = s.category_id
            LEFT JOIN regions r ON r.id = s.region_id
            WHERE s.manager_id = $1`,
            [manager.rows[0].id]
        );

        return res.status(200).json({ salon: result.rows[0] ?? null });
    } catch (error) {
        console.error('getMySalon error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export const createSalon = [
  uploadSalonImage,       
  async function (req, res) {
    const {
      name, description, category_id, region_id, address, city, postal_code,
      phone, email, instagram
    } = req.body;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!name || !description || !category_id || !region_id || !address ||
        !city || !postal_code || !phone || !email || !instagram) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const categoryId = Number(category_id);
    const regionId = Number(region_id);
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return res.status(400).json({ message: 'category_id must be a positive integer' });
    }
    if (!Number.isInteger(regionId) || regionId < 1) {
      return res.status(400).json({ message: 'region_id must be a positive integer' });
    }

    const imageUrl = req.file ? `/uploads/salons/${req.file.filename}` : null;

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
           (manager_id, name, description, category_id, region_id, address, city,
            postal_code, phone, email, instagram, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id, name, description, category_id, region_id, address, city,
                   postal_code, phone, email, instagram, image_url`,
        [
          manager.rows[0].id, name, description, categoryId, regionId,
          address, city, postal_code, phone, email, instagram, imageUrl,
        ]
      );

      return res.status(201).json({
        message: 'Salon added successfully',
        salon: result.rows[0],
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'This manager already has a salon' });
      }
      if (error.code === '23503') {
        return res.status(400).json({ message: 'Invalid category_id or region_id' });
      }
      console.error('createSalon error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const searchSalons = async function (req, res) {
  const { category, name, region } = req.query;
  const conditions = ['s.is_active = true'];
  const values = [];

  if (category) {
    values.push(category);
    const parameter = `$${values.length}`;
    conditions.push(/^\d+$/.test(category)
      ? `s.category_id = ${parameter}::int`
      : `c.name ILIKE ${parameter}`);
  }

  if (name) {
    values.push(`%${name}%`);
    conditions.push(`s.name ILIKE $${values.length}`);
  }

  if (region) {
    values.push(/^\d+$/.test(region) ? Number(region) : `%${region}%`);
    const parameter = `$${values.length}`;
    conditions.push(/^\d+$/.test(region)
      ? `s.region_id = ${parameter}::int`
      : `r.name ILIKE ${parameter}`);
  }

  const parsedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 50) : 20;
  const parsedOffset = Number.parseInt(req.query.offset, 10);
  const offset = Number.isInteger(parsedOffset) ? Math.max(parsedOffset, 0) : 0;
  values.push(limit + 1, offset);

  try {
    const result = await req.db.query(
      `SELECT
         s.id, s.name, s.description, s.category_id, c.name AS category_name,
         s.region_id, r.name AS region_name, s.address, s.city, s.postal_code, s.phone, s.email, s.instagram, s.image_url
       FROM salon s
       JOIN category c ON c.id = s.category_id
       LEFT JOIN regions r ON r.id = s.region_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY s.name, s.id
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    const hasMore = result.rows.length > limit;
    const salons = hasMore ? result.rows.slice(0, limit) : result.rows;
    return res.status(200).json({ salons, limit, offset, hasMore });
  } catch (error) {
    console.error('searchSalons error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllSalons = async function (req, res) {
    try {
        const result = await req.db.query(
            `SELECT 
                s.id, s.name, s.description, s.category_id, c.name AS category_name,
                s.region_id, r.name AS region_name, s.address, s.city, s.postal_code, s.phone, s.email, s.instagram, s.image_url
            FROM salon s
            JOIN category c ON c.id = s.category_id
            LEFT JOIN regions r ON r.id = s.region_id
            WHERE s.is_active = true
            ORDER BY s.name, s.id`
        )

        return res.status(200).json({ salons: result.rows });

    } catch (error) {
        console.error('getAllSalons error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function authorizeSalonMutation(req, res) {
  const salonId = req.params.id;
  if (!/^[0-9a-f-]{36}$/i.test(salonId)) {
    res.status(400).json({ message: 'Invalid salon ID' });
    return null;
  }

  const [actor, salon] = await Promise.all([
    req.db.query(`SELECT role FROM "user" WHERE id = $1`, [req.user.id]),
    req.db.query(
      `SELECT s.id, s.name, s.manager_id, s.image_url, sm.user_id AS manager_user_id
       FROM salon s
       JOIN salon_manager sm ON sm.id = s.manager_id
       WHERE s.id = $1`,
      [salonId]
    ),
  ]);

  if (!actor.rows.length) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  if (!salon.rows.length) {
    res.status(404).json({ message: 'Salon not found' });
    return null;
  }
  if (salon.rows[0].manager_user_id !== req.user.id) {
    res.status(403).json({ message: 'You can only manage your own salon' });
    return null;
  }
  return salon.rows[0];
}

export const requireSalonOwner = async function (req, res, next) {
  try {
    const salon = await authorizeSalonMutation(req, res);
    if (!salon) return;
    req.authorizedSalon = salon;
    return next();
  } catch (error) {
    console.error('salon authorization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSalon = [
  uploadSalonImage,
  async function (req, res) {
    try {
      const salon = req.authorizedSalon;

      const fields = [];
      const values = [];
      const textFields = ['name', 'description', 'address', 'city', 'postal_code', 'phone', 'email', 'instagram'];

      for (const field of textFields) {
        if (req.body[field] === undefined) continue;
        if (typeof req.body[field] !== 'string') {
          return res.status(400).json({ message: `${field} must be a string` });
        }
        const value = req.body[field].trim();
        if (field === 'name' && !value) {
          return res.status(400).json({ message: 'name cannot be empty' });
        }
        values.push(value || null);
        fields.push(`${field} = $${values.length}`);
      }

      for (const field of ['category_id', 'region_id']) {
        if (req.body[field] === undefined) continue;
        const value = Number(req.body[field]);
        if (!Number.isInteger(value) || value < 1) {
          return res.status(400).json({ message: `${field} must be a positive integer` });
        }
        values.push(value);
        fields.push(`${field} = $${values.length}`);
      }

      if (req.file) {
        values.push(`/uploads/salons/${req.file.filename}`);
        fields.push(`image_url = $${values.length}`);
      }

      if (!fields.length) {
        return res.status(400).json({ message: 'Provide at least one salon field to update' });
      }

      fields.push('updated_at = NOW()');
      values.push(salon.id);
      const result = await req.db.query(
        `UPDATE salon SET ${fields.join(', ')}
         WHERE id = $${values.length}
         RETURNING id, name, description, category_id, region_id, address, city,
                   postal_code, phone, email, instagram, image_url, is_active, updated_at`,
        values
      );

      return res.status(200).json({ message: 'Salon updated successfully', salon: result.rows[0] });
    } catch (error) {
      if (error.code === '23503') return res.status(400).json({ message: 'Invalid category_id or region_id' });
      console.error('update salon error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const deleteSalon = async function (req, res) {
  try {
    const salon = req.authorizedSalon ?? await authorizeSalonMutation(req, res);
    if (!salon) return;

    await withTransaction(async (client) => {
      await client.query(`DELETE FROM salon WHERE id = $1`, [salon.id]);
    });

    return res.status(200).json({ message: 'Salon account deleted successfully' });
  } catch (error) {
    console.error('delete salon error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
