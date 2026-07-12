'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, ArrowLeft, Leaf, Flame, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AddItemPage() {
  const router = useRouter();
  const { user, loading, addCustomItem } = useAuth();

  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=items/add');
    }
  }, [user, loading, router]);

  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Pizza' | 'Burgers' | 'Fried Chicken' | 'Sides' | 'Drinks'>('Burgers');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [calories, setCalories] = useState('');
  const [spicyLevel, setSpicyLevel] = useState<number>(0);
  const [isVeg, setIsVeg] = useState<boolean>(false);
  const [ingredientsText, setIngredientsText] = useState('');

  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Checking credentials...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !price || !description || !longDescription || !calories || !ingredientsText) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Please enter a valid price greater than $0.00.');
      return;
    }

    const calNum = parseInt(calories, 10);
    if (isNaN(calNum) || calNum < 0) {
      setErrorMsg('Please enter a valid calorie count.');
      return;
    }

    setSubmitting(true);
    
    
    const defaultImage = category === 'Burgers'
      ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'
      : category === 'Pizza'
      ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'
      : category === 'Fried Chicken'
      ? 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600'
      : category === 'Sides'
      ? 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600'
      : 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600';

    const cleanImgUrl = imageUrl.trim() !== '' ? imageUrl.trim() : defaultImage;

    
    const ingredients = ingredientsText
      .split(',')
      .map((ing) => ing.trim())
      .filter((ing) => ing !== '');

    
    addCustomItem({
      name,
      price: priceNum,
      category,
      description,
      longDescription,
      images: [cleanImgUrl, defaultImage], 
      spicyLevel,
      isVeg,
      calories: calNum,
      ingredients
    });

    setSubmitting(false);
    setSuccessMsg('Menu item added successfully! Redirecting to dashboard...');
    
    setTimeout(() => {
      router.push('/items/manage');
    }, 1200);
  };

  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        
        {}
        <Link href="/items/manage" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {}
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Admin Operations</span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Add New Recipe</h1>
          <p className="text-sm text-zinc-400">Introduce a new hot delicacy to the FlameHouse menu database.</p>
        </div>

        {}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs animate-pulse">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {}
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col gap-6">
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">Dish Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Inferno Hot Wings"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">Category <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
              >
                <option value="Burgers">Burgers</option>
                <option value="Pizza">Pizza</option>
                <option value="Fried Chicken">Fried Chicken</option>
                <option value="Sides">Sides</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">Price ($ USD) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 10.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">Calories (kcal) <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                placeholder="e.g. 620"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
              />
              <span className="text-[10px] text-zinc-500">Leave blank to assign a beautiful default category image.</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400">Ingredients (comma-separated) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Beef, Cheese, Lettuce, Hot Mayo"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          {}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">Short Card Description <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="Brief description for menu cards (max 120 chars)."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">Full Overview Description <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={4}
              placeholder="Detailed description of the taste, cooking style, and visual look for detail pages."
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          {}
          <div className="flex items-center gap-8 flex-wrap border-t border-white/5 pt-4">
            {}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400">Spicy Heat Level</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpicyLevel(lvl)}
                    className={`h-9 w-9 rounded-full border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      spicyLevel === lvl
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {}
            <label className="flex items-center gap-3 cursor-pointer group mt-4">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="sr-only"
              />
              <div className={`h-6 w-6 rounded border flex items-center justify-center transition-all ${
                isVeg 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-black/40 border-white/10 group-hover:border-white/20'
              }`}>
                {isVeg && <span>✓</span>}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Vegetarian Recipe</span>
                <span className="text-[10px] text-zinc-500">Check if this dish contains no meat.</span>
              </div>
            </label>
          </div>

          {}
          <button
            type="submit"
            disabled={submitting}
            className="btn-jelly w-full py-4 text-sm font-bold tracking-wide flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <PlusCircle className="h-5 w-5" /> {submitting ? 'Creating Recipe...' : 'Publish Recipe'}
          </button>
        </form>

      </div>
    </div>
  );
}
