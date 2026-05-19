-- Migration script to add roles and soft delete support for users

-- 1. Ensure columns exist (in case JPA didn't create them or for fresh environments)
-- Note: 'role' and 'active' might already be there if hibernate.ddl-auto=update was used
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='active') THEN
        ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;
    END IF;
END $$;

-- 2. Update existing users to have a default role if they have NULL
UPDATE users SET role = 'ROLE_USER' WHERE role IS NULL;

-- 3. Update existing users to be active if they have NULL
UPDATE users SET active = TRUE WHERE active IS NULL;

-- 4. Add index on email if not exists (for performance on login)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. Add index on active status for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
