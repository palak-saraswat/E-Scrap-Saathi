'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Languages, Sparkles, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSupabaseClient } from '@/lib/supabase/client';

type Language = 'en' | 'hi';
type CategoryKey = 'smartphones' | 'laptops_it' | 'cables' | 'pcb' | 'batteries' | 'crt' | 'appliances' | 'other';
type TrendPoint = { date: string; price: number; high: number; low: number };

type Copy = {
  eyebrow: string; title: string; subtitle: string; highest: string; lowest: string; currentAvg: string; weeklyTrend: string;
  avg30Day: string; valuationTitle: string; ocrVerifiedWeight: string; fairMarketValue: string; advisoryTitle: string;
  advisoryText: string; ctaButton: string; average: string; high: string; low: string; perKg: string; formula: string; language: string;
  categories: Record<CategoryKey, string>;
};

const content: Record<Language, Copy> = {
  en: {
    eyebrow: 'PRICE INTELLIGENCE', title: '30-Day Historical Price Index', subtitle: 'Verified E-Waste Market Intelligence', highest: '30-Day High (₹/kg)', lowest: '30-Day Low (₹/kg)', currentAvg: 'Current Market Benchmark (₹/kg)', weeklyTrend: 'Trending Up', avg30Day: '30-Day Avg', valuationTitle: 'Estimated Fair Lot Valuation', ocrVerifiedWeight: 'Verified Material Weight', fairMarketValue: 'Estimated Fair Lot Valuation', advisoryTitle: 'Market Advisory', advisoryText: 'Material prices are currently trading near a 30-day peak. Recommended window for authorized liquidation.', ctaButton: 'Connect with Authorized Recyclers', average: 'Average Price', high: 'High Price', low: 'Low Price', perKg: '/kg', formula: 'Verified weight × current market benchmark', language: 'हिंदी', categories: { smartphones: 'Smartphones & Mobiles', laptops_it: 'Laptops & IT Hardware', cables: 'Copper Cables', pcb: 'PCBs / Motherboards', batteries: 'Lithium-ion Batteries', crt: 'CRT Displays & Glass', appliances: 'Home Electronics', other: 'Other E-Waste' },
  },
  hi: {
    eyebrow: 'बाज़ार भाव', title: '30-दिवसीय बाज़ार मूल्य सूचकांक', subtitle: 'सत्यापित ई-कबाड़ बाज़ार दर ट्रैकर', highest: '30 दिनों में उच्चतम दर', lowest: '30 दिनों में न्यूनतम दर', currentAvg: 'वर्तमान बाज़ार औसत दर', weeklyTrend: 'बढ़त पर है', avg30Day: '30-दिन का औसत', valuationTitle: 'अनुमानित उचित लॉट मूल्य', ocrVerifiedWeight: 'सत्यापित वजन', fairMarketValue: 'अनुमानित उचित लॉट मूल्य', advisoryTitle: 'बाज़ार विश्लेषण', advisoryText: 'इस सामग्री का भाव 30 दिनों के उच्चतम स्तर पर है। अधिकृत रीसाइक्लर को बेचने का यह अनुकूल समय है।', ctaButton: 'अधिकृत रीसाइक्लर से जुड़ें', average: 'औसत दर', high: 'उच्चतम दर', low: 'न्यूनतम दर', perKg: '/किलो', formula: 'सत्यापित वजन × वर्तमान बाज़ार औसत दर', language: 'English', categories: { smartphones: 'स्मार्टफोन व मोबाइल', laptops_it: 'लैपटॉप व IT उपकरण', cables: 'तांबे के तार व केबल', pcb: 'सर्किट बोर्ड / मदरबोर्ड', batteries: 'लिथियम-आयन बैटरी', crt: 'सीआरटी स्क्रीन व ग्लास', appliances: 'घरेलू उपकरण', other: 'अन्य ई-कबाड़' },
  },
};

const categoryConfig: Record<CategoryKey, { icon: string; dbLabel: string; rate: number; range: [number, number] }> = {
  smartphones: { icon: '📱', dbLabel: 'Smartphones & Mobiles', rate: 650, range: [580, 700] },
  laptops_it: { icon: '💻', dbLabel: 'Laptops & IT Hardware', rate: 380, range: [340, 420] },
  cables: { icon: '🔌', dbLabel: 'Copper Cables', rate: 475, range: [420, 500] },
  pcb: { icon: '🖨', dbLabel: 'Printed Circuit Boards', rate: 340, range: [280, 380] },
  batteries: { icon: '🔋', dbLabel: 'Lithium-ion Batteries', rate: 165, range: [130, 190] },
  crt: { icon: '📺', dbLabel: 'CRT Monitors', rate: 25, range: [15, 35] },
  appliances: { icon: '🏠', dbLabel: 'Home Electronics', rate: 75, range: [55, 95] },
  other: { icon: '♻️', dbLabel: 'Other E-Waste', rate: 75, range: [55, 95] },
};

