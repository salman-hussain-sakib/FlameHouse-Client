'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, CartItem, Order } from '../lib/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  ordersLoading: boolean;
  refreshOrders: () => Promise<void>;
  placeOrder: () => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `flamehouse_cart_${user?.id || 'anonymous'}`;
    try {
      const stored = localStorage.getItem(key);
      setCart(stored ? JSON.parse(stored) : []);
    } catch { setCart([]); }
  }, [user]);

  
  const fetchOrders = useCallback(async () => {
    if (!user) { setOrders([]); return; }
    setOrdersLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('flamehouse_token') : null;
      const url = user.role === 'admin' ? '/api/orders' : `/api/orders?userId=${user.id}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const { orders: serverOrders } = await res.json();
        setOrders(serverOrders || []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (!user) return;
    const intervalId = window.setInterval(fetchOrders, 10000);
    return () => window.clearInterval(intervalId);
  }, [fetchOrders, user]);

  

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`flamehouse_cart_${user?.id || 'anonymous'}`, JSON.stringify(newCart));
    }
  };

  const addToCart = (item: MenuItem, quantity = 1) => {
    const availableStock = item.stock ?? 25;
    if (availableStock <= 0) return;

    const idx = cart.findIndex((i) => i.item.id === item.id);
    const existingQty = idx > -1 ? cart[idx].quantity : 0;
    const safeQuantity = Math.min(quantity, Math.max(0, availableStock - existingQty));
    if (safeQuantity <= 0) return;

    const newCart = [...cart];
    if (idx > -1) { newCart[idx].quantity += safeQuantity; }
    else { newCart.push({ item, quantity: safeQuantity }); }
    saveCart(newCart);
  };

  const removeFromCart = (itemId: string) => saveCart(cart.filter((i) => i.item.id !== itemId));

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(itemId); return; }
    saveCart(cart.map((i) => i.item.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => saveCart([]);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = cart.reduce((t, i) => t + i.item.price * i.quantity, 0);

  

  const placeOrder = async (): Promise<Order | null> => {
    if (!user || cart.length === 0) return null;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('flamehouse_token') : null;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id, items: cart, cartTotal }),
      });

      if (!res.ok) return null;
      const { order } = await res.json();

      setOrders((prev) => [order, ...prev]);
      clearCart();
      return order as Order;
    } catch {
      return null;
    }
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal, orders, ordersLoading, refreshOrders: fetchOrders, placeOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
