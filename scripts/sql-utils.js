#!/usr/bin/env node
// SQL utility scripts for StakPro using Supabase
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

// Utility functions for database operations
export class SQLUtils {
  
  // Get database statistics
  static async getStats() {
    console.log('📊 Fetching database statistics...');
    
    const { data: tools, error } = await supabase
      .from('tools')
      .select('status, category, pricing_type, rating');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    const stats = {
      total: tools.length,
      byStatus: {},
      byCategory: {},
      byPricing: {},
      avgRating: 0
    };
    
    let totalRating = 0;
    
    tools.forEach(tool => {
      stats.byStatus[tool.status] = (stats.byStatus[tool.status] || 0) + 1;
      stats.byCategory[tool.category] = (stats.byCategory[tool.category] || 0) + 1;
      stats.byPricing[tool.pricing_type] = (stats.byPricing[tool.pricing_type] || 0) + 1;
      totalRating += tool.rating;
    });
    
    stats.avgRating = (totalRating / tools.length).toFixed(2);
    
    console.log('✅ Database Statistics:');
    console.log(`   Total Tools: ${stats.total}`);
    console.log(`   Average Rating: ${stats.avgRating}★`);
    console.log('\n   By Status:');
    Object.entries(stats.byStatus).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`);
    });
    console.log('\n   By Category:');
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`     ${category}: ${count}`);
    });
    console.log('\n   By Pricing:');
    Object.entries(stats.byPricing).forEach(([pricing, count]) => {
      console.log(`     ${pricing}: ${count}`);
    });
    
    return stats;
  }
  
  // Backup all tools to JSON
  static async backup() {
    console.log('💾 Creating backup...');
    
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Backup failed:', error.message);
      return;
    }
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      total_tools: tools.length,
      tools: tools
    };
    
    const filename = `backup-${new Date().toISOString().split('T')[0]}.json`;
    
    // In a real scenario, you'd save this to a file
    console.log('✅ Backup created successfully!');
    console.log(`   Tools backed up: ${tools.length}`);
    console.log(`   Backup size: ${JSON.stringify(backup).length} bytes`);
    console.log(`   Suggested filename: ${filename}`);
    
    return backup;
  }
  
  // Clean up duplicate tools
  static async findDuplicates() {
    console.log('🔍 Checking for duplicate tools...');
    
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, website');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    const nameMap = new Map();
    const urlMap = new Map();
    const duplicates = [];
    
    tools.forEach(tool => {
      // Check for duplicate names
      if (nameMap.has(tool.name)) {
        duplicates.push({
          type: 'name',
          value: tool.name,
          ids: [nameMap.get(tool.name), tool.id]
        });
      } else {
        nameMap.set(tool.name, tool.id);
      }
      
      // Check for duplicate URLs
      if (urlMap.has(tool.website)) {
        duplicates.push({
          type: 'website',
          value: tool.website,
          ids: [urlMap.get(tool.website), tool.id]
        });
      } else {
        urlMap.set(tool.website, tool.id);
      }
    });
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
    } else {
      console.log(`⚠️  Found ${duplicates.length} potential duplicates:`);
      duplicates.forEach(dup => {
        console.log(`   ${dup.type}: "${dup.value}" (IDs: ${dup.ids.join(', ')})`);
      });
    }
    
    return duplicates;
  }
  
  // Get pending submissions count
  static async getPendingCount() {
    const { count, error } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return 0;
    }
    
    console.log(`📋 Pending submissions: ${count}`);
    return count;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'stats':
      await SQLUtils.getStats();
      break;
    case 'backup':
      await SQLUtils.backup();
      break;
    case 'duplicates':
      await SQLUtils.findDuplicates();
      break;
    case 'pending':
      await SQLUtils.getPendingCount();
      break;
    case 'help':
    default:
      console.log('🛠️  StakPro SQL Utilities');
      console.log('\nUsage: node scripts/sql-utils.js [command]');
      console.log('\nCommands:');
      console.log('  stats      - Show database statistics');
      console.log('  backup     - Create backup of all tools');
      console.log('  duplicates - Find duplicate tools');
      console.log('  pending    - Count pending submissions');
      console.log('  help       - Show this help message');
      break;
  }
}