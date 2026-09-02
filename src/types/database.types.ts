/**
 * Database Types for E-Scrap-Saathi
 * Auto-generated from Supabase schema
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ============================================================================
// MATERIALS CATEGORIES
// ============================================================================

export interface MaterialsCategory {
  id: string;
  name_en: string;
  name_hi: string;
  icon: string;
  is_hazardous: boolean;
  description: string | null;
  created_at: string;
}

export type MaterialsCategoryInsert = Omit<MaterialsCategory, 'id' | 'created_at'>;
export type MaterialsCategoryUpdate = Partial<MaterialsCategoryInsert>;

// ============================================================================
// PRICE HISTORY
// ============================================================================

export interface PriceHistory {
  id: string;
  category_id: string;
  recorded_date: string;
  avg_price_per_kg: string; // NUMERIC stored as string to preserve precision
  high_price_per_kg: string;
  low_price_per_kg: string;
  created_at: string;
}

export type PriceHistoryInsert = Omit<PriceHistory, 'id' | 'created_at'>;
export type PriceHistoryUpdate = Partial<PriceHistoryInsert>;

// ============================================================================
// RECYCLERS
// ============================================================================

export interface Recycler {
  id: string;
  business_name: string;
  gst_number: string;
  cpcb_id: string;
  contact_phone: string | null;
  location_name: string;
  distance_km: string; // NUMERIC stored as string
  is_verified: boolean;
  created_at: string;
}

export type RecyclerInsert = Omit<Recycler, 'id' | 'created_at'>;
export type RecyclerUpdate = Partial<RecyclerInsert>;

// ============================================================================
// COLLECTOR PROFILES
// ============================================================================

export interface CollectorProfile {
  id: string;
  phone: string;
  name: string;
  trust_score: number;
  total_earnings: string; // NUMERIC stored as string
  weight_accuracy_pct: string; // NUMERIC stored as string
  created_at: string;
}

export type CollectorProfileInsert = Omit<CollectorProfile, 'id' | 'created_at'>;
export type CollectorProfileUpdate = Partial<CollectorProfileInsert>;

// ============================================================================
// LOTS
// ============================================================================

export type LotStatus = 'draft' | 'analyzed' | 'negotiating' | 'accepted' | 'completed';

export interface Lot {
  id: string;
  collector_id: string;
  category_id: string;
  ocr_weight_kg: string | null; // NUMERIC stored as string
  manual_weight_kg: string | null;
  image_url: string | null;
  is_hazardous: boolean;
  hazard_warning: string | null;
  status: LotStatus;
  created_at: string;
}

export type LotInsert = Omit<Lot, 'id' | 'created_at'>;
export type LotUpdate = Partial<LotInsert>;

// ============================================================================
// TRANSACTIONS
// ============================================================================

export type TransactionStatus = 'pending_handover' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  lot_id: string;
  collector_id: string;
  recycler_id: string;
  agreed_price_per_kg: string; // NUMERIC stored as string
  is_premium_negotiated: boolean;
  total_amount: string; // NUMERIC stored as string
  status: TransactionStatus;
  created_at: string;
}

export type TransactionInsert = Omit<Transaction, 'id' | 'created_at'>;
export type TransactionUpdate = Partial<TransactionInsert>;

// ============================================================================
// JOINED TYPES (WITH RELATIONS)
// ============================================================================

export interface LotWithRelations extends Lot {
  materials_categories?: MaterialsCategory;
  collector_profiles?: CollectorProfile;
}

export interface TransactionWithRelations extends Transaction {
  lots?: Lot;
  collector_profiles?: CollectorProfile;
  recyclers?: Recycler;
}

export interface PriceHistoryWithCategory extends PriceHistory {
  materials_categories?: MaterialsCategory;
}

// ============================================================================
// DATABASE SCHEMA TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      materials_categories: {
        Row: MaterialsCategory;
        Insert: MaterialsCategoryInsert;
        Update: MaterialsCategoryUpdate;
        Relationships: [];
      };
      price_history: {
        Row: PriceHistory;
        Insert: PriceHistoryInsert;
        Update: PriceHistoryUpdate;
        Relationships: [];
      };
      recyclers: {
        Row: Recycler;
        Insert: RecyclerInsert;
        Update: RecyclerUpdate;
        Relationships: [];
      };
      collector_profiles: {
        Row: CollectorProfile;
        Insert: CollectorProfileInsert;
        Update: CollectorProfileUpdate;
        Relationships: [];
      };
      lots: {
        Row: Lot;
        Insert: LotInsert;
        Update: LotUpdate;
        Relationships: [];
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
