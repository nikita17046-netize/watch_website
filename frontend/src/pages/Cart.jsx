import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, ShieldCheck, Truck, CreditCard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <div className="w-24 h-24 bg-luxury-sand/30 rounded-full flex items-center justify-center mx-auto mb-10">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="text-5xl font-playfair mb-6 italic text-luxury-charcoal">Your Bag is Empty</h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mb-12 leading-loose font-bold">
            The registry is currently vacant. Begin your acquisition by exploring our curated collections.
          </p>
          <Link to="/products" className="inline-block px-12 py-5 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-luxury-gold transition-all shadow-xl">
            Explore Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] min-h-screen pt-32 pb-32">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <span className="text-luxury-gold uppercase tracking-[0.6em] text-[10px] font-black mb-4 block">Personal Registry</span>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <h1 className="text-6xl md:text-8xl font-playfair text-luxury-charcoal tracking-tighter leading-none">Shopping <span className="italic font-light">Bag.</span></h1>
              <button 
                onClick={() => { if(window.confirm('Empty your entire registry?')) { cart.forEach(item => removeFromCart(item.product?._id || item.productId, item._id)); } }}
                className="px-6 py-2 border border-red-100 text-red-400 text-[9px] uppercase tracking-widest font-black rounded-full hover:bg-red-50 transition-all w-fit"
              >
                Clear Bag
              </button>
            </div>
          </div>
          <Link to="/products" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 hover:text-black transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Continue Selection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Table Section */}
          <div className="lg:col-span-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-luxury-sand pb-10">
                    <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Masterpiece</th>
                    <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 text-center">Quantity</th>
                    <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 text-right">Valuation</th>
                    <th className="pb-10 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-sand/30">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.tr
                        key={item._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group"
                      >
                        <td className="py-10">
                          <div className="flex items-center gap-8">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-luxury-sand/20 shrink-0 border border-luxury-sand/50 shadow-sm group-hover:shadow-xl transition-all duration-700">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                                   <ShoppingBag size={24} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-luxury-gold uppercase tracking-[0.4em] text-[9px] font-black mb-2">{item.product?.brand || 'Premium Brand'}</p>
                              <h3 className="text-xl font-playfair font-medium text-luxury-charcoal group-hover:text-luxury-gold transition-colors duration-500 mb-2">{item.product?.name || 'Loading Piece...'}</h3>
                              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Ref: {item.product?.sku || 'GEN-777'}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-10">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center bg-luxury-pearl border border-luxury-sand rounded-2xl p-1">
                              <button 
                                onClick={() => updateQuantity(item.product?._id || item.productId, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:bg-white transition-all"
                              >
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product?._id || item.productId, item.quantity + 1)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:bg-white transition-all"
                              >
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="py-10 text-right">
                          <p className="text-xl font-black tracking-tighter text-luxury-charcoal">
                            ${(Number(item.product?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </td>

                        <td className="py-10 text-right pl-4">
                          <button 
                            onClick={() => removeFromCart(item.product?._id || item.productId, item._id)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] p-10 border border-luxury-sand shadow-sm sticky top-40">
              <h3 className="text-2xl font-playfair mb-8 pb-6 border-b border-luxury-sand/50">Summary</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <span>Registry Subtotal</span>
                  <span className="text-luxury-charcoal">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <span>Insured Shipping</span>
                  <span className="text-luxury-gold italic">Complimentary</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <span>Boutique Tax</span>
                  <span className="text-luxury-charcoal">$0.00</span>
                </div>
              </div>

              <div className="pt-8 border-t border-luxury-sand mb-10">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-luxury-gold">Total Investment</p>
                  <span className="text-4xl font-black tracking-tighter text-luxury-charcoal">${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.5em] font-black rounded-full hover:bg-luxury-gold transition-all duration-500 shadow-xl flex items-center justify-center gap-4 group"
              >
                Confirm Acquisition <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-gray-400 px-4 py-3 bg-luxury-pearl rounded-2xl">
                  <ShieldCheck size={16} className="text-luxury-gold" /> Secure Escrow Checkout
                </div>
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-gray-400 px-4 py-3 bg-luxury-pearl rounded-2xl">
                  <Truck size={16} className="text-luxury-gold" /> Worldwide Concierge Delivery
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
