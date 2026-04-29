import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-pearl flex flex-col items-center justify-center pt-20 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-20 rounded-[4rem] shadow-2xl border border-luxury-sand flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-luxury-sand/50 rounded-full flex items-center justify-center mb-10">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="text-5xl font-playfair mb-6 italic text-luxury-charcoal">Your Bag is Empty</h2>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-12 max-w-xs leading-loose">
            It appears you haven't selected any masterpieces for your collection yet.
          </p>
          <Link to="/products" className="px-12 py-5 bg-luxury-charcoal text-white text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-luxury-gold transition-all shadow-xl">
            Explore Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-luxury-pearl min-h-screen pt-48 pb-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-luxury-gold uppercase tracking-[0.6em] text-[10px] font-black mb-4 block">Acquisition Review</span>
            <h1 className="text-6xl md:text-8xl font-playfair">Shopping Bag</h1>
          </div>
          <div className="text-right">
             <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 mb-2">Private Collection</p>
             <p className="text-lg font-bold">{cart.length} Masterpieces Selected</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Collection Items */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[3rem] shadow-xl border border-luxury-sand overflow-hidden">
              <div className="p-8 md:p-12 space-y-12">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div 
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex flex-col md:flex-row gap-10 pb-12 border-b border-luxury-sand/50 last:border-0 last:pb-0 group"
                    >
                      <Link to={`/product/${item.product._id}`} className="w-full md:w-56 aspect-square rounded-3xl overflow-hidden bg-luxury-sand/30 shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                      </Link>

                      <div className="flex-grow flex flex-col justify-between py-2">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-luxury-gold uppercase tracking-[0.4em] text-[9px] font-black mb-2 block">{item.product.brand}</span>
                              <h3 className="text-2xl md:text-3xl font-playfair group-hover:text-luxury-gold transition-colors duration-500">{item.product.name}</h3>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.product._id)}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={18} strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="flex gap-4">
                             <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold px-3 py-1 bg-luxury-sand rounded-full">Ref: {item.product.sku}</span>
                             <span className="text-[9px] uppercase tracking-widest text-green-600 font-bold px-3 py-1 bg-green-50 rounded-full">In Boutique</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-10">
                          <div className="flex items-center bg-luxury-sand/50 rounded-xl px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                              className="p-3 text-gray-400 hover:text-luxury-charcoal transition-colors"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-12 text-center text-sm font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-3 text-gray-400 hover:text-luxury-charcoal transition-colors"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Piece Value</p>
                             <p className="text-2xl font-bold tracking-tighter">${(item.product.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            <Link to="/products" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black text-luxury-gold hover:text-luxury-charcoal transition-all group">
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md group-hover:translate-x-[-4px] transition-transform"><ArrowLeft size={16} /></span>
              Continue Selection
            </Link>
          </div>

          {/* Acquisition Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-40 space-y-8">
              <div className="bg-luxury-charcoal text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                
                <h3 className="text-2xl font-playfair mb-10 pb-6 border-b border-white/10">Summary</h3>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-xs font-light text-gray-400">
                    <span className="uppercase tracking-[0.2em]">Subtotal</span>
                    <span className="text-white font-bold tracking-widest">${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-light text-gray-400">
                    <span className="uppercase tracking-[0.2em]">Insured Shipping</span>
                    <span className="text-luxury-gold font-black tracking-widest uppercase">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-xs font-light text-gray-400">
                    <span className="uppercase tracking-[0.2em]">Boutique Tax</span>
                    <span className="text-white font-bold tracking-widest">$0.00</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-8 mb-12">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-luxury-gold">Total Investment</span>
                    <span className="text-4xl font-bold tracking-tighter">${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link 
                  to="/checkout" 
                  className="block w-full bg-luxury-gold text-white text-center py-6 text-[10px] uppercase tracking-[0.4em] font-black rounded-2xl hover:bg-white hover:text-luxury-charcoal transition-all duration-500 shadow-xl shadow-luxury-gold/20"
                >
                  Confirm Acquisition
                </Link>
                
                <p className="text-[8px] text-gray-500 mt-8 text-center leading-relaxed uppercase tracking-[0.3em] font-bold">
                  Secure White-Glove Logistics <br /> Worldwide Certification Included
                </p>
              </div>

              {/* Service Cards */}
              <div className="bg-white rounded-[2rem] p-8 border border-luxury-sand space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-luxury-sand/50 rounded-xl"><ShieldCheck size={20} className="text-luxury-gold" /></div>
                    <div>
                       <h5 className="text-[9px] uppercase tracking-widest font-black mb-1">Authenticity Guaranteed</h5>
                       <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Original certification paperwork provided with every timepiece.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-luxury-sand/50 rounded-xl"><Truck size={20} className="text-luxury-gold" /></div>
                    <div>
                       <h5 className="text-[9px] uppercase tracking-widest font-black mb-1">Global Express Logistics</h5>
                       <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Fully insured shipping via our secure logistics network.</p>
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

export default Cart;
