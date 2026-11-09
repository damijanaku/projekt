CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS salon_active_name_idx
    ON salon (name, id)
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS salon_active_category_idx
    ON salon (category_id)
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS salon_name_trgm_idx
    ON salon USING GIN (name gin_trgm_ops)
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS salon_region_trgm_idx
    ON salon USING GIN (region gin_trgm_ops)
    WHERE is_active = true;
