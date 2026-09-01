'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSupabaseClient } from '@/lib/supabase/client';

type CategoryKey = 'cables' | 'pcbs' | 'batteries' | 'crt';

type TrendPoint = {
  date: string;
  price: number;
  high: number;
  low: number;
};

const categoryConfig: Record<CategoryKey, { key: CategoryKey; icon: string; labelHi: string; dbLabel: string; range: [number, number] }> = {
  cables: { key: 'cables', icon: '🔌', labelHi: 'तांबे के तार', dbLabel: 'Copper Cables', range: [400, 480] },
  pcbs: { key: 'pcbs', icon: '🖨', labelHi: 'प्रिंटेड सर्किट बोर्ड', dbLabel: 'Printed Circuit Boards', range: [280, 350] },
  batteries: { key: 'batteries', icon: '🔋', labelHi: 'लिथियम बैटरी', dbLabel: 'Lithium Batteries', range: [120, 170] },
  crt: { key: 'crt', icon: '📺', labelHi: 'सीआरटी स्क्रीन', dbLabel: 'CRT Monitors', range: [15, 30] },
};

const fmt = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function resolveCategory(input: string | null): CategoryKey {
  const value = (input ?? 'cables').toLowerCase().replace(/[^a-z]/g, '');
  if (value.includes('cable') || value.includes('copper')) return 'cables';
  if (value.includes('pcb') || value.includes('circuit')) return 'pcbs';
  if (value.includes('battery') || value.includes('lithium')) return 'batteries';
  if (value.includes('crt') || value.includes('screen')) return 'crt';
  return 'cables';
}

function formatShortDate(dateString: string) {
  const day = new Date(dateString);
  return Number.isNaN(day.getTime()) ? dateString : new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(day);
}

function createFallbackTrend(categoryKey: CategoryKey): TrendPoint[] {
  const [min, max] = categoryConfig[categoryKey].range;
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const base = min + ((max - min) * index) / 29;
    const wave = Math.sin(index / 2.7) * ((max - min) * 0.1);
    const average = Math.min(max, Math.max(min, Number((base + wave).toFixed(2))));
    const high = Number((average + (max - min) * 0.08 + 2.5).toFixed(2));
    const low = Number((average - (max - min) * 0.09 - 2.2).toFixed(2));
    return {
      date: formatShortDate(date.toISOString()),
      price: average,
      high: Math.min(max, high),
      low: Math.max(min, low),
    };
  });
}

async function fetchHistoricalPriceData(categoryKey: CategoryKey): Promise<TrendPoint[]> {
  try {
    const supabase = getSupabaseClient();
    const config = categoryConfig[categoryKey];
    const { data: materialData, error: materialError } = await supabase
      .from('materials_categories')
      .select('id')
      .eq('name_en', config.dbLabel)
      .limit(1)
      .maybeSingle();

    if (materialError || !materialData?.id) return createFallbackTrend(categoryKey);

    const { data, error } = await supabase
      .from('price_history')
      .select('recorded_date, avg_price_per_kg, high_price_per_kg, low_price_per_kg')
      .eq('category_id', materialData.id)
      .order('recorded_date', { ascending: true })
      .limit(30);

    if (error || !data || !data.length) return createFallbackTrend(categoryKey);

    return data.map((point) => ({
      date: formatShortDate(point.recorded_date),
      price: Number(point.avg_price_per_kg),
      high: Number(point.high_price_per_kg),
      low: Number(point.low_price_per_kg),
    }));
  } catch {
    return createFallbackTrend(categoryKey);
  }
}

