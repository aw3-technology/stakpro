#!/usr/bin/env node
// Setup Supabase Storage for StakPro
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key] = value;
  }
});

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function setupStorage() {
  console.log('🏗️  Setting up Supabase Storage for tool logos...');
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      return;
    }
    
    const toolLogosBucket = buckets.find(bucket => bucket.id === 'tool-logos');
    
    if (toolLogosBucket) {
      console.log('✅ tool-logos bucket already exists!');
    } else {
      console.log('📁 tool-logos bucket not found, manual setup required');
      console.log('\n📋 Manual Setup Instructions:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to Storage');
      console.log('3. Create a new bucket called "tool-logos"');
      console.log('4. Set it as public');
      console.log('5. Run the SQL script in supabase-storage-setup.sql');
    }
    
    // Test upload functionality
    console.log('\n🧪 Testing storage functionality...');
    
    // Create a small test file
    const testContent = 'test-image-content';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool-logos')
      .upload('test-file.txt', testBlob, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.log('⚠️  Upload test failed:', uploadError.message);
      console.log('   This likely means storage policies are not set up yet');
      console.log('   Please run the SQL script in supabase-storage-setup.sql');
    } else {
      console.log('✅ Upload test successful!');
      
      // Test public URL
      const { data: urlData } = supabase.storage
        .from('tool-logos')
        .getPublicUrl('test-file.txt');
      
      console.log('🔗 Test file URL:', urlData.publicUrl);
      
      // Clean up test file
      await supabase.storage
        .from('tool-logos')
        .remove(['test-file.txt']);
      
      console.log('🧹 Test file cleaned up');
    }
    
    console.log('\n✨ Storage setup check complete!');
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await setupStorage();
}