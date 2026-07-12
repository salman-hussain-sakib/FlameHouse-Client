'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MenuItem, StoredUser } from '../lib/types';
import { INITIAL_MENU } from '../lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  demoLogin: (role: 'user' | 'admin') => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUsers: () => Promise<StoredUser[]>;

  
  customItems: MenuItem[];
  deletedItemIds: string[];
  addCustomItem: (item: Omit<MenuItem, 'id' | 'rating' | 'isFeatured'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getMenu: () => MenuItem[];

  
  getAllUsers: () => StoredUser[];
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [customItems, setCustomItems] = useState<MenuItem[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);
  const [serverMenu, setServerMenu] = useState<MenuItem[]>([]);
  const [allUsers, setAllUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('flamehouse_user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) { console.error(e); }

      fetch('/api/menu')
        .then((res) => res.ok ? res.json() : { items: [] })
        .then(({ items }) => setServerMenu(items ?? []))
        .catch(() => setServerMenu([]));

      setLoading(false);
    }
  }, []);

  

  const refreshUsers = async (): Promise<StoredUser[]> => {
    if (typeof window === 'undefined') return [];

    const token = localStorage.getItem('flamehouse_token');
    try {
      const res = await fetch('/api/auth/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const fallback = getAllUsers();
        return fallback;
      }

      const { users } = await res.json();
      const normalized = (users || []).map((u: StoredUser) => ({
        ...u,
        password: u.password || '',
      }));
      setAllUsers(normalized);
      return normalized;
    } catch {
      const fallback = getAllUsers();
      return fallback;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshUsers();
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { setLoading(false); return false; }
      const { user: serverUser, token } = await res.json();
      setUser(serverUser);
      localStorage.setItem('flamehouse_user', JSON.stringify(serverUser));
      localStorage.setItem('flamehouse_token', token);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) { setLoading(false); return false; }
      const { user: serverUser, token } = await res.json();
      setUser(serverUser);
      localStorage.setItem('flamehouse_user', JSON.stringify(serverUser));
      localStorage.setItem('flamehouse_token', token);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flamehouse_user');
    localStorage.removeItem('flamehouse_token');
  };

  const demoLogin = async (role: 'user' | 'admin'): Promise<boolean> => {
    const email = role === 'admin' ? 'admin@flamehouse.com' : 'user@flamehouse.com';
    const password = role === 'admin' ? 'admin123' : 'password123';
    return login(email, password);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('flamehouse_user', JSON.stringify(updated));

    try {
      const token = localStorage.getItem('flamehouse_token');
      await fetch('/api/auth/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id, updates }),
      });
    } catch {
      // keep local state even if persistence fails
    }
  };

  

  const addCustomItem = async (
    item: Omit<MenuItem, 'id' | 'rating' | 'isFeatured'>
  ): Promise<void> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('flamehouse_token') : null;
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...item, createdBy: user?.id ?? 'anonymous' }),
    });
    if (res.ok) {
      const { item: created } = await res.json();
      setCustomItems((prev) => [created, ...prev]);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('flamehouse_token') : null;
    const res = await fetch(`/api/menu/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      setDeletedItemIds((prev) => [...prev, id]);
      setCustomItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  
  const getMenu = (): MenuItem[] => {
    const baseMenu = serverMenu.length > 0
      ? serverMenu
      : [...INITIAL_MENU];

    return [...baseMenu, ...customItems].filter((i) => !deletedItemIds.includes(i.id));
  };

  

  const getAllUsers = (): StoredUser[] => {
    if (typeof window === 'undefined') {
      return [
        { id: 'admin-id', name: 'Chef Admin', email: 'admin@flamehouse.com', role: 'admin', password: 'admin123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
        { id: 'user-id', name: 'Alex Customer', email: 'user@flamehouse.com', role: 'user', password: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      ];
    }

    if (allUsers.length > 0) return allUsers;

    const list: StoredUser[] = JSON.parse(
      localStorage.getItem('flamehouse_registered_users') || '[]'
    );
    const demoUsers: StoredUser[] = [
      { id: 'admin-id', name: 'Chef Admin', email: 'admin@flamehouse.com', role: 'admin', password: 'admin123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
      { id: 'user-id', name: 'Alex Customer', email: 'user@flamehouse.com', role: 'user', password: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
    ];
    const merged = [...demoUsers];
    list.forEach((u) => { if (!merged.find((m) => m.id === u.id)) merged.push(u); });
    return merged;
  };

  const deleteUser = (id: string) => {
    const list: StoredUser[] = JSON.parse(localStorage.getItem('flamehouse_registered_users') || '[]');
    const updated = list.filter((u) => u.id !== id);
    localStorage.setItem('flamehouse_registered_users', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout, demoLogin, updateProfile, refreshUsers,
      customItems, deletedItemIds, addCustomItem, deleteItem, getMenu,
      getAllUsers, deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
