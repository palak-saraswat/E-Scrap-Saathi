'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, CircuitBoard, Factory, LoaderCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/components/ecostream/language-provider';

type Role = 'collector' | 'recycler';
const DEMO_OTP = '1234';
const DEMO_RECYCLER = {
  gstin: '07AACFY8976B1Z5',
  cpcb: 'CPCB/REG/2024/001234',
  name: 'EcoRecycle Solutions Delhi',
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, toggleLanguage } = useLanguage();
  const [role, setRole] = useState<Role>(() => (searchParams.get('role') === 'recycler' ? 'recycler' : 'collector'));
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [gstin, setGstin] = useState('');
  const [cpcb, setCpcb] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const hi = language === 'hi';

  useEffect(() => {
    if (!otpSent || seconds === 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [otpSent, seconds]);

  function selectRole(nextRole: Role) {
    setRole(nextRole);
    setError('');
    setVerified(false);
    setOtpSent(false);
  }

  async function sendOtp(event: FormEvent) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError(hi ? '10 अंकों का सही मोबाइल नंबर डालें।' : 'Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    setOtpSent(true);
    setSeconds(30);
    setError('');
  }

  async function verifyCollector(event: FormEvent) {
    event.preventDefault();
    if (otp.join('') !== DEMO_OTP) {
      setError(hi ? 'गलत OTP। Demo OTP 1234 है।' : 'Invalid OTP. Use demo OTP 1234.');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    localStorage.setItem('collectorPhone', `+91${phone.replace(/\D/g, '')}`);
    localStorage.setItem('isAuthenticated', 'true');
    setLoading(false);
    router.push('/collector/dashboard');
  }

  async function verifyRecycler(event: FormEvent) {
    event.preventDefault();
    const normalizedGstin = gstin.toUpperCase().replace(/\s/g, '');
    const normalizedCpcb = cpcb.toUpperCase().trim();

    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(normalizedGstin)) {
      setError(hi ? 'GSTIN 15 अक्षरों का सही format नहीं है।' : 'Enter a valid 15-character GSTIN.');
      return;
    }

    if (!/^CPCB\/REG\/\d{4}\/\d{6}$/.test(normalizedCpcb)) {
      setError(hi ? 'CPCB Registration ID का format सही नहीं है।' : 'Enter a valid CPCB Registration ID.');
      return;
    }

    if (normalizedGstin !== DEMO_RECYCLER.gstin || normalizedCpcb !== DEMO_RECYCLER.cpcb) {
      setError(hi ? 'यह facility CPCB verified list में नहीं मिली।' : 'These credentials were not found in the CPCB verified list.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setVerified(true);
    localStorage.setItem('recyclerAuthenticated', 'true');
    localStorage.setItem('recyclerName', DEMO_RECYCLER.name);
    localStorage.setItem('recyclerGstin', normalizedGstin);
    localStorage.setItem('recyclerCpcbId', normalizedCpcb);
    setLoading(false);
    setTimeout(() => router.push('/recycler/dashboard'), 900);
  }

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp((current) => current.map((item, itemIndex) => (itemIndex === index ? digit : item)));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-900">
            <ArrowLeft className="h-4 w-4" />
            {hi ? 'होम' : 'Back to Home'}
          </Link>
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-950">
            <span className="flex h-9 w-9 items-center justify-center bg-blue-900 text-white">
              <CircuitBoard className="h-5 w-5" />
            </span>
            E-Scrap<span className="text-emerald-600">-Saathi</span>
          </Link>
          <button type="button" onClick={toggleLanguage} className="border border-slate-200 px-3 py-2 text-xs font-bold text-blue-900">
            {hi ? 'English' : 'हिंदी'}
          </button>
        </header>

        <section className="mx-auto max-w-xl py-10">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-700">Secure Partner Access</p>
            <h1 className="mt-2 text-3xl font-bold text-blue-950">{hi ? 'पहचान सत्यापित करें' : 'Verify your identity'}</h1>
            <p className="mt-2 text-sm text-slate-600">{hi ? 'सत्यापन के बाद ही dashboard खुलेगा।' : 'Your dashboard opens only after secure verification.'}</p>
          </div>

          <div className="grid grid-cols-2 border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => selectRole('collector')}
              className={`flex items-center justify-center gap-2 px-3 py-4 text-sm font-bold ${role === 'collector' ? 'bg-blue-900 text-white' : 'text-slate-600'}`}
            >
              <Phone className="h-4 w-4" />
              कबाड़ी भाई / Collector
            </button>
            <button
              type="button"
              onClick={() => selectRole('recycler')}
              className={`flex items-center justify-center gap-2 px-3 py-4 text-sm font-bold ${role === 'recycler' ? 'bg-blue-900 text-white' : 'text-slate-600'}`}
            >
              <Factory className="h-4 w-4" />
              रीसाइक्लिंग प्लांट
            </button>
          </div>

          {verified ? (
            <div className="mt-5 border border-emerald-200 bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-4 text-lg font-bold text-emerald-900">{hi ? 'सत्यापन सफल' : 'Verification complete'}</p>
              <p className="mt-2 text-sm text-emerald-800">{hi ? 'रीसाइक्लर डैशबोर्ड पर जाएँ।' : 'Redirecting to the recycler dashboard.'}</p>
            </div>
          ) : role === 'collector' ? (
            <form onSubmit={sendOtp} className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">{hi ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={hi ? '10 अंकों का नंबर' : '10-digit mobile'}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    maxLength={10}
                  />
                </div>
              </div>

              {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}

              {!otpSent ? (
                <button type="submit" disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-blue-900 text-sm font-bold text-white disabled:opacity-70">
                  {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : hi ? 'OTP भेजें' : 'Send OTP'}
                </button>
              ) : (
                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">{hi ? 'OTP दर्ज करें' : 'Enter OTP'}</label>
                    <div className="flex items-center justify-between gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          value={otp[index]}
                          onChange={(event) => updateOtp(index, event.target.value)}
                          className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-bold text-slate-900 outline-none focus:border-blue-900"
                          maxLength={1}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{hi ? 'OTP नहीं मिला?' : "Didn't receive OTP?"}</span>
                    <button type="button" onClick={() => setOtpSent(false)} className="font-semibold text-blue-900">
                      {hi ? 'फिर से भेजें' : 'Resend'}
                    </button>
                  </div>

                  <button type="button" onClick={verifyCollector} disabled={loading} className="flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white disabled:opacity-70">
                    {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : hi ? 'लॉगिन करें' : 'Verify & Login'}
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={verifyRecycler} className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">GSTIN</label>
                  <input
                    value={gstin}
                    onChange={(event) => setGstin(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-blue-900"
                    placeholder="07AACFY8976B1Z5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">CPCB Registration ID</label>
                  <input
                    value={cpcb}
                    onChange={(event) => setCpcb(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-blue-900"
                    placeholder="CPCB/REG/2024/001234"
                  />
                </div>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center rounded-2xl bg-blue-900 text-sm font-bold text-white disabled:opacity-70">
                  {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : hi ? 'सत्यापित करें' : 'Verify Facility'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <LoginPageContent />
    </Suspense>
  );
}
