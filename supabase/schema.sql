-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Materials Categories Table
CREATE TABLE materials_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_hazardous BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_materials_categories_hazardous ON materials_categories(is_hazardous);
CREATE INDEX idx_materials_categories_name_en ON materials_categories(name_en);

-- Price History Table
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES materials_categories(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL,
  avg_price_per_kg NUMERIC(10,2) NOT NULL,
  high_price_per_kg NUMERIC(10,2) NOT NULL,
  low_price_per_kg NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_price_history_category ON price_history(category_id);
CREATE INDEX idx_price_history_recorded_date ON price_history(recorded_date);
CREATE INDEX idx_price_history_category_date ON price_history(category_id, recorded_date);

-- Recyclers Table
CREATE TABLE recyclers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  gst_number TEXT UNIQUE NOT NULL,
  cpcb_id TEXT UNIQUE NOT NULL,
  contact_phone TEXT,
  location_name TEXT NOT NULL,
  distance_km NUMERIC(5,2) DEFAULT 3.5,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_recyclers_gst_number ON recyclers(gst_number);
CREATE INDEX idx_recyclers_cpcb_id ON recyclers(cpcb_id);
CREATE INDEX idx_recyclers_is_verified ON recyclers(is_verified);
CREATE INDEX idx_recyclers_location ON recyclers(location_name);

-- Collector Profiles Table
CREATE TABLE collector_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT 'Saathi Collector',
  trust_score INTEGER DEFAULT 650,
  total_earnings NUMERIC(12,2) DEFAULT 0.00,
  weight_accuracy_pct NUMERIC(5,2) DEFAULT 95.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_collector_profiles_phone ON collector_profiles(phone);
CREATE INDEX idx_collector_profiles_trust_score ON collector_profiles(trust_score);

-- Lots Table
CREATE TABLE lots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collector_id UUID NOT NULL REFERENCES collector_profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES materials_categories(id) ON DELETE RESTRICT,
  ocr_weight_kg NUMERIC(8,2),
  manual_weight_kg NUMERIC(8,2),
  image_url TEXT,
  is_hazardous BOOLEAN DEFAULT false,
  hazard_warning TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'analyzed', 'negotiating', 'accepted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_lots_collector_id ON lots(collector_id);
CREATE INDEX idx_lots_category_id ON lots(category_id);
CREATE INDEX idx_lots_status ON lots(status);
CREATE INDEX idx_lots_is_hazardous ON lots(is_hazardous);
CREATE INDEX idx_lots_created_at ON lots(created_at);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE RESTRICT,
  collector_id UUID NOT NULL REFERENCES collector_profiles(id) ON DELETE RESTRICT,
  recycler_id UUID NOT NULL REFERENCES recyclers(id) ON DELETE RESTRICT,
  agreed_price_per_kg NUMERIC(10,2) NOT NULL,
  is_premium_negotiated BOOLEAN DEFAULT false,
  total_amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'pending_handover' CHECK (status IN ('pending_handover', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_transactions_lot_id ON transactions(lot_id);
CREATE INDEX idx_transactions_collector_id ON transactions(collector_id);
CREATE INDEX idx_transactions_recycler_id ON transactions(recycler_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert Material Categories
INSERT INTO materials_categories (id, name_en, name_hi, icon, is_hazardous, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Printed Circuit Boards', 'प्रिंटेड सर्किट बोर्ड', '🖥️', false, 'PCBs from old electronics containing valuable metals'),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Lithium Batteries', 'लिथियम बैटरी', '⚡', true, 'Rechargeable lithium batteries - HAZARDOUS MATERIAL'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Copper Cables', 'तांबे के तार', '🔌', false, 'Copper wires and cables from various electronics'),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'CRT Monitors', 'सीआरटी स्क्रीन', '📺', true, 'Cathode Ray Tube screens - HAZARDOUS MATERIAL');

-- Insert 30 days of Price History for PCBs (₹280-₹350/kg)
INSERT INTO price_history (category_id, recorded_date, avg_price_per_kg, high_price_per_kg, low_price_per_kg)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  CURRENT_DATE - (30 - ROW_NUMBER() OVER ()),
  ROUND((280 + (RANDOM() * 70))::numeric, 2),
  ROUND((290 + (RANDOM() * 80))::numeric, 2),
  ROUND((270 + (RANDOM() * 60))::numeric, 2)
FROM generate_series(1, 30);

-- Insert 30 days of Price History for Lithium Batteries (₹120-₹170/kg)
INSERT INTO price_history (category_id, recorded_date, avg_price_per_kg, high_price_per_kg, low_price_per_kg)
SELECT 
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  CURRENT_DATE - (30 - ROW_NUMBER() OVER ()),
  ROUND((120 + (RANDOM() * 50))::numeric, 2),
  ROUND((130 + (RANDOM() * 60))::numeric, 2),
  ROUND((110 + (RANDOM() * 40))::numeric, 2)
FROM generate_series(1, 30);

-- Insert 30 days of Price History for Copper Cables (₹400-₹480/kg)
INSERT INTO price_history (category_id, recorded_date, avg_price_per_kg, high_price_per_kg, low_price_per_kg)
SELECT 
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  CURRENT_DATE - (30 - ROW_NUMBER() OVER ()),
  ROUND((400 + (RANDOM() * 80))::numeric, 2),
  ROUND((420 + (RANDOM() * 100))::numeric, 2),
  ROUND((380 + (RANDOM() * 60))::numeric, 2)
FROM generate_series(1, 30);

-- Insert 30 days of Price History for CRT Monitors (₹30-₹50/kg)
INSERT INTO price_history (category_id, recorded_date, avg_price_per_kg, high_price_per_kg, low_price_per_kg)
SELECT 
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  CURRENT_DATE - (30 - ROW_NUMBER() OVER ()),
  ROUND((30 + (RANDOM() * 20))::numeric, 2),
  ROUND((35 + (RANDOM() * 25))::numeric, 2),
  ROUND((25 + (RANDOM() * 15))::numeric, 2)
FROM generate_series(1, 30);

-- Insert Authorized Recyclers
INSERT INTO recyclers (id, business_name, gst_number, cpcb_id, contact_phone, location_name, distance_km, is_verified) VALUES
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, 'EcoRecycle Solutions Delhi', '07AACFY8976B1Z5', 'CPCB/REG/2024/001234', '+91-11-45678901', 'New Delhi, DL', 12.5, true),
  ('650e8400-e29b-41d4-a716-446655440002'::uuid, 'GreenIndia E-Waste Aggregators', '29AAFFD5055K1ZX', 'CPCB/REG/2024/001235', '+91-22-98765432', 'Mumbai, MH', 18.3, true),
  ('650e8400-e29b-41d4-a716-446655440003'::uuid, 'Bharat Recycling Hub', '12ABCDE1234F1Z0', 'CPCB/REG/2024/001236', '+91-80-12345678', 'Bangalore, KA', 22.7, true);

-- Insert Mock Collector Profile
INSERT INTO collector_profiles (id, phone, name, trust_score, total_earnings, weight_accuracy_pct) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '+91-9876543210', 'Amit Kumar', 780, 45000.00, 96.50);
