'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import MenuCard from '@/components/MenuCard';
import { 
  Flame, 
  ChevronRight, 
  ChevronLeft, 
  ArrowDown, 
  UtensilsCrossed, 
  Truck, 
  Clock, 
  Sparkles, 
  Users, 
  Star, 
  Plus, 
  Minus,
  Mail,
  CheckCircle2
} from 'lucide-react';


const HERO_SLIDES = [
  {
    title: 'Sizzling Fire-Grilled Masterpieces',
    subtitle: 'Taste the Blaze',
    description: 'We grill our burgers over open fire and layer them with secret hot-honey glazes and double melted sharp cheddar cheese.',
    
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&auto=format&fit=crop&q=80',
    
    foodImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80',
    ctaText: 'Explore Menu',
    ctaLink: '/menu',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    borderColor: 'border-red-500/20',
    ringColor: 'border-red-500/10',
    particleColor: '#ef4444',
    particleGlowColor: '#ef4444',
    portalStyles: {
      '--portal-color-1': '#ef4444',
      '--portal-color-2': '#ea580c',
      '--portal-glow-rgb': '239, 68, 68'
    } as React.CSSProperties
  },
  {
    title: 'Stone-Oven Pizzas Loaded With Heat',
    subtitle: 'Bubbling & Crisp',
    description: 'Hand-stretched dough baked to a perfect char, topped with double-spiced pepperoni and hot chili oil drizzle.',
    
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&auto=format&fit=crop&q=80',
    
    foodImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    ctaText: 'Order Pizza',
    ctaLink: '/menu?category=Pizza',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    borderColor: 'border-orange-500/20',
    ringColor: 'border-orange-500/10',
    particleColor: '#f97316',
    particleGlowColor: '#f97316',
    portalStyles: {
      '--portal-color-1': '#f97316',
      '--portal-color-2': '#d97706',
      '--portal-glow-rgb': '249, 115, 22'
    } as React.CSSProperties
  },
  {
    title: 'Crispy Nashville Glazed Hot Chicken',
    subtitle: 'Fired to Perfection',
    description: 'Double-breaded tenders dipped in custom cayenne pepper glazes, served with fresh cooling pickles.',
    
    image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=1600&auto=format&fit=crop&q=80',
    
    foodImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    ctaText: 'Grab Chicken',
    ctaLink: '/menu?category=Fried Chicken',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    borderColor: 'border-amber-500/20',
    ringColor: 'border-amber-500/10',
    particleColor: '#f59e0b',
    particleGlowColor: '#f59e0b',
    portalStyles: {
      '--portal-color-1': '#f59e0b',
      '--portal-color-2': '#ca8a04',
      '--portal-glow-rgb': '245, 158, 11'
    } as React.CSSProperties
  }
];


