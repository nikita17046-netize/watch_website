import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, ChevronRight, MapPin, Search, Wallet, User, Phone, CreditCard, ShoppingBag, Landmark, Award, Star, Sparkles, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/api';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    address: '',
    paymentMethod: 'Concierge COD'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const orderItems = cart.map(item => ({
        productId: item.product?._id || item.productId?._id || item.productId,
        quantity: item.quantity,
        price: Number(item.product?.price || 0)
      }));
      
      const payload = { 
        items: orderItems,
        totalAmount: Number(cartTotal.toFixed(2)),
        shippingAddress: formData.address,
        paymentMethod: formData.paymentMethod
      };

      const response = await API.post('/order/create', payload);
      setOrderId(response.data.order?._id?.slice(-8).toUpperCase() || 'LX-777');
      setOrderComplete(true);
      await clearCart();
      toast.success("Acquisition Secured!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process acquisition.");
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const nextStep = () => {
    if (step === 1 && (!formData.fullName || !formData.contact || !formData.address)) {
      toast.error("Please provide all delivery details");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 relative overflow-hidden font-playfair">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.05),transparent)] z-0" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl w-full bg-white p-20 md:p-32 rounded-[3rem] border border-luxury-sand text-center shadow-2xl relative z-10">
          <div className="w-24 h-24 bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mx-auto mb-12 border border-luxury-gold/20">
            <Award size={48} strokeWidth={1} />
          </div>
          <h1 className="text-7xl font-black text-luxury-charcoal mb-8 tracking-tighter">Acquisition <br/><span className="italic font-light text-luxury-gold">Certified.</span></h1>
          <div className="w-40 h-[1px] bg-luxury-sand mx-auto my-12" />
          <p className="text-gray-400 text-xs uppercase tracking-[0.4em] font-black font-outfit mb-12">Reference ID: {orderId}</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link to="/" className="luxury-btn luxury-btn-primary px-16">Return to Maison</Link>
            <Link to="/my-orders" className="text-[10px] uppercase tracking-[0.4em] font-black text-luxury-gold underline underline-offset-8">View Archives</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] min-h-screen pt-40 pb-40 font-outfit text-luxury-charcoal">
      
      <AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center">
            <div className="w-40 h-40 border-t-2 border-luxury-gold rounded-full animate-spin" />
            <p className="mt-12 text-[10px] uppercase tracking-[1em] font-black text-luxury-gold">Authenticating...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-32 flex flex-col items-center">
           <div className="flex items-center gap-20">
             {[1, 2, 3].map((n) => (
               <div key={n} className="flex flex-col items-center gap-4">
                 <div className={`w-3 h-3 rounded-full transition-all duration-700 ${step >= n ? 'bg-luxury-gold ring-8 ring-luxury-gold/10 scale-125' : 'bg-luxury-sand'}`} />
                 <span className={`text-[8px] uppercase tracking-[0.4em] font-black transition-colors ${step >= n ? 'text-luxury-charcoal' : 'text-gray-300'}`}>0{n}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start max-w-7xl mx-auto">
          
          {/* Main Interaction Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white p-16 md:p-24 rounded-[4rem] border border-luxury-sand shadow-sm">
                  <h3 className="text-6xl font-playfair mb-20 italic">Arrival <span className="font-black not-italic text-luxury-charcoal">Site.</span></h3>
                  <div className="space-y-16">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.5em] font-black text-luxury-gold">Recipient Name</label>
                      <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Full Legal Name" className="w-full bg-transparent border-b border-luxury-sand p-4 text-lg font-bold tracking-widest focus:border-luxury-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.5em] font-black text-luxury-gold">Contact Signal</label>
                      <input name="contact" value={formData.contact} onChange={handleInputChange} type="tel" placeholder="+00 000 000 0000" className="w-full bg-transparent border-b border-luxury-sand p-4 text-lg font-bold tracking-widest focus:border-luxury-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.5em] font-black text-luxury-gold">Destination Sanctuary</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="Complete Residence Details" className="w-full bg-transparent border-b border-luxury-sand p-4 text-lg font-bold tracking-widest focus:border-luxury-gold outline-none transition-all resize-none" />
                    </div>
                  </div>
                  <div className="mt-24 flex justify-end">
                    <button onClick={nextStep} className="luxury-btn luxury-btn-primary px-20">Continue <ChevronRight size={16}/></button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-16 md:p-24 rounded-[4rem] border border-luxury-sand shadow-sm">
                  <h3 className="text-6xl font-playfair mb-20">Verify <span className="italic text-luxury-gold">Details.</span></h3>
                  <div className="space-y-10 mb-20">
                    {cart.map((item) => (
                      <div key={item._id} className="flex gap-10 items-center">
                        <img src={item.product?.images?.[0]} className="w-24 h-24 rounded-3xl object-cover border border-luxury-sand p-1" alt="" />
                        <div className="flex-grow">
                          <h4 className="text-2xl font-playfair font-black">{item.product?.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-2xl font-black tracking-tighter">${formatPrice(item.product?.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <button onClick={prevStep} className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-black hover:text-black">← Back</button>
                    <button onClick={nextStep} className="luxury-btn luxury-btn-primary px-20">Next Step</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-16 md:p-24 rounded-[4rem] border border-luxury-sand shadow-sm">
                  <h3 className="text-6xl font-playfair mb-20 italic text-luxury-charcoal">Final <span className="font-black not-italic text-luxury-charcoal">Settlement.</span></h3>
                  <div className="grid grid-cols-1 gap-8 mb-20">
                    {['Concierge COD', 'Digital Secure'].map((m) => (
                      <button key={m} onClick={() => setFormData(p => ({ ...p, paymentMethod: m }))} className={`p-10 rounded-[3rem] border transition-all text-left flex items-center gap-8 ${formData.paymentMethod === m ? 'border-luxury-gold bg-luxury-gold/5 shadow-xl' : 'border-luxury-sand hover:border-luxury-gold/30 opacity-60'}`}>
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${formData.paymentMethod === m ? 'bg-luxury-gold text-white' : 'bg-luxury-pearl text-gray-400'}`}>
                          <ShieldCheck size={28} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-luxury-charcoal">{m}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Secured Transaction Protocol</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <button onClick={prevStep} className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-black hover:text-black">← Back</button>
                    <button onClick={handlePlaceOrder} className="luxury-btn luxury-btn-primary px-24">Secure Piece</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fixed Right Summary Side */}
          <div className="lg:col-span-5 sticky top-40">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[4.5rem] p-16 md:p-20 shadow-2xl border border-luxury-sand relative overflow-hidden">
              <h3 className="text-6xl font-playfair mb-16 text-luxury-charcoal italic leading-none">Brief <br/><span className="font-black not-italic text-luxury-charcoal">Summary.</span></h3>
              
              <div className="space-y-10 mb-16">
                <div className="flex justify-between items-end border-b border-luxury-sand pb-8">
                  <span className="text-[11px] uppercase tracking-[0.4em] font-black text-luxury-gold">Subtotal</span>
                  <span className="text-2xl font-black text-luxury-charcoal font-outfit tracking-tighter">${formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-luxury-sand pb-8">
                  <span className="text-[11px] uppercase tracking-[0.4em] font-black text-luxury-gold">Logistics</span>
                  <span className="text-[10px] font-black text-luxury-gold tracking-[0.3em] uppercase italic">Complimentary</span>
                </div>
              </div>

              <div className="p-16 bg-luxury-pearl rounded-[4rem] border border-luxury-sand text-center shadow-inner group transition-all duration-700 hover:bg-white">
                  <p className="text-[11px] uppercase tracking-[0.6em] font-black text-luxury-gold mb-8">Total Valuation</p>
                  <p className="text-6xl font-black tracking-tighter text-luxury-charcoal font-outfit leading-none mb-4">${formatPrice(cartTotal)}</p>
                  <div className="flex items-center justify-center gap-3 text-[8px] uppercase tracking-widest font-bold text-gray-400">
                    <ShieldCheck size={14} className="text-luxury-gold" /> Fully Insured Global Delivery
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="p-8 bg-luxury-cream rounded-[2.5rem] border border-luxury-sand text-center">
                   <Landmark size={24} className="text-luxury-gold mx-auto mb-4" strokeWidth={1} />
                   <p className="text-[8px] uppercase tracking-widest font-black text-gray-400">Maison Escrow</p>
                </div>
                <div className="p-8 bg-luxury-cream rounded-[2.5rem] border border-luxury-sand text-center">
                   <Truck size={24} className="text-luxury-gold mx-auto mb-4" strokeWidth={1} />
                   <p className="text-[8px] uppercase tracking-widest font-black text-gray-400">Express Track</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
