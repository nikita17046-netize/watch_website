import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Star, ShieldCheck, Globe, X, ChevronDown, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import { useWishlist } from '../context/WishlistContext';

import heroVideo from '../assets/hero_video.mp4';

/* ─── Offers Banner ─── */
const offersData = [
  {
    id: 'guarantee',
    title: "Certified Authenticity",
    highlight: "100% Guarantee",
    desc: "Rigorous multi-point inspection by Geneva-certified horologists ensuring absolute originality.",
    icon: <ShieldCheck size={20} />,
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=2400"
  },
  {
    id: 'warranty',
    title: "Heritage Care",
    highlight: "5-Year Warranty",
    desc: "Comprehensive mechanical warranty and priority routine maintenance at any global boutique.",
    icon: <Star size={20} />,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=2400"
  },
  {
    id: 'privilege',
    title: "Inner Circle",
    highlight: "15% Courtesy",
    desc: "Exclusive courtesy valuation on subsequent acquisitions and priority access to limited releases.",
    icon: <Globe size={20} />,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2400"
  }
];

const OffersBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % offersData.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img src={offersData[current].image} className="w-full h-full object-cover" alt={offersData[current].title} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2044]/95 via-[#0F2044]/80 to-[#0F2044]/40" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="text-[#C9A84C] uppercase tracking-[0.6em] text-[10px] font-black mb-6 flex items-center gap-4">
              {offersData[current].icon} <span className="w-8 h-[1px] bg-[#C9A84C]" /> Client Privileges
            </span>
            <h2 className="text-5xl md:text-7xl font-playfair font-black text-white leading-[1.1] mb-6">
              {offersData[current].title} <br/>
              <span className="italic font-light" style={{ color: '#C9A84C' }}>{offersData[current].highlight}</span>
            </h2>
            <p className="text-white/60 uppercase tracking-[0.2em] text-sm font-medium mb-10 max-w-lg leading-loose">
              {offersData[current].desc}
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to={`/offer/${offersData[current].id}`} className="group flex items-center gap-4 bg-[#C9A84C] text-black px-10 py-5 text-[11px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-white transition-all shadow-2xl">
                Explore Pieces <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-12 left-6 lg:left-16 flex gap-4 z-20">
          {offersData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`transition-all duration-500 rounded-full h-[2px] ${current === idx ? 'bg-[#C9A84C] w-12' : 'bg-white/30 w-4 hover:bg-white/60'}`}
              aria-label={`Show offer ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Brand Marquee ─── */
const brands = ['ROLEX', 'OMEGA', 'PATEK PHILIPPE', 'CARTIER', 'TAG HEUER', 'AUDEMARS PIGUET', 'TITAN', 'IWC', 'BREITLING', 'JAEGER-LECOULTRE'];

const Marquee = () => (
  <div className="overflow-hidden bg-black py-4 border-y border-white/10">
    <motion.div
      className="flex gap-16 whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
    >
      {[...brands, ...brands].map((b, i) => (
        <span key={i} className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 shrink-0">
          {b} <span className="text-white/20 mx-4">✦</span>
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─── Video Modal ─── */
const VideoModal = ({ onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
        onClick={e => e.stopPropagation()}
      >
        <video
          className="w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          controls
        />
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
          <X size={18} className="text-white" />
        </button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─── Stat Counter ─── */
const Stat = ({ num, label }) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
  >
    <h3 className="text-5xl md:text-6xl font-playfair font-black text-white mb-2">{num}</h3>
    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">{label}</p>
  </motion.div>
);

/* ─── Main Home ─── */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToWishlist, isInWishlist } = useWishlist();
  const [showVideo, setShowVideo] = useState(false);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);

  const y1 = useTransform(scrollY, [0, 700], [0, 260]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.12]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);
  const smoothY = useSpring(y1, { stiffness: 80, damping: 25 });

  useEffect(() => {
    API.get('/product/all').then(res => {
      setFeaturedProducts(res.data.products.slice(0, 4));
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-luxury-pearl overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        {/* Video background */}
        <motion.div style={{ y: smoothY, scale }} className="absolute inset-0 z-0">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </motion.div>

        {/* Floating accent elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#C9A84C]/10 blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-blue-900/20 blur-[60px]" />

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}>
              <motion.span
                className="inline-flex items-center gap-3 text-[#C9A84C] uppercase tracking-[0.6em] text-[10px] font-black mb-10 block"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              >
                <span className="w-8 h-[1px] bg-[#C9A84C]" />
                The Art of High Horology
                <span className="w-8 h-[1px] bg-[#C9A84C]" />
              </motion.span>

              <h1 className="text-7xl md:text-[10rem] font-playfair font-black text-white leading-[0.85] tracking-tighter mb-12">
                DEFINING <br />
                <span className="italic font-light" style={{ color: '#C9A84C' }}>PRECISION.</span>
              </h1>

              <p className="text-white/60 text-sm max-w-sm leading-loose font-medium uppercase tracking-widest border-l-2 pl-6 mb-14" style={{ borderColor: '#C9A84C' }}>
                Crafted in Geneva. <br />
                A symphony of mechanical perfection for the modern elite.
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <Link to="/products" className="group inline-flex items-center gap-4 bg-[#C9A84C] text-black px-10 py-5 text-[11px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-white transition-all duration-500 shadow-2xl shadow-[#C9A84C]/20">
                  Explore Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>

                <button
                  onClick={() => setShowVideo(true)}
                  className="group flex items-center gap-4 text-white/70 hover:text-white transition-colors text-[11px] uppercase tracking-[0.3em] font-black"
                >
                  <div className="relative w-14 h-14 flex items-center justify-center border border-white/30 rounded-full group-hover:border-[#C9A84C] transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-[#C9A84C] scale-0 group-hover:scale-100 transition-transform origin-center rounded-full opacity-20" />
                    <Play size={16} fill="currentColor" />
                  </div>
                  Watch Film
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[8px] uppercase tracking-[0.5em] font-black text-white/40">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={20} className="text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ BRAND MARQUEE ═══ */}
      <Marquee />

      {/* ═══ FEATURED COLLECTION ═══ */}
      <section className="py-40 bg-luxury-pearl">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
              <span className="text-[#C9A84C] uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">Current Acquisitions</span>
              <h2 className="text-6xl md:text-8xl font-playfair font-black text-luxury-charcoal leading-none">The<br /><span className="italic font-light">Collection.</span></h2>
            </div>
            <Link to="/products" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-luxury-charcoal border-b-2 border-luxury-sand pb-3 hover:border-[#C9A84C] transition-all">
              View All <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.length > 0 ? featuredProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.9 }}
                className={`group ${idx === 1 ? 'md:translate-y-16' : ''}`}
              >
                <Link to={`/product/${product._id}`} className="block bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-luxury-sand/40 transition-all duration-500 group-hover:-translate-y-2">
                  <div className="relative aspect-[4/5] rounded-[3.5rem] bg-white premium-card mb-10">
                    <div className="absolute top-8 right-8 z-20">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToWishlist(product);
                        }}
                        className={`p-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
                      >
                        <Heart size={18} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110" 
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.3em] font-black shadow-sm text-luxury-charcoal">{product.brand}</span>
                    </div>
                    <div className="absolute inset-0 bg-[#0F2044]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                      <span className="bg-white text-luxury-charcoal px-8 py-3 text-[10px] uppercase tracking-[0.3em] font-black rounded-full shadow-2xl translate-y-6 group-hover:translate-y-0 transition-transform duration-500">View Piece</span>
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-xl font-playfair font-medium text-luxury-charcoal mb-4 group-hover:text-[#C9A84C] transition-colors duration-500 line-clamp-1">{product.name}</h3>
                    <div className="flex justify-between items-center border-t border-luxury-sand/50 pt-4">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{product.category}</span>
                      <span className="text-lg font-black tracking-tight text-[#0F2044]">${product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              /* Placeholder cards when no products */
              [
                { img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800', name: 'Submariner Date', brand: 'Rolex', price: 15000, cat: 'Men' },
                { img: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?q=80&w=800', name: 'Seamaster 300', brand: 'Omega', price: 8500, cat: 'Men' },
                { img: 'https://images.unsplash.com/photo-1508685096489-7aac291ba59e?q=80&w=800', name: 'Ballon Bleu', brand: 'Cartier', price: 12000, cat: 'Women' },
              ].map((p, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className={`group ${idx === 1 ? 'md:translate-y-16' : ''}`}>
                  <Link to="/products" className="block bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-luxury-sand/40 transition-all duration-500 group-hover:-translate-y-2">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] mb-6 bg-luxury-sand/20">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.3em] font-black shadow-sm text-luxury-charcoal">{p.brand}</span>
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <h3 className="text-xl font-playfair font-black text-luxury-charcoal mb-4 group-hover:text-[#C9A84C] transition-colors duration-500 line-clamp-1">{p.name}</h3>
                      <div className="flex justify-between items-center border-t border-luxury-sand/50 pt-4">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{p.cat}</span>
                        <span className="text-lg font-black tracking-tight text-[#0F2044]">${p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══ SLIDING OFFERS BANNER ═══ */}
      <OffersBanner />

      {/* ═══ HERITAGE EDITORIAL ═══ */}
      <section className="py-48 bg-white relative overflow-hidden">
        {/* Subtle background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-20" />
        
        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            >
              <span className="text-[#C9A84C] uppercase tracking-[0.7em] text-[10px] font-black mb-8 block flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[#C9A84C]" /> Our Heritage
              </span>
              <h2 className="text-7xl md:text-8xl font-playfair font-black mb-12 leading-[0.9] tracking-tighter text-slate-900">
                Mastery in <br />
                <span className="italic font-light text-[#C9A84C]">Every Gear.</span>
              </h2>
              <div className="relative pl-10 mb-14">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C] opacity-30" />
                 <p className="text-slate-500 text-xl font-light leading-relaxed italic">
                    "At LUXE, we don't just curate timepieces; we engineer legacies. Each mechanical heartbeat in our collection is a testament to centuries of Swiss horological perfection."
                 </p>
              </div>
              <Link to="/products" className="group inline-flex items-center gap-6 text-[11px] uppercase tracking-[0.5em] font-black text-slate-900 transition-all">
                Explore the Archives 
                <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] group-hover:text-white transition-all">
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }} 
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group">
                <img 
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200" 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                  alt="Precision Craftsmanship" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Luxury Certification Badge */}
              <motion.div
                className="absolute -bottom-16 -left-16 bg-white p-12 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 hidden lg:block z-20"
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: 0.6, duration: 1 }}
              >
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center text-[#C9A84C]">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated By</p>
                      <p className="text-sm font-playfair font-black text-slate-900 uppercase">Geneva Registry</p>
                   </div>
                </div>
              </motion.div>

              {/* Decorative Floating Ring */}
              <div className="absolute -top-10 -right-10 w-40 h-40 border border-[#C9A84C]/20 rounded-full animate-spin-slow" />
            </motion.div>

          </div>
        </div>
      </section>


      {/* ═══ GRID GALLERY ═══ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 mb-16 text-center">
           <span className="text-[#C9A84C] uppercase tracking-[0.6em] text-[9px] font-black mb-4 block">Visual Registry</span>
           <h2 className="text-4xl font-playfair font-black text-slate-900 uppercase tracking-tight italic">The Visual Edit.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {[
            'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800',
            'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=800',
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800',
            'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800',
          ].map((src, i) => (
            <motion.div
              key={i} 
              className="overflow-hidden rounded-[2rem] aspect-[4/5] group cursor-pointer relative shadow-sm hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <img 
                src={src} 
                alt="Curated Gallery" 
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Heart size={20} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ═══ TRUST SECTION ═══ */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <span className="text-[#C9A84C] uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">The LUXE Promise</span>
            <h2 className="text-5xl md:text-6xl font-playfair font-black">Why Choose Us.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: <ShieldCheck size={36} />, title: 'Unrivaled Trust', desc: 'Global 50-year heritage warranty with every masterpiece.' },
              { icon: <Globe size={36} />, title: 'Secure Logistics', desc: 'Insured white-glove delivery to over 120 countries.' },
              { icon: <Star size={36} />, title: 'Expert Concierge', desc: 'Complimentary lifetime maintenance at any global boutique.' },
            ].map((item, i) => (
              <motion.div
                key={i} className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              >
                <div className="w-20 h-20 border border-luxury-sand rounded-full flex items-center justify-center mb-10 group-hover:shadow-xl group-hover:bg-white transition-all duration-700" style={{ color: '#C9A84C' }}>
                  {item.icon}
                </div>
                <h4 className="text-[13px] uppercase tracking-[0.4em] font-black mb-4">{item.title}</h4>
                <p className="text-gray-400 text-xs font-bold leading-relaxed uppercase tracking-widest max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER CTA ═══ */}
      <section className="py-32 bg-[#0F2044] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#C9A84C]/10 blur-[100px]" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <span className="text-[#C9A84C] uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Private Registry</span>
            <h2 className="text-5xl md:text-6xl font-playfair font-black text-white mb-8">Join the Inner Circle.</h2>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold mb-14 max-w-md mx-auto">Exclusive access to limited releases, private sales, and curatorial events.</p>
            <div className="flex max-w-md mx-auto border-b border-white/20 pb-4 gap-4">
              <input type="email" placeholder="Your Email Address" className="flex-1 bg-transparent text-white text-[11px] uppercase tracking-widest outline-none placeholder:text-white/30 font-bold" />
              <button className="text-[#C9A84C] text-[11px] uppercase tracking-[0.3em] font-black hover:text-white transition-colors">
                Join →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
    </div>
  );
};

export default Home;