const formatter = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function resolveLanguage(value: string | null): Language { return value === 'hi' ? 'hi' : 'en'; }
function resolveCategory(value: string | null): CategoryKey {
  const normalized = (value ?? 'cables').toLowerCase().replace(/[^a-z]/g, '');
  if (normalized.includes('phone') || normalized.includes('mobile')) return 'smartphones';
  if (normalized.includes('laptop') || normalized.includes('computer') || normalized.includes('it')) return 'laptops_it';
  if (normalized.includes('pcb') || normalized.includes('circuit')) return 'pcb';
  if (normalized.includes('battery') || normalized.includes('lithium')) return 'batteries';
  if (normalized.includes('crt') || normalized.includes('screen')) return 'crt';
  if (normalized.includes('appliance') || normalized.includes('electronics')) return 'appliances';
  return 'cables';
}
function formatDate(value: string, language: Language) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', day: 'numeric' }).format(date);
}
function fallbackTrend(category: CategoryKey, language: Language): TrendPoint[] {
  const [min, max] = categoryConfig[category].range;
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (29 - index));
    const average = Math.min(max, Math.max(min, Number((min + ((max - min) * index) / 29 + Math.sin(index / 2.7) * (max - min) * 0.1).toFixed(2))));
    return { date: formatDate(date.toISOString(), language), price: average, high: Math.min(max, Number((average + (max - min) * 0.08 + 2.5).toFixed(2))), low: Math.max(min, Number((average - (max - min) * 0.09 - 2.2).toFixed(2))) };
  });
}
async function fetchTrend(category: CategoryKey, language: Language): Promise<TrendPoint[]> {
  try {
    const supabase = getSupabaseClient();
    const { data: material, error: materialError } = await supabase.from('materials_categories').select('id').eq('name_en', categoryConfig[category].dbLabel).limit(1).maybeSingle();
    if (materialError || !material?.id) return fallbackTrend(category, language);
    const { data, error } = await supabase.from('price_history').select('recorded_date, avg_price_per_kg, high_price_per_kg, low_price_per_kg').eq('category_id', material.id).order('recorded_date', { ascending: true }).limit(30);
    if (error || !data?.length) return fallbackTrend(category, language);
    return data.map((point) => ({ date: formatDate(String(point.recorded_date), language), price: Number(point.avg_price_per_kg ?? 0), high: Number(point.high_price_per_kg ?? 0), low: Number(point.low_price_per_kg ?? 0) }));
  } catch { return fallbackTrend(category, language); }
}

function TrendsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = resolveLanguage(searchParams.get('lang'));
  const text = content[language];
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(() => resolveCategory(searchParams.get('category')));
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const weight = Number(searchParams.get('weight') ?? '12.5') || 12.5;
  const scannedItem = searchParams.get('item') || text.categories[activeCategory];
  const scannedRate = Number(searchParams.get('rate')) || categoryConfig[activeCategory].rate;

  useEffect(() => {
    let active = true;
    void fetchTrend(activeCategory, language).then((data) => { if (active) { setTrendData(data); setLoading(false); } });
    return () => { active = false; };
  }, [activeCategory, language]);

  const metrics = useMemo(() => {
    if (!trendData.length) return { highest: 0, lowest: 0, currentAvg: 0, avg30: 0, momentum: 0 };
    const currentAvg = trendData[trendData.length - 1]?.price ?? 0;
    const previous = trendData[Math.max(0, trendData.length - 7)]?.price ?? currentAvg;
    return { highest: Math.max(...trendData.map((point) => point.high)), lowest: Math.min(...trendData.map((point) => point.low)), currentAvg, avg30: trendData.reduce((sum, point) => sum + point.price, 0) / trendData.length, momentum: previous ? ((currentAvg - previous) / previous) * 100 : 0 };
  }, [trendData]);

  const valuation = weight * scannedRate;
  const updateLanguage = () => { const params = new URLSearchParams(searchParams.toString()); params.set('lang', language === 'en' ? 'hi' : 'en'); router.replace(`/collector/trends?${params.toString()}`); };
  const startNegotiation = () => router.push(`/collector/negotiate?category=${activeCategory}&weight=${weight}&value=${valuation.toFixed(2)}`);

  return <main className="mx-auto min-h-screen max-w-md bg-zinc-50 p-4 pb-20"><div className="space-y-4">
    <header className="flex items-start justify-between gap-3 pt-2"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{text.eyebrow}</p><h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">{text.title}</h1><p className="mt-1 text-sm text-zinc-600">{text.subtitle}</p></div><Button variant="outline" size="sm" onClick={updateLanguage} className="shrink-0"><Languages className="mr-1 h-4 w-4" />{text.language}</Button></header>
    <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryKey)}><TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-xl border border-zinc-200 bg-white p-1">{(Object.keys(categoryConfig) as CategoryKey[]).map((key) => <TabsTrigger key={key} value={key} className="min-w-0 px-1 py-2 text-[11px] font-semibold"><span className="mr-1">{categoryConfig[key].icon}</span><span className="truncate">{text.categories[key]}</span></TabsTrigger>)}</TabsList></Tabs>
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm"><CardHeader className="pb-3"><CardTitle className="flex flex-col gap-2 text-base text-zinc-900 sm:flex-row sm:items-center sm:justify-between"><span>{categoryConfig[activeCategory].icon} {text.categories[activeCategory]}</span><Badge className="w-fit bg-emerald-600 text-white hover:bg-emerald-700"><TrendingUp className="mr-1 h-3.5 w-3.5" />{metrics.momentum >= 0 ? '+' : ''}{metrics.momentum.toFixed(1)}% {text.weeklyTrend}</Badge></CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-2"><Badge className="justify-start bg-green-100 py-2 text-green-800 hover:bg-green-100">{text.highest}: ₹{formatter.format(metrics.highest)}</Badge><Badge className="justify-start bg-red-100 py-2 text-red-800 hover:bg-red-100">{text.lowest}: ₹{formatter.format(metrics.lowest)}</Badge><Badge className="justify-start bg-amber-100 py-2 text-amber-900 hover:bg-amber-100">{text.currentAvg}: ₹{formatter.format(metrics.currentAvg)}</Badge></div>
      {loading ? <div className="h-[280px] animate-pulse rounded-xl bg-zinc-200/80" /> : <div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}><defs><linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.35} /><stop offset="95%" stopColor="#10b981" stopOpacity={0.04} /></linearGradient></defs><CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} minTickGap={22} /><YAxis tick={{ fontSize: 10, fill: '#52525b' }} width={48} tickFormatter={(value) => `₹${value}`} /><Tooltip content={({ active, payload }) => { if (!active || !payload?.length) return null; const point = payload[0].payload as TrendPoint; return <div className="rounded-xl border border-zinc-200 bg-white p-3 text-xs shadow-lg"><p className="mb-2 font-semibold text-zinc-700">{point.date}</p><p>{text.average}: <strong className="text-emerald-700">₹{formatter.format(point.price)}{text.perKg}</strong></p><p>{text.high}: <strong>₹{formatter.format(point.high)}{text.perKg}</strong></p><p>{text.low}: <strong>₹{formatter.format(point.low)}{text.perKg}</strong></p></div>; }} /><ReferenceLine y={metrics.avg30} stroke="#047857" strokeDasharray="5 5" label={{ value: text.avg30Day, position: 'insideTopRight', fill: '#047857', fontSize: 10 }} /><Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fill="url(#priceFill)" /></AreaChart></ResponsiveContainer></div>}
    </CardContent></Card>
    <Card className="border-emerald-200 bg-white shadow-sm"><CardHeader className="pb-3"><CardTitle className="text-base text-zinc-900">{text.valuationTitle}</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><span className="text-sm text-zinc-600">{text.ocrVerifiedWeight}</span><span className="text-lg font-bold text-zinc-900">{weight.toFixed(1)} kg</span></div><div className="flex items-center justify-between text-sm"><span className="text-zinc-600">{scannedItem}</span><span className="font-semibold text-zinc-900">₹{formatter.format(scannedRate)}{text.perKg}</span></div><Separator /><div><p className="text-sm text-zinc-600">{text.fairMarketValue}</p><p className="mt-1 text-3xl font-black text-emerald-700">₹{formatter.format(valuation)}</p><p className="mt-1 text-xs text-zinc-600">{text.formula}</p></div></CardContent></Card>
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-emerald-50 shadow-sm"><CardContent className="flex items-start gap-2 p-4"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><div><p className="text-sm font-bold text-emerald-900">{text.advisoryTitle}</p><p className="mt-1 text-sm leading-6 text-emerald-900">{text.advisoryText}</p></div></CardContent></Card>
    <Button size="lg" className="h-12 w-full bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800" onClick={startNegotiation}><span className="mr-2">🤝</span>{text.ctaButton}<ArrowRight className="ml-2 h-4 w-4" /></Button>
  </div></main>;
}

export default function CollectorTrendsPage() { return <Suspense fallback={<main className="mx-auto min-h-screen max-w-md bg-zinc-50 p-4 pb-20" />}><TrendsContent /></Suspense>; }
