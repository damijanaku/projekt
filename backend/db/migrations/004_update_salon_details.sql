CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO category (name) VALUES 
('Klasična manikura in pedikura'),
('Gel in akrilni nohti'),
('Trajni lak (Gelish)'),
('Nail Art in poslikave'),
('Medicinska pedikura');

ALTER TABLE salon ADD COLUMN category_id INT REFERENCES category(id);