/**
 * Database Query Utilities
 * Convenience functions for common Supabase operations
 */

import { getSupabaseServerClient } from './server';
import type {
  MaterialsCategory,
  PriceHistory,
  Recycler,
  CollectorProfile,
  Lot,
  Transaction,
  PriceHistoryWithCategory,
  LotWithRelations,
  TransactionWithRelations,
} from '@/types/database.types';

export async function getAllMaterials() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('materials_categories').select('*').order('name_en', { ascending: true });
  if (error) throw new Error(`Failed to fetch materials: ${error.message}`);
  return (data ?? []) as MaterialsCategory[];
}

export async function getHazardousMaterials() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('materials_categories').select('*').eq('is_hazardous', true);
  if (error) throw new Error(`Failed to fetch hazardous materials: ${error.message}`);
  return (data ?? []) as MaterialsCategory[];
}

export async function getMaterialById(id: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('materials_categories').select('*').eq('id', id).single();
  if (error) throw new Error(`Failed to fetch material: ${error.message}`);
  return data as MaterialsCategory;
}

export async function getPriceHistoryForCategory(categoryId: string, days = 30) {
  const supabase = await getSupabaseServerClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('price_history')
    .select('*, materials_categories(*)')
    .eq('category_id', categoryId)
    .gte('recorded_date', startDate.toISOString().split('T')[0])
    .order('recorded_date', { ascending: true });

  if (error) throw new Error(`Failed to fetch price history: ${error.message}`);
  return (data ?? []) as PriceHistoryWithCategory[];
}

export async function getLatestPrices() {
  const supabase = await getSupabaseServerClient();
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('price_history').select('*, materials_categories(*)').eq('recorded_date', today);
  if (error) throw new Error(`Failed to fetch latest prices: ${error.message}`);
  return (data ?? []) as PriceHistoryWithCategory[];
}

export async function getAveragePriceForCategory(categoryId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('price_history')
    .select('avg_price_per_kg')
    .eq('category_id', categoryId)
    .order('recorded_date', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return Number(data?.avg_price_per_kg ?? 0) || null;
}

export async function getVerifiedRecyclers() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('recyclers').select('*').eq('is_verified', true).order('distance_km', { ascending: true });
  if (error) throw new Error(`Failed to fetch recyclers: ${error.message}`);
  return (data ?? []) as Recycler[];
}

export async function getRecyclerById(id: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('recyclers').select('*').eq('id', id).single();
  if (error) throw new Error(`Failed to fetch recycler: ${error.message}`);
  return data as Recycler;
}

export async function getRecyclersByLocation(locationName: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('recyclers').select('*').ilike('location_name', `%${locationName}%`).eq('is_verified', true);
  if (error) throw new Error(`Failed to fetch recyclers by location: ${error.message}`);
  return (data ?? []) as Recycler[];
}

export async function getCollectorByPhone(phone: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('collector_profiles').select('*').eq('phone', phone).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch collector: ${error.message}`);
  }
  return data as CollectorProfile;
}

export async function createCollectorProfile(phone: string, name?: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('collector_profiles').insert([{ phone, name: name || 'Saathi Collector' }]).select().single();
  if (error) throw new Error(`Failed to create collector: ${error.message}`);
  return data as CollectorProfile;
}

export async function updateCollectorProfile(id: string, updates: Partial<CollectorProfile>) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('collector_profiles').update(updates).eq('id', id).select().single();
  if (error) throw new Error(`Failed to update collector: ${error.message}`);
  return data as CollectorProfile;
}

export async function createLot(lot: Partial<Lot>) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('lots').insert([lot]).select('*, materials_categories(*), collector_profiles(*)').single();
  if (error) throw new Error(`Failed to create lot: ${error.message}`);
  return data as LotWithRelations;
}

export async function getLotsByCollector(collectorId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('lots').select('*, materials_categories(*), collector_profiles(*)').eq('collector_id', collectorId).order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch lots: ${error.message}`);
  return (data ?? []) as LotWithRelations[];
}

export async function getAllTransactions() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('transactions').select('*, lots(*), recyclers(*)').order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
  return (data ?? []) as TransactionWithRelations[];
}

export async function getTransactionById(id: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('transactions').select('*, lots(*), recyclers(*)').eq('id', id).single();
  if (error) throw new Error(`Failed to fetch transaction: ${error.message}`);
  return data as TransactionWithRelations;
}

export async function createTransaction(transaction: Partial<Transaction>) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('transactions').insert([transaction]).select('*, lots(*), recyclers(*)').single();
  if (error) throw new Error(`Failed to create transaction: ${error.message}`);
  return data as TransactionWithRelations;
}
