import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const currentScore = Math.min(1000, Math.max(0, toNumber(body.current_score ?? body.previous_trust_score, 780)));
    const weightVerified = Boolean(body.weight_verified ?? true);
    const cleanHandover = Boolean(body.is_clean_handover ?? !(body.is_hazardous ?? false));
    const updatedScore = Math.min(1000, currentScore + (weightVerified ? 15 : 0) + (cleanHandover ? 10 : 0));
    const amount = Math.max(0, toNumber(body.amount, 0));
    const previousEarnings = Math.max(0, toNumber(body.previous_earnings, 0));
    const tier = updatedScore >= 800 ? 'Tier 1 (Micro-Credit Eligible)' : updatedScore >= 700 ? 'Tier 2' : 'Tier 3';
    const profile = {
      trust_score: updatedScore,
      total_earnings: Number((previousEarnings + amount).toFixed(2)),
      tier,
      loan_limit: updatedScore >= 800 ? '₹25,000 for E-Rickshaw / Safety Gear' : 'Build more verified handovers to unlock micro-credit',
      weight_verified: weightVerified,
      is_clean_handover: cleanHandover,
    };

    try {
      const supabase = await getSupabaseServerClient();
      const phone = String(body.collector_phone || '+91-9876543210');
      const { data: existing } = await supabase.from('collector_profiles').select('id').eq('phone', phone).maybeSingle();
      const payload = { trust_score: updatedScore, total_earnings: previousEarnings + amount, weight_accuracy_pct: weightVerified ? 100 : 0 };
      if (existing && typeof existing === 'object' && 'id' in existing) await supabase.from('collector_profiles').update(payload as never).eq('id', String(existing.id));
      else await supabase.from('collector_profiles').insert({ phone, name: 'Saathi Collector', ...payload } as never);
    } catch {
      // Demo mode remains usable when Supabase is not configured.
    }

    return NextResponse.json({ status: 'success', message: 'Handover verified and trust score updated.', profile });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error instanceof Error ? error.message : 'Trust evaluation failed' }, { status: 400 });
  }
}
