'use client';

import Link from 'next/link';
import { MapPin, Clock3, Phone, ArrowRight } from 'lucide-react';

const locations = [
  {
    city: 'Dhaka',
    address: 'Level 8, Banani Arcade, Dhaka 1213',
    hours: 'Open daily · 11:00 AM - 11:00 PM',
    phone: '+880 1712-000000',
  },
  {
    city: 'Chattogram',
    address: 'GEC Circle, Chattogram 4000',
    hours: 'Open daily · 12:00 PM - 10:00 PM',
    phone: '+880 1811-000000',
  },
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#0f0907] text-zinc-100 px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-400">Locations</p>
          <h1 className="text-4xl font-black sm:text-5xl">Visit FlameHouse near you</h1>
          <p className="max-w-2xl text-base text-zinc-400">
            We are serving fresh fire-grilled meals across key city locations with fast pickup and delivery support.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {locations.map((location) => (
            <div key={location.city} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-red-500/15 p-3 text-red-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{location.city}</h2>
                  <p className="text-sm text-zinc-400">FlameHouse Kitchen</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-zinc-300">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-red-400" />
                  <span>{location.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-red-400" />
                  <span>{location.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-zinc-300">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Need help choosing a branch?</h3>
              <p className="text-zinc-400">Our team can help you find the fastest pickup location near your area.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-red-300">
              Contact support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
