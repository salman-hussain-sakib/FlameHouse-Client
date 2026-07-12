'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Star, Flame, Eye, Plus, Leaf } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();

  
  const spicyFlames = Array.from({ length: item.spicyLevel });
  const isSoldOut = (item.stock ?? 25) <= 0;

  return (
    <div className="group flex flex-col h-[480px] w-full glass-card rounded-2xl overflow-hidden relative">
      {}
      <div className="h-48 w-full overflow-hidden relative bg-zinc-900 shrink-0">
        <Image
          src={item.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized={true} 
        />
        
        {}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-zinc-200 text-xs px-2.5 py-1 rounded-full border border-white/10 font-medium">
          {item.category}
        </span>

        {isSoldOut && (
          <span className="absolute top-3 right-12 bg-rose-500/80 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">
            Sold Out
          </span>
        )}

        {}
        <span className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border ${
          item.isVeg 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
        }`}>
          <Leaf className="h-3.5 w-3.5" />
        </span>
      </div>

      {}
      <div className="p-5 flex flex-col flex-1 justify-between">
        
        {}
        <div>
          {}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs text-amber-400 shrink-0">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          </div>

          {}
          <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {}
        <div>
          {}
          <div className="flex items-center justify-between border-t border-white/5 pt-3 mb-4">
            {}
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-zinc-500 mr-1.5 uppercase font-semibold">Spice:</span>
              {item.spicyLevel === 0 ? (
                <span className="text-xs text-zinc-400 font-medium">Mild</span>
              ) : (
                spicyFlames.map((_, i) => (
                  <Flame key={i} className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                ))
              )}
            </div>

            {}
            <span className="text-xs text-zinc-400">
              {item.calories} <span className="text-[10px] text-zinc-500 uppercase font-semibold">kcal</span>
            </span>
          </div>

          {}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Price</span>
              <span className="text-lg font-extrabold text-white">${item.price.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-2">
              {}
              <Link 
                href={`/menu/${item.id}`}
                className="p-2.5 rounded-xl border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Link>

              {}
              <button 
                onClick={() => addToCart(item, 1)}
                disabled={isSoldOut}
                className={`p-2.5 rounded-xl flex items-center justify-center text-white transition-all ${isSoldOut ? 'bg-zinc-700/80 cursor-not-allowed' : 'btn-jelly'}`}
                title={isSoldOut ? 'Sold out' : 'Add to Cart'}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
