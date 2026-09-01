'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Phone,
  CheckCircle2,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Lock,
  Heart,
  LogOut,
  Edit,
  Wallet,
  Bell,
} from 'lucide-react';

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export default function CollectorProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userPhone = localStorage.getItem('collectorPhone');

    if (!isAuthenticated) {
      router.push('/collector/login');
    } else {
      setPhone(userPhone || '');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('collectorPhone');
    router.push('/collector/login');
  };

  const stats = [
    { icon: CheckCircle2, label: 'Trust Score', value: '780/1000', color: 'text-green-600' },
    { icon: TrendingUp, label: 'Total Earnings', value: '₹45,000', color: 'text-blue-600' },
    { icon: Target, label: 'Accuracy Rate', value: '96%', color: 'text-amber-600' },
    { icon: BarChart3, label: 'Total Lots', value: '47', color: 'text-purple-600' },
  ];

  const benefits: Benefit[] = [
    {
      icon: Zap,
      title: 'Micro-Credit Facility',
      description: 'Access ₹50K - ₹2L credit at zero interest for upgrading equipment',
    },
    {
      icon: TrendingUp,
      title: 'Premium Pricing',
      description: 'Get 3-5% better rates on your materials due to high trust score',
    },
    {
      icon: Heart,
      title: 'Accident Insurance',
      description: '₹5L coverage for work-related injuries and medical emergencies',
    },
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-50" />;
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Amit Kumar</h1>
              <div className="flex items-center gap-2 mt-1 text-green-100">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{phone}</span>
              </div>
              <Badge className="mt-2 bg-white text-green-600 hover:bg-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified Collector
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="space-y-2">
        <h2 className="font-semibold text-zinc-900 px-1">Your Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-zinc-600 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" className="h-12 flex flex-col items-center justify-center gap-1">
          <Edit className="h-4 w-4" />
          <span className="text-xs">Edit Profile</span>
        </Button>
        <Button variant="outline" className="h-12 flex flex-col items-center justify-center gap-1">
          <Wallet className="h-4 w-4" />
          <span className="text-xs">Bank Details</span>
        </Button>
        <Button variant="outline" className="h-12 flex flex-col items-center justify-center gap-1">
          <Bell className="h-4 w-4" />
          <span className="text-xs">Notifications</span>
        </Button>
      </div>

      <Separator />

      {/* Benefits Section */}
      <div className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Your Benefits</h2>
        <div className="space-y-2">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-green-600 mt-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 text-sm">{benefit.title}</p>
                      <p className="text-xs text-zinc-600 mt-1">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Security Section */}
      <div className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Security & Privacy</h2>
        <Button variant="outline" className="w-full justify-start h-11">
          <Lock className="h-4 w-4 mr-3" />
          Change Password
        </Button>
      </div>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white h-11"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>

      <p className="text-xs text-center text-zinc-600 pb-4">
        App Version 1.0.0 | Last updated: Aug 30, 2024
      </p>
    </div>
  );
}