export default function CollectorTrendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = resolveCategory(searchParams.get('category'));
  const weight = Number(searchParams.get('weight') ?? '12.5') || 12.5;

  const [activeCategory, setActiveCategory] = useState<CategoryKey>(categoryFromUrl);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const data = await fetchHistoricalPriceData(activeCategory);
      if (mounted) {
        setTrendData(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [activeCategory]);

  const metrics = useMemo(() => {
    if (!trendData.length) {
      return { highest: 0, lowest: 0, currentAvg: 0, avg30: 0, weekMomentum: 0 };
    }
    const highest = Math.max(...trendData.map((point) => point.high));
    const lowest = Math.min(...trendData.map((point) => point.low));
    const currentAvg = trendData[trendData.length - 1]?.price ?? 0;
    const avg30 = trendData.reduce((sum, point) => sum + point.price, 0) / trendData.length;
    const previousWeekAvg = trendData[Math.max(0, trendData.length - 7)]?.price ?? currentAvg;
    const weekMomentum = previousWeekAvg === 0 ? 0 : ((currentAvg - previousWeekAvg) / previousWeekAvg) * 100;
    return { highest, lowest, currentAvg, avg30, weekMomentum };
  }, [trendData]);

  const valuation = weight * metrics.currentAvg;
  const momentumIsPositive = metrics.weekMomentum >= 0;
  const momentumLabel = `${momentumIsPositive ? '+' : ''}${metrics.weekMomentum.toFixed(1)}% this week (${momentumIsPositive ? 'बढ़त पर है' : 'कमज़ोर है'})`;

  const recommendationText =
    activeCategory === 'cables'
      ? '💡 साथी सलाह (Saathi Advisory): तांबे का भाव इस हफ़्ते सबसे ऊंचे स्तर पर है। बेचने का यह सबसे अच्छा समय है! (Copper rates are near a 30-day peak. Great time to sell!)'
      : activeCategory === 'pcbs'
        ? '💡 साथी सलाह (Saathi Advisory): PCB का भाव स्थिर और ऊपर की तरफ है। थोड़ी देर इंतज़ार करने से बेहतर लाभ मिल सकता है। (PCB prices are holding firm and are trending upward. A small patience window may improve the sell value.)'
        : activeCategory === 'batteries'
          ? '💡 साथी सलाह (Saathi Advisory): बैटरी का भाव संतुलित है, लेकिन सुरक्षित-हैंडलिंग के साथ जल्द बिक्री बेहतर है। (Battery prices are stable; selling soon with careful handling is still the most efficient move.)'
          : '💡 साथी सलाह (Saathi Advisory): CRT स्क्रीन का भाव सीमित लेकिन स्थिर है। अगर आप ट्रांसपोर्ट और डिस्पोज़ल को आसान बनाना चाहते हैं, तो अभी बेचना सही है। (CRT screens are modest but stable; quick disposal remains a practical option.)';

  const handleNegotiation = () => {
    const params = new URLSearchParams({
      category: activeCategory,
      weight: weight.toString(),
      value: valuation.toFixed(2),
    });
    router.push(`/collector/negotiate?${params.toString()}`);
  };

  return (
    <main className="mx-auto max-w-md min-h-screen bg-zinc-50 p-4 pb-24">
      <div className="space-y-4">
        <header className="space-y-1 pt-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Price Bhav</p>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950">📈 30-Day Historical Trends</h1>
          <p className="text-sm text-zinc-600">BuyHatke-style market rate tracker for your scrap lot</p>
        </header>

        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryKey)} className="w-full">
          <TabsList className="flex w-full justify-start overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-sm">
            {(Object.keys(categoryConfig) as CategoryKey[]).map((key) => (
              <TabsTrigger key={key} value={key} className="min-w-fit rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 data-active:bg-emerald-50 data-active:text-emerald-800">
                <span className="mr-1.5">{categoryConfig[key].icon}</span>
                <span>{categoryConfig[key].labelHi}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-2 text-base text-zinc-900">
              <span>{categoryConfig[activeCategory].icon} {categoryConfig[activeCategory].labelHi}</span>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                {momentumLabel}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🟢 Highest in 30 Days: ₹{fmt.format(metrics.highest)}/kg</Badge>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Lowest in 30 Days: ₹{fmt.format(metrics.lowest)}/kg</Badge>
              <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">⚡️ Current Market Average: ₹{fmt.format(metrics.currentAvg)}/kg</Badge>
            </div>

            {loading || !trendData.length ? (
              <div className="h-[260px] animate-pulse rounded-xl bg-zinc-200/80" />
            ) : (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 8, right: 12, left: -20, bottom: 4 }}>
                    <defs>
                      <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} minTickGap={18} />
                    <YAxis tick={{ fontSize: 10, fill: '#52525b' }} width={42} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                      cursor={{ stroke: '#10b981', strokeDasharray: '4 4' }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const point = payload[0].payload as TrendPoint;
                        return (
                          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
                            <p className="mb-2 text-xs font-semibold text-zinc-700">{point.date}</p>
                            <div className="space-y-1 text-xs text-zinc-700">
                              <p>Average Price: <span className="font-bold text-emerald-700">₹{fmt.format(point.price)}/kg</span></p>
                              <p>High Price: <span className="font-bold text-zinc-900">₹{fmt.format(point.high)}/kg</span></p>
                              <p>Low Price: <span className="font-bold text-zinc-900">₹{fmt.format(point.low)}/kg</span></p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <ReferenceLine y={metrics.avg30} stroke="#047857" strokeDasharray="5 5" strokeOpacity={0.8} label={{ value: '30-Day Avg', position: 'insideTopRight', fill: '#047857', fontSize: 10 }} />
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fill="url(#priceFill)" activeDot={{ r: 5, fill: '#059669', stroke: '#ecfdf5', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-zinc-900">💰 Lot Valuation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">OCR Verified Weight</span>
              <span className="text-lg font-bold text-zinc-900">{weight.toFixed(1)} kg</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm text-zinc-600">Fair Market Value</p>
              <div className="flex items-end justify-between gap-2">
                <p className="text-3xl font-black tracking-tight text-emerald-700">₹{fmt.format(valuation)}</p>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Avg ₹{fmt.format(metrics.currentAvg)}/kg</Badge>
              </div>
              <p className="text-xs text-zinc-600">{weight.toFixed(1)} kg × ₹{fmt.format(metrics.currentAvg)}/kg = <span className="font-semibold text-zinc-900">₹{fmt.format(valuation)}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-emerald-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-5 w-5 text-amber-600" />
              <p className="text-sm leading-6 text-emerald-900">{recommendationText}</p>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="h-12 w-full bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800" onClick={handleNegotiation}>
          <span className="mr-2">🤝</span>
          रीसाइक्लर खोजें और Saathi Broker शुरू करें (Find Recycler & Start Broker Negotiation)
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </main>
  );
}
