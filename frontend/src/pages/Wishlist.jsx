import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="bg-luxury-pearl min-h-screen pt-40 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-24">
           <Link to="/products" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 hover:text-black transition-colors mb-10 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
          </Link>
          <span className="text-[#C9A84C] uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">Personal Curation</span>
          <h1 className="text-6xl md:text-8xl font-playfair font-black text-luxury-charcoal tracking-tighter mb-4">
            My <span className="italic font-light">Wishlist.</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
            A sanctuary for the pieces that have captured your attention. <br />
            Ready for your eventual acquisition.
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatePresence mode="popLayout">
              {wishlist.filter(p => p).map((product, idx) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="group relative"
                >
                  <div className="bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-luxury-sand/40 transition-all duration-500 group-hover:-translate-y-2">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] mb-6 bg-luxury-sand/20">
                      <Link to={`/product/${product._id}`}>
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                      </Link>
                      
                      <button 
                        onClick={() => removeFromWishlist(product._id)}
                        className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.3em] font-black shadow-sm text-luxury-charcoal">{product.brand}</span>
                      </div>
                    </div>

                    <div className="px-2 pb-2">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-xl font-playfair font-black text-luxury-charcoal mb-4 group-hover:text-[#C9A84C] transition-colors duration-500 line-clamp-1">{product.name}</h3>
                      </Link>
                      <div className="flex justify-between items-center border-t border-luxury-sand/50 pt-4">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{product.category}</span>
                        <span className="text-lg font-black tracking-tight text-[#0F2044]">${product.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-40 bg-white rounded-[4rem] border border-luxury-sand shadow-sm"
          >
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-luxury-sand/30 rounded-full flex items-center justify-center text-gray-300">
                <Heart size={40} />
              </div>
            </div>
            <h2 className="text-4xl font-playfair font-black text-luxury-charcoal italic mb-6">Your sanctuary is empty.</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-12">Discover pieces that resonate with your legacy.</p>
            <Link 
              to="/products"
              className="group inline-flex items-center gap-6 bg-black text-white px-12 py-6 text-[10px] uppercase tracking-[0.5em] font-black rounded-full hover:bg-[#C9A84C] transition-all duration-500"
            >
              Explore Catalogue <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
