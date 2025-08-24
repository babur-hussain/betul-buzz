-- Create user preferences tables
-- This migration creates tables for storing user saved and favorite businesses

-- Create saved_businesses table
CREATE TABLE IF NOT EXISTS saved_businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    business_category TEXT NOT NULL,
    business_address TEXT NOT NULL,
    business_location JSONB NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    
    -- Ensure unique combination of user and business
    UNIQUE(user_id, business_id)
);

-- Create favorite_businesses table
CREATE TABLE IF NOT EXISTS favorite_businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    business_category TEXT NOT NULL,
    business_address TEXT NOT NULL,
    business_location JSONB NOT NULL,
    favorited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rating DECIMAL(3,1),
    
    -- Ensure unique combination of user and business
    UNIQUE(user_id, business_id)
);

-- Create user_preferences table (for future extensibility)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    saved_businesses JSONB DEFAULT '[]',
    favorite_businesses JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one preferences record per user
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_businesses_user_id ON saved_businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_businesses_business_id ON saved_businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_saved_businesses_saved_at ON saved_businesses(saved_at);

CREATE INDEX IF NOT EXISTS idx_favorite_businesses_user_id ON favorite_businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_businesses_business_id ON favorite_businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_favorite_businesses_favorited_at ON favorite_businesses(favorited_at);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for saved_businesses
CREATE POLICY "Users can view their own saved businesses" ON saved_businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved businesses" ON saved_businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved businesses" ON saved_businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved businesses" ON saved_businesses
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for favorite_businesses
CREATE POLICY "Users can view their own favorite businesses" ON favorite_businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite businesses" ON favorite_businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorite businesses" ON favorite_businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite businesses" ON favorite_businesses
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_preferences table
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
