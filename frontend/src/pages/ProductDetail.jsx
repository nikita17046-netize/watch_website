import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Shield, RefreshCw, Truck, ChevronRight, Star, Minus, Plus, Share2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlist as useLuxeWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { addToWishlist, isInWishlist } = useLuxeWishlist();
  const navigate = useNavigate();

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
        toast.error("Piece not found");
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
      console.error("Cart error", err);
    }
    setAdding(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF8]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">Luxe</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFCF8] p-6 text-center">
      <h2 className="text-3xl font-playfair text-[#1A1A1A] mb-4">Product Not Found</h2>
      <Link to="/products" className="text-[#C9A84C] text-xs uppercase tracking-widest font-bold hover:underline">Back to Gallery</Link>
    </div>
  );

  return (
    <div className="bg-[#FFFCF8] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-10">
        
        {/* Simple Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
          <Link to="/" className="hover:text-[#C9A84C]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#C9A84C]">Watches</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">{product.brand}</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#F0E6D2]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Vibrant Image Showcase */}
            <div className="p-8 lg:p-12 bg-[#F9F5EF] flex flex-col gap-6">
              <motion.div 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-3xl overflow-hidden shadow-xl bg-white border-4 border-white"
              >
                <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              </motion.div>
              
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#C9A84C] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Clean Info & Action */}
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-8">
                <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest mb-4">
                  {product.brand} Original
                </span>
                <h1 className="text-4xl lg:text-5xl font-playfair font-medium text-[#1A1A1A] mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-3xl font-black text-[#C9A84C]">${product.price.toLocaleString()}</span>
                  <div className="flex items-center text-[#FFB800]">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" className="opacity-30" />
                    <span className="ml-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">(4.8/5)</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {product.description}
                </p>
              </div>

              <div className="space-y-8">
                {/* Specs in a simple grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F9F5EF] rounded-2xl">
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">Category</span>
                    <span className="text-[11px] font-black uppercase text-[#1A1A1A]">{product.category}</span>
                  </div>
                  <div className="p-4 bg-[#F9F5EF] rounded-2xl">
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">Movement</span>
                    <span className="text-[11px] font-black uppercase text-[#1A1A1A]">Automatic</span>
                  </div>
                </div>

                {/* Selection Section */}
                <div className="flex items-center gap-6 p-2 bg-[#F9F5EF] rounded-full max-w-fit">
                  <div className="flex items-center gap-4 px-4">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-[#C9A84C] transition-colors"><Minus size={14} /></button>
                    <span className="text-sm font-black w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-[#C9A84C] transition-colors"><Plus size={14} /></button>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className="flex-1 bg-[#C9A84C] text-white py-5 px-8 text-xs uppercase tracking-[0.2em] font-black rounded-full hover:bg-[#1A1A1A] transition-all duration-500 shadow-xl shadow-[#C9A84C]/20 flex items-center justify-center gap-4 disabled:bg-gray-200 disabled:shadow-none"
                  >
                    {product.stock === 0 ? 'Out of Stock' : (adding ? 'Adding...' : <>Add To Shopping Bag <ShoppingBag size={18} /></>)}
                  </button>
                  <button 
                    onClick={() => addToWishlist(product)}
                    className={`w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center ${isInWishlist(product._id) ? 'bg-[#FF4D4D] border-[#FF4D4D] text-white shadow-lg' : 'border-[#F9F5EF] text-gray-300 hover:bg-[#FFE4E4] hover:border-[#FFE4E4] hover:text-[#FF4D4D]'}`}
                  >
                    <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} strokeWidth={2} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-8 border-t border-gray-100 grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Truck size={18} className="text-[#C9A84C]" />
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield size={18} className="text-[#C9A84C]" />
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Authentic</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw size={18} className="text-[#C9A84C]" />
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Easy Return</span>
                  </div>
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
