import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert e-waste inspector and safety officer. Analyze the provided image, which contains e-waste items placed on a digital weighing scale.
1. Identify the primary e-waste material (e.g., Copper Cables, PCB / Motherboards, Lithium-ion Batteries, CRT Glass / Monitors, Mixed Electronics).
2. Read and extract the numeric weight displayed on the digital scale LED/LCD screen (in kg). If not visible, return null.
3. Check for physical safety hazards: swollen/punctured batteries, exposed CRT lead glass, leaking chemicals, or burnt components.

Return ONLY a raw JSON object (without markdown code fences) with the exact structure:
{
  "material_name_en": string,
  "material_name_hi": string,
  "category_key": "pcb" | "cables" | "batteries" | "crt" | "other",
  "weight_kg": number | null,
  "ocr_confidence": "high" | "medium" | "low",
  "is_hazardous": boolean,
  "hazard_title": string | null,
  "hazard_warning_en": string | null,
  "hazard_warning_hi": string | null,
  "safety_action_hi": string | null
}`;

export interface VisionAnalysis {
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
}

const FALLBACK_ANALYSIS: VisionAnalysis = {
  material_name_en: 'Copper Cables',
  material_name_hi: 'तांबे के तार',
  category_key: 'cables',
  weight_kg: 12.5,
  ocr_confidence: 'high',
  is_hazardous: false,
  hazard_title: null,
  hazard_warning_en: null,
  hazard_warning_hi: null,
  safety_action_hi: null,
};

function cleanJson(text: string) {
  return text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
}

async function readImage(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const image = formData.get('image');
    const selectedCategory = formData.get('selected_category');
    if (!(image instanceof File)) throw new Error('An image file is required.');
    return {
      base64: Buffer.from(await image.arrayBuffer()).toString('base64'),
      mimeType: image.type || 'image/jpeg',
      selectedCategory: typeof selectedCategory === 'string' ? selectedCategory : null,
    };
  }

  const body = (await request.json()) as { image?: string; mimeType?: string; selected_category?: string };
  if (!body.image) throw new Error('An image is required.');
  return {
    base64: body.image.replace(/^data:[^;]+;base64,/, ''),
    mimeType: body.mimeType || 'image/jpeg',
    selectedCategory: body.selected_category || null,
  };
}

export async function POST(request: Request) {
  try {
    const { base64, mimeType, selectedCategory } = await readImage(request);
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ ...FALLBACK_ANALYSIS, demo_mode: true });

    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
    const categoryHint = selectedCategory
      ? `The collector selected category: ${selectedCategory}. Use it as a hint, but trust the image.`
      : '';
    const result = await model.generateContent([{ inlineData: { data: base64, mimeType } }, categoryHint]);
    return NextResponse.json(JSON.parse(cleanJson(result.response.text())) as VisionAnalysis);
  } catch (error) {
    console.error('Vision agent fallback:', error);
    return NextResponse.json({ ...FALLBACK_ANALYSIS, demo_mode: true });
  }
}