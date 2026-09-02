'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, LayoutDashboard, ShieldCheck, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ecostream/theme-toggle';

type NavItem = {
  label: string;
  href: string;
  icon: typeof Camera;
  color: string;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/collector/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
  { label: 'Scan', href: '/collector/add-scrap', icon: Camera, color: 'text-green-600' },
  { label: 'Bhav', href: '/collector/trends', icon: TrendingUp, color: 'text-amber-600' },
  { label: 'Profile', href: '/collector/profile', icon: ShieldCheck, color: 'text-purple-600' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-zinc-200 bg-white shadow-lg">
      <div className="flex h-20 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-16 w-16 flex-col items-center justify-center rounded-lg transition-all duration-200',
                isActive ? 'scale-110 bg-green-50' : 'hover:bg-zinc-50'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive ? item.color : 'text-zinc-400')} />
              <span className={cn('mt-1 text-xs font-medium', isActive ? 'text-green-700' : 'text-zinc-500')}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <ThemeToggle />
      </div>
    </nav>
  );
}
