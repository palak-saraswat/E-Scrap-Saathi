'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface MockRecycler {
  name: string;
  gstin: string;
  cpcbId: string;
}

// Mock recyclers database
const MOCK_RECYCLERS: MockRecycler[] = [
  {
    name: 'EcoRecycle Solutions Delhi',
    gstin: '07AACFY8976B1Z5',
    cpcbId: 'CPCB/REG/2024/001234',
  },
  {
    name: 'GreenIndia E-Waste Aggregators',
    gstin: '29AAFFD5055K1ZX',
    cpcbId: 'CPCB/REG/2024/001235',
  },
  {
    name: 'Bharat Recycling Hub',
    gstin: '12ABCDE1234F1Z0',
    cpcbId: 'CPCB/REG/2024/001236',
  },
];

export default function RecyclerLogin() {
  const router = useRouter();
  const [gstin, setGstin] = useState('');
  const [cpcbId, setCpcbId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifiedFacility, setVerifiedFacility] = useState<MockRecycler | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!gstin.trim() || !cpcbId.trim()) {
      setError('Please enter both GSTIN and CPCB ID');
      return;
    }

    setIsLoading(true);
    // Simulate verification API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check against mock database
    const facility = MOCK_RECYCLERS.find(
      (r) => r.gstin === gstin.toUpperCase() && r.cpcbId === cpcbId.toUpperCase()
    );

    if (facility) {
      setVerified(true);
      setVerifiedFacility(facility);
      setIsLoading(false);

      // Wait for animation then redirect
      await new Promise((resolve) => setTimeout(resolve, 2000));
      localStorage.setItem('recyclerAuthenticated', 'true');
      localStorage.setItem('recyclerName', facility.name);
      localStorage.setItem('recyclerGstin', facility.gstin);
      localStorage.setItem('recyclerCpcbId', facility.cpcbId);
      router.push('/recycler/dashboard');
    } else {
      setIsLoading(false);
      setError('Unauthorized entity. Only CPCB-registered facilities can access this portal.');
    }
  };

  if (verified && verifiedFacility) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-20 w-20 text-green-600 animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                Authorized Facility Verified
              </h2>
              <p className="text-sm text-zinc-600">by Central Pollution Control Board</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <p className="text-xs text-zinc-600 mb-1">Facility Name</p>
              <p className="font-semibold text-green-700 text-lg mb-4">{verifiedFacility.name}</p>
              <p className="text-xs text-zinc-600 mb-1">CPCB ID</p>
              <p className="font-mono text-sm text-green-700 mb-4">{verifiedFacility.cpcbId}</p>
              <p className="text-xs text-zinc-600 mb-1">GSTIN</p>
              <p className="font-mono text-sm text-green-700">{verifiedFacility.gstin}</p>
            </div>
            <p className="text-xs text-zinc-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <CardTitle className="text-2xl">E-Scrap-Saathi</CardTitle>
          <CardDescription className="text-slate-300">
            Recycler Portal - CPCB Verification
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8 pb-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">
              Authorized Recycler Access
            </h2>
            <p className="text-sm text-zinc-600">
              Enter your facility's GST and CPCB registration details to verify
              authorization and access the buyer portal.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                GSTIN (Goods & Service Tax ID)
              </label>
              <Input
                type="text"
                placeholder="e.g., 07AACFY8976B1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="font-mono text-sm"
              />
              <p className="text-xs text-zinc-500">
                15-character GST registration number
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                CPCB Registration ID
              </label>
              <Input
                type="text"
                placeholder="e.g., CPCB/REG/2024/001234"
                value={cpcbId}
                onChange={(e) => setCpcbId(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="font-mono text-sm"
              />
              <p className="text-xs text-zinc-500">
                Central Pollution Control Board registration ID
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !gstin.trim() || !cpcbId.trim()}
              className="w-full h-11 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Authorization'
              )}
            </Button>
          </form>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-700 uppercase">Demo Credentials</p>
            <div className="space-y-1 text-xs font-mono text-slate-600">
              <p>
                <span className="text-slate-500">GSTIN:</span> 07AACFY8976B1Z5
              </p>
              <p>
                <span className="text-slate-500">CPCB:</span> CPCB/REG/2024/001234
              </p>
            </div>
          </div>

          <p className="text-xs text-center text-zinc-500">
            This portal is restricted to CPCB-authorized e-waste recycling facilities only.
            Unauthorized access is prohibited by Indian law.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
