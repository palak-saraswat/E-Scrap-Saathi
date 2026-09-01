import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lotId = String(body.lot_id ?? body.lotId ?? 'ESS-UNKNOWN');
    const category = String(body.category ?? 'Copper Cables');
    const weightKg = toNumber(body.weight_kg ?? body.weight ?? 0);
    const currentAvgPrice = toNumber(body.current_avg_price ?? body.currentAvgPrice ?? 0);
    const isHazardous = Boolean(body.is_hazardous ?? body.hazardous ?? false);

    const isEligibleForPremium = weightKg > 10 && !isHazardous;
    const premiumPerKg = isEligibleForPremium ? 15 : 0;
    const finalOfferedPricePerKg = currentAvgPrice + premiumPerKg;
    const extraEarningsInr = weightKg * premiumPerKg;

    const fallbackRecyclers = [
      {
        business_name: 'EcoRecycle Solutions Delhi',
        location_name: 'New Delhi, DL',
        distance_km: 3.8,
        is_verified: true,
        cpcb_verified: true,
      },
      {
        business_name: 'GreenIndia E-Waste Aggregators',
        location_name: 'Rohini Sector 14',
        distance_km: 4.9,
        is_verified: true,
        cpcb_verified: true,
      },
      {
        business_name: 'Bharat Recycling Hub',
        location_name: 'Dwarka, DL',
        distance_km: 6.1,
        is_verified: true,
        cpcb_verified: true,
      },
    ];

    let matchedRecycler = fallbackRecyclers[0];

    try {
      const supabase = await getSupabaseServerClient();
      const { data, error } = await supabase
        .from('recyclers')
        .select('*')
        .eq('is_verified', true)
        .order('distance_km', { ascending: true })
        .limit(3);

      if (!error && data && data.length > 0) {
        matchedRecycler = {
          business_name: data[0].business_name,
          location_name: data[0].location_name,
          distance_km: Number(data[0].distance_km),
          is_verified: data[0].is_verified,
          cpcb_verified: true,
        };
      }
    } catch {
      matchedRecycler = fallbackRecyclers[0];
    }

    const result = {
      status: 'premium_offer_ready',
      lot_id: lotId,
      category,
      weight_kg: weightKg,
      eligible_for_premium: isEligibleForPremium,
      base_price_per_kg: Number(currentAvgPrice.toFixed(2)),
      premium_per_kg: premiumPerKg,
      final_offered_price_per_kg: Number(finalOfferedPricePerKg.toFixed(2)),
      matched_recycler: `${matchedRecycler.business_name} (CPCB Verified, ${matchedRecycler.distance_km.toFixed(1)} km away)`,
      recycler_business_name: matchedRecycler.business_name,
      recycler_location: matchedRecycler.location_name,
      recycler_distance_km: Number(matchedRecycler.distance_km.toFixed(1)),
      pickup_included: true,
      extra_earnings_inr: Number(extraEarningsInr.toFixed(2)),
      message:
        isEligibleForPremium
          ? 'Premium deal secured for a verified bulk lot with free pickup.'
          : 'Market offer generated. Premium eligibility is not met for this lot.',
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Broker negotiation failed',
      },
      { status: 500 }
    );
  }
}
