import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, ChevronRight, MapPin, Search, Wallet, User, Phone, CreditCard, ShoppingBag, Landmark, Award, Star, Sparkles, Fingerprint, X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/api';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(() => {
    const savedStep = sessionStorage.getItem('checkoutStep');
    return savedStep ? parseInt(savedStep) : 1;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem('checkoutFormData');
    return savedData ? JSON.parse(savedData) : {
      fullName: '',
      contact: '',
      address: '',
      paymentMethod: 'Concierge COD'
    };
  });

  const [showScanner, setShowScanner] = useState(false);
  const [lastOrderItems, setLastOrderItems] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '', productId: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('checkoutStep', step.toString());
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

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

      setLastOrderItems(orderItems);
      const response = await API.post('/order/add', payload);
      setOrderId(response.data.order?._id?.slice(-8).toUpperCase() || 'LX-777');
      setOrderComplete(true);
      await clearCart();
      sessionStorage.removeItem('checkoutStep');
      sessionStorage.removeItem('checkoutFormData');
      toast.success("Acquisition Secured!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process acquisition.");
      setIsProcessing(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewData.comment.trim()) {
      toast.error("Please share your thoughts");
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post('/review/add', {
        productId: reviewData.productId || lastOrderItems[0]?.productId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      toast.success("Experience Recorded");
      setShowReviewModal(false);
    } catch (err) {
      toast.error("Process failed. Please try again later.");
    }
    setSubmittingReview(false);
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

  useEffect(() => {
    if (orderComplete) {
      const timer = setTimeout(() => setShowReviewModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [orderComplete]);

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
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-md">
              <button 
                 onClick={() => navigate('/')}
                 className="flex-1 bg-black text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-luxury-gold transition-all shadow-xl"
              >
                 Return to Maison
              </button>
              <button 
                 onClick={() => setShowReviewModal(true)}
                 className="flex-1 bg-luxury-gold text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl"
              >
                 Rate Experience
              </button>
            </div>
            <button onClick={() => navigate('/my-orders')} className="text-gray-300 text-[10px] font-black uppercase tracking-[0.5em] hover:text-luxury-gold transition-colors border-b border-transparent hover:border-luxury-gold pb-1">
               View Acquisition Archives
            </button>
          </div>
        </motion.div>
        
        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
              <motion.form initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-[2rem] max-w-lg w-full shadow-2xl" onSubmit={submitReview}>
                <h3 className="text-2xl font-playfair font-black mb-8 italic">Share Your Impression</h3>
                <div className="flex gap-2 mb-8">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={24} className={star <= reviewData.rating ? "fill-luxury-gold text-luxury-gold" : "text-gray-300"} onClick={() => setReviewData(p => ({ ...p, rating: star }))} />
                  ))}
                </div>
                <textarea className="w-full border border-luxury-sand rounded-xl p-4 mb-8 font-outfit text-sm" rows="4" placeholder="Your reflections..." onChange={(e) => setReviewData(p => ({ ...p, comment: e.target.value }))}></textarea>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-4 border border-luxury-sand rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Close</button>
                  <button type="submit" disabled={submittingReview} className="flex-1 py-4 bg-luxury-gold text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Submit</button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
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
           <div className="flex items-center gap-16 md:gap-32">
             {[1, 2, 3].map((n) => (
               <div key={n} className="flex flex-col items-center gap-6 relative group">
                 {/* Connecting Line */}
                 {n < 3 && (
                   <div className="absolute top-4 left-1/2 w-[150%] md:w-[250%] h-[1px] bg-luxury-sand -z-10" />
                 )}
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-1000 ${step >= n ? 'bg-luxury-gold shadow-[0_0_30px_rgba(201,168,76,0.3)] ring-4 ring-luxury-gold/20' : 'bg-white border border-luxury-sand shadow-inner'}`}>
                    <span className={`text-[10px] font-black tracking-tighter ${step >= n ? 'text-white' : 'text-gray-300'}`}>{n}</span>
                 </div>
                 <div className="text-center">
                    <span className={`text-[9px] uppercase tracking-[0.5em] font-black transition-all duration-700 block ${step >= n ? 'text-luxury-charcoal opacity-100' : 'text-gray-300 opacity-50'}`}>
                       {n === 1 ? 'Details' : n === 2 ? 'Review' : 'Secure'}
                    </span>
                 </div>
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
                      <div key={m} className="space-y-6">
                        <button onClick={() => { setFormData(p => ({ ...p, paymentMethod: m })); if(m === 'Digital Secure') setShowScanner(true); }} className={`w-full p-10 rounded-[3rem] border transition-all text-left flex items-center gap-8 ${formData.paymentMethod === m ? 'border-luxury-gold bg-luxury-gold/5 shadow-xl' : 'border-luxury-sand hover:border-luxury-gold/30 opacity-60'}`}>
                          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${formData.paymentMethod === m ? 'bg-luxury-gold text-white' : 'bg-luxury-pearl text-gray-400'}`}>
                            {m === 'Concierge COD' ? <Truck size={28} /> : <Wallet size={28} />}
                          </div>
                          <div className="flex-grow">
                            <p className="text-2xl font-black text-luxury-charcoal">{m}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Secured Transaction Protocol</p>
                          </div>
                          {m === 'Digital Secure' && (
                            <div className="px-4 py-1.5 bg-luxury-gold/10 text-luxury-gold rounded-full text-[8px] font-black uppercase tracking-widest">Open Scanner</div>
                          )}
                        </button>
                      </div>
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

          {/* Scanner Modal */}
          <AnimatePresence>
            {showScanner && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] flex items-center justify-center p-6"
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowScanner(false)} />
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-md rounded-[3rem] p-10 md:p-12 relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-luxury-sand"
                >
                  <button onClick={() => setShowScanner(false)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:rotate-90 transition-all duration-500">
                    <X size={18} className="text-gray-400" />
                  </button>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                       <Fingerprint size={24} className="text-luxury-gold" />
                    </div>
                    <h3 className="text-3xl font-playfair font-black text-luxury-charcoal mb-2">Secure <span className="italic font-light text-luxury-gold">Vault.</span></h3>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Digital Acquisition Protocol</p>

                    <div className="bg-luxury-pearl rounded-[2.5rem] p-8 border border-luxury-sand mb-8 relative overflow-hidden group">
                       <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border-2 border-luxury-gold/10 relative shadow-xl">
                          <img src="/luxury_payment_qr.png" className="w-full h-full object-contain" alt="Payment QR" />
                          <div className="absolute inset-0 border border-luxury-gold/20 animate-pulse rounded-lg"></div>
                          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-luxury-gold rounded-tl-md"></div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-luxury-gold rounded-tr-md"></div>
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-luxury-gold rounded-bl-md"></div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-luxury-gold rounded-br-md"></div>
                       </div>
                    </div>

                    <div className="space-y-3 mb-8">
                       <p className="text-[10px] font-bold text-luxury-charcoal uppercase tracking-[0.2em]">Final Valuation: <span className="text-luxury-gold text-base ml-2">${formatPrice(cartTotal)}</span></p>
                       <p className="text-[8px] text-gray-400 font-medium tracking-widest uppercase leading-relaxed max-w-[250px] mx-auto">
                          Scan to authenticate and finalize your acquisition. This link will expire in 10:00 minutes.
                       </p>
                    </div>

                    <button 
                      onClick={() => { setShowScanner(false); handlePlaceOrder(); }}
                      className="w-full py-5 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] hover:bg-luxury-gold transition-all shadow-xl"
                    >
                       Confirm Transfer
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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

              <div className="p-10 md:p-12 bg-luxury-pearl rounded-[4rem] border border-luxury-sand text-center shadow-inner group transition-all duration-700 hover:bg-white">
                  <p className="text-[11px] uppercase tracking-[0.6em] font-black text-luxury-gold mb-6">Total Valuation</p>
                  <p className="text-3xl md:text-4xl font-black tracking-tight text-luxury-charcoal font-outfit leading-none mb-6">
                    ${formatPrice(cartTotal)}
                  </p>
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
