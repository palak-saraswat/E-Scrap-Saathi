'use client';

const bhavData = [
  { hindiName: 'तांबा', engName: 'Copper Cable', price: '₹470/kg', change: '+5.2%' },
  { hindiName: 'मदरबोर्ड', engName: 'PCB Board', price: '₹335/kg', change: '+2.1%' },
  { hindiName: 'बैटरी', engName: 'Lithium Battery', price: '₹180/kg', change: '+1.4%' },
  { hindiName: 'एल्युमिनियम', engName: 'Aluminium', price: '₹185/kg', change: '+3.0%' },
];

export function BhavTicker() {
  return <div className="w-full overflow-hidden border-b border-slate-200 bg-slate-50 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"><div className="flex w-max animate-marquee items-center space-x-8 whitespace-nowrap font-medium hover:[animation-play-state:paused]">{[...bhavData, ...bhavData].map((item, index) => <div key={`${item.engName}-${index}`} className="inline-flex items-center space-x-2"><span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500" /><span className="text-slate-700 dark:text-slate-300">{item.hindiName} ({item.engName}):</span><span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.price}</span><span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">{item.change}</span></div>)}</div></div>;
}
