import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

type VisionAnalysis = {
  material_name_en: string;
  material_name_hi: string;
  category_key: 'pcb' | 'cables' | 'batteries' | 'crt' | 'other';
  weight_kg: number | null;
  ocr_confidence: 'high' | 'medium' | 'low';
  is_hazardous: boolean;
  hazard_title: string | null;
  hazard_warning_en: string | null;
  hazard_warning_hi: string | null;
  safety_action_hi: string | null;
};

const fallback: VisionAnalysis = { material_name_en: 'Copper Cable', material_name_hi: 'तांबा तार', category_key: 'cables', weight_kg: null, ocr_confidence: 'low', is_hazardous: false, hazard_title: null, hazard_warning_en: null, hazard_warning_hi: null, safety_action_hi: null };
const prompt = `Analyze this e-waste image. Identify the primary material, read a visible scale weight in kg, and check for swollen batteries, exposed CRT glass, leaks, or burnt components. Return only JSON with keys material_name_en, material_name_hi, category_key (pcb|cables|batteries|crt|other), weight_kg, ocr_confidence (high|medium|low), is_hazardous, hazard_title, hazard_warning_en, hazard_warning_hi, safety_action_hi.`;

function cleanJson(text: string) { return text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim(); }

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    if (!(image instanceof File)) return NextResponse.json({ ...fallback, error: 'An image file is required.' }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ ...fallback, demo_mode: true });
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: prompt });
    const result = await model.generateContent([{ inlineData: { data: Buffer.from(await image.arrayBuffer()).toString('base64'), mimeType: image.type || 'image/jpeg' } }]);
    return NextResponse.json(JSON.parse(cleanJson(result.response.text())) as VisionAnalysis);
  } catch (error) {
    console.error('Vision agent fallback:', error);
    return NextResponse.json({ ...fallback, error: 'Vision analysis unavailable.' });
  }
}