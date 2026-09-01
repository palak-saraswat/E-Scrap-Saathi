'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Phone, Lock } from 'lucide-react';

type LoginStep = 'phone' | 'otp';

export default function CollectorLogin() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    if (!phone.startsWith('+91')) {
      setError('Please enter a valid Indian phone number');
      return;
    }

    if (phone.length !== 13) {
      // +91 + 10 digits = 13 characters
      setError('Phone number must be 10 digits');
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    // Move to OTP step
    setStep('otp');
    setTimeLeft(30);

    // Start countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 4) {
      setError('OTP must be 4 digits');
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Mock verification (in real app, verify against backend)
    if (otp === '1234') {
      // Store session
      localStorage.setItem('collectorPhone', phone);
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/collector/dashboard');
    } else {
      setError('Invalid OTP. Try 1234 for demo.');
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setTimeLeft(30);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-zinc-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">E-Scrap-Saathi</CardTitle>
          <CardDescription className="text-green-100">साथी के लिए लॉगिन करें</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Mobile Number / मोबाइल नंबर
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (!val.startsWith('91')) {
                        val = '91' + val;
                      }
                      if (val.length > 12) {
                        val = val.slice(0, 12);
                      }
                      setPhone(val.length === 12 ? '+' + val : '+91' + val.slice(2));
                    }}
                    className="pl-10 h-12 text-lg"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Enter 10-digit number with +91 country code
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || phone.length !== 13}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Get OTP'
                )}
              </Button>

              <p className="text-xs text-zinc-600 text-center">
                Demo: Use any 10-digit number → OTP 1234
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                OTP sent to {phone}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Enter 4-digit OTP / OTP दर्ज करें
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="0000"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtp(val);
                    }}
                    className="pl-10 h-12 text-2xl font-mono text-center tracking-widest"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || otp.length !== 4}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className="text-center space-y-2">
                {timeLeft > 0 ? (
                  <p className="text-sm text-zinc-600">
                    Resend OTP in <span className="font-semibold text-green-600">{timeLeft}s</span>
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="w-full text-green-600 hover:text-green-700"
                  >
                    Resend OTP
                  </Button>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
                className="w-full"
              >
                Change Number
              </Button>

              <p className="text-xs text-zinc-600 text-center">
                Demo OTP: 1234
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
