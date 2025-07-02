import { supabase } from './supabase';

export interface ImageUploadResult {
  success: boolean;
  storagePath?: string;
  publicUrl?: string;
  error?: string;
  fileSize?: number;
  contentType?: string;
}

// Upload image file to Supabase Storage
export const uploadImageFile = async (
  file: File,
  fileName: string
): Promise<ImageUploadResult> => {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WebP, SVG).'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Please upload an image smaller than 5MB.'
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const storagePath = `${timestamp}-${randomString}-${fileName}.${fileExtension}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('tool-logos')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('tool-logos')
      .getPublicUrl(storagePath);

    return {
      success: true,
      storagePath,
      publicUrl: publicUrlData.publicUrl,
      fileSize: file.size,
      contentType: file.type
    };

  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

// Download image from URL and upload to Supabase Storage
export const downloadAndUploadImage = async (
  imageUrl: string,
  toolName: string
): Promise<ImageUploadResult> => {
  try {
    // Validate URL
    new URL(imageUrl);

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to download image: ${response.statusText}`
      };
    }

    // Convert to blob
    const blob = await response.blob();

    // Validate content type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(blob.type)) {
      return {
        success: false,
        error: 'Downloaded file is not a valid image type.'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (blob.size > maxSize) {
      return {
        success: false,
        error: 'Downloaded image is too large (>5MB).'
      };
    }

    // Generate filename from tool name
    const sanitizedName = toolName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const timestamp = Date.now();
    const fileExtension = getExtensionFromMimeType(blob.type);
    const storagePath = `${timestamp}-${sanitizedName}-logo.${fileExtension}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('tool-logos')
      .upload(storagePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('tool-logos')
      .getPublicUrl(storagePath);

    return {
      success: true,
      storagePath,
      publicUrl: publicUrlData.publicUrl,
      fileSize: blob.size,
      contentType: blob.type
    };

  } catch (error) {
    console.error('Image download and upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download and upload failed'
    };
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (storagePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('tool-logos')
      .remove([storagePath]);

    if (error) {
      console.error('Image deletion error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Image deletion error:', error);
    return false;
  }
};

// Helper function to get file extension from MIME type
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
  };

  return mimeToExt[mimeType] || 'jpg';
}

// Resize image if it's too large (optional enhancement)
export const resizeImageIfNeeded = async (
  file: File,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file); // Fallback to original
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => resolve(file); // Fallback to original
    img.src = URL.createObjectURL(file);
  });
};