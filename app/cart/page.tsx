'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, Lock, ChevronRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, cartTotal, placeOrder } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [discount, setDiscount] = useState(0);

  
  const subtotal = cartTotal - discount;
  const tax = Number((subtotal * 0.08).toFixed(2)); 
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const grandTotal = Number((subtotal + tax + deliveryFee).toFixed(2));

  
  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'BLAZE50') {
      setDiscount(Number((cartTotal * 0.5).toFixed(2)));
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'LAVABREAD') {
      setDiscount(4.49); 
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try BLAZE50 or LAVABREAD.');
      setDiscount(0);
    }
  };

  
  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    setCheckingOut(true);
    const order = await placeOrder();
    setCheckingOut(false);
    
    if (order) {
      router.push('/my-orders');
    }
  };

  
  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#0f0907] min-h-[75vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="p-5 bg-white/5 border border-white/10 rounded-full text-zinc-400">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-zinc-400 text-sm max-w-xs">You haven't added any fiery fast food to your basket yet. Check out our menu!</p>
        <Link href="/menu" className="btn-jelly px-8 py-3.5 text-xs font-bold tracking-wide mt-2">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Title */}
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Order Summary</span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Your Food Basket</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Cart Items List (2 Columns) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((cartItem) => (
              <div 
                key={cartItem.item.id} 
                className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-center gap-5 justify-between"
              >
                {/* Product details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-white/5">
                    <Image
                      src={cartItem.item.images[0]}
                      alt={cartItem.item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="bg-red-500/10 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded w-fit mb-1 border border-red-500/20 uppercase tracking-wider">
                      {cartItem.item.category}
                    </span>
                    <h3 className="font-bold text-white text-base leading-snug">{cartItem.item.name}</h3>
                    <span className="text-xs text-zinc-400 mt-0.5">${cartItem.item.price.toFixed(2)} each</span>
                  </div>
                </div>

                {/* Adjuster & Delete trigger */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t border-white/5 pt-4 sm:pt-0 sm:border-none">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5">
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                      className="p-1.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-white">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      className="p-1.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Item Total Price */}
                  <span className="font-extrabold text-white text-base">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(cartItem.item.id)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-500 border border-transparent hover:border-red-500/25 hover:bg-red-500/5 transition-all cursor-pointer"
                    title="Remove from Cart"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}

            <Link href="/menu" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors w-fit pl-2 mt-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Continue shopping
            </Link>
          </div>

          {/* RIGHT: Order Financial Breakdown */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider text-sm">
              Checkout Summary
            </h3>

            {/* Promo code form */}
            <form onSubmit={applyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. BLAZE50)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 uppercase tracking-widest font-bold placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
              />
              <button type="submit" className="glass-panel-light hover:bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-bold transition-all cursor-pointer">
                Apply
              </button>
            </form>
            {promoError && <p className="text-[10px] text-red-400 font-semibold mt-[-8px]">{promoError}</p>}
            {discount > 0 && <p className="text-[10px] text-emerald-400 font-semibold mt-[-8px]">Coupon applied successfully!</p>}

            {/* Fees list */}
            <div className="flex flex-col gap-3 text-xs border-b border-white/5 pb-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Cart Subtotal</span>
                <span className="text-zinc-200 font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Discount Applied</span>
                  <span className="text-emerald-400 font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Estimated Delivery</span>
                <span className="text-zinc-200 font-semibold">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sales Tax (8%)</span>
                <span className="text-zinc-200 font-semibold">${tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Grand Total</span>
              <span className="text-2xl font-black text-white glow-text">${grandTotal.toFixed(2)}</span>
            </div>

            {/* Place Order Trigger */}
            {user ? (
              <button
                onClick={handlePlaceOrder}
                disabled={checkingOut}
                className="btn-jelly w-full py-4 text-sm font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {checkingOut ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Placing Order...
                  </span>
                ) : (
                  <>Place Blazing Order <ChevronRight className="h-4 w-4" /></>
                )}
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href={`/login?redirect=cart`}
                  className="btn-jelly w-full py-4 text-sm font-bold tracking-wide flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" /> Sign In To Order
                </Link>
                <p className="text-[10px] text-center text-zinc-500 leading-normal">
                  A logged-in account is required so we can assign order status tracking to your account history.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
