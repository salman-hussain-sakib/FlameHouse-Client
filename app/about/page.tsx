'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-16 px-6 md:px-12 text-zinc-300 relative overflow-hidden">
      <div className="absolute top-[30%] left-[-15%] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="flex flex-col gap-2.5 text-center">
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase">The FlameHouse Journey</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">Our Blazing Story</h1>
          <p className="text-base text-zinc-400 max-w-xl mx-auto mt-2 leading-relaxed">
            Fusing wood-fire craftsmanship with dynamic modern cooking techniques to create the ultimate premium fast food experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-80 rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80"
              alt="Grill flames cooking burger patties"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">How it All Started</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Founded in 2026, FlameHouse set out to challenge the standard fast food recipe. We believed that quick, convenient meals should not compromise on seared fire textures or premium ingredients.
            </p>
            <p className="text-sm leading-relaxed text-zinc-400">
              We sourced stone-ovens that operate at 800°F for pizzas and charcoal seared grills for our burgers. By combining this heat with chili-infused honey, fresh hand-picked basil, and signature dry-rubs, we developed a menu that truly lives up to its name.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-white text-center">Our Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Charcoal Grilling',
                desc: 'We never microwave or pan fry. All patties are seared on open flame grills to trap juices and char.',
                icon: <Flame className="h-6 w-6 text-red-500" />,
              },
              {
                title: 'Fresh Ingredients Only',
                desc: 'From fresh hand-kneaded dough to daily cut tomatoes, veggies, and local raw hot honey.',
                icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
              },
              {
                title: 'Blazing Fast Care',
                desc: 'Insulated case delivery matching state of the art dispatch tracking for steaming hot arrivals.',
                icon: <Heart className="h-6 w-6 text-orange-500" />,
              },
            ].map((val, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl w-fit">{val.icon}</div>
                <h3 className="font-bold text-white text-base mt-1">{val.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-extrabold text-white text-xl md:text-2xl">Hungry For More?</h3>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Head over to our explore screen to check our live pricing, spice filters, and customize a dynamic checkout order.
            </p>
          </div>
          <Link href="/menu" className="btn-jelly px-8 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start md:self-auto">
            Explore Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
