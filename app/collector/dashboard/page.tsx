'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Camera, TrendingUp, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Lot {
  id: string;
  material: string;
  weight: string;
  amount: string;
  status: 'completed' | 'negotiating' | 'pending';
}

export default function CollectorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [collectorName, setCollectorName] = useState('Amit Kumar');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const recentLots: Lot[] = [
    {
      id: '1',
      material: 'Copper Cables',
      weight: '12.5 kg',
      amount: '₹5,125',
      status: 'completed',
    },
    {
      id: '2',
      material: 'PCB Boards',
      weight: '25 kg',
      amount: '₹7,500',
      status: 'negotiating',
    },
    {
      id: '3',
      material: 'Old Phones',
      weight: '8.2 kg',
      amount: 'Pending',
      status: 'pending',
    },
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/collector/login');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('collectorPhone');
    router.push('/collector/login');
  };

  const getStatusColor = (status: Lot['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'negotiating':
        return 'bg-amber-100 text-amber-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: Lot['status']) => {
    const labels: Record<Lot['status'], { en: string; hi: string }> = {
      completed: { en: 'Completed', hi: 'पूर्ण' },
      negotiating: { en: 'In Negotiation', hi: 'वार्ता में' },
      pending: { en: 'Pending', hi: 'प्रतीक्षा में' },
    };
    return labels[status][language];
  };

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-50" />;
  }

  const headerText = language === 'en' ? 'Hello, Saathi! 👋' : 'नमस्ते, साथी! 👋';
  const trustText = language === 'en' ? 'Trust Score' : 'विश्वास स्कोर';
  const tierText = language === 'en' ? 'Excellent' : 'उत्कृष्ट';
  const microCreditText = language === 'en' ? 'Micro-Credit Eligible' : 'सूक्ष्म-ऋण योग्य';
  const accuracyText = language === 'en' ? 'Weight Accuracy' : 'वजन सटीकता';
  const earningsText = language === 'en' ? 'Verified Earnings' : 'सत्यापित आय';
  const addScrapText = language === 'en' ? 'Add New Scrap Lot' : 'नया स्क्रैप जोड़ें';
  const todayBhavText = language === 'en' ? "Check Today's Bhav" : 'आज के भाव देखें';
  const recentLotsText = language === 'en' ? 'Recent Lots' : 'हाल के लॉट';

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{headerText}</h1>
          <p className="text-sm text-zinc-600">
            {language === 'en' ? 'Welcome back, collector!' : 'स्वागत है, संग्रहकर्ता!'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="text-xs"
        >
          {language === 'en' ? 'हिंदी' : 'EN'}
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">{trustText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-green-600">780</span>
                <span className="text-lg text-zinc-600">/1000</span>
              </div>
              <p className="text-sm text-zinc-600 mt-1">
                Tier: <span className="font-semibold text-green-700">{tierText}</span>
              </p>
            </div>
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">78%</span>
            </div>
          </div>

          <Badge className="bg-green-600 hover:bg-green-700 w-fit">
            ✓ {microCreditText}
          </Badge>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-xs text-zinc-600">{accuracyText}</p>
              <p className="text-lg font-bold text-green-600">96%</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-xs text-zinc-600">{earningsText}</p>
              <p className="text-lg font-bold text-green-600">₹14.5k</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Link href="/collector/add-scrap" className="block">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Camera className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{addScrapText}</p>
                <p className="text-sm text-green-100">Take photo & upload</p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/collector/trends" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900">{todayBhavText}</p>
                <p className="text-sm text-zinc-600">Live market prices</p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-400" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-zinc-900">{recentLotsText}</h2>
        <div className="space-y-2">
          {recentLots.map((lot) => (
            <Card key={lot.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-900">{lot.material}</h3>
                  <Badge variant="outline" className={getStatusColor(lot.status)}>
                    {getStatusLabel(lot.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{lot.weight}</span>
                  <span className="font-semibold text-green-600">{lot.amount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-red-200 text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
