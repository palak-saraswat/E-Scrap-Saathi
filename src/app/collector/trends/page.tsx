'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PriceData {
  date: string;
  copper: number;
  pcb: number;
  battery: number;
  crt: number;
}

const priceData: PriceData[] = [
  { date: 'Aug 1', copper: 420, pcb: 305, battery: 135, crt: 35 },
  { date: 'Aug 5', copper: 435, pcb: 312, battery: 142, crt: 38 },
  { date: 'Aug 10', copper: 445, pcb: 318, battery: 148, crt: 40 },
  { date: 'Aug 15', copper: 455, pcb: 325, battery: 155, crt: 42 },
  { date: 'Aug 20', copper: 465, pcb: 330, battery: 160, crt: 45 },
  { date: 'Aug 25', copper: 458, pcb: 328, battery: 158, crt: 44 },
  { date: 'Aug 30', copper: 470, pcb: 335, battery: 165, crt: 47 },
];

interface Material {
  name: string;
  currentPrice: string;
  priceRange: string;
  change: number;
  trend: 'up' | 'down';
  color: string;
}

const materials: Material[] = [
  {
    name: 'Copper Cables',
    currentPrice: '₹470/kg',
    priceRange: '₹420 - ₹470',
    change: 5.2,
    trend: 'up',
    color: 'text-orange-600',
  },
  {
    name: 'PCB Boards',
    currentPrice: '₹335/kg',
    priceRange: '₹305 - ₹335',
    change: 4.9,
    trend: 'up',
    color: 'text-blue-600',
  },
  {
    name: 'Lithium Batteries',
    currentPrice: '₹165/kg',
    priceRange: '₹135 - ₹165',
    change: 3.1,
    trend: 'up',
    color: 'text-yellow-600',
  },
  {
    name: 'CRT Monitors',
    currentPrice: '₹47/kg',
    priceRange: '₹35 - ₹47',
    change: 2.2,
    trend: 'up',
    color: 'text-red-600',
  },
];

export default function TrendsPage() {
  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">📈 Price Bhav</h1>
        <p className="text-sm text-zinc-600 mt-1">Live market prices & 30-day trends</p>
      </div>

      {/* Chart */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-base">30-Day Price Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={priceData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="copper"
                stroke="#ea580c"
                name="Copper"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pcb"
                stroke="#0284c7"
                name="PCB"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="battery"
                stroke="#eab308"
                name="Battery"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="crt"
                stroke="#dc2626"
                name="CRT"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Material Cards */}
      <div className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Current Rates (Today)</h2>
        <div className="space-y-2">
          {materials.map((material) => (
            <Card key={material.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-zinc-900">{material.name}</h3>
                  <Badge
                    className={`${material.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {material.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {material.trend === 'up' ? '+' : '-'}
                    {Math.abs(material.change)}%
                  </Badge>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {material.currentPrice}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">{material.priceRange}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-600 mb-2">Set Alert</p>
                    <Badge variant="outline">⏰</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base">💬 Market Insight</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-emerald-900">
          Copper prices are trending up! Good time to sell your cables. Battery prices
          expected to rise next week due to demand.
        </CardContent>
      </Card>
    </div>
  );
}
