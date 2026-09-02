'use client';

import { ReactNode } from 'react';
import { AppShell } from '@/components/ecostream/app-shell';

export default function CollectorLayout({ children }: { children: ReactNode }) {
  return <AppShell portal="collector">{children}</AppShell>;
}
