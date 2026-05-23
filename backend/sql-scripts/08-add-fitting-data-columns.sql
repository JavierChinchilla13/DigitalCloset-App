-- Migration script to add fitting data columns to clothing_items

DO $$ 
BEGIN 
    -- Persona Type (MALE/FEMALE)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='persona_type') THEN
        ALTER TABLE clothing_items ADD COLUMN persona_type VARCHAR(20) NOT NULL DEFAULT 'MALE';
    END IF;

    -- Transform X
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='transform_x') THEN
        ALTER TABLE clothing_items ADD COLUMN transform_x DOUBLE PRECISION DEFAULT 0.0;
    END IF;

    -- Transform Y
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='transform_y') THEN
        ALTER TABLE clothing_items ADD COLUMN transform_y DOUBLE PRECISION DEFAULT 0.0;
    END IF;

    -- Transform Scale
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='transform_scale') THEN
        ALTER TABLE clothing_items ADD COLUMN transform_scale DOUBLE PRECISION DEFAULT 1.0;
    END IF;

    -- Transform Rotation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='transform_rotation') THEN
        ALTER TABLE clothing_items ADD COLUMN transform_rotation DOUBLE PRECISION DEFAULT 0.0;
    END IF;

    -- Transform Width
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='transform_width') THEN
        ALTER TABLE clothing_items ADD COLUMN transform_width DOUBLE PRECISION;
    END IF;

    -- Transform Height
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='transform_height') THEN
        ALTER TABLE clothing_items ADD COLUMN transform_height DOUBLE PRECISION;
    END IF;
END $$;
