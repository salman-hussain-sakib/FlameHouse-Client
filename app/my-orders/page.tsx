'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Receipt, HelpCircle } from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { orders, ordersLoading } = useCart();

  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=my-orders');
    }
  }, [user, loading, router]);

  
  if (loading || ordersLoading) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading order history...</span>
      </div>
    );
  }


  
  if (!user) {
    return null;
  }

  
  if (orders.length === 0) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[75vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="p-5 bg-white/5 border border-white/10 rounded-full text-zinc-500">
          <Receipt className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-black text-white">No Orders Placed Yet</h2>
        <p className="text-zinc-400 text-sm max-w-xs">You haven't ordered any delicious food from FlameHouse yet. Let's fire up your first order!</p>
        <Link href="/menu" className="btn-jelly px-8 py-3.5 text-xs font-bold tracking-wide mt-2">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {}
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Purchase Logs</span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Your Order History</h1>
          <p className="text-sm text-zinc-400">Track and view receipts of your fire-grilled feasts.</p>
        </div>

        {}
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 relative overflow-hidden"
            >
              {}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Order Ref</span>
                  <span className="text-white font-extrabold text-sm font-mono">{order.id}</span>
                </div>
                <div className="flex flex-col gap-1 sm:text-right">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Date Placed</span>
                  <span className="text-zinc-300 text-xs font-semibold">{order.date}</span>
                </div>
                <div className="flex flex-col gap-1 sm:text-right">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Order Status</span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded w-fit sm:ml-auto ${
                    order.status === 'Pending' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : order.status === 'Confirmed' 
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {}
              <div className="flex flex-col gap-3.5">
                {order.items.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-white/5">
                        <Image
                          src={cartItem.item.images[0]}
                          alt={cartItem.item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-tight">{cartItem.item.name}</span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">Qty: {cartItem.quantity} x ${cartItem.item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-zinc-300">
                      ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {}
              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">
                  <HelpCircle className="h-3.5 w-3.5" /> Est. arrival: 25 mins
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Total Receipt:</span>
                  <span className="text-base font-black text-white glow-text">${order.total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
