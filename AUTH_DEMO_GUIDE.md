# E-Scrap-Saathi: Auth & Dashboard Setup Guide

## Quick Start - Demo Users

### 🏠 Collector Portal
**URL:** `http://localhost:3000/collector/login`
- **Phone:** `+91-9876543210` (or any 10-digit number after +91)
- **OTP:** `1234`
- **Dashboard:** `/collector/dashboard`

### 🏭 Recycler Portal
**URL:** `http://localhost:3000/recycler/login`
- **GSTIN:** `07AACFY8976B1Z5`
- **CPCB ID:** `CPCB/REG/2024/001234`
- **Facility:** EcoRecycle Solutions Delhi
- **Dashboard:** `/recycler/dashboard`

---

## Architecture Overview

### Authentication Flow

#### Collector (Mobile-First)
```
[Landing Page] 
    ↓
[Phone + OTP Login] → localStorage
    ↓
[Collector Dashboard] ← Mobile Container (max-w-md)
    ├── Home
    ├── Add Scrap (Camera)
    ├── Price Trends (Recharts)
    └── Profile & Trust Score
```

#### Recycler (Desktop-First)
```
[Landing Page]
    ↓
[GSTIN + CPCB Verification] → Supabase lookup
    ↓
[Recycler Dashboard] ← Desktop (max-w-7xl)
    ├── Incoming Lots
    ├── AI Negotiations
    └── Transaction History
```

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing portal selector
│   ├── collector/
│   │   ├── layout.tsx                    # Mobile container + BottomNav
│   │   ├── login/page.tsx               # Phone + OTP login
│   │   ├── dashboard/page.tsx           # Home dashboard
│   │   ├── add-scrap/page.tsx           # Camera upload
│   │   ├── trends/page.tsx              # Price charts
│   │   └── profile/page.tsx             # Profile & trust
│   └── recycler/
│       ├── layout.tsx                    # Desktop layout with navbar
│       ├── login/page.tsx               # GSTIN/CPCB verification
│       └── dashboard/page.tsx           # Dashboard with tabs
└── components/
    └── collector/
        └── BottomNav.tsx                 # Mobile navigation bar
```

---

## Component Highlights

### BottomNav.tsx
- 4 tabs: Home, Scan, Bhav, Profile
- Active route highlighting
- Touch-friendly sizing (w-16 h-16)
- Green accent color for active state

### Collector Login
- Step 1: Phone number input with +91 prefix
- Step 2: 4-digit OTP with 30-second countdown timer
- Resend OTP option
- Demo: Enter any number, then OTP "1234"

### Collector Dashboard
- **Language Toggle:** English ↔ Hindi
- **Trust Score Widget:** Circular progress (780/1000)
- **Micro-Credit Badge:** Green badge for eligibility
- **Quick Stats:** Weight Accuracy (96%), Verified Earnings (₹14.5k)
- **Recent Lots:** Sample data with status badges
- **Logout Button:** Clears session and redirects to login

### Recycler Layout
- **Top Navbar:** Fixed position with facility verification
- **Facility Name & CPCB ID:** Displayed in navbar
- **Verified Badge:** Green checkmark indicating authorization
- **Capacity Indicator:** 65% with animated progress bar (13.5/20 MT)

### Recycler Login
- **GSTIN Input:** 15-character tax ID field
- **CPCB ID Input:** Central Pollution Control Board registration
- **Verification Animation:** Success screen with bouncing checkmark
- **Demo Credentials:** Hardcoded in UI for reference
- **Error Handling:** Shows "Unauthorized entity" for invalid credentials

### Recycler Dashboard
- **Metric Cards:** 4 key metrics (Inbound Waste, Negotiations, Handovers, Price Index)
- **Tabs:**
  - Incoming Lots & Offers (with Review button)
  - ⚡ Saathi Broker Negotiations (AI-powered price negotiation)
  - Completed Transactions (Table with CSV export)

---

## Styling Approach

### Color Scheme
- **Collector:** Green/Emerald (primary) + Zinc (neutral)
- **Recycler:** Slate/Neutral (primary) + Emerald (accent)
- **UI Components:** Shadcn/ui + Tailwind CSS

### Responsive Design
- **Collector:** Mobile-first (max-w-md container, fixed BottomNav)
- **Recycler:** Desktop-first (max-w-7xl container, sticky top navbar)

### Icons
- **Lucide React:** LayoutDashboard, Camera, TrendingUp, ShieldCheck, etc.
- **Recharts:** Price trend line chart in collector trends page

---

## Session Management

### Collector Session
```javascript
// Login Success
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('collectorPhone', phone);

