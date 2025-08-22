-- Create storage bucket for business images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'business-images', 
    'business-images', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for business images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'business-images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'business-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Business owners can update their images" ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'business-images' 
    AND (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE owner_id = auth.uid() 
            AND storage.foldername(name)[1] = id::text
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    )
);

CREATE POLICY "Business owners can delete their images" ON storage.objects FOR DELETE 
USING (
    bucket_id = 'business-images' 
    AND (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE owner_id = auth.uid() 
            AND storage.foldername(name)[1] = id::text
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    )
);
