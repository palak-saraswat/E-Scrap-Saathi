import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const inspectionPrompt = `You are an expert e-waste circular economy appraiser. Inspect this photo carefully:
1. Identify the exact item & material: (e.g., Laptop / Notebook Computer, PCB Motherboard, Mobile Phone, Copper Wires, Lithium Battery, CRT Monitor, Home Appliance).
2. Weight Detection / Estimation:
   - If a digital weighing scale display is visible in the photo, OCR extract the exact numeric weight displayed on the scale.
   - If NO scale is visible, estimate the realistic physical weight of the detected item (e.g., a standard Dell/HP laptop is ~1.8 to 2.3 kg; a smartphone is ~0.2 kg; a motherboard is ~0.5 kg).
3. Hazard Safety Check: Is there physical danger (swollen battery, broken CRT glass, burnt circuits, leaking acid)?

Return ONLY a strict JSON object (NO markdown fences):
{
  "material_name_en": string,
  "material_name_hi": string,
  "category_key": "laptops_it" | "pcb" | "cables" | "batteries" | "crt" | "appliances" | "other",
  "detected_item": string,
  "weight_kg": number,
  "is_scale_verified": boolean,
  "ocr_confidence": "high" | "medium" | "low",
  "is_hazardous": boolean,
  "hazard_title": string | null,
  "hazard_warning_hi": string | null
}`;

function cleanJson(text: string) {
  return text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
}

async function readImage(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const image = formData.get('image');
    if (image instanceof File) return { data: Buffer.from(await image.arrayBuffer()).toString('base64'), mimeType: image.type || 'image/jpeg' };
    return null;
  }
  const body = await request.json() as { image?: string; mimeType?: string };
  if (!body.image) return null;
  const dataUrlMatch = body.image.match(/^data:([^;]+);base64,(.*)$/s);
  const cleanBase64 = body.image.replace(/^data:image\/\w+;base64,/, '');
  return { data: dataUrlMatch ? dataUrlMatch[2] : cleanBase64, mimeType: body.mimeType || dataUrlMatch?.[1] || 'image/jpeg' };
}

export async function POST(request: Request) {
  try {
    const image = await readImage(request);
    if (!image) return NextResponse.json({ error: 'An image file or base64 image is required.' }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imagePart = { inlineData: { data: image.data, mimeType: image.mimeType || 'image/jpeg' } };
    const result = await model.generateContent([{ text: inspectionPrompt }, imagePart]);
    return NextResponse.json(JSON.parse(cleanJson(result.response.text())));
  } catch (error) {
    console.error('Gemini Vision Detailed Error:', error);
    return NextResponse.json({ error: 'Vision analysis unavailable.' }, { status: 500 });
  }
}
