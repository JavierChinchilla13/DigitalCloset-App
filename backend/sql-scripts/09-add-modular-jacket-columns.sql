-- Migration script to add modular jacket columns to clothing_items

DO $$ 
BEGIN 
    -- Is Modular Flag
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='is_modular') THEN
        ALTER TABLE clothing_items ADD COLUMN is_modular BOOLEAN DEFAULT FALSE;
    END IF;

    -- Modular Data (JSON storage for segments and transforms)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clothing_items' AND column_name='modular_data') THEN
        ALTER TABLE clothing_items ADD COLUMN modular_data TEXT;
    END IF;
END $$;
