# StakPro Backend Setup with Supabase

## Quick Start (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Create new project (free tier)
4. Wait for database setup (~2 minutes)

### 2. Set Up Database
1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-setup.sql`
3. Click "Run" to create tables and sample data

### 3. Get API Keys
1. Go to Settings → API in your Supabase project
2. Copy your Project URL and anon public key

### 4. Configure Environment
1. Copy `.env.example` to `.env.local`
2. Replace with your actual Supabase values:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Start Development
```bash
npm run dev
```

## Features Now Available

✅ **Real Database Storage** - PostgreSQL with automatic backups
✅ **Tool Submissions** - Form saves to database
✅ **Admin Panel** - Approve/reject tools at `/admin`  
✅ **Real-time Data** - Changes sync across tabs
✅ **Row Level Security** - Built-in permissions
✅ **Free Hosting** - No server costs on free tier

## Testing the Backend

1. **Submit a Tool**: Go to `/add-tool` and submit
2. **Check Admin**: Go to `/admin` to see submissions
3. **Approve Tools**: Click approve to make them public
4. **View Database**: Check Supabase dashboard → Table Editor

## API Functions Available

- `submitTool(formData)` - Submit new tool
- `getAllSubmittedTools()` - Get all tools (admin)
- `getApprovedTools()` - Get public tools
- `approveTool(id)` - Approve tool (admin)
- `rejectTool(id)` - Reject tool (admin)
- `searchTools(query)` - Search tools
- `getToolsByCategory(category)` - Filter by category

## Cost Breakdown

**Supabase Free Tier:**
- 50,000 monthly active users
- 500MB database storage  
- 1GB file storage
- 2GB bandwidth
- Authentication included

**Perfect for MVP and early growth!**

## Remote SQL Execution (Claude Code Compatible!)

You can now execute SQL remotely using multiple methods:

### Method 1: Built-in SQL Utilities (Recommended)
```bash
# Database statistics
npm run db:stats

# Create backup
npm run db:backup

# Find duplicates
npm run db:duplicates

# Count pending submissions
npm run db:pending
```

### Method 2: Supabase CLI
```bash
# Install and authenticate
supabase login

# Link project
supabase link --project-ref wqpanstubmsmvenjtosf

# Execute SQL (requires authentication)
supabase db query "SELECT COUNT(*) FROM tools;"
```

### Method 3: Direct Node.js Scripts
Create custom scripts in `/scripts/` directory using the Supabase client.

### Method 4: Supabase Dashboard
- SQL Editor: https://supabase.com/dashboard/project/wqpanstubmsmvenjtosf/sql
- Table Editor: https://supabase.com/dashboard/project/wqpanstubmsmvenjtosf/editor

## Database Management Commands

```bash
# Monitor database health
npm run db:stats

# Regular backups
npm run db:backup

# Data quality checks
npm run db:duplicates

# Admin workflow
npm run db:pending
```

## Next Steps

- [ ] Add authentication for admin panel
- [ ] Connect explore page to real data  
- [ ] Add tool rating/review system
- [ ] Set up email notifications
- [ ] Add search functionality
- [ ] Scheduled backups with GitHub Actions

## Deployment

Works with current Vercel setup - just add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`