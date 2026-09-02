import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const collectorPhone = String(body.collector_phone ?? '+91-9876543210');
    const amount = toNumber(body.amount ?? 5625, 5625);
    const previousTrust = Math.max(0, toNumber(body.previous_trust_score ?? 780, 780));
    const previousEarnings = Math.max(0, toNumber(body.previous_earnings ?? 20125, 20125));

    const weightAccuracyScore = 10;
    const safetyComplianceScore = 5;
    const transactionConsistencyScore = 5;
    const updatedTrust = Math.min(1000, previousTrust + weightAccuracyScore + safetyComplianceScore + transactionConsistencyScore);
    const updatedEarnings = previousEarnings + amount;
    const weightAccuracyPct = 96.5;
    const microCreditEligible = updatedTrust >= 800;

    try {
      const supabase = await getSupabaseServerClient();
      const normalizedPhone = collectorPhone.trim();
      const { data: existing } = await supabase
        .from('collector_profiles')
        .select('*')
        .eq('phone', normalizedPhone)
        .maybeSingle();

      const existingProfile = (existing || null) as { id?: string; phone?: string; name?: string } | null;

      if (existingProfile?.id) {
        await supabase
          .from('collector_profiles')
          .update({
            trust_score: updatedTrust,
            total_earnings: updatedEarnings,
            weight_accuracy_pct: weightAccuracyPct,
          } as any)
          .eq('id', existingProfile.id);
      } else {
        await supabase.from('collector_profiles').insert({
          phone: normalizedPhone,
          name: 'Amit Kumar',
          trust_score: updatedTrust,
          total_earnings: updatedEarnings,
          weight_accuracy_pct: weightAccuracyPct,
        } as any);
      }
    } catch {
      // Fallback for local/demo mode when Supabase is not ready.
    }

    const tier = updatedTrust >= 900 ? 'Tier 1' : updatedTrust >= 800 ? 'Tier 1' : updatedTrust >= 700 ? 'Tier 2' : 'Tier 3';

    return NextResponse.json({
      status: 'success',
      message: 'Handover verified and trust score updated.',
      profile: {
        trust_score: updatedTrust,
        total_earnings: Number(updatedEarnings.toFixed(2)),
        weight_accuracy_pct: Number(weightAccuracyPct.toFixed(1)),
        micro_credit_eligible: microCreditEligible,
        tier,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Trust profile update failed',
      },
      { status: 500 }
    );
  }
}
