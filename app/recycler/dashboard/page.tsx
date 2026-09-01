'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  CheckCircle2,
  Download,
  Eye,
  Zap,
  LogOut,
} from 'lucide-react';

interface MetricCard {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'amber' | 'green' | 'purple';
}

interface IncomingLot {
  id: string;
  material: string;
  weight: string;
  collector: string;
  status: 'pending' | 'reviewed' | 'offered';
}

interface Negotiation {
  id: string;
  material: string;
  quantity: string;
  suggestedPrice: string;
  offerCount: number;
}

interface Transaction {
  id: string;
  date: string;
  material: string;
  quantity: string;
  price: string;
  collector: string;
}

export default function RecyclerDashboard() {
  const router = useRouter();
  const facilityName = typeof window !== 'undefined' ? localStorage.getItem('recyclerName') || '' : '';
  const cpcbId = typeof window !== 'undefined' ? localStorage.getItem('recyclerCpcbId') || '' : '';

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('recyclerAuthenticated') !== 'true') {
      router.push('/recycler/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('recyclerAuthenticated');
    localStorage.removeItem('recyclerName');
    localStorage.removeItem('recyclerCpcbId');
    localStorage.removeItem('recyclerGstin');
    router.push('/recycler/login');
  };

  const metrics: MetricCard[] = [
    {
      label: 'Total Inbound E-Waste',
      value: '156.8',
      unit: 'MT',
      trend: '+12% this month',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Active Negotiations',
      value: '23',
      unit: 'Offers',
      trend: '8 awaiting response',
      icon: Zap,
      color: 'amber',
    },
    {
      label: "Today's Scheduled Handovers",
      value: '5',
      unit: 'Lots',
      trend: '127.5 kg total',
      icon: CheckCircle2,
      color: 'green',
    },
    {
      label: 'Avg Buying Price Index',
      value: '₹312',
      unit: '/kg',
      trend: '-2.1% vs. yesterday',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  const incomingLots: IncomingLot[] = [
    {
      id: '1',
      material: 'Copper Cables',
      weight: '12.5 kg',
      collector: 'Amit Kumar',
      status: 'pending',
    },
    {
      id: '2',
      material: 'PCB Boards',
      weight: '25 kg',
      collector: 'Rajesh Singh',
      status: 'reviewed',
    },
    {
      id: '3',
      material: 'Lithium Batteries',
      weight: '8.2 kg',
      collector: 'Priya Sharma',
      status: 'offered',
    },
    {
      id: '4',
      material: 'CRT Monitors',
      weight: '42.5 kg',
      collector: 'Dev Patel',
      status: 'pending',
    },
  ];

  const negotiations: Negotiation[] = [
    {
      id: '1',
      material: 'Copper Cables (Bulk)',
      quantity: '250 kg',
      suggestedPrice: '₹425/kg',
      offerCount: 3,
    },
    {
      id: '2',
      material: 'Mixed PCBs (Grade A)',
      quantity: '180 kg',
      suggestedPrice: '₹315/kg',
      offerCount: 5,
    },
    {
      id: '3',
      material: 'Lithium Batteries',
      quantity: '95 kg',
      suggestedPrice: '₹150/kg',
      offerCount: 2,
    },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-08-29',
      material: 'Copper Cables',
      quantity: '50 kg',
      price: '₹21,250',
      collector: 'Amit Kumar',
    },
    {
      id: '2',
      date: '2024-08-28',
      material: 'PCB Boards',
      quantity: '75 kg',
      price: '₹23,625',
      collector: 'Rajesh Singh',
    },
    {
      id: '3',
      date: '2024-08-27',
      material: 'Mixed E-waste',
      quantity: '120 kg',
      price: '₹28,500',
      collector: 'Priya Sharma',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; border: string }> = {
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
      amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200' },
      green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
    };
    return colors[color];
  };

  const getStatusBadge = (status: IncomingLot['status']) => {
    const badges = {
      pending: { label: 'Pending Review', color: 'bg-slate-100 text-slate-700' },
      reviewed: { label: 'Reviewed', color: 'bg-blue-100 text-blue-700' },
      offered: { label: 'Offer Made', color: 'bg-green-100 text-green-700' },
    };
    return badges[status];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900">
                E-Scrap-Saathi
              </h1>
              <p className="text-xs text-slate-600">Recycler Hub</p>
            </div>
          </div>

          <div className="flex-1 ml-12 max-w-md">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <h2 className="font-semibold text-slate-900 text-sm">
                  {facilityName}
                </h2>
                <p className="text-xs text-slate-600">{cpcbId}</p>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-600">Active Capacity</p>
              <p className="font-semibold text-slate-900">65% (13.5 / 20 MT)</p>
              <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-amber-500 to-orange-500" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const colorClasses = getColorClasses(metric.color);

            return (
              <Card
                key={metric.label}
                className={`${colorClasses.bg} border ${colorClasses.border} hover:shadow-md transition-shadow`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">{metric.label}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-bold text-slate-900">
                          {metric.value}
                        </span>
                        {metric.unit && (
                          <span className="text-sm text-slate-600">{metric.unit}</span>
                        )}
                      </div>
                    </div>
                    <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
                  </div>
                  {metric.trend && (
                    <p className="text-xs text-slate-600">{metric.trend}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-200">
            <TabsTrigger value="incoming">Incoming Lots & Offers</TabsTrigger>
            <TabsTrigger value="negotiations">
              ⚡ Saathi Broker Negotiations
            </TabsTrigger>
            <TabsTrigger value="completed">Completed Transactions</TabsTrigger>
          </TabsList>

          {/* Tab 1: Incoming Lots */}
          <TabsContent value="incoming" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {incomingLots.map((lot) => {
                const badge = getStatusBadge(lot.status);
                return (
                  <Card key={lot.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-zinc-900">{lot.material}</h3>
                        <Badge variant="outline" className={badge.color}>
                          {badge.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-slate-600">Weight</p>
                          <p className="font-semibold text-slate-900">{lot.weight}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Collector</p>
                          <p className="font-semibold text-slate-900">{lot.collector}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Action</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-1 h-7"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Tab 2: Saathi Broker Negotiations */}
          <TabsContent value="negotiations" className="space-y-4 mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 mb-4">
              <Zap className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">AI-Powered Negotiations</p>
                <p className="text-xs mt-1">
                  Saathi agent actively negotiates bulk material prices based on market trends
                  and buyer demand.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {negotiations.map((neg) => (
                <Card key={neg.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-zinc-900">{neg.material}</h3>
                        <p className="text-sm text-slate-600 mt-1">{neg.quantity}</p>
                      </div>
                      <Badge className="bg-green-600 hover:bg-green-700">
                        {neg.offerCount} Offers
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-green-600">
                        {neg.suggestedPrice}
                      </p>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Review Offers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 3: Completed Transactions */}
          <TabsContent value="completed" className="space-y-4 mt-6">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr className="text-left text-sm font-semibold text-slate-700">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Material</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Total Price</th>
                    <th className="px-4 py-3">Collector</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {txn.date}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {txn.material}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {txn.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">
                        {txn.price}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {txn.collector}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
