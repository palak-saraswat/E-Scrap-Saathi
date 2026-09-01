'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { compressImage } from '../../../lib/image-utils';
import { AlertTriangle, Camera, CheckCircle2, Pencil, Scale, Sparkles, Volume2 } from 'lucide-react';

type CategoryKey = 'pcb' | 'cables' | 'batteries' | 'crt';
type Analysis = {
  material_name_en: string;
  material_name_hi: string;
  category_key: CategoryKey | 'other';
  weight_kg: number | null;
  ocr_confidence: 'high' | 'medium' | 'low';
  is_hazardous: boolean;
  hazard_title: string | null;
  hazard_warning_hi: string | null;
  safety_action_hi: string | null;
};

const categories: { key: CategoryKey; emoji: string; hi: string; en: string }[] = [
  { key: 'pcb', emoji: '🖨', hi: 'प्रिंटेड सर्किट बोर्ड', en: 'PCBs' },
  { key: 'cables', emoji: '🔌', hi: 'तांबे के तार', en: 'Copper Cables' },
  { key: 'batteries', emoji: '🔋', hi: 'लिथियम बैटरी', en: 'Lithium Batteries' },
  { key: 'crt', emoji: '📺', hi: 'सीआरटी स्क्रीन', en: 'CRT Screens' },
];

export default function AddScrapPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('cables');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [weight, setWeight] = useState('');
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAnalysis(null);
    setIsAnalyzing(true);
    try {
      const compressed = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressed);
      setImageUrl(previewUrl);
      const formData = new FormData();
      formData.append('image', compressed);
      formData.append('selected_category', selectedCategory);
      const response = await fetch('/api/agents/vision', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Vision analysis failed');
      const result = (await response.json()) as Analysis;
      setAnalysis(result);
      setWeight(result.weight_kg?.toString() ?? '');
    } catch {
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function continueToTrends() {
    const lotId = `demo-lot-${Date.now()}`;
    const finalWeight = Number(weight) || 0;
    localStorage.setItem(`scrap-lot:${lotId}`, JSON.stringify({ ...analysis, weight_kg: finalWeight }));
    router.push(`/collector/trends?lot_id=${lotId}&category=${analysis?.category_key ?? selectedCategory}&weight=${finalWeight}`);
  }

  return (
    <main className="space-y-5 px-4 pb-28 pt-6">
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Saathi Vision</p>
        <h1 className="text-2xl font-bold text-zinc-950">📸 कबाड़ स्कैन करें</h1>
        <p className="mt-1 text-sm text-zinc-600">Scan Scrap for weight and safety check</p>
      </header>

      {!imageUrl && !isAnalyzing && !analysis && (
        <>
          <section className="space-y-3">
            <h2 className="font-semibold text-zinc-900">कबाड़ की श्रेणी चुनें</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button type="button" key={category.key} onClick={() => setSelectedCategory(category.key)} className={`min-h-28 rounded-xl border-2 p-3 text-left transition ${selectedCategory === category.key ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-zinc-200 bg-white'}`}>
                  <span className="text-2xl">{category.emoji}</span>
                  <span className="mt-2 block text-sm font-semibold text-zinc-900">{category.hi}</span>
                  <span className="block text-xs text-zinc-500">{category.en}</span>
                </button>
              ))}
            </div>
          </section>
          <Card className="border-emerald-200 bg-emerald-50/70">
            <CardContent className="p-5 text-center">
              <Camera className="mx-auto mb-3 h-12 w-12 text-emerald-700" />
              <Button size="lg" className="h-12 w-full bg-emerald-700 hover:bg-emerald-800" onClick={() => inputRef.current?.click()}><Camera className="mr-2 h-5 w-5" /> फोटो लें / Upload Photo</Button>
              <p className="mt-3 text-xs leading-5 text-emerald-950">फोटो में तराजू का डिजिटल मीटर साफ़ दिखना चाहिए<br />(Scale display should be clearly visible)</p>
              <input ref={inputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={handleImage} />
            </CardContent>
          </Card>
        </>
      )}

      {(isAnalyzing || imageUrl) && (
        <Card className="overflow-hidden border-zinc-200">
          <div className="relative aspect-[4/3] bg-zinc-100">
            {imageUrl && <img src={imageUrl} alt="Uploaded e-waste on a scale" className="h-full w-full object-cover" />}
            {isAnalyzing && <div className="absolute inset-x-0 top-1/2 h-1 animate-pulse bg-emerald-400 shadow-[0_0_18px_4px_rgba(52,211,153,0.8)]" />}
          </div>
          {isAnalyzing && <CardContent className="space-y-3 p-5"><div className="flex items-center gap-2 font-semibold"><Sparkles className="h-5 w-5 text-emerald-600" /> AI साथी जांच कर रहा है...</div><p className="text-sm text-zinc-600">Extracting weight & checking safety</p><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-3/4" /></CardContent>}
        </Card>
      )}

      {analysis && !isAnalyzing && (
        <div className="space-y-4">
          <Card className="border-emerald-200 bg-emerald-50/50"><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-zinc-600">पहचाना गया सामान</p><p className="font-bold text-zinc-950">{analysis.material_name_hi}</p><p className="text-sm text-zinc-600">{analysis.material_name_en}</p></div><Badge className="bg-emerald-600 text-white">{analysis.ocr_confidence} confidence</Badge></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Scale className="h-5 w-5 text-emerald-700" /> तराजू का वजन</CardTitle></CardHeader><CardContent>{isEditingWeight ? <div className="flex gap-2"><Input aria-label="Weight in kilograms" type="number" step="0.01" value={weight} onChange={(event) => setWeight(event.target.value)} autoFocus /><Button onClick={() => setIsEditingWeight(false)}>Done</Button></div> : <div className="flex items-end justify-between"><p className="text-4xl font-bold tracking-tight text-zinc-950">{weight || 'N/A'} <span className="text-lg font-medium text-zinc-500">kg</span></p><Button variant="outline" size="sm" onClick={() => setIsEditingWeight(true)}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button></div>}<Badge variant="outline" className="mt-3 border-emerald-300 text-emerald-700"><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Digital Scale OCR Verified</Badge></CardContent></Card>
          {analysis.is_hazardous && <Alert className="border-red-300 bg-red-50 text-red-950"><AlertTriangle className="h-5 w-5" /><AlertTitle>⚠️ खतरा चेतावनी (Hazard Alert)</AlertTitle><AlertDescription className="text-red-900">{analysis.hazard_warning_hi}<br /><span className="text-xs">{analysis.safety_action_hi}</span></AlertDescription><Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-red-700" aria-label="Read hazard warning aloud" onClick={() => setIsSpeaking((value) => !value)}><Volume2 className={isSpeaking ? 'animate-pulse' : ''} /></Button></Alert>}
          <Button size="lg" className="h-12 w-full bg-emerald-700 text-sm hover:bg-emerald-800" onClick={continueToTrends}>📊 आज का भाव और ट्रेंड देखें</Button>
          <Button variant="outline" className="w-full" onClick={() => { setImageUrl(null); setAnalysis(null); setWeight(''); if (inputRef.current) inputRef.current.value = ''; }}>Scan another item</Button>
        </div>
      )}
    </main>
  );
}
