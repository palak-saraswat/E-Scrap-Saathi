'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-slate-50">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-5xl font-bold text-zinc-900 mb-4">
          E-Scrap-Saathi
        </h1>
        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
          AI-Powered Platform for Informal E-Waste Collectors & Authorized Recyclers
        </p>
      </div>

      {/* Portal Selection */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Collector Portal */}
          <Link href="/collector/login" className="block group">
            <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8" />
                  <CardTitle>Collector Portal</CardTitle>
                </div>
                <CardDescription className="text-green-100">
                  For Informal E-Waste Collectors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Upload scrap photos for AI analysis</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Real-time market prices (Bhav)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Track your trust score & earnings</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Connect with verified recyclers</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Micro-credit eligibility</span>
                  </li>
                </ul>

                <Button className="w-full bg-green-600 hover:bg-green-700 h-11 group-hover:translate-x-1 transition-transform">
                  Continue to Collector Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Recycler Portal */}
          <Link href="/recycler/login" className="block group">
            <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-slate-300 hover:border-slate-500 hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-8 w-8" />
                  <CardTitle>Recycler Portal</CardTitle>
                </div>
                <CardDescription className="text-slate-300">
                  For CPCB-Authorized Recyclers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li className="flex gap-2">
                    <span className="text-slate-600 font-bold">✓</span>
                    <span>Verify GSTIN & CPCB registration</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-600 font-bold">✓</span>
                    <span>View incoming e-waste lots</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-600 font-bold">✓</span>
                    <span>AI-powered price negotiations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-600 font-bold">✓</span>
                    <span>Track capacity & volume metrics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-600 font-bold">✓</span>
                    <span>Export transaction history</span>
                  </li>
                </ul>

                <Button variant="outline" className="w-full h-11 group-hover:translate-x-1 transition-transform border-slate-400 hover:bg-slate-50">
                  Continue to Recycler Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto px-4 pb-8 text-center text-sm text-zinc-600">
        <p>
          E-Scrap-Saathi is an Agentic AI platform for informal e-waste management.
        </p>
        <p className="mt-2">
          Built for NIT Delhi Hackathon • Powered by Next.js, Supabase & Gemini AI
        </p>
      </div>
    </div>
  );
}
