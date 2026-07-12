'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell, PieChart, Pie, Legend
} from 'recharts';
import {
  Users, ShoppingBag, DollarSign, ChefHat, Trash2, Eye,
  TrendingUp, Plus, Shield, Star, Edit3, Save, Camera, X, CheckCircle2
} from 'lucide-react';

type Tab = 'overview' | 'users' | 'orders' | 'menu' | 'profile';

const DEFAULT_ADMIN_AVATAR_URL = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80';
const ADMIN_AVATAR_OPTIONS = [
  DEFAULT_ADMIN_AVATAR_URL,
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, getAllUsers, deleteUser, getMenu, deleteItem, addCustomItem, updateProfile } = useAuth();
  const { orders, refreshOrders } = useCart();

  const [tab, setTab] = useState<Tab>('overview');
  const [mounted, setMounted] = useState(false);

  
  const [editingProfile, setEditingProfile] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminAvatar, setAdminAvatar] = useState(DEFAULT_ADMIN_AVATAR_URL);
  const [profileSaved, setProfileSaved] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=admin');
    if (!loading && user && user.role !== 'admin') router.push('/');
    setMounted(true);
    if (user) {
      const nextAvatar = user.avatar?.trim()
        ? user.avatar
        : DEFAULT_ADMIN_AVATAR_URL;

      setAdminName('Sakib');
      setAdminPhone(user.phone || '+880 1700-000000');
      setAdminAvatar(nextAvatar);
    }
  }, [user, loading, router]);

  const allUsers = getAllUsers();
  const menu = getMenu();

  const stats = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Delivered');
    const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    
    const statusData = ['Pending', 'Confirmed', 'Delivered'].map((status) => ({
      name: status.split(' ')[0],
      count: orders.filter((o) => o.status === status).length
    }));

    
    const categories = ['Pizza', 'Burgers', 'Fried Chicken', 'Sides', 'Drinks'];
    const catData = categories.map((cat) => ({
      name: cat,
      value: menu.filter((m) => m.category === cat).length
    }));

    
    const priceData = categories.map((cat) => {
      const items = menu.filter((m) => m.category === cat);
      return {
        name: cat === 'Fried Chicken' ? 'Chicken' : cat,
        avg: items.length > 0 ? parseFloat((items.reduce((s, i) => s + i.price, 0) / items.length).toFixed(2)) : 0
      };
    });

    return { totalRevenue, avgOrderValue, statusData, catData, priceData };
  }, [orders, menu]);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  const handleSaveProfile = async () => {
    const fixedName = 'Sakib';
    await updateProfile({ name: fixedName, phone: adminPhone, avatar: adminAvatar });
    setAdminName(fixedName);
    setEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        setAdminAvatar(result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleConfirmOrder = async (orderId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('flamehouse_token') : null;
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      if (res.ok) {
        await refreshOrders();
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading admin dashboard...</span>
      </div>
    );
  }

  if (user.role !== 'admin') return null;

  const resolvedAdminAvatar = adminAvatar?.trim() ? adminAvatar : DEFAULT_ADMIN_AVATAR_URL;

  const TAB_LABELS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { key: 'users', label: `Users (${allUsers.length})`, icon: <Users className="h-3.5 w-3.5" /> },
    { key: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag className="h-3.5 w-3.5" /> },
    { key: 'menu', label: `Menu (${menu.length})`, icon: <ChefHat className="h-3.5 w-3.5" /> },
    { key: 'profile', label: 'My Profile', icon: <Shield className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="w-full bg-[#0f0907] min-h-screen text-zinc-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-8 relative z-10">

        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Admin Console</span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-1">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-lg shadow-red-500/10">
            <div className="relative">
              <Image
                src={resolvedAdminAvatar}
                alt="Admin"
                width={48}
                height={48}
                className="rounded-full border-2 border-red-500/40 object-cover"
                unoptimized
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f0907] bg-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">{adminName || 'Sakib'}</span>
              <span className="text-[10px] text-red-400 font-bold uppercase">Chef Admin</span>
            </div>
          </div>
        </div>

        {profileSaved && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs">
            <CheckCircle2 className="h-4 w-4" /> Profile updated!
          </div>
        )}

        {}
        <div className="flex gap-2 flex-wrap">
          {TAB_LABELS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                tab === t.key
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {}
        {tab === 'overview' && (
          <div className="flex flex-col gap-6">
            {}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: allUsers.length, icon: <Users className="h-5 w-5 text-blue-400" />, color: 'blue' },
                { label: 'Total Orders', value: orders.length, icon: <ShoppingBag className="h-5 w-5 text-orange-400" />, color: 'orange' },
                { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign className="h-5 w-5 text-emerald-400" />, color: 'emerald' },
                { label: 'Menu Items', value: menu.length, icon: <ChefHat className="h-5 w-5 text-red-400" />, color: 'red' },
              ].map((kpi) => (
                <div key={kpi.label} className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-2">
                  <div className={`p-2.5 bg-${kpi.color}-500/10 border border-${kpi.color}-500/20 rounded-xl w-fit`}>
                    {kpi.icon}
                  </div>
                  <span className="text-2xl font-black text-white">{kpi.value}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">{kpi.label}</span>
                </div>
              ))}
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {}
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-500" /> Avg Price By Category
                </h3>
                <div className="h-52">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.priceData} margin={{ left: -20 }}>
                        <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} unit="$" />
                        <Tooltip contentStyle={{ background: '#180f0c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                          {stats.priceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {}
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-red-500" /> Menu Distribution
                </h3>
                <div className="h-52">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats.catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                          {stats.catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#180f0c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        {tab === 'users' && (
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
            <div className="p-5 border-b border-white/5">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">All Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-400 bg-white/[0.01]">
                    <th className="p-4 font-semibold uppercase tracking-wider">User</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Email</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Role</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                            alt={u.name}
                            width={32}
                            height={32}
                            className="rounded-full border border-white/10"
                            unoptimized
                          />
                          <span className="font-bold text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                          u.role === 'admin'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border-white/5'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => { if (confirm(`Delete user "${u.name}"?`)) deleteUser(u.id); }}
                            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {}
        {tab === 'orders' && (
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-zinc-500 border border-white/5">
                No orders have been placed yet.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-extrabold text-sm font-mono">{order.id}</span>
                    <span className="text-[10px] text-zinc-500">{order.date} · {order.items.length} item(s)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded border ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : order.status === 'Confirmed' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleConfirmOrder(order.id)}
                      disabled={order.status === 'Confirmed' || updatingOrderId === order.id}
                      className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-all ${
                        order.status === 'Confirmed'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 cursor-default'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer'
                      }`}
                    >
                      {updatingOrderId === order.id ? 'Updating...' : order.status === 'Confirmed' ? 'Confirmed' : 'Confirm Order'}
                    </button>
                    <span className="font-black text-white text-base">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {}
        {tab === 'menu' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Link href="/items/add" className="btn-jelly px-5 py-2.5 text-xs font-bold flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Add Recipe
              </Link>
            </div>
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-400 bg-white/[0.01]">
                      <th className="p-4 font-semibold uppercase tracking-wider">Item</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">Category</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">Price</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">Rating</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">Source</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {menu.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                              <Image src={item.images[0]} alt={item.name} fill className="object-cover" unoptimized />
                            </div>
                            <span className="font-bold text-white">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-300">{item.category}</td>
                        <td className="p-4 text-white font-extrabold">${item.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="h-3 w-3 fill-amber-400" /> {item.rating}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                            item.createdBy ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-500/10 text-zinc-400 border-white/5'
                          }`}>
                            {item.createdBy ? 'Custom' : 'System'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Link href={`/menu/${item.id}`} className="p-2 rounded-lg border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white transition-all">
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              onClick={() => { if (confirm(`Delete "${item.name}"?`)) deleteItem(item.id); }}
                              className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {}
        {tab === 'profile' && (
          <div className="max-w-xl flex flex-col gap-6">
            <div className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col items-center gap-6">
              {}
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-red-500/40 bg-gradient-to-br from-red-600/40 to-amber-500/30 p-1">
                  <Image src={adminAvatar} alt="Admin" width={128} height={128} className="h-full w-full rounded-full object-cover" unoptimized />
                </div>
                {editingProfile && (
                  <div className="absolute -bottom-1 -right-1 p-2 bg-red-500 rounded-full">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {}
              {editingProfile && (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold transition-all hover:bg-red-500/20 cursor-pointer"
                    >
                      <Camera className="h-3.5 w-3.5" /> Upload from device
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide mb-2 text-center">Select Avatar Style</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ADMIN_AVATAR_OPTIONS.map((avatarUrl) => (
                      <button
                        key={avatarUrl}
                        onClick={() => setAdminAvatar(avatarUrl)}
                        className={`h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          adminAvatar === avatarUrl ? 'border-red-500' : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Image src={avatarUrl} alt="Admin avatar option" width={56} height={56} className="w-full h-full object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {}
              <div className="w-full flex flex-col gap-4">
                {[
                  { label: 'Display Name', value: adminName, setter: setAdminName },
                  { label: 'Phone', value: adminPhone, setter: setAdminPhone },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">{f.label}</label>
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                      disabled={!editingProfile}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">Email</label>
                  <input disabled value={user.email} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs opacity-50 cursor-not-allowed" />
                </div>
              </div>

              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-3 w-full">
                  <button onClick={handleSaveProfile} className="btn-jelly flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Save className="h-3.5 w-3.5" /> Save Changes
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="flex-1 py-3 text-xs font-bold border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
