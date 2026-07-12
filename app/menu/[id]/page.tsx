'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MenuCard from '@/components/MenuCard';
import { MenuItem } from '@/lib/types';
import { Review } from '@/lib/types';
import {
  Flame, Leaf, ArrowLeft, ShoppingCart, Plus, Minus, Star, Calendar, MessageSquare
} from 'lucide-react';

interface MenuItemPageProps {
  params: Promise<{ id: string }>;
}

export default function MenuItemPage({ params }: MenuItemPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { addToCart } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const imageList = Array.isArray(item?.images)
    ? item.images.filter((img): img is string => Boolean(img))
    : [];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  useEffect(() => {
    if (imageList.length === 0) return;
    if (activeImageIndex >= imageList.length) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, imageList.length]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/menu/${id}`)
      .then((r) => r.json())
      .then(async ({ item: fetchedItem, reviews: fetchedReviews }) => {
        if (!fetchedItem) { setLoading(false); return; }
        setItem(fetchedItem);
        setReviews(fetchedReviews ?? []);
        
        const rel = await fetch(`/api/menu?category=${encodeURIComponent(fetchedItem.category)}`).then(r => r.json());
        setRelatedItems((rel.items ?? []).filter((i: MenuItem) => i.id !== fetchedItem.id).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading item details...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex flex-col items-center justify-center gap-4 px-6">
        <span className="text-6xl">🍕</span>
        <h2 className="text-2xl font-black text-white">Item Not Found</h2>
        <p className="text-zinc-400 text-sm text-center max-w-xs">The menu item you are looking for does not exist or has been deleted.</p>
        <Link href="/menu" className="btn-jelly px-6 py-2.5 text-xs font-bold mt-2">Back to Menu</Link>
      </div>
    );
  }

  const safeRating = typeof item.rating === 'number' && Number.isFinite(item.rating) ? item.rating : 0;
  const safePrice = typeof item.price === 'number' && Number.isFinite(item.price) ? item.price : 0;
  const safeCalories = typeof item.calories === 'number' && Number.isFinite(item.calories) ? item.calories : 0;
  const safeSpicyLevel = typeof item.spicyLevel === 'number' && Number.isFinite(item.spicyLevel) ? item.spicyLevel : 0;
  const ingredientList = Array.isArray(item.ingredients) ? item.ingredients : [];
  const spicyFlames = Array.from({ length: safeSpicyLevel });

  const handleAddToCart = () => {
    addToCart(item, quantity);
    router.push('/cart');
  };

  const featuredImage = imageList[activeImageIndex] ?? imageList[0] ?? '/file.svg';
  const itemAltText = item.name ? `${item.name} image` : 'Menu item image';

  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        {}
        <Link href="/menu" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Full Menu
        </Link>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {}
          <div className="flex flex-col gap-4">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
              <Image src={featuredImage} alt={itemAltText} fill className="object-cover" unoptimized />
            </div>
            {imageList.length > 1 && (
              <div className="flex gap-4">
                {imageList.map((img, index) => (
                  <button key={index} onClick={() => setActiveImageIndex(index)}
                    className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${activeImageIndex === index ? 'border-red-500 scale-105 shadow-lg shadow-red-500/20' : 'border-white/5 hover:border-white/20'}`}>
                    <Image src={img} alt={`${itemAltText} thumbnail ${index + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="flex flex-col justify-between py-2">
            <div className="flex flex-col gap-4">
              {}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/20 font-bold uppercase tracking-wider">{item.category}</span>
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${item.isVeg ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  <Leaf className="h-3.5 w-3.5" />{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-amber-400 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /><span>{safeRating.toFixed(1)} / 5.0 Rating</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight glow-text">{item.name}</h1>
              <span className="text-4xl font-black text-white tracking-tight">${safePrice.toFixed(2)}</span>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base border-t border-b border-white/5 py-4">{item.longDescription}</p>
            </div>

            <div className="flex flex-col gap-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel-light rounded-xl p-3.5 border border-white/5 flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Est. Energy Value</span>
                  <span className="text-white font-extrabold text-sm mt-1">{safeCalories} kcal</span>
                </div>
                <div className="glass-panel-light rounded-xl p-3.5 border border-white/5 flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Spicy Level</span>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {safeSpicyLevel === 0 ? (
                      <span className="text-zinc-400 text-xs font-semibold">0 (Mild)</span>
                    ) : (
                      spicyFlames.map((_, i) => <Flame key={i} className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />)
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-1 shrink-0">
                  <button onClick={() => setQuantity((p) => Math.max(1, p - 1))} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-white">{quantity}</span>
                  <button onClick={() => setQuantity((p) => p + 1)} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart} className="btn-jelly flex-grow flex items-center justify-center gap-2 py-4 px-8 text-sm font-bold tracking-wide cursor-pointer">
                  <ShoppingCart className="h-4 w-4" /> Add To Feast Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start border-t border-white/5 pt-12">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2"><span>🌱</span> Fresh Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {ingredientList.map((ing, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 hover:border-red-500/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-all">{ing}</span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-red-500" /> Customer Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No reviews yet. Be the first to try this!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="glass-panel-light rounded-2xl p-5 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{rev.userName}</span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3" />{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5 bg-white/5 px-2 py-0.5 rounded border border-white/10 text-amber-400 text-xs items-center font-bold">
                        <Star className="h-3 w-3 fill-amber-400" /><span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">&quot;{rev.comment}&quot;</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {}
        {relatedItems.length > 0 && (
          <div className="flex flex-col gap-6 border-t border-white/5 pt-12">
            <div>
              <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">More Flavor From {item.category}</span>
              <h3 className="text-2xl font-black text-white tracking-tight">Related Items</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((rel) => <MenuCard key={rel.id} item={rel} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
