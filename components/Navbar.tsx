'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Flame, ShoppingCart, Menu, X, LogOut, Shield, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative p-2 rounded-full bg-red-600/10 border border-red-500/20 group-hover:bg-red-600/20 transition-all duration-300">
            <Flame className="h-6 w-6 text-red-500 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            FLAME<span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">HOUSE</span>
          </span>
        </Link>

        {}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-all hover:text-red-400 ${
                isActive(link.href) ? 'text-red-500 glow-text' : 'text-zinc-300'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              href="/my-orders"
              className={`text-sm font-medium tracking-wide transition-all hover:text-red-400 ${
                isActive('/my-orders') ? 'text-red-500 glow-text' : 'text-zinc-300'
              }`}
            >
              My Orders
            </Link>
          )}

          {}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`text-sm font-medium tracking-wide transition-all flex items-center gap-1 hover:text-red-400 ${
                isActive('/admin') ? 'text-red-500 glow-text' : 'text-zinc-300'
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </div>

        {}
        <div className="hidden md:flex items-center gap-4">
          {}
          <Link href="/cart" className="relative p-2 text-zinc-300 hover:text-white transition-colors group">
            <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-background animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              {}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-white/10 hover:border-white/25 bg-white/5 transition-all cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border border-red-500/30 bg-zinc-900">
                  <Image
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                  <span className="text-[9px] text-zinc-400 capitalize">{user.role}</span>
                </div>
              </button>

              {}
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 glass-panel rounded-2xl border border-white/10 p-2 flex flex-col gap-1 shadow-2xl"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <User className="h-3.5 w-3.5 text-orange-400" /> My Profile
                  </Link>
                  <Link
                    href="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 text-amber-400" /> My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Shield className="h-3.5 w-3.5 text-red-400" /> Admin Dashboard
                    </Link>
                  )}
                  <div className="h-px bg-white/5 my-1" />
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer w-full text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn-jelly px-5 py-2 text-xs font-bold tracking-wide">
                Register
              </Link>
            </div>
          )}
        </div>

        {}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-zinc-300 hover:text-white">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-300 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 flex flex-col gap-1 animate-fadeIn">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-white/5 ${
                isActive(link.href) ? 'text-red-500 bg-red-500/5' : 'text-zinc-300'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <>
              <Link href="/my-orders" onClick={() => setIsOpen(false)} className="text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-white/5 text-zinc-300">
                My Orders
              </Link>
              <Link href="/profile" onClick={() => setIsOpen(false)} className="text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-white/5 text-zinc-300">
                My Profile
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-white/5 text-red-400 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Admin Dashboard
                </Link>
              )}
            </>
          )}

          <div className="h-px bg-white/5 my-2" />

          {user ? (
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-[10px] text-zinc-400 capitalize">{user.role}</span>
                </div>
              </div>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="flex items-center gap-1.5 text-sm font-bold text-red-500"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="btn-jelly text-center py-3 text-sm font-bold tracking-wide mx-2">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
