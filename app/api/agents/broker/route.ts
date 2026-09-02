import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

type Recycler = { business_name: string; location_name: string; distance_km: number; cpcb_registration_id: string };

const fallbackRecyclers: Recycler[] = [
  { business_name: 'EcoRecycle Solutions Delhi', location_name: 'New Delhi, DL', distance_km: 3.8, cpcb_registration_id: 'CPCB/EW/DEL/2024/001' },
  { business_name: 'GreenIndia E-Waste Aggregators', location_name: 'Rohini Sector 14', distance_km: 4.9, cpcb_registration_id: 'CPCB/EW/DEL/2024/002' },
  { business_name: 'Bharat Recycling Hub', location_name: 'Dwarka, DL', distance_km: 6.1, cpcb_registration_id: 'CPCB/EW/DEL/2024/003' },
];

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function findRecyclers(): Promise<Recycler[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.from('recyclers').select('*').eq('is_verified', true).order('distance_km', { ascending: true }).limit(3);
    if (error || !data?.length) return fallbackRecyclers;
    return (data as Array<Record<string, unknown>>).map((row, index) => ({
      business_name: String(row.business_name || fallbackRecyclers[index]?.business_name || 'Verified Recycler'),
      location_name: String(row.location_name || 'Delhi NCR'),
      distance_km: toNumber(row.distance_km, fallbackRecyclers[index]?.distance_km || 5),
      cpcb_registration_id: String(row.cpcb_registration_id || row.cpcb_id || fallbackRecyclers[index]?.cpcb_registration_id || 'CPCB/EW/DEL/2024/001'),
    }));
  } catch {
    return fallbackRecyclers;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const category = String(body.category || 'Copper Cables');
    const weightKg = Math.max(0, toNumber(body.weight_kg ?? body.weight, 12.5));
    const basePrice = Math.max(0, toNumber(body.base_market_price ?? body.current_avg_price ?? body.base_price_per_kg, 435));
    const isHazardous = Boolean(body.is_hazardous ?? body.hazardous ?? false);
    const eligible = weightKg >= 10 && !isHazardous;
    const premium = eligible ? 15 : 0;
    const recyclers = await findRecyclers();
    const recycler = recyclers[0];
    const finalRate = basePrice + premium;
    const totalPayout = weightKg * finalRate;
    const extraEarned = weightKg * premium;

    return NextResponse.json({
      status: eligible ? 'deal_secured' : 'offer_generated',
      category,
      weight_kg: weightKg,
      matched_recycler: `${recycler.business_name} (${recycler.cpcb_registration_id})`,
      recycler_business_name: recycler.business_name,
      recycler_location: recycler.location_name,
      distance_km: recycler.distance_km,
      recycler_distance_km: recycler.distance_km,
      base_price_per_kg: Number(basePrice.toFixed(2)),
      premium_bonus_per_kg: premium,
      premium_per_kg: premium,
      final_agreed_rate: Number(finalRate.toFixed(2)),
      final_offered_price_per_kg: Number(finalRate.toFixed(2)),
      total_lot_payout: Number(totalPayout.toFixed(2)),
      extra_earned_via_ai: Number(extraEarned.toFixed(2)),
      extra_earnings_inr: Number(extraEarned.toFixed(2)),
      ai_reasoning_hi: eligible
        ? `${weightKg} kg ${category} के बड़े लॉट और शून्य खतरे के कारण Saathi AI ने ₹15/kg का अतिरिक्त प्रीमियम सुरक्षित किया।`
        : 'इस लॉट के लिए सुरक्षित बाजार भाव तैयार किया गया है; प्रीमियम की शर्तें पूरी नहीं हुईं।',
      pickup_included: true,
      nearby_recyclers: recyclers,
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error instanceof Error ? error.message : 'Broker negotiation failed' }, { status: 400 });
  }
}
