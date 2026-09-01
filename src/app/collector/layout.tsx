import { ReactNode } from 'react';
import { BottomNav } from '@/components/collector/BottomNav';

export default function CollectorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 pb-20 shadow-xl border-x border-zinc-100 flex flex-col">
      {children}
      <BottomNav />
    </div>
  );
}
