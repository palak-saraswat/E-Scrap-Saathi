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
## SKILL: Tailwind Design System & UI Polish
When generating UI components, you MUST adhere to these strict design rules to ensure a premium, mobile-first experience:

1. Mobile-First Layouts: 
   - Wrap collector pages in max-w-md mx-auto min-h-screen pb-safe.
   - Never use fixed heights h-[500px] that break on small Android screens. Use min-h-screen, flex-col, and relative padding.

2. Tailwind Spacing & Typography:
   - Use space-y-4 or space-y-6 for vertical rhythm instead of random margins.
   - Use text-zinc-500 for subtitles and text-zinc-900 for primary text.
   - Use exact rounded corners for a modern feel: rounded-2xl for cards, rounded-xl for buttons/inputs.

3. Color Palette (E-Scrap-Saathi Theme):
   - Primary: bg-green-600 hover:bg-green-700 (for main actions).
   - Backgrounds: bg-zinc-50 for app background, bg-white for cards.
   - Alerts: bg-red-50 text-red-600 border-red-200 for Hazard warnings.
   - Premium: bg-gradient-to-r from-emerald-500 to-green-600 for Saathi Broker success cards.

4. Micro-Interactions & Polish:
   - Always add transition-all duration-200 ease-in-out to buttons and hover states.
   - Active states on buttons should have active:scale-[0.98].
   - Use lucide-react icons extensively for low-literacy users, aligned perfectly with flexbox (flex items-center gap-2).

5. shadcn/ui Composition:
   - Do not hallucinate props. Use shadcn components exactly as designed (e.g., <Card className="p-4 shadow-sm border-zinc-100">).