// Dashboard Protection
const isAuthenticated = localStorage.getItem('isAuthenticated');
if (!isAuthenticated) {
  router.push('/collector/login');
}

// Logout
localStorage.removeItem('isAuthenticated');
localStorage.removeItem('collectorPhone');
```

### Recycler Session
```javascript
// Login Success
localStorage.setItem('recyclerAuthenticated', 'true');
localStorage.setItem('recyclerName', facility.name);
localStorage.setItem('recyclerGstin', facility.gstin);
localStorage.setItem('recyclerCpcbId', facility.cpcbId);

// Dashboard Protection
const auth = localStorage.getItem('recyclerAuthenticated');
if (auth !== 'true') {
  router.push('/recycler/login');
}
```

---

## Mock Data

### Collector Dashboard
- **Name:** Amit Kumar
- **Phone:** +91-9876543210
- **Trust Score:** 780/1000 (Tier: Excellent)
- **Weight Accuracy:** 96%
- **Verified Earnings:** ₹14,500
- **Recent Lots:** 3 sample lots with statuses

### Recycler Dashboard
- **Metrics:**
  - Inbound E-Waste: 156.8 MT (+12% this month)
  - Active Negotiations: 23 offers (8 awaiting response)
  - Today's Handovers: 5 lots (127.5 kg total)
  - Avg Price Index: ₹312/kg (-2.1% vs yesterday)

### Recyclers (Verification Database)
1. **EcoRecycle Solutions Delhi**
   - GSTIN: 07AACFY8976B1Z5
   - CPCB ID: CPCB/REG/2024/001234

2. **GreenIndia E-Waste Aggregators**
   - GSTIN: 29AAFFD5055K1ZX
   - CPCB ID: CPCB/REG/2024/001235

3. **Bharat Recycling Hub**
   - GSTIN: 12ABCDE1234F1Z0
   - CPCB ID: CPCB/REG/2024/001236

---

## Testing Checklist

- [ ] Landing page loads with portal selection cards
- [ ] Collector login accepts phone in +91XXXXXXXXXX format
- [ ] OTP input works with 4-digit entry
- [ ] OTP countdown timer counts down and allows resend
- [ ] Collector dashboard loads and shows user data
- [ ] BottomNav highlights active route
- [ ] Language toggle (EN/HI) changes text
- [ ] Collector can navigate between tabs using BottomNav
- [ ] Recycler login accepts GSTIN and CPCB ID
- [ ] Recycler verification shows success animation for valid credentials
- [ ] Recycler verification shows error for invalid credentials
- [ ] Recycler dashboard shows navbar with facility info
- [ ] Recycler dashboard tabs switch between content
- [ ] Logout buttons clear session and redirect to login
- [ ] All interactive elements have hover/loading states

---

## Next Steps for Backend Integration

1. **Collector Auth:**
   - Connect phone login to Supabase Auth (OTP provider)
   - Query collector_profiles table by phone
   - Auto-create profile if first-time user

2. **Recycler Verification:**
   - Query recyclers table by GSTIN + CPCB ID
   - Implement real signature/cryptographic verification
   - Add audit logging for access attempts

3. **Dashboard Data:**
   - Fetch real collector stats from transactions table
   - Fetch recycler metrics from lots and transactions
   - Add real-time price updates from price_history

4. **Features:**
   - Camera upload with image compression
   - AI image analysis with Gemini Vision API
   - Real-time Supabase subscriptions for live updates
   - SMS notifications for OTP and alerts

---

## Deployment Notes

- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY`

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Dev Server:** `npm run dev`

---

## Known Limitations (MVP)

- ✋ Phone/OTP and GSTIN verification are mocked (not real API calls)
- ✋ Lots and transactions data are hardcoded samples
- ✋ Camera upload is a placeholder (no actual file upload)
- ✋ No real Supabase Auth integration yet
- ✋ Capacity indicator is static (not real-time)

These will be implemented in the next phase with Supabase Auth and API routes.

---

**Built for:** NIT Delhi Hackathon  
**Tech Stack:** Next.js 15, React 19, Tailwind CSS, Shadcn/UI, Lucide React, Recharts  
**Status:** ✅ Frontend Shells Complete | ⏳ Supabase Integration Pending
