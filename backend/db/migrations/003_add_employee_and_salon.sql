ALTER TABLE "user"
    ALTER COLUMN password_hash DROP NOT NULL;

CREATE TABLE salon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_id UUID NOT NULL UNIQUE REFERENCES salon_manager(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    region VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    longitude DECIMAL(9,6),
    latitude DECIMAL(9,6),
    phone VARCHAR(30),
    email VARCHAR(255),
    instagram VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE nail_artist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES salon(id) ON DELETE CASCADE,
    display_name VARCHAR(150),
    bio TEXT,
    experience_years INT CHECK (experience_years IS NULL OR experience_years >= 0),
    specialty VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