const PARTICLE_CONFIGS = [
  { size: 4, left: 15, delay: 0.2, duration: 4.2, drift: 12 },
  { size: 6, left: 32, delay: 1.5, duration: 5.5, drift: -10 },
  { size: 3, left: 48, delay: 0.8, duration: 3.8, drift: 15 },
  { size: 5, left: 65, delay: 2.2, duration: 4.8, drift: -15 },
  { size: 4, left: 78, delay: 1.1, duration: 4.4, drift: 8 },
  { size: 5, left: 25, delay: 3.0, duration: 5.0, drift: 10 },
  { size: 3, left: 42, delay: 0.4, duration: 4.0, drift: -8 },
  { size: 6, left: 58, delay: 2.5, duration: 5.8, drift: 14 },
  { size: 4, left: 70, delay: 1.8, duration: 4.6, drift: -12 },
  { size: 3, left: 12, delay: 2.9, duration: 3.9, drift: 9 }
];


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const { getMenu } = useAuth();
  const menu = getMenu();
  const featuredItems = menu.filter(item => item.isFeatured);

  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#0f0907] relative overflow-hidden pb-12">
      {}
      <div className="fixed top-[10%] left-[-15%] w-[700px] h-[700px] bg-red-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[50%] right-[-15%] w-[600px] h-[600px] bg-amber-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[30%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      {}
      <section className="w-full h-[65vh] min-h-[500px] relative flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={HERO_SLIDES[currentSlide].image}
                alt={HERO_SLIDES[currentSlide].title}
                fill
                className="object-cover blur-[3px]"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent z-10" />
            </motion.div>
          </AnimatePresence>
        </div>

        {}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              },
              exit: { 
                opacity: 0,
                transition: { duration: 0.3 }
              }
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center z-10"
          >
            {}
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <motion.span 
                    variants={{
                      hidden: { opacity: 0, y: -20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                    className="text-sm font-bold tracking-widest text-red-500 uppercase glow-text"
                  >
                    {HERO_SLIDES[currentSlide].subtitle}
                  </motion.span>
                  <motion.h1 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    className="text-4xl md:text-6xl font-black leading-tight"
                  >
                    <span className="shimmer-text">{HERO_SLIDES[currentSlide].title}</span>
                  </motion.h1>
                </div>

                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="text-base text-zinc-300 max-w-md leading-relaxed"
                >
                  {HERO_SLIDES[currentSlide].description}
                </motion.p>

                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="flex gap-4 mt-1 flex-wrap"
                >
                  <Link href={HERO_SLIDES[currentSlide].ctaLink} className="btn-jelly px-8 py-3.5 text-base font-bold tracking-wide">
                    {HERO_SLIDES[currentSlide].ctaText}
                  </Link>
                  <Link href="/menu" className="glass-panel-light hover:bg-white/10 px-8 py-3.5 rounded-full text-base font-semibold text-white transition-all border border-white/15">
                    Explore Full Menu
                  </Link>
                </motion.div>
              </div>

              {}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.8, rotate: -8 },
                  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.75, type: "spring", stiffness: 80, damping: 15 } }
                }}
                className="hidden md:flex items-center justify-center relative mx-auto"
              >
                {}
                <div 
                  className="hero-portal-container"
                  style={HERO_SLIDES[currentSlide].portalStyles}
                >
                  {}
                  <div 
                    className="absolute w-64 h-64 rounded-full blur-3xl opacity-50 transition-all duration-700" 
                    style={{ backgroundColor: HERO_SLIDES[currentSlide].glowColor }}
                  />

                  {}
                  <div className="portal-ring-dashed" />
                  <div className="portal-ring-glow" />
                  <div className="portal-ring-pulse" />

                  {}
                  <div className="float-3d relative z-10 w-52 h-52 md:w-60 md:h-60 aspect-square">
                    <Image
                      src={HERO_SLIDES[currentSlide].foodImage}
                      alt={HERO_SLIDES[currentSlide].title}
                      fill
                      sizes="(max-width: 768px) 200px, 300px"
                      className="rounded-full object-cover border-4 border-white/10 shadow-2xl"
                      unoptimized
                    />
                  </div>

                  {}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-20">
                    {PARTICLE_CONFIGS.map((particle, idx) => (
                      <div
                        key={idx}
                        className="absolute bottom-6 rounded-full animate-ember"
                        style={{
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                          left: `${particle.left}%`,
                          animationDelay: `${particle.delay}s`,
                          animationDuration: `${particle.duration}s`,
                          backgroundColor: HERO_SLIDES[currentSlide].particleColor,
                          boxShadow: `0 0 10px ${HERO_SLIDES[currentSlide].particleGlowColor}`,
                          '--ember-drift': `${particle.drift}px`
                        } as React.CSSProperties}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 z-20 p-3 rounded-full glass-panel border border-white/10 hover:bg-red-500/10 text-white transition-all cursor-pointer hidden md:block"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 z-20 p-3 rounded-full glass-panel border border-white/10 hover:bg-red-500/10 text-white transition-all cursor-pointer hidden md:block"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-zinc-400">
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-red-500" />
          </motion.div>
        </div>
      </section>

      {}
      <div className="max-w-7xl w-full px-6 md:px-12 flex flex-col gap-24 mt-24">

        {}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full flex flex-col gap-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">Top Rated Food</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">Featured Best-Sellers</h2>
            </div>
            <Link href="/menu" className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors">
              Browse Entire Menu <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredItems.map((item) => (
              <motion.div key={item.id} variants={fadeInUp}>
                <MenuCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full flex flex-col gap-8"
        >
          <div className="text-center">
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">Satisfy Your Cravings</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">Browse By Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Burgers', icon: '🍔', desc: 'Flame grilled double stack', link: '/menu?category=Burgers' },
              { name: 'Pizza', icon: '🍕', desc: 'Charred stone oven style', link: '/menu?category=Pizza' },
              { name: 'Fried Chicken', icon: '🍗', desc: 'Spiced hot tender breast', link: '/menu?category=Fried Chicken' },
              { name: 'Sides', icon: '🍟', desc: 'Cajun waffle fries & bread', link: '/menu?category=Sides' },
              { name: 'Drinks', icon: '🥤', desc: 'Mango and caramel creations', link: '/menu?category=Drinks' },
            ].map((cat, i) => (
              <Link href={cat.link} key={i} className="glass-card hover:border-red-500/30 rounded-2xl p-6 flex flex-col items-center text-center gap-3 group">
                <span className="text-4xl group-hover:scale-115 transition-transform duration-300">{cat.icon}</span>
                <span className="text-base font-bold text-white tracking-wide">{cat.name}</span>
                <span className="text-xs text-zinc-400">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </motion.section>

        {}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full flex flex-col gap-8"
        >
          <div className="text-center">
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">Our Process</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">How Ordering Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Feast',
                desc: 'Browse our signature glass-menu of hand-crafted burgers, pizzas, and tenders loaded with customizable fillings.',
                icon: <UtensilsCrossed className="h-7 w-7 text-red-500" />,
              },
              {
                step: '02',
                title: 'We Fire-Grill It',
                desc: 'Our chefs fire up the stone hearth and seared grills, cooking your selection to bubbling perfection in minutes.',
                icon: <Flame className="h-7 w-7 text-orange-500" />,
              },
              {
                step: '03',
                title: 'Blazing Fast Delivery',
                desc: 'Our drivers dispatch immediately in insulated cases to guarantee your food arrives steaming hot and full of flame.',
                icon: <Truck className="h-7 w-7 text-amber-500" />,
              },
            ].map((item, index) => (
              <div key={index} className="glass-panel-light rounded-2xl p-8 flex flex-col gap-4 relative">
                <span className="absolute top-4 right-6 text-5xl font-black text-white/5 tracking-wider">{item.step}</span>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl w-fit">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full flex flex-col gap-8"
        >
          <div>
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">Limited Offers</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">Today's Blazing Deals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promo 1 */}
            <div className="glass-panel border-l-4 border-l-red-500 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="flex flex-col gap-2.5 z-10">
                <span className="bg-red-500/10 text-red-400 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded w-fit uppercase">50% OFF FIRST ORDER</span>
                <h3 className="text-xl font-bold text-white">FlameHouse Welcome Feast</h3>
                <p className="text-sm text-zinc-400">Get half off your entire first order using code at checkout.</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="bg-white/5 border border-white/10 border-dashed px-3.5 py-1.5 rounded-lg text-sm font-mono text-white tracking-widest font-bold">BLAZE50</span>
                  <span className="text-xs text-zinc-500 font-medium">Click to copy</span>
                </div>
              </div>
              <div className="relative h-28 w-28 shrink-0 select-none">
                <Image src="https://images.unsplash.com/photo-1571066811602-71683a3f680d?w=300&auto=format&fit=crop&q=80" alt="Pizza slice deal" fill className="object-cover rounded-xl" unoptimized />
              </div>
            </div>

            {/* Promo 2 */}
            <div className="glass-panel border-l-4 border-l-amber-500 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="flex flex-col gap-2.5 z-10">
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded w-fit uppercase">FREE GARLIC BREAD</span>
                <h3 className="text-xl font-bold text-white">Cheesy Lava Drizzle Upgrade</h3>
                <p className="text-sm text-zinc-400">Add free garlic bread to any order of $25.00 or more.</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="bg-white/5 border border-white/10 border-dashed px-3.5 py-1.5 rounded-lg text-sm font-mono text-white tracking-widest font-bold">LAVABREAD</span>
                  <span className="text-xs text-zinc-500 font-medium">Click to copy</span>
                </div>
              </div>
              <div className="relative h-28 w-28 shrink-0 select-none">
                <Image src="https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300&auto=format&fit=crop&q=80" alt="Garlic bread deal" fill className="object-cover rounded-xl" unoptimized />
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 5: Stats Counter */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full glass-panel rounded-3xl p-10 flex flex-col md:flex-row items-center justify-around gap-8 text-center"
        >
          {[
            { value: '15,000+', label: 'Happy Foodies Served', icon: <Users className="h-6 w-6 text-red-500" /> },
            { value: '4.9/5', label: 'Average Customer Rating', icon: <Star className="h-6 w-6 text-amber-500 fill-amber-500" /> },
            { value: '22 Mins', label: 'Average Delivery Time', icon: <Clock className="h-6 w-6 text-orange-500" /> },
            { value: '120k+', label: 'Burgers Fire-Grilled', icon: <Flame className="h-6 w-6 text-red-600" /> },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-full">
                {stat.icon}
              </div>
              <span className="text-3xl font-black text-white glow-text tracking-tight mt-1">{stat.value}</span>
              <span className="text-xs text-zinc-400 tracking-wide uppercase font-semibold">{stat.label}</span>
            </div>
          ))}
        </motion.section>

        {/* SECTION 6: Testimonials */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full flex flex-col gap-8"
        >
          <div className="text-center">
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">Fan Favorites</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">What Foodies Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Marcus K.',
                rating: 5,
                comment: 'The signature burger blew my mind. Onion rings inside are super crispy and the sauce has a beautiful kick. 10/10.',
                role: 'Verified Burger Lover'
              },
              {
                name: 'Elena R.',
                rating: 5,
                comment: 'We ordered the Firehouse Pepperoni pizza last night. The hot-honey drizzle combined with pepperoni was magical. Delivered within 20 minutes.',
                role: 'Frequent Feast Customer'
              },
              {
                name: 'Devin T.',
                rating: 4.8,
                comment: 'Amazing Nashville Hot Chicken! Very spicy but incredibly juicy. The pickles balance it perfectly. Will order again.',
                role: 'Fried Chicken Connoisseur'
              }
            ].map((testi, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 flex flex-col justify-between gap-4 hover:translate-y-0 hover:border-white/10">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 italic leading-relaxed">"{testi.comment}"</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-red-600 to-amber-500 flex items-center justify-center font-bold text-xs text-white">
                    {testi.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{testi.name}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 7: Interactive FAQ Accordions */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full flex flex-col gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">Got Questions?</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                q: 'What is the average delivery range and time?',
                a: 'We deliver within an 8-mile radius of our store. Our average delivery time is 20-30 minutes, ensuring your food arrives hot, fresh, and seared.'
              },
              {
                q: 'Are there vegetarian-friendly items on the menu?',
                a: 'Yes! We offer items like the Garden Veggie Feast Pizza and Cheesy Lava Garlic Bread. You can filter the menu easily by checking the "Vegetarian" checkbox.'
              },
              {
                q: 'Can I adjust the spice level of my order?',
                a: 'Our menu cards show heat indicators. Many of our items have customizable settings, and you can add instructions during checkout to request extra mild or volcanic heat levels!'
              },
              {
                q: 'How does the simulated ordering system work?',
                a: 'This site runs a fully persistent simulated experience. You can log in using our demo buttons, add items, place orders, and track them instantly on the "My Orders" tab.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="glass-panel rounded-xl overflow-hidden border border-white/5 transition-all">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-bold text-white hover:bg-white/5 transition-colors cursor-pointer text-sm md:text-base"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <Minus className="h-4 w-4 text-red-500" /> : <Plus className="h-4 w-4 text-zinc-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-zinc-400 border-t border-white/5 leading-relaxed bg-black/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* SECTION 8: Newsletter signup */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="w-full glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute -right-12 -top-12 p-10 bg-red-600/10 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="max-w-2xl flex flex-col gap-6 relative z-10">
            <div>
              <span className="text-xs font-bold text-red-500 tracking-widest uppercase block mb-1">Stay Updated</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">Join The Blazing Circle</h2>
              <p className="text-sm text-zinc-300 leading-relaxed mt-2.5">
                Subscribe to our newsletter to receive exclusive discount codes, menu releases, and notification of weekly deals.
              </p>
            </div>

            {newsletterSubscribed ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">Awesome! You have subscribed. Check your inbox soon for your 25% off coupon!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-grow">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-full text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-500"
                  />
                </div>
                <button type="submit" className="btn-jelly px-8 py-3.5 text-sm font-bold tracking-wide shrink-0">
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
