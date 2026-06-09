"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';

// Mock Data
const revenueData = [
  { name: 'Mon', GoRide: 4000, GoFood: 2400 },
  { name: 'Tue', GoRide: 3000, GoFood: 1398 },
  { name: 'Wed', GoRide: 2000, GoFood: 9800 },
  { name: 'Thu', GoRide: 2780, GoFood: 3908 },
  { name: 'Fri', GoRide: 1890, GoFood: 4800 },
  { name: 'Sat', GoRide: 2390, GoFood: 3800 },
  { name: 'Sun', GoRide: 3490, GoFood: 4300 },
];

const userGrowthData = [
  { month: 'Jan', users: 4000 },
  { month: 'Feb', users: 5000 },
  { month: 'Mar', users: 6500 },
  { month: 'Apr', users: 8000 },
  { month: 'May', users: 11000 },
  { month: 'Jun', users: 15000 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black mb-2 uppercase">Analytics Overview</h2>
          <p className="text-xl font-bold opacity-80">Track your Furab Super-App performance</p>
        </div>
        <div className="bg-[var(--color-secondary)] neo-border p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          June 2026
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value="Rp 24.5M" icon={<DollarSign size={24} />} color="bg-[var(--color-accent)]" trend="+12%" />
        <KPICard title="Active Users" value="15,234" icon={<Users size={24} />} color="bg-[var(--color-primary)]" trend="+5.4%" />
        <KPICard title="GoRide Orders" value="8,405" icon={<TrendingUp size={24} />} color="bg-[var(--color-secondary)]" trend="+14%" />
        <KPICard title="GoFood Orders" value="4,302" icon={<ShoppingBag size={24} />} color="bg-[#E5E7EB]" trend="+2%" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Bar Chart */}
        <div className="neo-card p-6">
          <h3 className="text-2xl font-black mb-6">Revenue by Service</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="name" stroke="#000" tick={{fontWeight: 'bold'}} />
                <YAxis stroke="#000" tick={{fontWeight: 'bold'}} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.1)'}} contentStyle={{ border: '3px solid black', borderRadius: '0', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px black' }} />
                <Legend wrapperStyle={{fontWeight: 'bold'}} />
                <Bar dataKey="GoRide" fill="var(--color-secondary)" stroke="#000" strokeWidth={3} />
                <Bar dataKey="GoFood" fill="var(--color-primary)" stroke="#000" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Area Chart */}
        <div className="neo-card p-6">
          <h3 className="text-2xl font-black mb-6">User Growth</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="month" stroke="#000" tick={{fontWeight: 'bold'}} />
                <YAxis stroke="#000" tick={{fontWeight: 'bold'}} />
                <RechartsTooltip contentStyle={{ border: '3px solid black', borderRadius: '0', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px black' }} />
                <Area type="monotone" dataKey="users" stroke="#000" strokeWidth={3} fill="var(--color-accent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

// Subcomponent for KPI Card
function KPICard({ title, value, icon, color, trend }: { title: string, value: string, icon: React.ReactNode, color: string, trend: string }) {
  return (
    <div className={`neo-card p-6 ${color} flex flex-col justify-between h-40`}>
      <div className="flex justify-between items-start">
        <div className="bg-white p-2 neo-border rounded-full">
          {icon}
        </div>
        <div className="bg-white neo-border px-2 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold opacity-80">{title}</h4>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}
