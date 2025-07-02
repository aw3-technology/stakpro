-- Supabase Storage Setup for StakPro
-- Run this in your Supabase SQL Editor after the main schema

-- Create storage bucket for tool logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tool-logos', 'tool-logos', true)
ON CONFLICT DO NOTHING;

-- Allow public access to view images in the tool-logos bucket
CREATE POLICY "Public Access for tool logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'tool-logos');

-- Allow authenticated users to upload images (for now allowing anon for simplicity)
CREATE POLICY "Allow uploads to tool logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tool-logos');

-- Allow updates to tool logos  
CREATE POLICY "Allow updates to tool logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tool-logos');

-- Allow deletes (for cleanup)
CREATE POLICY "Allow deletes of tool logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'tool-logos');

-- Update the tools table to add better image handling
ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_storage_path VARCHAR(500);
ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_public_url VARCHAR(500);

-- Add comment to clarify the logo columns
COMMENT ON COLUMN tools.logo IS 'External logo URL (from scraped websites)';
COMMENT ON COLUMN tools.logo_storage_path IS 'Supabase Storage path for uploaded/downloaded logos';
COMMENT ON COLUMN tools.logo_public_url IS 'Public URL for the logo stored in Supabase Storage';

-- Create a function to get the public URL for a logo
CREATE OR REPLACE FUNCTION get_logo_public_url(storage_path TEXT)
RETURNS TEXT AS $$
BEGIN
  IF storage_path IS NULL OR storage_path = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN 'https://wqpanstubmsmvenjtosf.supabase.co/storage/v1/object/public/tool-logos/' || storage_path;
END;
$$ LANGUAGE plpgsql;

-- Create a view that includes the computed public URL
CREATE OR REPLACE VIEW tools_with_logo_urls AS
SELECT 
  *,
  CASE 
    WHEN logo_storage_path IS NOT NULL THEN get_logo_public_url(logo_storage_path)
    ELSE logo
  END AS computed_logo_url
FROM tools;

-- Grant access to the view
GRANT SELECT ON tools_with_logo_urls TO anon, authenticated;

-- Update RLS policy for the view
CREATE POLICY "Anyone can view approved tools with logos" ON tools_with_logo_urls
  FOR SELECT USING (status = 'approved');

-- Create a function to clean up storage when a tool is deleted
CREATE OR REPLACE FUNCTION delete_tool_logo()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the logo from storage if it exists
  IF OLD.logo_storage_path IS NOT NULL THEN
    PERFORM storage.delete_object('tool-logos', OLD.logo_storage_path);
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for logo cleanup
CREATE TRIGGER tool_logo_cleanup
  BEFORE DELETE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION delete_tool_logo();

-- Add file size and type tracking for better management
ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_file_size INTEGER;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_content_type VARCHAR(100);

COMMENT ON COLUMN tools.logo_file_size IS 'Size of the stored logo file in bytes';
COMMENT ON COLUMN tools.logo_content_type IS 'MIME type of the stored logo file';