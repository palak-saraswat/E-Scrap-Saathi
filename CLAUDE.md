@AGENTS.md
# E-Scrap-Saathi: AI Coding Assistant Instructions

## Project Context
You are an expert Next.js & AI developer helping build "E-Scrap-Saathi" for the NIT Delhi Hackathon.
This is an Agentic AI + E-Waste Circular Economy platform. It is NOT just a CRUD app. 
Target Users: 
1. Informal Collectors (Mobile-first UI)
2. Authorized Recyclers (Desktop Dashboard, verified via GST/CPCB ID).

## Tech Stack
- Next.js 15 (App Router)
- React, Tailwind CSS, shadcn/ui (Nova preset)
- Supabase (Auth & PostgreSQL)
- Recharts (for BuyHatke-style price graphs)
- AI: Gemini 3.1 Pro (Vision & Text)

## Coding Rules (Strictly Follow to Save Tokens & Time)
1. **No Yapping:** Give me the exact code snippets. Skip long explanations unless I specifically ask for them.
2. **Mobile First for Collectors:** Any UI inside `app/collector/` MUST be designed for mobile (max-width containers, bottom nav bars, large touch targets for low-literacy users). Use `zinc` and `green` as primary colors.
3. **No Over-engineering (Hackathon MVP Rule):** We only have a few days. If a feature (like OTP login or GST verification) takes too long to build securely, use **Mock Data or simulated UI states** to make the demo look perfect.
4. **Agentic Architecture:** Keep AI logic separate from UI components. UI components should call Next.js Server Actions or API routes, which in turn call the AI prompts.
5. **UI Components:** Always use `lucide-react` for icons and `shadcn/ui` for buttons, inputs, cards, and dialogs.
6. **Data Fetching:** Prefer Next.js Server Components and Server Actions over client-side `useEffect` whenever possible.

## File Structure Rules
- `app/(routes)`: Keep pages clean.
- `components/ui`: Only shadcn components.
- `components/shared`: Reusable custom components (e.g., BottomNav, PriceGraph).
- `app/api/agents/[agent-name]`: Keep AI logic isolated here.