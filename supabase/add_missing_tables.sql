-- Fix reviews table foreign key reference
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add missing columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS flag_reason TEXT;

-- Create business_images table
CREATE TABLE IF NOT EXISTS business_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL,
    type VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    alt_text TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for business_images
CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id);
CREATE INDEX IF NOT EXISTS idx_business_images_is_primary ON business_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_business_images_is_featured ON business_images(is_featured);

-- Create storage bucket for business images
-- Note: This needs to be run in Supabase dashboard under Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('business-images', 'business-images', true);

-- Enable RLS on business_images
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_images table
CREATE POLICY "Business owners can view their own business images" ON business_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = business_images.business_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Business owners can insert their own business images" ON business_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = business_images.business_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Business owners can update their own business images" ON business_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = business_images.business_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Business owners can delete their own business images" ON business_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = business_images.business_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view public business images" ON business_images
    FOR SELECT USING (true);

CREATE POLICY "Super admins can manage all business images" ON business_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );
