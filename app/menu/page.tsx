'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import { MenuItem } from '@/lib/types';
import { Search, SlidersHorizontal, Check, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

function MenuExploreClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  
  const urlCategory = searchParams.get('category') || 'All';
  const urlQuery = searchParams.get('search') || '';

  
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [priceRange, setPriceRange] = useState<number>(25);
  const [spiceFilter, setSpiceFilter] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('rating-desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    setLoading(true);
    fetch('/api/menu')
      .then((r) => r.json())
      .then(({ items }) => { setMenu(items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  
  useEffect(() => { setSelectedCategory(urlCategory); }, [urlCategory]);
  useEffect(() => { setSearchQuery(urlQuery); }, [urlQuery]);


  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange(20);
    setSpiceFilter('All');
    setVegOnly(false);
    setSortBy('rating-desc');
    setCurrentPage(1);
    router.push('/menu');
  };

  
  const filteredItems = useMemo(() => {
    let result = [...menu];

    
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    
    if (searchQuery.trim() !== '') {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    
    result = result.filter(item => item.price <= priceRange);

    
    if (spiceFilter !== 'All') {
      const spiceNum = parseInt(spiceFilter, 10);
      result = result.filter(item => item.spicyLevel === spiceNum);
    }

    
    if (vegOnly) {
      result = result.filter(item => item.isVeg);
    }

    
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [menu, selectedCategory, searchQuery, priceRange, spiceFilter, vegOnly, sortBy]);

  
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredItems, currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const categories = ['All', 'Pizza', 'Burgers', 'Fried Chicken', 'Sides', 'Drinks'];

  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {}
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase">FlameHouse Kitchen</span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Explore Our Fire Menu</h1>
          <p className="text-sm text-zinc-400">Discover hand-crafted recipes seared over flame and glazed in fiery hot honey.</p>
        </div>

        {}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                  router.push(`/menu?category=${cat}`);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 border-transparent text-white shadow-lg shadow-red-500/20'
                    : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-full text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-500"
            />
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                <SlidersHorizontal className="h-4 w-4 text-red-500" /> Filters
              </span>
              <button 
                onClick={resetFilters}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RefreshCw className="h-3 w-3" /> Reset All
              </button>
            </div>

            {}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-400">Max Price</span>
                <span className="text-white">${priceRange.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="0.5"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(parseFloat(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
                <span>$3.00</span>
                <span>$25.00</span>
              </div>
            </div>

            {}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-zinc-400">Heat Level</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'All Heat', val: 'All' },
                  { label: 'Mild (0)', val: '0' },
                  { label: 'Medium (1)', val: '1' },
                  { label: 'Hot (2)', val: '2' },
                  { label: 'Volcano (3)', val: '3' },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => {
                      setSpiceFilter(s.val);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      spiceFilter === s.val
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {}
            <label className="flex items-center gap-3 cursor-pointer group py-1">
              <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                vegOnly 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-black/40 border-white/10 group-hover:border-white/20'
              }`}>
                {vegOnly && <Check className="h-3.5 w-3.5" />}
              </div>
              <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Vegetarian Only</span>
            </label>

            {}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-zinc-400">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
              >
                <option value="rating-desc">Rating: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

          </div>

          {}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {loading ? (
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col h-[480px] w-full bg-white/5 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 w-full bg-white/5" />
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div className="flex flex-col gap-3">
                        <div className="h-5 w-3/4 bg-white/5 rounded" />
                        <div className="h-3 w-full bg-white/5 rounded" />
                        <div className="h-3 w-5/6 bg-white/5 rounded" />
                        <div className="h-3 w-2/3 bg-white/5 rounded" />
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="h-7 w-20 bg-white/5 rounded" />
                        <div className="h-9 w-20 bg-white/5 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              
              <div className="glass-panel rounded-2xl p-16 text-center flex flex-col items-center gap-4 border border-white/5">
                <span className="text-5xl">🔥</span>
                <h3 className="text-xl font-bold text-white">No Blazing Matches Found</h3>
                <p className="text-sm text-zinc-400 max-w-sm">We couldn't find any menu items that match your search or active filters. Try loosening your range or search terms.</p>
                <button onClick={resetFilters} className="btn-jelly px-6 py-2.5 text-xs font-bold">
                  Show All Items
                </button>
              </div>
            ) : (
              // MENU ITEMS GRID
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
                    <span className="text-xs text-zinc-400">
                      Showing page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredItems.length} items)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`p-2.5 rounded-xl border border-white/5 text-zinc-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`h-9 w-9 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                            currentPage === i + 1
                              ? 'bg-gradient-to-r from-red-600 to-orange-500 border-transparent text-white'
                              : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2.5 rounded-xl border border-white/5 text-zinc-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-[#0f0907] min-h-screen py-10 px-6 flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading menu exploration...</span>
      </div>
    }>
      <MenuExploreClient />
    </Suspense>
  );
}
