'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  User, Mail, Phone, MapPin, Camera, Save,
  ShoppingBag, DollarSign, Star, Edit3, CheckCircle2, X
} from 'lucide-react';

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=flame';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();
  const { orders } = useCart();

  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=profile');
    }
    if (user) {
      const seed = user.name?.trim() || 'flame';
      const nextAvatar = user.avatar?.trim()
        ? user.avatar
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatarUrl(nextAvatar);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading profile...</span>
      </div>
    );
  }

  const resolvedAvatarUrl = avatarUrl?.trim() ? avatarUrl : DEFAULT_AVATAR_URL;

  
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const handleSave = async () => {
    await updateProfile({ name, phone, address, avatar: avatarUrl });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  
  const avatarSeeds = [user.name, 'fire', 'burger', 'chef', 'spicy', 'flame'];

  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-12 px-6 md:px-12 text-zinc-300 relative overflow-hidden">
      {}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">

        {}
        <div>
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase">My Account</span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-1">Profile</h1>
        </div>

        {}
        {saved && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs animate-pulse">
            <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {}
          <div className="flex flex-col gap-6">

            {}
            <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-red-500/30 bg-zinc-900">
                  <Image
                    src={resolvedAvatarUrl}
                    alt={user.name || 'Profile avatar'}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                {editing && (
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-red-500 rounded-full">
                    <Camera className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>

              <div className="text-center">
                <h2 className="font-black text-white text-lg">{user.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-zinc-500/10 text-zinc-400 border border-white/10'
                }`}>
                  {user.role}
                </span>
              </div>

              {}
              {editing && (
                <div className="w-full">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide mb-2 text-center">Choose Avatar Style</p>
                  <div className="grid grid-cols-3 gap-2">
                    {avatarSeeds.map((seed) => (
                      <button
                        key={seed}
                        onClick={() => setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`)}
                        className={`h-12 w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          avatarUrl.includes(encodeURIComponent(seed))
                            ? 'border-red-500'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Image
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
                          alt={seed}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {}
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleSave}
                    className="btn-jelly flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" /> Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 text-xs font-bold border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl w-fit">
                  <ShoppingBag className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-xl font-black text-white mt-1">{orders.length}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Orders</span>
              </div>
              <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-xl font-black text-white mt-1">${totalSpent.toFixed(2)}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Spent</span>
              </div>
            </div>

          </div>

          {}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {}
            <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-5">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-3">
                Personal Details
              </h3>

              {[
                { label: 'Full Name', value: name, setter: setName, icon: <User className="h-4 w-4 text-zinc-500" />, placeholder: 'Your full name' },
                { label: 'Email Address', value: user.email, setter: null, icon: <Mail className="h-4 w-4 text-zinc-500" />, placeholder: 'Email' },
                { label: 'Phone Number', value: phone, setter: setPhone, icon: <Phone className="h-4 w-4 text-zinc-500" />, placeholder: '+1 (555) 000-0000' },
                { label: 'Delivery Address', value: address, setter: setAddress, icon: <MapPin className="h-4 w-4 text-zinc-500" />, placeholder: '123 Street, City, ZIP' },
              ].map((field) => (
                <div key={field.label} className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">{field.label}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{field.icon}</span>
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.setter && field.setter(e.target.value)}
                      disabled={!editing || field.setter === null}
                      placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                  {field.setter === null && (
                    <span className="text-[10px] text-zinc-600">Email cannot be changed.</span>
                  )}
                </div>
              ))}
            </div>

            {}
            <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-3">
                Order History ({orders.length} orders · ${totalSpent.toFixed(2)} total)
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  No orders yet. <a href="/menu" className="text-red-400 hover:underline">Browse the menu!</a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map((order) => (
                    <div key={order.id} className="glass-panel-light rounded-2xl p-4 border border-white/5 flex justify-between items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-bold text-xs font-mono">{order.id}</span>
                        <span className="text-[10px] text-zinc-500">{order.date} · {order.items.length} item(s)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                          {order.status}
                        </span>
                        <span className="font-extrabold text-white text-sm">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
