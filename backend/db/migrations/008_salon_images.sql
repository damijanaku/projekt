CREATE TABLE salon_gallery_image (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID NOT NULL REFERENCES salon(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_salon_gallery_image_salon_id
    ON salon_gallery_image(salon_id);