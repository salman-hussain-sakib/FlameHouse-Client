'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-white/5 mt-auto py-12 px-6 md:px-12 text-zinc-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold tracking-wider text-white">
              FLAME<span className="text-orange-500">HOUSE</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-zinc-400">
            Fusing fire, fresh ingredients, and premium sauces to create the ultimate fast-food experience. Taste the blaze today!
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 hover:text-white transition-all">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.9.2-1.2 1-1.2h2V2h-3c-3 0-5 1.8-5 4.8V8z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 hover:text-white transition-all">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 hover:text-white transition-all">
              <svg className="h-4 w-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold text-base tracking-wide">Quick Links</h4>
          <Link href="/" className="text-sm hover:text-white hover:underline transition-all">Home</Link>
          <Link href="/menu" className="text-sm hover:text-white hover:underline transition-all">Explore Menu</Link>
          <Link href="/about" className="text-sm hover:text-white hover:underline transition-all">Our Story (About)</Link>
          <Link href="/contact" className="text-sm hover:text-white hover:underline transition-all">Get in Touch (Contact)</Link>
        </div>

        {}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold text-base tracking-wide">Menu Categories</h4>
          <Link href="/menu?category=Burgers" className="text-sm hover:text-white hover:underline transition-all">Burgers</Link>
          <Link href="/menu?category=Pizza" className="text-sm hover:text-white hover:underline transition-all">Stone-Oven Pizzas</Link>
          <Link href="/menu?category=Fried Chicken" className="text-sm hover:text-white hover:underline transition-all">Nashville Chicken</Link>
          <Link href="/menu?category=Sides" className="text-sm hover:text-white hover:underline transition-all">Fries & Garlic Bread</Link>
          <Link href="/menu?category=Drinks" className="text-sm hover:text-white hover:underline transition-all">Lava Beverages</Link>
        </div>

        {}
        <div className="flex flex-col gap-3 text-sm">
          <h4 className="text-white font-semibold text-base tracking-wide">Contact Us</h4>
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>128 Blazing Boulevard, Heatwave City, HW 90210</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-red-500 shrink-0" />
            <span>+1 (800) 555-FIRE</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-red-500 shrink-0" />
            <span>hello@flamehouse.com</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto h-px bg-white/5 my-8" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} FlameHouse LLC. All rights reserved. Fire-grilled since 2026.</p>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-zinc-400">Privacy Policy</Link>
          <Link href="/about" className="hover:text-zinc-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
