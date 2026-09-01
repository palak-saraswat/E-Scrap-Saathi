# Supabase Setup Guide for E-Scrap-Saathi

## Overview
This document outlines the complete Supabase data architecture setup for the E-Scrap-Saathi platform, including database schema, seed data, TypeScript types, and client utilities.

## Files Created

### 1. **Database Schema** (`supabase/schema.sql`)
Contains:
- 6 PostgreSQL tables with proper PKs, FKs, timestamps, and indexes
- Comprehensive seed data (categories, price history, recyclers, collectors)
- 30 days of realistic price fluctuation for each material category

**Tables:**
- `materials_categories`: Types of e-waste materials (PCBs, Batteries, Copper, CRT)
- `price_history`: Daily price tracking for market rates
- `recyclers`: Authorized recycling facilities with GST/CPCB verification
- `collector_profiles`: Informal e-waste collector profiles with trust scores
- `lots`: Individual e-waste collection batches with OCR/manual weight
- `transactions`: Sale transactions between collectors and recyclers

### 2. **TypeScript Types** (`src/types/database.types.ts`)
Strong typing for all database tables:
- Base types (e.g., `Lot`, `Transaction`, `CollectorProfile`)
- Insert and Update types for mutations
- Relation types (e.g., `LotWithRelations`, `TransactionWithRelations`)
- Full `Database` interface for Supabase client integration

### 3. **Supabase Client** (`src/lib/supabase/client.ts`)
Browser client for Client Components:
- Uses `@supabase/ssr` for proper cookie handling
- Singleton pattern to avoid multiple instances
- Fully typed with `Database` interface
- Ready for real-time subscriptions and client-side mutations

### 4. **Supabase Server** (`src/lib/supabase/server.ts`)
Server client for Server Actions and Route Handlers:
- Uses `@supabase/ssr` with Next.js `cookies()` API
- Handles cookie serialization automatically
- Safe for server-side operations (auth, admin operations)
- Fully typed with `Database` interface

### 5. **Environment Configuration** (`.env.example`)
Template for required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
```

## Setup Steps

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `Project URL` and `Anon Key` from Settings > API

### Step 2: Apply Database Schema
1. Go to Supabase Dashboard > SQL Editor
2. Create a new query and copy the entire contents of `supabase/schema.sql`
3. Run the SQL to create all tables and seed data

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in the actual values from your Supabase project
3. Optionally add `GEMINI_API_KEY` from Google AI Studio

### Step 4: Verify Setup
Test the connection with this quick verification script:
```bash
# From project root
npm run dev
# The app should start without database connection errors
```

## Seed Data Overview

### Materials Categories (4)
1. **PCBs** (प्रिंटेड सर्किट बोर्ड)
   - Price range: ₹280-₹350/kg
   - Non-hazardous
   
2. **Lithium Batteries** (लिथियम बैटरी)
   - Price range: ₹120-₹170/kg
   - Hazardous material ⚠️
   
3. **Copper Cables** (तांबे के तार)
   - Price range: ₹400-₹480/kg
   - Non-hazardous
   
4. **CRT Monitors** (सीआरटी स्क्रीन)
   - Price range: ₹30-₹50/kg
   - Hazardous material ⚠️

### Price History
- 30 consecutive days of data for each category
- Realistic market fluctuations using randomized ranges
- Perfect for Recharts demo graphs

### Recyclers (3)
1. **EcoRecycle Solutions Delhi**
   - GST: 07AACFY8976B1Z5
   - CPCB ID: CPCB/REG/2024/001234
   - Distance: 12.5 km

2. **GreenIndia E-Waste Aggregators**
   - GST: 29AAFFD5055K1ZX
   - CPCB ID: CPCB/REG/2024/001235
   - Distance: 18.3 km

3. **Bharat Recycling Hub**
   - GST: 12ABCDE1234F1Z0
   - CPCB ID: CPCB/REG/2024/001236
   - Distance: 22.7 km

### Mock Collector
- **Name:** Amit Kumar
- **Phone:** +91-9876543210
- **Trust Score:** 780/1000
- **Total Earnings:** ₹45,000
- **Weight Accuracy:** 96.5%

## Usage Examples

### Server Action (Get Materials)
```typescript
// app/actions/materials.ts
'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function getMaterialsCategories() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('materials_categories')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

### Client Component (Real-time Price)
```typescript
'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { PriceHistory } from '@/types/database.types';

export function PriceGraph() {
  const [prices, setPrices] = useState<PriceHistory[]>([]);
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Fetch initial data
    supabase
      .from('price_history')
      .select('*')
      .order('recorded_date', { ascending: false })
      .limit(30)
      .then(({ data }) => setPrices(data || []));

    // Subscribe to changes
    const subscription = supabase
      .from('price_history')
      .on('*', (payload) => {
        // Update prices in real-time
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    // Render with prices data
    <div>{prices.length} records loaded</div>
  );
}
```

### Route Handler
```typescript
// app/api/recyclers/route.ts
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await getSupabaseServerClient();
  
  const { data: recyclers, error } = await supabase
    .from('recyclers')
    .select('*')
    .eq('is_verified', true);

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ recyclers });
}
```

## Key Features of This Setup

✅ **Fully Typed:** All tables have TypeScript interfaces  
✅ **Optimized Queries:** Indexes on frequently queried columns  
✅ **Referential Integrity:** Foreign keys with cascade/restrict policies  
✅ **Status Enums:** Check constraints for status fields  
✅ **Timestamp Tracking:** `created_at` on all tables  
✅ **Realistic Seed Data:** 30 days of price history for demo  
✅ **Mobile-Ready:** Structure supports both collector and recycler roles  
✅ **Production-Ready:** Follows PostgreSQL best practices  

## Important Notes

- **Do NOT commit `.env.local`** to git (add to .gitignore)
- **Seed data uses UUIDs** for relational consistency
- **Price history is randomized** - run `supabase.auth.refresh()` to get latest real-time data
- **CPCB/GST numbers are mock** - replace with real data for production
- **Hazardous materials** are marked with `is_hazardous = true` for frontend filtering
- **Trust scores** range from 300-1000 (started at 650)

## Next Steps

1. Apply the schema to your Supabase project
2. Implement API routes/Server Actions as needed
3. Create UI components using the types
4. Add authentication (Supabase Auth with OTP)
5. Implement real-time updates with Supabase subscriptions
6. Add AI integration for image analysis and price predictions

---

For questions or issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 15 App Router](https://nextjs.org/docs)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/)
