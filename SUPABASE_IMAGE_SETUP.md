# Supabase Image Storage Setup for StakPro

This guide will help you set up image storage capabilities for StakPro, allowing users to upload tool logos and automatically store scraped images.

## Quick Setup (5 minutes)

### 1. Create Storage Bucket

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/wqpanstubmsmvenjtosf)
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Enter bucket name: `tool-logos`
5. Check **"Public bucket"** option
6. Click **"Create bucket"**

### 2. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-storage-setup.sql`
3. Click **"Run"** to execute the script

### 3. Verify Setup

Run the setup verification script:

```bash
npm run storage:setup
```

You should see:
```
✅ tool-logos bucket already exists!
✅ Upload test successful!
```

## What This Enables

### 🖼️ **Image Upload Features**

1. **Manual Logo Upload**
   - Users can drag & drop logo files in the Add Tool form
   - Supports PNG, JPG, GIF, WebP, SVG up to 5MB
   - Automatic image resizing and optimization
   - Preview before submission

2. **Automatic Logo Download**
   - Quick Add feature downloads logos from scraped websites
   - Stores them in Supabase Storage for reliability
   - Generates permanent URLs for consistent access

3. **Smart Logo Handling**
   - Prefers uploaded files over external URLs
   - Fallback to external URLs if no file uploaded
   - Automatic cleanup when tools are deleted

### 📊 **Database Enhancements**

The setup adds these new columns to the `tools` table:

- `logo_storage_path` - Storage path for uploaded logos
- `logo_public_url` - Public URL for stored logos  
- `logo_file_size` - File size in bytes
- `logo_content_type` - MIME type (image/png, etc.)

### 🔒 **Security & Policies**

- **Public Read Access** - Anyone can view approved tool logos
- **Authenticated Upload** - Controlled upload permissions
- **File Type Validation** - Only allows valid image formats
- **Size Limits** - Maximum 5MB per image
- **Automatic Cleanup** - Deletes images when tools are removed

## File Organization

```
Supabase Storage Structure:
tool-logos/
├── 1641234567-visual-studio-code-logo.png
├── 1641234568-figma-logo.svg
├── 1641234569-docker-logo.png
└── ...
```

Files are named with:
- Timestamp for uniqueness
- Tool name (sanitized)
- Original file extension

## Usage Examples

### Manual Form Upload
1. Go to `/add-tool`
2. Select "Manual Entry" tab
3. Drag & drop logo file or click to browse
4. File is automatically uploaded when form is submitted

### Quick Add (URL Scraping)
1. Go to `/add-tool`
2. Select "Quick Add (URL)" tab
3. Enter tool website URL
4. Logo is automatically downloaded and stored

### API Usage
```typescript
import { submitTool } from '@/lib/tool-api';

// With file upload
const file = new File([blob], 'logo.png', { type: 'image/png' });
await submitTool(formData, file);

// With URL (auto-download)
await submitTool({
  ...formData,
  logo: 'https://example.com/logo.png'
});
```

## Storage Management

### Monitor Usage
```bash
# Check database stats
npm run db:stats

# View storage usage in Supabase Dashboard
# Go to Storage > tool-logos
```

### Cleanup
```bash
# Find duplicate tools (may have duplicate images)
npm run db:duplicates

# Manual cleanup via Supabase Dashboard
# Go to Storage > tool-logos > select files > delete
```

## Troubleshooting

### Upload Fails
```
Error: "Logo upload failed: Upload failed: Bucket not found"
```
**Solution:** Create the `tool-logos` bucket in Supabase Storage

### Permission Denied
```
Error: "new row violates row-level security policy"
```
**Solution:** Run the SQL script in `supabase-storage-setup.sql`

### File Too Large
```
Error: "File size too large. Please upload an image smaller than 5MB"
```
**Solution:** Compress image or choose a smaller file

### Invalid File Type
```
Error: "Invalid file type. Please upload a valid image file"
```
**Solution:** Use PNG, JPG, GIF, WebP, or SVG format

## Cost Considerations

**Supabase Free Tier:**
- 1GB file storage included
- ~5,000-10,000 tool logos (assuming 100-200KB average)
- Additional storage: $0.021/GB/month

**Optimization:**
- Images are automatically optimized during upload
- Old logos are cleaned up when tools are deleted
- External URLs don't count against storage quota

## Next Steps

Once setup is complete, you can:

1. **Test the Upload Feature**
   - Try uploading a logo in the Add Tool form
   - Verify it appears in Supabase Storage

2. **Test Quick Add**
   - Use Quick Add with a tool that has a logo
   - Check that the logo is downloaded and stored

3. **Monitor Storage Usage**
   - Check the Storage dashboard regularly
   - Set up alerts for storage limits

4. **Customize File Limits** (optional)
   - Edit `maxSize` in `FileUpload` component
   - Modify validation in `image-upload.ts`

The image storage system is now ready for production use! 🎉