-- Local Docker Postgres: schema aligned with Sequelize `voters` model (+ party, district).
CREATE TABLE IF NOT EXISTS voters (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    street_no VARCHAR(50) NOT NULL DEFAULT '-',
    street_name VARCHAR(255) NOT NULL DEFAULT '-',
    residence_city VARCHAR(100) NOT NULL DEFAULT '-',
    residence_zip VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    party VARCHAR(100),
    district VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_voters_name_dob ON voters (first_name, last_name, dob);
