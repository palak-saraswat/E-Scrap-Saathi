import type { ReactNode } from 'react';
import { AppShell } from '@/components/ecostream/app-shell';

export default function RecyclerLayout({ children }: { children: ReactNode }) {
  return <AppShell portal="recycler">{children}</AppShell>;
}
