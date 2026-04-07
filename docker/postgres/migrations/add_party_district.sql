-- Run against existing RDS / Postgres if `party` and `district` are missing:
ALTER TABLE voters ADD COLUMN IF NOT EXISTS party VARCHAR(100);
ALTER TABLE voters ADD COLUMN IF NOT EXISTS district VARCHAR(50);
