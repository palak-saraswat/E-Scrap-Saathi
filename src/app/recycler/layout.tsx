'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecyclerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [facilityName, setFacilityName] = useState('');
  const [cpcbId, setCpcbId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('recyclerAuthenticated');
    const name = localStorage.getItem('recyclerName');
    const id = localStorage.getItem('recyclerCpcbId');

    if (auth === 'true' && name && id) {
      setIsAuthenticated(true);
      setFacilityName(name);
      setCpcbId(id);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('recyclerAuthenticated');
    localStorage.removeItem('recyclerName');
    localStorage.removeItem('recyclerCpcbId');
    localStorage.removeItem('recyclerGstin');
    router.push('/recycler/login');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

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
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Capacity Indicator */}
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
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
