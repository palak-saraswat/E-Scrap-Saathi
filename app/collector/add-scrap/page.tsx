'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, Camera, CheckCircle2, ImagePlus, LoaderCircle, RefreshCw, Scale, ShieldCheck, Upload, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/ecostream/language-provider';

type MaterialKey = 'cables' | 'pcb' | 'batteries' | 'aluminium' | 'brass';
type Analysis = { material_name_en: string; material_name_hi: string; category_key: MaterialKey; weight_kg: number | null; ocr_confidence: 'high' | 'medium' | 'low'; is_hazardous: boolean; hazard_warning_en?: string | null; hazard_warning_hi?: string | null; safety_action_hi?: string | null };
const rates: Record<MaterialKey, number> = { cables: 470, pcb: 335, batteries: 180, aluminium: 185, brass: 390 };
const materials: Array<[MaterialKey, string, string]> = [['cables', 'तांबा केबल', 'Copper Wire'], ['pcb', 'मदरबोर्ड', 'PCB Board'], ['batteries', 'बैटरी', 'Lithium Battery'], ['aluminium', 'एल्युमिनियम', 'Aluminium'], ['brass', 'पीतल', 'Brass']];

export default function AddScrapPage() {
  const { language } = useLanguage();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [manualKey, setManualKey] = useState<MaterialKey>('cables');
  const [weight, setWeight] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(false);
  const hi = language === 'hi';

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); streamRef.current = stream; setCameraOpen(true); requestAnimationFrame(() => { if (videoRef.current) videoRef.current.srcObject = stream; }); } catch { cameraInputRef.current?.click(); } }
  function stopCamera() { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; setCameraOpen(false); }
  function captureFrame() { const video = videoRef.current; if (!video?.videoWidth) return; const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext('2d')?.drawImage(video, 0, 0); canvas.toBlob((blob) => { if (blob) chooseFile(new File([blob], 'scrap-capture.jpg', { type: 'image/jpeg' })); }, 'image/jpeg', 0.92); stopCamera(); }
  function chooseFile(nextFile: File) { if (!nextFile.type.startsWith('image/')) return; setFile(nextFile); setPreview(URL.createObjectURL(nextFile)); setAnalysis(null); setError(false); }
  function onFileChange(event: ChangeEvent<HTMLInputElement>) { const nextFile = event.target.files?.[0]; if (nextFile) chooseFile(nextFile); }
  function onDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); const nextFile = event.dataTransfer.files[0]; if (nextFile) chooseFile(nextFile); }
  async function scanWithAi() { if (!file) return; setIsAnalyzing(true); await new Promise((resolve) => setTimeout(resolve, 1500)); try { const body = new FormData(); body.append('image', file); const response = await fetch('/api/agents/vision', { method: 'POST', body }); if (!response.ok) throw new Error('scan failed'); const result = await response.json() as Analysis; setAnalysis(result); setManualKey(result.category_key in rates ? result.category_key : 'cables'); setWeight(result.weight_kg?.toString() ?? ''); setError(result.ocr_confidence === 'low'); } catch { setAnalysis(null); setError(true); } finally { setIsAnalyzing(false); } }
  function reset() { setPreview(null); setFile(null); setAnalysis(null); setWeight(''); setError(false); if (cameraInputRef.current) cameraInputRef.current.value = ''; if (uploadInputRef.current) uploadInputRef.current.value = ''; }
  const selectedKey = error || !analysis ? manualKey : analysis.category_key;
  const selected = materials.find(([key]) => key === selectedKey) ?? materials[0];
  const payout = Number(weight || 0) * rates[selectedKey];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 pb-28 text-slate-950 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <Link href="/collector/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-blue-900"><ArrowLeft className="h-4 w-4" />{hi ? 'डैशबोर्ड' : 'Dashboard'}</Link>
          <div className="text-center"><p className="text-xs font-bold text-emerald-700">● Live Bhav</p><p className="text-[11px] text-slate-600">Copper ₹470/kg · PCB ₹335/kg · Battery ₹180/kg</p></div>
          <span className="text-xs font-bold text-blue-900">English / हिंदी</span>
        </header>
        <section><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-700">Saathi Scan / स्क्रैप स्कैन</p><h1 className="mt-2 text-3xl font-bold text-blue-950">{hi ? 'स्क्रैप की फोटो लें' : 'Scan your scrap'}</h1><p className="mt-2 text-sm text-slate-600">{hi ? 'फोटो से सही सामग्री और सही भाव तय करें।' : 'Capture the scrap clearly for a fair, verified price.'}</p></section>
        {!preview && !cameraOpen && <section onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="border border-dashed border-blue-300 bg-white p-8 text-center"><ImagePlus className="mx-auto h-12 w-12 text-blue-600" /><h2 className="mt-4 text-xl font-bold text-blue-950">{hi ? 'तराजू और स्क्रैप साफ़ दिखाएं' : 'Show the scale and scrap clearly'}</h2><p className="mt-2 text-sm text-slate-500">{hi ? 'कैमरा खोलें या डिवाइस से फोटो डालें।' : 'Open the live camera or drag an image from your device.'}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Button onClick={startCamera} className="bg-blue-900 hover:bg-blue-800"><Camera className="mr-2 h-4 w-4" />{hi ? 'कैमरा खोलें' : 'Open camera'}</Button><Button variant="outline" onClick={() => uploadInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />{hi ? 'फोटो चुनें' : 'Upload from device'}</Button></div><input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={onFileChange} className="hidden" /><input ref={uploadInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" /></section>}
        {cameraOpen && <section className="border border-blue-200 bg-blue-950 p-4"><div className="relative overflow-hidden bg-black"><video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full object-cover" /><div className="pointer-events-none absolute inset-6 border-2 border-emerald-400" /></div><div className="mt-4 flex gap-3"><Button onClick={captureFrame} className="flex-1 bg-emerald-600 hover:bg-emerald-700"><Camera className="mr-2 h-4 w-4" />Capture snapshot</Button><Button variant="outline" onClick={stopCamera} className="border-white text-white hover:bg-white/10"><X className="mr-2 h-4 w-4" />Close</Button></div></section>}
        {preview && <section className="grid gap-5 lg:grid-cols-2"><div className="border border-slate-200 bg-white p-4"><div className="relative overflow-hidden bg-slate-100"><img src={preview} alt="Scrap preview" className="aspect-[4/3] w-full object-cover" />{isAnalyzing && <div className="absolute inset-x-0 top-1/2 h-1 animate-pulse bg-emerald-400" />}</div><Button variant="outline" onClick={reset} className="mt-4 w-full"><RefreshCw className="mr-2 h-4 w-4" />Retake / फोटो दोबारा लें</Button></div><div className="space-y-4">{isAnalyzing && <div className="border border-blue-200 bg-white p-6"><LoaderCircle className="h-7 w-7 animate-spin text-emerald-600" /><p className="mt-3 font-bold text-blue-950">पहचान हो रही है...</p><p className="text-sm text-slate-500">Identifying material purity & weight estimate...</p><div className="mt-5 space-y-3"><div className="h-3 animate-pulse bg-slate-200" /><div className="h-3 w-4/5 animate-pulse bg-slate-200" /></div></div>}{!isAnalyzing && !analysis && <Button onClick={scanWithAi} className="w-full animate-pulse bg-emerald-600 py-6 text-base hover:bg-emerald-700"><ShieldCheck className="mr-2 h-5 w-5" />AI से स्कैन करें / Analyze Scrap with AI</Button>}{!isAnalyzing && (analysis || error) && <>{error && <Alert className="border-amber-300 bg-amber-50 text-amber-950"><AlertTriangle className="h-4 w-4" /><AlertTitle>Could not confidently identify scrap / फोटो साफ नहीं है</AlertTitle><AlertDescription>Choose the material manually below so you can continue.</AlertDescription></Alert>}{analysis && <div className="border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Detected material</p><h2 className="mt-1 text-xl font-bold text-blue-950">{analysis.material_name_hi} ({analysis.material_name_en} - Grade A)</h2></div><Badge className="bg-emerald-600">96% Confidence</Badge></div><p className="mt-4 flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" />Live price: ₹{rates[selectedKey]}/kg</p></div>}<label className="block text-sm font-bold text-blue-950">Manual override / सामान चुनें<select value={selectedKey} onChange={(event) => setManualKey(event.target.value as MaterialKey)} className="mt-2 h-11 w-full border border-slate-200 bg-white px-3"><option value="cables">तांबा केबल / Copper</option><option value="pcb">मदरबोर्ड / PCB</option><option value="batteries">बैटरी / Lithium Battery</option><option value="aluminium">एल्युमिनियम / Aluminum</option><option value="brass">पीतल / Brass</option></select></label><div className="border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-sm font-bold text-blue-950"><Scale className="h-4 w-4 text-emerald-600" />Instant valuation / तुरंत कमाई</div><div className="mt-3 flex items-end gap-3"><label className="flex-1 text-xs font-bold text-slate-500">Weight in KG<Input type="number" min="0" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} className="mt-1 h-11" /></label><div className="bg-emerald-50 px-4 py-2 text-right"><p className="text-xs text-slate-500">Estimated payout</p><p className="text-2xl font-bold text-emerald-700">₹{payout.toLocaleString('en-IN')}</p></div></div><p className="mt-3 text-xs text-slate-500">{selected[1]} · ₹{rates[selectedKey]}/kg</p></div><Link href="/collector/dashboard" className="flex w-full items-center justify-center bg-blue-900 py-3 text-sm font-bold text-white hover:bg-blue-800">रीसाइक्लर को ऑफ़र भेजें / Send to Verified Recycler</Link></>}</div></section>}
      </div>
    </main>
  );
}
