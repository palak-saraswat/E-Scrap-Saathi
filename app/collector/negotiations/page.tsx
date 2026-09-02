'use client';

import { useState } from 'react';
import { Check, Clock3, MessageSquare, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const initialOffers = [
  { id: 'OFF-2048', recycler: 'EcoRecycle Delhi', material: 'Copper Cable', weight: '42 kg', rate: 470, status: 'Awaiting reply' },
  { id: 'OFF-2047', recycler: 'GreenIndia Hub', material: 'PCB Board', weight: '80 kg', rate: 335, status: 'Offer received' },
  { id: 'OFF-2046', recycler: 'Bharat Recycling', material: 'Lithium Battery', weight: '120 kg', rate: 180, status: 'Accepted' },
];

export default function NegotiationsPage() {
  const [offers, setOffers] = useState(initialOffers);
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Awaiting reply', 'Offer received', 'Accepted'];
  const visible = offers.filter((offer) => filter === 'All' || offer.status === filter);
  return <main className="min-h-screen bg-slate-50 px-5 py-6 lg:px-10"><div className="mx-auto max-w-6xl space-y-6"><header><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-700">Collector Saathi</p><h1 className="mt-2 text-3xl font-bold text-blue-950">Negotiations / बातचीत</h1><p className="mt-2 text-sm text-slate-600">अपने भेजे हुए offers और recycler replies यहां देखें।</p></header><div className="flex flex-wrap gap-2">{statuses.map((status) => <Button key={status} variant={filter === status ? 'default' : 'outline'} onClick={() => setFilter(status)} className={filter === status ? 'bg-blue-900 hover:bg-blue-800' : ''}>{status}</Button>)}</div><section className="overflow-x-auto border border-slate-200 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Offer ID</th><th className="px-5 py-3">Recycler</th><th className="px-5 py-3">Material / Weight</th><th className="px-5 py-3">Rate</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((offer) => <tr key={offer.id}><td className="px-5 py-4 font-mono text-xs font-bold text-blue-900">{offer.id}</td><td className="px-5 py-4 font-semibold">{offer.recycler}</td><td className="px-5 py-4">{offer.material}<span className="block text-xs text-slate-500">{offer.weight}</span></td><td className="px-5 py-4 font-bold text-emerald-700">₹{offer.rate}/kg</td><td className="px-5 py-4"><Badge className={offer.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : offer.status === 'Offer received' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}>{offer.status}</Badge></td><td className="px-5 py-4 text-right">{offer.status === 'Offer received' ? <div className="flex justify-end gap-2"><Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setOffers((current) => current.map((item) => item.id === offer.id ? { ...item, status: 'Accepted' } : item))}><Check className="mr-1 h-4 w-4" />Accept</Button><Button size="sm" variant="outline"><MessageSquare className="mr-1 h-4 w-4" />Reply</Button></div> : <span className="flex items-center justify-end gap-1 text-xs text-slate-500"><Clock3 className="h-4 w-4" />Tracking live</span>}</td></tr>)}</tbody></table></section><div className="border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950"><X className="mr-2 inline h-4 w-4" />Offers are locked only after you accept. Final weight is confirmed at handover.</div></div></main>;
}
