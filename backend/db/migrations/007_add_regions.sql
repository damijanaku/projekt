CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO regions (name) VALUES 
('Osrednjeslovenska'),
('Podravska'),
('Pomurska'),
('Koroška'),
('Savinjska'),
('Zasavska'),
('Posavska'),
('Jugovzhodna Slovenija'),
('Primorsko-notranjska'),
('Goriška'),
('Obalno-kraška'),
('Gorenjska');

DROP INDEX IF EXISTS salon_region_trgm_idx;
ALTER TABLE salon DROP COLUMN region;
ALTER TABLE salon ADD COLUMN region_id INT REFERENCES regions(id);

CREATE INDEX IF NOT EXISTS salon_active_region_idx
    ON salon (region_id)
    WHERE is_active = true;
