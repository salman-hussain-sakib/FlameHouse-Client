'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Plus, 
  Trash2, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  ChefHat, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

export default function ManageItemsPage() {
  const router = useRouter();
  const { user, loading, getMenu, deleteItem, customItems } = useAuth();
  
  
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=items/manage');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menu = getMenu();

  
  const stats = useMemo(() => {
    const totalItems = menu.length;
    const avgPrice = totalItems > 0 
      ? menu.reduce((sum, item) => sum + item.price, 0) / totalItems 
      : 0;
    const customCount = customItems.length;

    
    const categories = ['Pizza', 'Burgers', 'Fried Chicken', 'Sides', 'Drinks'];
    const chartData = categories.map((cat) => {
      const catItems = menu.filter((item) => item.category === cat);
      const avgPriceCat = catItems.length > 0
        ? catItems.reduce((sum, item) => sum + item.price, 0) / catItems.length
        : 0;
      return {
        name: cat,
        avgPrice: parseFloat(avgPriceCat.toFixed(2))
      };
    });

    return {
      totalItems,
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      customCount,
      chartData
    };
  }, [menu, customItems]);

  const COLORS = ['#ea3838', '#f57c00', '#ffb300', '#ea580c', '#b91c1c'];

  if (loading) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading dashboard...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Console Dashboard</span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Manage Recipes</h1>
            <p className="text-sm text-zinc-400">Add, delete, or inspect menu listings and average price metrics.</p>
          </div>
          
          <Link href="/items/add" className="btn-jelly px-6 py-3 text-xs font-bold flex items-center gap-1.5 shrink-0 self-start md:self-auto">
            <Plus className="h-4.5 w-4.5" /> Add New Recipe
          </Link>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              <ChefHat className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Total Catalog Dishes</span>
              <span className="text-2xl font-black text-white mt-0.5">{stats.totalItems} Items</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Average Catalog Price</span>
              <span className="text-2xl font-black text-white mt-0.5">${stats.avgPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Your Added Recipes</span>
              <span className="text-2xl font-black text-white mt-0.5">{stats.customCount} Custom</span>
            </div>
          </div>
        </div>

        {}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5">
          <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-red-500" /> Avg Price Breakdown By Category
          </h3>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    unit="$"
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{
                      background: '#180f0c',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="avgPrice" fill="#ea3838" radius={[8, 8, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                Initializing chart metrics...
              </div>
            )}
          </div>
        </div>

        {}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">
              Live Catalog Listings Table
            </h3>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">
              Authenticated: {user.name} ({user.role})
            </span>
          </div>

          <div className="overflow-x-auto">
            {menu.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-sm">
                No items currently exist in the database. Add some using the button above.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-400 bg-white/[0.01]">
                    <th className="p-4 font-semibold uppercase tracking-wider">Item Details</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Category</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Price</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Spice</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Source</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {menu.map((item) => {
                    const isCustom = item.createdBy !== undefined;
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        {}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/5">
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-xs">{item.name}</span>
                              <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{item.description}</span>
                            </div>
                          </div>
                        </td>

                        {}
                        <td className="p-4 text-zinc-300 font-medium">{item.category}</td>

                        {}
                        <td className="p-4 text-white font-extrabold">${item.price.toFixed(2)}</td>

                        {}
                        <td className="p-4">
                          <div className="flex items-center gap-0.5">
                            {item.spicyLevel === 0 ? (
                              <span className="text-zinc-500">None</span>
                            ) : (
                              Array.from({ length: item.spicyLevel }).map((_, i) => (
                                <span key={i} className="text-red-500 text-xs">🔥</span>
                              ))
                            )}
                          </div>
                        </td>

                        {}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider border ${
                            isCustom 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                              : 'bg-zinc-500/10 text-zinc-400 border-white/5'
                          }`}>
                            {isCustom ? 'Custom' : 'System'}
                          </span>
                        </td>

                        {}
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-2">
                            <Link
                              href={`/menu/${item.id}`}
                              className="p-2 rounded-lg border border-white/5 hover:border-white/20 bg-white/5 text-zinc-300 hover:text-white transition-all"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                  deleteItem(item.id);
                                }
                              }}
                              className="p-2 rounded-lg border border-transparent hover:border-red-500/20 hover:bg-red-500/5 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
