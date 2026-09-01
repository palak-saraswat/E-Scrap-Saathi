'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Camera, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/collector/dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-600',
  },
  {
    label: 'Scan',
    href: '/collector/add-scrap',
    icon: Camera,
    color: 'text-green-600',
  },
  {
    label: 'Bhav',
    href: '/collector/trends',
    icon: TrendingUp,
    color: 'text-amber-600',
  },
  {
    label: 'Profile',
    href: '/collector/profile',
    icon: ShieldCheck,
    color: 'text-purple-600',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white border-t border-zinc-200 z-50 shadow-lg">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-green-50 scale-110'
                  : 'hover:bg-zinc-50'
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isActive ? item.color : 'text-zinc-400'
                )}
              />
              <span
                className={cn(
                  'text-xs mt-1 font-medium transition-colors',
                  isActive ? 'text-green-700' : 'text-zinc-500'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
