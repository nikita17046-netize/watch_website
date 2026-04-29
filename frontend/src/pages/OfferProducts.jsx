import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Star, Globe } from 'lucide-react';
import API from '../api/api';

const offerDetails = {
  guarantee: {
    title: "Certified Authenticity",
    highlight: "100% Guarantee",
    desc: "Rigorous multi-point inspection by Geneva-certified horologists ensuring absolute originality.",
    icon: <ShieldCheck size={32} className="text-[#C9A84C]" />,
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=2400"
  },
  warranty: {
    title: "Heritage Care",
    highlight: "5-Year Warranty",
    desc: "Comprehensive mechanical warranty and priority routine maintenance at any global boutique.",
    icon: <Star size={32} className="text-[#C9A84C]" />,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=2400"
  },
  privilege: {
    title: "Inner Circle",
    highlight: "15% Courtesy",
    desc: "Exclusive courtesy valuation on subsequent acquisitions and priority access to limited releases.",
    icon: <Globe size={32} className="text-[#C9A84C]" />,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2400"
  }
};

const OfferProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  
  const offer = offerDetails[id] || offerDetails.guarantee;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch all products and slice the first 4 to demonstrate
    API.get('/product/all').then(res => {
      // Show all products with the offer
      setProducts(res.data.products);
    }).catch(console.error);
  }, [id]);

  return (
    <div className="bg-luxury-pearl min-h-screen pt-24 pb-40">
      <div className="container mx-auto px-6 lg:px-12">
        <Link to="/" className="inline-flex items-center gap-3 text-luxury-charcoal uppercase tracking-[0.3em] text-[10px] font-black hover:text-[#C9A84C] transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        
        {/* Banner */}
        <div className="relative rounded-[3rem] overflow-hidden mb-24 h-[50vh] flex items-center shadow-2xl">
          <img src={offer.image} className="absolute inset-0 w-full h-full object-cover" alt={offer.title} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2044]/90 via-[#0F2044]/60 to-transparent" />
          <div className="relative z-10 px-12 md:px-24">
            <div className="mb-8 bg-white/5 p-4 rounded-full border border-white/20 inline-block backdrop-blur-md">
              {offer.icon}
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-black text-white mb-6">
              {offer.title} <br/>
              <span className="italic font-light text-[#C9A84C]">{offer.highlight}</span>
            </h1>
            <p className="text-white/70 uppercase tracking-[0.2em] text-xs font-bold max-w-lg leading-loose border-l-2 border-[#C9A84C] pl-6">
              {offer.desc}
            </p>
          </div>
        </div>

        <div className="text-center mb-16">
          <span className="text-[#C9A84C] uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">Curated Selection</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-black text-luxury-charcoal">Eligible Timepieces.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.9 }}
              className="group"
            >
              <Link to={`/product/${product._id}`} className="block bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-luxury-sand/40 transition-all duration-500 group-hover:-translate-y-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] mb-6 bg-luxury-sand/20">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#0F2044]/90 backdrop-blur-md text-[#C9A84C] px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.3em] font-black shadow-lg">
                      {offer.highlight}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-[#0F2044]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                    <span className="bg-white text-luxury-charcoal px-8 py-3 text-[10px] uppercase tracking-[0.3em] font-black rounded-full shadow-2xl translate-y-6 group-hover:translate-y-0 transition-transform duration-500">View Piece</span>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-xl font-playfair font-black text-luxury-charcoal mb-4 group-hover:text-[#C9A84C] transition-colors duration-500 line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center border-t border-luxury-sand/50 pt-4">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{product.category}</span>
                    <span className="text-lg font-black tracking-tight text-[#0F2044]">${product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {products.length === 0 && (
             <div className="col-span-4 text-center py-20 text-gray-500">
               No products available at the moment.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferProducts;
