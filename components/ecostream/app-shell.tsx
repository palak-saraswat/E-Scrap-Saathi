'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Bell, ChevronLeft, ChevronRight, CircleUserRound, FileText, LayoutDashboard, Menu, ScanLine, Settings, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useLanguage } from './language-provider';

type Portal = 'collector' | 'recycler';
type NavItem = { href: string; label: string; hi: string; icon: typeof LayoutDashboard; tab?: 'dashboard' | 'incoming' | 'negotiations' };
const collectorItems: NavItem[] = [
  { href: '/collector/dashboard', label: 'Dashboard', hi: 'डैशबोर्ड', icon: LayoutDashboard },
  { href: '/collector/add-scrap', label: 'Scan Scrap', hi: 'स्क्रैप स्कैन', icon: ScanLine },
  { href: '/collector/negotiations', label: 'Negotiations', hi: 'बातचीत', icon: FileText },
  { href: '/collector/market-bhav', label: 'Market Bhav', hi: 'बाज़ार भाव', icon: TrendingUp },
  { href: '/collector/profile', label: 'Profile', hi: 'प्रोफ़ाइल', icon: CircleUserRound },
];
const recyclerItems: NavItem[] = [
  { href: '/recycler/dashboard', label: 'Dashboard', hi: 'डैशबोर्ड', icon: LayoutDashboard, tab: 'dashboard' },
  { href: '/recycler/dashboard#incoming-lots', label: 'Incoming Lots', hi: 'आने वाले लॉट', icon: FileText, tab: 'incoming' },
  { href: '/recycler/dashboard#negotiations', label: 'Negotiations', hi: 'बातचीत', icon: TrendingUp, tab: 'negotiations' },
];

export function AppShell({ children, portal }: { children: ReactNode; portal: Portal }) {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRecyclerTab, setActiveRecyclerTab] = useState<'dashboard' | 'incoming' | 'negotiations'>('dashboard');
  const items = portal === 'collector' ? collectorItems : recyclerItems;

  useEffect(() => {
    if (portal !== 'recycler') return;
    const syncTab = () => {
      const hash = window.location.hash.toLowerCase();
      setActiveRecyclerTab(hash.includes('incoming') ? 'incoming' : hash.includes('negotiation') ? 'negotiations' : 'dashboard');
    };
    syncTab();
    window.addEventListener('hashchange', syncTab);
    return () => window.removeEventListener('hashchange', syncTab);
  }, [portal]);

  return <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100"><aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900 ${collapsed ? 'w-20' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}><div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white"><LeafLogo /></div>{!collapsed && <div><p className="font-bold tracking-tight">E-Scrap<span className="text-emerald-600">-Saathi</span></p><p className="text-[9px] font-semibold uppercase tracking-[.18em] text-slate-500">{portal === 'collector' ? 'Collector portal' : 'Recycler hub'}</p></div>}<button className="ml-auto md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button></div><nav className="flex-1 space-y-1 p-3">{items.map((item) => { const Icon = item.icon; const active = portal === 'recycler' && item.tab ? activeRecyclerTab === item.tab : pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} onClick={() => { setMobileOpen(false); if (portal === 'recycler' && item.tab) { setActiveRecyclerTab(item.tab); window.location.hash = item.tab === 'incoming' ? 'incoming-lots' : item.tab === 'negotiations' ? 'negotiations' : ''; } }} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon className={`h-5 w-5 shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />{!collapsed && <span><span className="block">{language === 'hi' ? item.hi : item.label}</span><span className="block text-[10px] font-normal text-slate-400">{language === 'hi' ? item.label : item.hi}</span></span>}</Link>; })}</nav><div className="space-y-2 border-t border-slate-200 p-3"><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"><Settings className="h-5 w-5" />{!collapsed && 'Platform home'}</Link><Button variant="ghost" size="icon" className="hidden w-full md:flex" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">{collapsed ? <ChevronRight /> : <ChevronLeft />}</Button></div></aside><div className={`${collapsed ? 'md:pl-20' : 'md:pl-64'} transition-[padding]`}><header className="sticky top-0 z-40 border-b border-slate-200 bg-white"><div className="flex h-16 items-center gap-3 px-4 md:px-6"><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button><div className="min-w-0 flex-1 overflow-hidden"><div className="flex min-w-max items-center gap-8 whitespace-nowrap text-xs"><span className="font-semibold text-slate-500">आज का बाजार भाव <span className="text-emerald-600">● Live</span></span><span className="text-slate-500">Copper <b className="text-slate-900">₹470/kg</b></span><span className="text-slate-500">PCB <b className="text-slate-900">₹335/kg</b></span><span className="text-slate-500">Battery <b className="text-slate-900">₹180/kg</b></span></div></div><div className="flex items-center gap-2 border-l border-slate-200 pl-3"><button className="hidden text-xs font-semibold text-slate-600 sm:block" onClick={toggleLanguage}>{language === 'en' ? 'हिंदी' : 'English'}</button><ThemeToggle /><Bell className="h-4 w-4 text-slate-500" /></div></div></header><main>{children}</main></div></div>;
}

function LeafLogo() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15Z" /><path d="M5 19 16 9" /></svg>; }
