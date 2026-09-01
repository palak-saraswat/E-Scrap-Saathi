'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Copy, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function generatePin() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
}

export default function HandoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lotId = searchParams.get('lot_id') ?? 'ESS-92841';
  const recyclerId = searchParams.get('recycler_id') ?? 'rec_eco_delhi';
  const amount = Number(searchParams.get('amount') ?? '5625.00') || 5625;

  const [pin] = useState<number[]>(() => generatePin());
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<{ trust_score: number; total_earnings: number; tier: string } | null>(null);

  const qrCodeUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`handover:${lotId}:recycler:${recyclerId}:pin:${pin.join('')}`)}`,
    [lotId, recyclerId, pin]
  );

  const handleCopy = async () => {
    const code = pin.join('');
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/agents/trust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: lotId,
          recycler_id: recyclerId,
          amount,
          collector_phone: typeof window !== 'undefined' ? localStorage.getItem('collectorPhone') || '+91-9876543210' : '+91-9876543210',
          previous_trust_score: 780,
          previous_earnings: 20125,
        }),
      });

      const payload = await response.json();
      setResult(payload.profile ?? { trust_score: 800, total_earnings: 20125 + amount, tier: 'Tier 1' });
      setIsOpen(true);
      setTimeout(() => router.push('/collector/profile'), 1800);
    } catch {
      const fallback = { trust_score: 800, total_earnings: 20125 + amount, tier: 'Tier 1' };
      setResult(fallback);
      setIsOpen(true);
      setTimeout(() => router.push('/collector/profile'), 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md min-h-screen bg-zinc-50 p-4 pb-20">
      <div className="space-y-4 pt-4">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Handover</p>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950">📦 कबाड़ सुपुर्दगी (Handover Confirmation)</h1>
        </header>

        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Handover Security</p>
                <h2 className="mt-1 text-base font-bold text-zinc-900">रीसाइक्लर को यह 4-अंकों का कोड बताएं (Share this 4-digit code with the recycler pickup agent)</h2>
              </div>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Verified
              </Badge>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between text-xs text-zinc-600">
                <span>Pickup PIN</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-emerald-700 hover:bg-emerald-50">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2">
                {pin.map((digit, index) => (
                  <div key={`${digit}-${index}`} className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-3xl font-black text-emerald-700 shadow-inner">
                    {digit}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2">
                <Image src={qrCodeUrl} alt="Pickup QR code" width={80} height={80} className="h-20 w-20 rounded-lg object-cover" />
              </div>
              <div className="flex-1 text-sm text-zinc-700">
                <p className="font-semibold text-zinc-900">EcoRecycle Solutions Delhi (CPCB Authorized)</p>
                <p className="mt-1 text-xs text-zinc-600">Lot ID: {lotId}</p>
                <p className="mt-1 text-xs text-zinc-600">Recycler ID: {recyclerId}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center justify-between gap-3 text-sm text-amber-900">
                <span>Final Agreed Payout</span>
                <span className="text-lg font-black">₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-amber-800">⚡ Premium Negotiated</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <Button
              size="lg"
              className="h-12 w-full bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing…' : '✓ डिलीवरी और भुगतान पूर्ण हुआ (Confirm Handover & Payment Received)'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
                <Sparkles className="h-7 w-7 text-emerald-600" />
              </motion.div>
            </div>
            <DialogTitle className="text-center text-xl">Handover confirmed</DialogTitle>
            <DialogDescription className="text-center">
              Saathi Trust Score updated successfully. Redirecting to your profile…
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-900">
            <p className="font-semibold">Updated Trust Score: {result?.trust_score ?? 800}/1000</p>
            <p className="mt-1">Earnings ledger: ₹{(result?.total_earnings ?? 20125 + amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="mt-1">Tier: {result?.tier ?? 'Tier 1'}</p>
          </div>

          <DialogFooter>
            <Button onClick={() => router.push('/collector/profile')} className="w-full bg-emerald-700 hover:bg-emerald-800">
              View Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
