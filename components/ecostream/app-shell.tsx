'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
/* eslint-disable react/no-unescaped-entities */
import { Bell, ChevronLeft, ChevronRight, CircleUserRound, FileText, LayoutDashboard, Menu, ScanLine, Settings, TrendingUp, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useLanguage } from './language-provider';

const navItems = [
  { href: '/collector/dashboard', label: 'Dashboard', hi: 'डैशबोर्ड', icon: LayoutDashboard },
  { href: '/collector/add-scrap', label: 'Scan Scrap', hi: 'स्क्रैप स्कैन', icon: ScanLine },
  { href: '/collector/negotiations', label: 'Negotiations', hi: 'बातचीत', icon: FileText },
  { href: '/collector/market-bhav', label: 'Market Bhav', hi: 'बाज़ार भाव', icon: TrendingUp },
  { href: '/collector/profile', label: 'Profile', hi: 'प्रोफ़ाइल', icon: CircleUserRound },
];

const recyclerNavItems = [
  { href: '/recycler/dashboard', label: 'Dashboard', hi: 'डैशबोर्ड', icon: LayoutDashboard },
  { href: '/recycler/dashboard#incoming-lots', label: 'Incoming Lots', hi: 'आने वाले लॉट', icon: FileText },
  { href: '/recycler/dashboard#negotiations', label: 'Negotiations', hi: 'बातचीत', icon: TrendingUp },
];

function EcoLogo() {
  return <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white"><svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true"><path d="M7 21c0-8 6-13 17-14-1 10-6 16-14 16" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" /><path d="M8 24c4-5 7-8 12-11M21 7v5h5" stroke="#A7F3D0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 20h5v5h-5z" stroke="#FDE68A" strokeWidth="1.5" /><path d="M24.5 21.5h2" stroke="#FDE68A" strokeWidth="1.2" /></svg></span>;
}

export function AppShell({ children, portal }: { children: ReactNode; portal: 'collector' | 'recycler' }) {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = portal === 'collector' ? navItems : recyclerNavItems;

  return <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100"><aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900 ${collapsed ? 'w-20' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}><div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800"><EcoLogo />{!collapsed && <div><p className="font-bold tracking-tight">E-Scrap<span className="text-emerald-600">-Saathi</span></p><p className="text-[9px] font-semibold uppercase tracking-[.18em] text-slate-500">{portal === 'collector' ? 'Collector portal' : 'Recycler hub'}</p></div>}<button className="ml-auto md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button></div><nav className="flex-1 space-y-1 p-3">{items.map((item) => { const Icon = item.icon; const active = pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'}`}><Icon className={`h-5 w-5 shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />{!collapsed && <span><span className="block">{language === 'hi' ? item.hi : item.label}</span><span className="block text-[10px] font-normal text-slate-400">{language === 'hi' ? item.label : item.hi}</span></span>}</Link>; })}</nav><div className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-800"><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"><Settings className="h-5 w-5" />{!collapsed && 'Platform home'}</Link><Button variant="ghost" size="icon" className="hidden w-full md:flex" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">{collapsed ? <ChevronRight /> : <ChevronLeft />}</Button></div></aside><div className={`${collapsed ? 'md:pl-20' : 'md:pl-64'} transition-[padding]`}><header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95"><div className="flex h-16 items-center gap-3 px-4 md:px-6"><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button><div className="min-w-0 flex-1 overflow-hidden"><div className="flex min-w-max items-center gap-8 text-xs"><span className="font-semibold text-slate-500">Today's Bhav <span className="text-emerald-600">● Live</span></span><span className="text-slate-500">Copper <b className="text-slate-900 dark:text-white">₹470/kg</b> <em className="not-italic text-emerald-600">+5.2%</em></span><span className="text-slate-500">PCB <b className="text-slate-900 dark:text-white">₹335/kg</b> <em className="not-italic text-emerald-600">+2.1%</em></span><span className="text-slate-500">Aluminium <b className="text-slate-900 dark:text-white">₹185/kg</b></span></div></div><div className="flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800"><button className="hidden items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 dark:text-slate-300 sm:flex" onClick={toggleLanguage}>{language === 'en' ? 'हिंदी' : 'English'} <span className="text-slate-300">/</span> {language === 'en' ? 'English' : 'हिंदी'}</button><ThemeToggle /><Button variant="ghost" size="icon" aria-label="Notifications" className="relative text-slate-500"><Bell className="h-4 w-4" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-500" /></Button><div className="hidden items-center gap-2 border-l border-slate-200 pl-3 text-xs dark:border-slate-800 lg:flex"><CircleUserRound className="h-5 w-5 text-emerald-600" /><span className="font-semibold">{portal === 'collector' ? 'Amit Kumar' : 'EcoRecycle Delhi'}</span></div></div></div></header><main>{children}</main></div></div>;
}
