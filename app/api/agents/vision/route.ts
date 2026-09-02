import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

type CategoryKey = 'smartphones' | 'laptops_it' | 'pcb' | 'cables' | 'batteries' | 'crt' | 'appliances' | 'other';
type Benchmark = { rate: number; weight: number; nameEn: string; nameHi: string };

type VisionResult = {
  detected_item: string;
  category_key: CategoryKey;
  material_name_en: string;
  material_name_hi: string;
  weight_kg: number;
  rate_per_kg: number;
  total_valuation: number;
  is_scale_verified: boolean;
  is_hazardous: boolean;
  ocr_confidence: 'high' | 'medium' | 'low';
  hazard_title: string | null;
  hazard_warning_hi: string | null;
};

const benchmarks: Record<CategoryKey, Benchmark> = {
  smartphones: { rate: 650, weight: 0.2, nameEn: 'Smartphones & Mobiles', nameHi: 'स्मार्टफोन व मोबाइल' },
  laptops_it: { rate: 380, weight: 2.1, nameEn: 'Laptops & IT Hardware', nameHi: 'लैपटॉप व IT उपकरण' },
  pcb: { rate: 340, weight: 0.6, nameEn: 'PCBs & Motherboards', nameHi: 'सर्किट बोर्ड / मदरबोर्ड' },
  cables: { rate: 475, weight: 3.5, nameEn: 'Copper Cables & Wires', nameHi: 'तांबे के तार व केबल' },
  batteries: { rate: 165, weight: 0.8, nameEn: 'Lithium-ion Batteries', nameHi: 'लिथियम-आयन बैटरी' },
  crt: { rate: 25, weight: 8.5, nameEn: 'CRT Displays & Glass', nameHi: 'सीआरटी स्क्रीन व ग्लास' },
  appliances: { rate: 75, weight: 4, nameEn: 'Home Electronics', nameHi: 'घरेलू उपकरण' },
  other: { rate: 75, weight: 1, nameEn: 'Other E-Waste', nameHi: 'अन्य ई-कबाड़' },
};

const modelCandidates = ['gemini-3.5-flash'];
const inspectionPrompt = `You are an expert Indian e-waste appraiser. Identify the specific device or material in this image. Read a digital scale if visible; otherwise estimate a realistic physical weight in kilograms for the individual device. Inspect for swollen or leaking batteries, broken CRT glass, and burnt circuits. Return only JSON with this shape: {"detected_item":"string","category_key":"smartphones|laptops_it|pcb|cables|batteries|crt|appliances|other","material_name_en":"string","material_name_hi":"string","weight_kg":number,"is_scale_verified":boolean,"is_hazardous":boolean,"ocr_confidence":"high|medium|low","hazard_title":"string or null","hazard_warning_hi":"string or null"}.`;

function cleanJson(text: string) {
  return text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
}

function validCategory(value: unknown): CategoryKey {
  return typeof value === 'string' && value in benchmarks
    ? (value as CategoryKey)
    : 'other';
}


async function readImage(request: NextRequest) {
  if ((request.headers.get('content-type') || '').includes('multipart/form-data')) {
    const formData = await request.formData();
    const file = formData.get('image');
    if (file instanceof File) return { data: Buffer.from(await file.arrayBuffer()).toString('base64'), mimeType: file.type || 'image/jpeg' };
    return null;
  }

  const body = await request.json() as { image?: string; mimeType?: string };
  if (!body.image) return null;
  const match = body.image.match(/^data:([^;]+);base64,([\s\S]*)$/);
  return { data: match ? match[2] : body.image, mimeType: body.mimeType || match?.[1] || 'image/jpeg' };
}

function normalizeResult(raw: Partial<VisionResult>): VisionResult {
  const category = validCategory(raw.category_key);
  const benchmark = benchmarks[category];
  const weight = Number(raw.weight_kg);
  const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : benchmark.weight;
  const rate = benchmark.rate;
  return {
    detected_item: raw.detected_item || benchmark.nameEn,
    category_key: category,
    material_name_en: benchmark.nameEn,
    material_name_hi: benchmark.nameHi,
    weight_kg: Number(safeWeight.toFixed(2)),
    rate_per_kg: rate,
    total_valuation: Number((safeWeight * rate).toFixed(2)),
    is_scale_verified: Boolean(raw.is_scale_verified),
    is_hazardous: Boolean(raw.is_hazardous),
    ocr_confidence: raw.ocr_confidence || 'medium',
    hazard_title: raw.hazard_title || null,
    hazard_warning_hi: raw.hazard_warning_hi || null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured in .env.local');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const image = await readImage(request);
    if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError: unknown;
    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([inspectionPrompt, { inlineData: { data: image.data, mimeType: image.mimeType } }]);
        return NextResponse.json(normalizeResult(JSON.parse(cleanJson(result.response.text()))));
      } catch (error) {
        lastError = error;
        console.warn(`Vision model ${modelName} failed; trying next model.`);
      }
    }

    throw lastError instanceof Error ? lastError : new Error('All Gemini Vision models failed');
  } catch (error) {
    console.error('Gemini Vision Detailed Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to analyze image' }, { status: 500 });
  }
}
