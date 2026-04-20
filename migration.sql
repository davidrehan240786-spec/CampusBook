-- Migration Script for splitting name into first_name and last_name
-- Phase 1: Add columns and migrate data

USE campus_book_exchange;

-- 1. Add columns (if they don't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);

-- 2. Migrate existing data
UPDATE users SET 
    first_name = SUBSTRING_INDEX(name, ' ', 1),
    last_name = IF(LOCATE(' ', name) > 0, SUBSTRING(name, LOCATE(' ', name) + 1), '')
WHERE first_name IS NULL OR first_name = '';

-- 3. Set constraints (Optional but good practice after migration)
-- Note: We wait until after migration to set NOT NULL if needed, 
-- but user said first_name is required.
-- ALTER TABLE users MODIFY first_name VARCHAR(50) NOT NULL;
