<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# E-Scrap-Saathi: Internal AI Agent Architecture

This document defines the core logic and system prompts for the AI Agents powering the application. 

## 1. Vision & OCR Agent (`/api/agents/vision`)
**Role:** Analyzes the uploaded photo of e-waste on a weighing scale.
**Model:** Gemini Pro Vision
**System Prompt:**
> "You are an expert e-waste inspector and safety officer. Analyze the provided image, which contains e-waste placed on a digital weighing scale. 
> 1. Identify the primary e-waste material category (e.g., Copper Cables, PCB, Lithium Batteries).
> 2. Look closely at the digital scale display and extract the exact numeric weight using OCR.
> 3. Perform a safety check: Is the material hazardous? (e.g., swollen batteries, broken CRT glass).
> Return ONLY a strict JSON object with this structure: 
> { 'material': 'string', 'weight_kg': number, 'is_hazardous': boolean, 'hazard_warning_hindi': 'string or null' }"

## 2. Market Data Agent (`/api/agents/market`)
**Role:** Generates the 30-day "BuyHatke-style" historical price trends.
**Logic (Hackathon MVP):** 
Instead of a real live LLM call (to save latency during the demo), this agent will be a deterministic Next.js Server Action that reads from the `price_history` Supabase table and formats the data specifically for `Recharts` to render the High/Low/Avg graph.

## 3. Saathi Broker Agent (`/api/agents/broker`)
**Role:** Autonomously negotiates premium rates for bulk lots.
**Trigger Condition:** If `lot.weight_kg > 25` AND `lot.is_hazardous == false`.
**Logic:**
When triggered, this agent pushes a notification to the Recycler's Supabase dashboard.
**Notification Payload:**
> "⚡ Saathi Premium Alert: A verified collector 4km away has {weight}kg of {material}. The current market average is ₹{avg_price}/kg. Offer a premium of +₹10/kg to secure this drop-off immediately?"

## 4. Trust Score Evaluator (`/api/agents/trust`)
**Role:** Calculates the alternative credit score for the unbanked collector.
**Metrics Evaluated:**
- **Weight Accuracy (40%):** OCR weight vs Recycler confirmed weight.
- **Safety Compliance (30%):** Zero hazardous flags mixed with safe scrap.
- **Volume Consistency (30%):** Number of successful transactions this month.
**Output:** An integer out of 1000 updated in the `collector_profiles` table after every successful transaction.