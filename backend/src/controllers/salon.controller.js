export const getCategories = async function (_req, res) {
  try {
    const result = await _req.db.query(
      `SELECT id, name FROM category ORDER BY id`
    );

    return res.status(200).json({ categories: result.rows });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createSalon = async function (req, res) {
  const {
    name, description, category_id, region, address, city, postal_code,
    phone, email, instagram
  } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!name || !description || !category_id || !region || !address || !city ||
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
         (manager_id, name, description, category_id, region, address, city, postal_code, phone, email, instagram)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, description, category_id, region, address, city, postal_code, phone, email, instagram`,
      [
        manager.rows[0].id, name, description, category_id, region, address, city,
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
    values.push(`%${region}%`);
    conditions.push(`s.region ILIKE $${values.length}`);
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
         s.region, s.address, s.city, s.postal_code, s.phone, s.email, s.instagram
       FROM salon s
       JOIN category c ON c.id = s.category_id
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

