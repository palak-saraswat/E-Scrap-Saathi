'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle2, Factory, LoaderCircle, LockKeyhole, Phone, ShieldCheck } from 'lucide-react';
import { BrandLockup } from '@/components/Navbar';
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
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const hi = language === 'hi';

  useEffect(() => {
    if (!otpSent || seconds === 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [otpSent, seconds]);

  useEffect(() => {
    if (otpSent) otpRefs.current[0]?.focus();
  }, [otpSent]);

  // Auto-submit once the final OTP digit is entered
  useEffect(() => {
    if (otpSent && otp.every(Boolean) && !loading) {
      void verifyCollector();
    }
  }, [otp, otpSent, loading]);

  function selectRole(nextRole: Role) {
    setRole(nextRole);
    setError('');
    setVerified(false);
    setOtpSent(false);
    setOtp(['', '', '', '']);
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

  async function verifyCollector(event?: FormEvent) {
    event?.preventDefault();
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
    window.setTimeout(() => router.push('/recycler/dashboard'), 900);
  }

  function updateOtp(index: number, value: string) {
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      setOtp((current) => current.map((item, itemIndex) => (itemIndex === index ? '' : item)));
      return;
    }
    const digit = digits[digits.length - 1];
    setOtp((current) => current.map((item, itemIndex) => (itemIndex === index ? digit : item)));
    otpRefs.current[Math.min(index + 1, 3)]?.focus();
  }

  function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      setOtp((current) => current.map((item, itemIndex) => (itemIndex === index - 1 ? '' : item)));
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    setOtp(Array.from({ length: 4 }, (_, index) => pasted[index] ?? ''));
    otpRefs.current[Math.min(pasted.length, 4) - 1]?.focus();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-900">
            <ArrowLeft className="h-4 w-4" />
            {hi ? 'होम' : 'Back to Home'}
          </Link>
          <BrandLockup />
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
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <h2 className="mt-4 text-xl font-bold text-blue-950">CPCB Authorized / सरकारी मान्यता प्राप्त</h2>
              <p className="mt-2 text-sm text-slate-600">{DEMO_RECYCLER.name}</p>
              <p className="mt-4 text-xs text-emerald-700">Redirecting to recycler dashboard...</p>
            </div>
          ) : role === 'collector' ? (
            <form onSubmit={otpSent ? verifyCollector : sendOtp} className="mt-5 space-y-5 border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-blue-950">{otpSent ? 'Enter OTP / OTP डालें' : 'Mobile verification / मोबाइल सत्यापन'}</h2>
                <p className="mt-1 text-sm text-slate-500">{otpSent ? `OTP sent to +91 ${phone.replace(/\D/g, '')}` : 'Use your 10-digit mobile number to continue.'}</p>
              </div>

              {!otpSent ? (
                <>
                  <label className="block text-sm font-bold text-blue-950">
                    Mobile number
                    <div className="mt-2 flex">
                      <span className="flex items-center border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600">+91</span>
                      <input
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        value={phone}
                        onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="h-11 w-full border border-slate-200 px-3 font-mono text-slate-900"
                        placeholder="9876543210"
                      />
                    </div>
                  </label>
                  <p className="text-xs text-slate-500">Demo: Use any 10-digit number (e.g. 9876543210)</p>
                  <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 bg-emerald-600 font-bold text-white hover:bg-emerald-700 disabled:opacity-70">
                    {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Get OTP / ओटीपी प्राप्त करें
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[index] = element;
                        }}
                        aria-label={`OTP digit ${index + 1}`}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => updateOtp(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        onPaste={handleOtpPaste}
                        className="h-14 w-12 border border-slate-200 text-center text-2xl font-bold text-blue-900 focus:border-blue-900 focus:outline-none"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Demo OTP: 1234</p>
                  <button
                    type="button"
                    disabled={seconds > 0}
                    onClick={() => {
                      setSeconds(30);
                      setOtp(['', '', '', '']);
                      setError('');
                      otpRefs.current[0]?.focus();
                    }}
                    className="text-sm font-bold text-blue-900 disabled:text-slate-400"
                  >
                    {seconds > 0 ? `Resend OTP in ${seconds}s` : 'Resend OTP / ओटीपी दोबारा भेजें'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 4}
                    className="flex h-11 w-full items-center justify-center gap-2 bg-emerald-600 font-bold text-white hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Verify & Enter Dashboard / सत्यापन करें
                  </button>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={verifyRecycler} className="mt-5 space-y-5 border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-blue-950">GSTIN + CPCB verification</h2>
                <p className="mt-1 text-sm text-slate-500">Only registered recycling facilities can enter.</p>
              </div>

              <label className="block text-sm font-bold text-blue-950">
                GSTIN
                <input
                  required
                  maxLength={15}
                  value={gstin}
                  onChange={(event) => setGstin(event.target.value.toUpperCase().slice(0, 15))}
                  className="mt-2 h-11 w-full border border-slate-200 px-3 font-mono text-slate-900 focus:border-blue-900 focus:outline-none"
                  placeholder="07AACFY8976B1Z5"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">15-character Goods & Services Tax ID</span>
              </label>

              <label className="block text-sm font-bold text-blue-950">
                CPCB Registration ID
                <input
                  required
                  value={cpcb}
                  onChange={(event) => setCpcb(event.target.value.toUpperCase())}
                  className="mt-2 h-11 w-full border border-slate-200 px-3 font-mono text-slate-900 focus:border-blue-900 focus:outline-none"
                  placeholder="CPCB/REG/2024/001234"
                />
              </label>

              <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 bg-emerald-600 font-bold text-white hover:bg-emerald-700 disabled:opacity-70">
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Verify CPCB Authorization / CPCB सत्यापन करें
              </button>

              <p className="text-xs text-slate-500">
                Demo GSTIN: 07AACFY8976B1Z5
                <br />
                Demo CPCB ID: CPCB/REG/2024/001234
              </p>
            </form>
          )}

          {error && (
            <div className="mt-4 flex gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <LockKeyhole className="h-4 w-4 text-emerald-600" />
            Secure demo verification
          </div>
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