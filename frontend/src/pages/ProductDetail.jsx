import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Shield, RefreshCw, Truck, ChevronRight, Star, Minus, Plus, Share2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
        toast.error("Collection record not found");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
    } catch (err) {
      // Error handled by CartContext
    }
    setAdding(false);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-pearl gap-6">
      <div className="w-16 h-[1px] bg-luxury-gold animate-pulse"></div>
      <span className="text-[10px] uppercase tracking-[0.5em] font-black shimmer">Loading Masterpiece</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-pearl px-6 text-center">
      <h2 className="text-4xl font-playfair mb-6 italic">Masterpiece not found</h2>
      <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-10">This specific timepiece may have been retired or moved.</p>
      <Link to="/products" className="px-10 py-4 bg-luxury-charcoal text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-luxury-gold transition-all">
        Explore Collections
      </Link>
    </div>
  );

  return (
    <div className="bg-luxury-pearl min-h-screen pt-40 pb-32">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Editorial Navigation */}
        <div className="flex items-center justify-between mb-16 pb-8 border-b border-luxury-sand">
          <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] font-black text-gray-400">
            <Link to="/" className="hover:text-luxury-charcoal transition-colors">House</Link>
            <ChevronRight size={10} />
            <Link to="/products" className="hover:text-luxury-charcoal transition-colors">Catalog</Link>
            <ChevronRight size={10} />
            <span className="text-luxury-gold">{product.name}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-luxury-charcoal transition-colors flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Visual Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2 space-y-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square w-full rounded-2xl overflow-hidden bg-white border-2 transition-all ${activeImage === idx ? 'border-luxury-gold shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="col-span-10">
                <motion.div 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-2xl premium-card"
                >
                  <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </div>
            
            {/* Extended Visual Detail */}
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-luxury-sand">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-luxury-gold mb-8">Collector's Notes</h3>
              <p className="text-gray-500 leading-loose text-lg font-light italic">
                "{product.description}"
              </p>
            </div>
          </div>

          {/* Acquisition Module */}
          <div className="lg:col-span-5">
            <div className="sticky top-40">
              <div className="mb-12">
                <span className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] font-black mb-6 block shimmer">The {product.brand} Collection</span>
                <h1 className="text-5xl md:text-7xl font-playfair mb-6 leading-none">{product.name}</h1>
                <div className="flex items-center gap-8">
                  <span className="text-4xl font-bold tracking-tighter text-luxury-charcoal">${product.price.toLocaleString()}</span>
                  {product.discount > 0 && (
                    <span className="bg-red-50 py-1.5 px-4 rounded-full text-red-600 text-[10px] uppercase font-black tracking-widest">
                      Special Privilege -{product.discount}%
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-12 pb-12 border-b border-luxury-sand">
                {/* Configuration */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">Availability</span>
                    <span className={`text-[10px] uppercase tracking-widest font-black ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? 'Boutique Exclusive' : 'Reserved / Sold Out'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-luxury-sand shadow-sm">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black ml-2">Quantity</span>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-luxury-sand rounded-lg transition-colors"><Minus size={14} /></button>
                      <span className="text-sm font-black w-4 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:bg-luxury-sand rounded-lg transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-5 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className="col-span-4 bg-luxury-charcoal text-white py-6 px-10 text-[10px] uppercase tracking-[0.4em] font-black rounded-2xl hover:bg-luxury-gold transition-all duration-500 shadow-xl disabled:bg-gray-300 flex items-center justify-center gap-4 group"
                  >
                    {product.stock === 0 ? 'Waitlist Only' : (adding ? 'Authenticating...' : <>Add To Bag <ShoppingBag size={18} strokeWidth={1.5} className="group-hover:translate-y-[-2px] transition-transform" /></>)}
                  </button>
                  <button className="col-span-1 border border-luxury-sand rounded-2xl flex items-center justify-center hover:bg-white hover:shadow-lg hover:border-luxury-gold transition-all text-gray-400 hover:text-luxury-gold">
                    <Heart size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* High-End Specs Table */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <Info size={16} className="text-luxury-gold" />
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Technical Specifications</h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'Movement', value: 'Calibre 3235, Manufacture Rolex' },
                    { label: 'Case', value: 'Oyster, 41 mm, Oystersteel and platinum' },
                    { label: 'Bezel', value: 'Fluted, 18 ct white gold' },
                    { label: 'Bracelet', value: 'Jubilee, five-piece links' },
                    { label: 'Winding', value: 'Bidirectional self-winding' },
                  ].map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-luxury-sand/50 group">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-luxury-gold transition-colors">{spec.label}</span>
                      <span className="text-[10px] uppercase tracking-widest font-black text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-3 gap-6 mt-16">
                <div className="flex flex-col items-center text-center gap-3 p-4 bg-white/50 rounded-2xl">
                  <Truck size={18} className="text-luxury-gold" />
                  <span className="text-[8px] uppercase tracking-widest font-black leading-tight">Secured <br /> Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 p-4 bg-white/50 rounded-2xl">
                  <Shield size={18} className="text-luxury-gold" />
                  <span className="text-[8px] uppercase tracking-widest font-black leading-tight">Lifetime <br /> Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 p-4 bg-white/50 rounded-2xl">
                   <RefreshCw size={18} className="text-luxury-gold" />
                  <span className="text-[8px] uppercase tracking-widest font-black leading-tight">Authentic <br /> Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
