'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Award, Banknote, LogOut, Receipt, ShieldCheck, TrendingUp, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function CollectorProfile() {
  const router = useRouter();
  const phone = typeof window !== 'undefined' ? localStorage.getItem('collectorPhone') || '+91-9876543210' : '+91-9876543210';
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') !== 'true') {
      router.push('/collector/login');
    }
  }, [router]);

  const ledgerStats = [
    { label: 'कुल कमाई (Total Earnings)', value: '₹20,125.00' },
    { label: 'कुल रिसाइकल किया (E-Waste Diverted)', value: '48.5 kg' },
    { label: 'AI प्रीमियम लाभ (Extra Earned via AI)', value: '+₹680.00' },
  ];

  const transactions = [
    { title: 'Copper Cables (12.5 kg)', amount: '₹5,625', recycler: 'EcoRecycle Delhi', date: 'Today', highlight: '⚡ Negotiated' },
    { title: 'PCBs Grade A (20.0 kg)', amount: '₹6,400', recycler: 'Bharat Recycling', date: 'Yesterday', highlight: '' },
    { title: 'Lithium Batteries (16.0 kg)', amount: '₹2,600', recycler: 'GreenIndia Hub', date: '3 days ago', highlight: '' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('collectorPhone');
    router.push('/collector/login');
  };

  const openReceipt = (title: string) => {
    setSelectedReceipt(title);
    setShowReceipt(true);
  };

  return (
    <main className="mx-auto max-w-md min-h-screen bg-zinc-50 p-4 pb-24">
      <div className="space-y-5 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-500 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                <User className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-emerald-100">Collector Identity</p>
                <h1 className="text-xl font-black">Amit Kumar</h1>
                <p className="text-xs text-emerald-100">{phone}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/15 text-white hover:bg-white/25" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="border-emerald-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Saathi Trust Score</p>
                <h2 className="mt-2 text-3xl font-black text-zinc-900">800 <span className="text-lg text-zinc-500">/ 1000</span></h2>
              </div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[8px] border-emerald-100 bg-white">
                <motion.div
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 144 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-[8px] border-transparent border-t-emerald-500 border-r-emerald-500"
                  style={{ transform: 'rotate(144deg)' }}
                />
                <span className="text-sm font-bold text-emerald-700">80%</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                🛡️ CPCB Verified Supplier
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Banknote className="mr-1 h-3.5 w-3.5" />
                💳 Micro-Credit Eligible (ऋण हेतु पात्र)
              </Badge>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-emerald-50 p-3 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <Award className="h-4 w-4 text-amber-600" />
                Alternative Credit Power
              </div>
              <p className="mt-2 leading-6">
                🏦 ई-रिक्शा और सुरक्षा उपकरणों के लिए ₹25,000 तक के सूक्ष्म-ऋण (Micro-Loan) के पात्र।
                Eligible for up to ₹25,000 working capital loan based on verified e-waste scrap transactions.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-zinc-900">Collector Earnings Summary</h3>
          <div className="grid gap-3">
            {ledgerStats.map((item) => (
              <Card key={item.label} className="border-zinc-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-zinc-600">{item.label}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-2xl font-black text-zinc-900">{item.value}</p>
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-zinc-900">Transaction History</h3>
          {transactions.map((txn) => (
            <Card key={txn.title} className="border-zinc-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-900">{txn.title}</p>
                    <p className="mt-1 text-xs text-zinc-600">{txn.recycler} • {txn.date}</p>
                    {txn.highlight && <p className="mt-1 text-xs font-medium text-emerald-700">{txn.highlight}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-700">{txn.amount}</p>
                    <Button variant="outline" size="sm" className="mt-2 h-8 px-2 text-xs" onClick={() => openReceipt(txn.title)}>
                      <Receipt className="mr-1 h-3.5 w-3.5" />
                      🧾 रसीद (Receipt)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Receipt Summary</DialogTitle>
            <DialogDescription>
              {selectedReceipt ?? 'Transaction receipt'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <div className="flex justify-between"><span>Base payout</span><span>₹5,625.00</span></div>
            <div className="flex justify-between"><span>AI premium</span><span>+₹425.00</span></div>
            <div className="flex justify-between"><span>Service fee</span><span>-₹0.00</span></div>
            <Separator />
            <div className="flex justify-between font-semibold text-zinc-900"><span>Total</span><span>₹6,050.00</span></div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowReceipt(false)} className="w-full bg-emerald-700 hover:bg-emerald-800">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
