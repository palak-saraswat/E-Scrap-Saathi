'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Recycle, Camera, TrendingUp, Handshake } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        {/* Animated Recycling Icon with Glow */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 rounded-full animate-pulse" />
            {/* Icon */}
            <div className="relative">
              <Recycle className="h-24 w-24 text-green-600 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Title with Hindi */}
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-zinc-900 mb-2">
            E-Scrap-Saathi
          </h1>
          <p className="text-3xl font-semibold text-green-700">
            ई-स्क्रैप साथी
          </p>
        </div>

        {/* Tagline Badge */}
        <div className="mb-6 flex justify-center">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-4 py-2 text-base font-semibold">
            🌿 Identify. Value. Verify. Recycle.
          </Badge>
        </div>

        {/* Subtitle */}
        <p className="text-xl text-zinc-700 max-w-3xl mx-auto mb-2">
          AI Decision & Trust Layer for Informal E-Waste Collectors & Recyclers
        </p>
        <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
          Bridging the gap between informal collectors and authorized recyclers through AI-powered trust, transparent pricing, and sustainable e-waste management.
        </p>
      </div>

      {/* Primary CTA Buttons */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Collector Button */}
          <Link href="/collector/login" className="block group">
            <Button className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl mr-3">📱</span>
              <span className="text-left">
                <div className="font-bold">कबाड़ विक्रेता लॉगिन</div>
                <div className="text-sm font-normal opacity-90">Collector Login</div>
              </span>
            </Button>
          </Link>

          {/* Recycler Button */}
          <Link href="/recycler/login" className="block group">
            <Button
              variant="outline"
              className="w-full h-16 border-2 border-slate-400 text-slate-900 font-semibold text-lg rounded-xl shadow-md hover:shadow-xl hover:border-slate-600 transition-all duration-300 group-hover:scale-105 hover:bg-slate-50"
            >
              <span className="text-2xl mr-3">🏢</span>
              <span className="text-left">
                <div className="font-bold">अधिकृत रीसाइक्लर पोर्टल</div>
                <div className="text-sm font-normal">Recycler Portal - GST/CPCB Auth</div>
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Features Highlight */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-center text-zinc-900 mb-12">
          Why E-Scrap-Saathi?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-lg">
                  <Camera className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">
                📸 Scale OCR & Hazard Detection
              </h3>
              <p className="text-sm text-zinc-700">
                AI-powered image analysis instantly identifies material types, estimates weight, and flags hazardous materials for safety compliance.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">
                📈 30-Day BuyHatke Price Trends
              </h3>
              <p className="text-sm text-zinc-700">
                Real-time market rates updated daily. Collectors get transparent pricing so they know exactly what their scrap is worth.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-purple-100 rounded-lg">
                  <Handshake className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">
                🤝 Autonomous Saathi Broker Negotiation
              </h3>
              <p className="text-sm text-zinc-700">
                AI agent negotiates bulk deals between collectors and recyclers, maximizing value for both parties without middlemen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-zinc-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-zinc-400 space-y-2">
          <p>
            E-Scrap-Saathi: Formalizing the informal e-waste ecosystem through AI-powered trust and transparent markets.
          </p>
          <p>
            Built for NIT Delhi Hackathon • Powered by Next.js 15, Supabase, Gemini AI & Tailwind CSS
          </p>
          <p className="text-zinc-500 pt-4">
            🌍 Sustainable E-Waste Management • 💰 Fair Compensation • 🤖 AI-Driven Trust
          </p>
        </div>
      </div>
    </div>
  );
}
