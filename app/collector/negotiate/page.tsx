'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, MapPinned, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const tickerMessages = [
  'Comparing bids...',
  'Checking CPCB compliance...',
  'Negotiating bulk premium...',
  'Locking verified recycler pickup...',
];

function CollectorNegotiatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNegotiating, setIsNegotiating] = useState(true);
  const [tickerIndex, setTickerIndex] = useState(0);

  const category = searchParams.get('category') ?? 'cables';
  const weight = Number(searchParams.get('weight') ?? '12.5') || 12.5;
  const value = Number(searchParams.get('value') ?? '5437.5') || 5437.5;
  const categoryLabel = category === 'cables' ? 'Copper Cables' : category === 'pcbs' ? 'PCB Boards' : category === 'batteries' ? 'Lithium Batteries' : 'CRT Monitors';

  useEffect(() => {
    const timer = setTimeout(() => setIsNegotiating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pricePerKg = useMemo(() => {
    if (value <= 0 || weight <= 0) return 435;
    return value / weight;
  }, [value, weight]);

  const baseRate = 435;
  const premiumPerKg = 15;
  const finalRate = baseRate + premiumPerKg;
  const totalPayout = weight * finalRate;
  const extraEarnings = totalPayout - weight * baseRate;

  const handleAcceptDeal = () => {
    router.push(`/collector/handover?lot_id=ESS-92841&recycler_id=rec_eco_delhi&amount=${totalPayout.toFixed(2)}`);
  };

  return (
    <main className="mx-auto max-w-md min-h-screen bg-zinc-50 p-4 pb-24">
      <div className="space-y-4 pt-4">
        {isNegotiating ? (
          <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                  🤖 साथी ब्रोकर बातचीत कर रहा है...
                </Badge>
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                  <div className="absolute inset-1 rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <Sparkles className="h-4 w-4" />
                  Saathi Broker Negotiating {categoryLabel} with 3 Nearby Recyclers
                </div>
                <div className="space-y-2 text-sm text-zinc-700">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {tickerMessages[tickerIndex]}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-zinc-300" />
                    Matching CPCB-compliant buyers
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-zinc-300" />
                    Calculating premium bulk offer
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-500 text-white shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                  <Sparkles className="h-4 w-4" />
                  🎉 विशेष प्रीमियम ऑफर तैयार है! (Special Premium Deal Secured!)
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Matched Recycler</p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-900">EcoRecycle Solutions Delhi</h2>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    ✓ Premium Match
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    CPCB Verified Facility
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    <MapPinned className="mr-1 h-3.5 w-3.5" />
                    3.8 km away
                  </Badge>
                  <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">
                    <Truck className="mr-1 h-3.5 w-3.5" />
                    Free Pickup Available
                  </Badge>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="space-y-3 text-sm text-zinc-700">
                    <div className="flex items-center justify-between">
                      <span>Base Market Rate</span>
                      <span className="font-semibold text-zinc-900">₹{baseRate.toFixed(2)} / kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>⚡️ Saathi Premium Bonus</span>
                      <span className="font-semibold text-emerald-700">+₹{premiumPerKg.toFixed(2)} / kg</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-emerald-200 pt-2">
                      <span className="font-bold text-zinc-900">Final Negotiated Rate</span>
                      <span className="text-lg font-black text-emerald-700">₹{finalRate.toFixed(2)} / kg</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-600">
                      <span>Market benchmark</span>
                      <span>₹{pricePerKg.toFixed(2)} / kg</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-emerald-200 pt-2">
                      <span>Total Payout for Lot ({weight.toFixed(1)} kg)</span>
                      <span className="text-lg font-black text-zinc-900">₹{totalPayout.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  ✨ AI साथी ने आपके लिए ₹{extraEarnings.toFixed(2)} अतिरिक्त कमाए! (Extra earnings negotiated)
                </div>

                <div className="space-y-3 pt-1">
                  <Button
                    size="lg"
                    className="h-12 w-full bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800"
                    onClick={handleAcceptDeal}
                  >
                    डील स्वीकार करें (Accept Offer & Confirm Handover)
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button variant="outline" className="h-12 w-full border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50">
                    अन्य खरीदार देखें (View Other Quotes)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

export default function CollectorNegotiatePage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md min-h-screen bg-zinc-50 p-4 pb-24" /> }>
      <CollectorNegotiatePageContent />
    </Suspense>
  );
}
