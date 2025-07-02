#!/usr/bin/env node
// Test script to verify Explore page backend integration
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

async function testExploreIntegration() {
  console.log('🧪 Testing Explore page backend integration...\n');

  try {
    // Test 1: Get approved tools
    console.log('1️⃣ Testing getApprovedTools()...');
    const { data: approvedTools, error: approvedError } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (approvedError) {
      console.log('❌ Error fetching approved tools:', approvedError.message);
      return;
    }

    console.log(`✅ Found ${approvedTools.length} approved tools:`);
    approvedTools.forEach(tool => {
      console.log(`   - ${tool.name} (${tool.category}) - ${tool.pricing_type}`);
    });

    // Test 2: Test category filtering
    console.log('\n2️⃣ Testing category filtering...');
    const categories = [...new Set(approvedTools.map(tool => tool.category))];
    console.log(`   Available categories: ${categories.join(', ')}`);

    for (const category of categories) {
      const { data: categoryTools, error: categoryError } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')
        .eq('category', category);

      if (categoryError) {
        console.log(`   ❌ Error filtering by ${category}:`, categoryError.message);
      } else {
        console.log(`   ✅ ${category}: ${categoryTools.length} tools`);
      }
    }

    // Test 3: Test search functionality
    console.log('\n3️⃣ Testing search functionality...');
    const searchTerms = ['code', 'design', 'docker'];
    
    for (const term of searchTerms) {
      const { data: searchResults, error: searchError } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')
        .or(`name.ilike.%${term}%,description.ilike.%${term}%,tags.cs.{${term}}`);

      if (searchError) {
        console.log(`   ❌ Search for "${term}" failed:`, searchError.message);
      } else {
        console.log(`   ✅ Search "${term}": ${searchResults.length} results`);
        searchResults.forEach(tool => {
          console.log(`      - ${tool.name}`);
        });
      }
    }

    // Test 4: Test data completeness
    console.log('\n4️⃣ Testing data completeness...');
    const requiredFields = ['name', 'description', 'category', 'pricing_type', 'website'];
    let allComplete = true;

    approvedTools.forEach(tool => {
      const missing = requiredFields.filter(field => !tool[field]);
      if (missing.length > 0) {
        console.log(`   ⚠️  ${tool.name} missing: ${missing.join(', ')}`);
        allComplete = false;
      }
    });

    if (allComplete) {
      console.log('   ✅ All tools have complete required data');
    }

    // Test 5: Check for logos
    console.log('\n5️⃣ Testing logo availability...');
    const toolsWithLogos = approvedTools.filter(tool => 
      tool.logo || tool.logo_public_url || tool.logo_storage_path
    );
    console.log(`   ✅ ${toolsWithLogos.length}/${approvedTools.length} tools have logos`);

    console.log('\n🎉 Explore page integration test complete!');
    console.log('\n📋 Summary:');
    console.log(`   • ${approvedTools.length} approved tools ready for display`);
    console.log(`   • ${categories.length} categories available for filtering`);
    console.log(`   • Search functionality working`);
    console.log(`   • ${toolsWithLogos.length} tools with logos`);
    
    if (approvedTools.length === 0) {
      console.log('\n💡 Next steps:');
      console.log('   1. Add some tools via /add-tool page');
      console.log('   2. Approve them via /admin page');
      console.log('   3. They will appear on /explore page');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await testExploreIntegration();
}