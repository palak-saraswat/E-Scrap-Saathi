'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Award, TrendingUp, Wallet, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('collectorPhone');
    router.push('/collector/login');
  };

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">💳 Profile & Trust</h1>
        <p className="text-sm text-zinc-600 mt-1">Your Saathi collector profile</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
              AK
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Amit Kumar</h2>
              <p className="text-sm text-zinc-600">+91-9876543210</p>
              <Badge className="bg-green-600 hover:bg-green-700 mt-2">
                <Shield className="h-3 w-3 mr-1" />
                Verified Collector
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Award className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">780</span>
            </div>
            <p className="text-xs text-zinc-600">Trust Score</p>
            <p className="text-xs font-semibold text-zinc-900">Tier: Excellent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Wallet className="h-5 w-5 text-green-600" />
              <span className="text-xl font-bold text-green-600">₹14.5k</span>
            </div>
            <p className="text-xs text-zinc-600">Total Earnings</p>
            <p className="text-xs text-zinc-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">96%</span>
            </div>
            <p className="text-xs text-zinc-600">Accuracy</p>
            <p className="text-xs text-zinc-500">Weight measurement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📦</span>
              <span className="text-2xl font-bold text-purple-600">47</span>
            </div>
            <p className="text-xs text-zinc-600">Total Lots</p>
            <p className="text-xs text-zinc-500">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span>🎁</span>
            Collector Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-lg">✓</span>
            <div className="text-sm">
              <p className="font-semibold text-green-900">Micro-Credit Eligible</p>
              <p className="text-xs text-green-700">Up to ₹50,000 at low interest</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-lg">✓</span>
            <div className="text-sm">
              <p className="font-semibold text-blue-900">Premium Pricing Access</p>
              <p className="text-xs text-blue-700">Extra ₹10-15/kg on bulk orders</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <span className="text-lg">✓</span>
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Insurance Coverage</p>
              <p className="text-xs text-amber-700">₹2,00,000 accident cover included</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start h-11">
          ⚙️ Edit Profile
        </Button>
        <Button variant="outline" className="w-full justify-start h-11">
          📱 Manage Bank Details
        </Button>
        <Button variant="outline" className="w-full justify-start h-11">
          🔔 Notifications & Alerts
        </Button>
      </div>

      <Button
        variant="outline"
        className="w-full border-red-200 text-red-600 hover:bg-red-50 h-11"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 text-xs text-slate-600 space-y-1">
          <p>Version 1.0.0 • E-Scrap-Saathi</p>
          <p>Built for NIT Delhi Hackathon</p>
        </CardContent>
      </Card>
    </div>
  );
}
