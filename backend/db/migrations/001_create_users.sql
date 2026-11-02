CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('admin', 'customer', 'salon_manager', 'nail_artist')),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    activation_token VARCHAR(255) UNIQUE,
    activation_expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE INDEX idx_user_email ON "user"(email);

CREATE TABLE customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    default_region VARCHAR(100),
    notes TEXT
);

CREATE TABLE salon_manager (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    bio TEXT
);