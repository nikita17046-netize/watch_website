import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, ShoppingBag, ShieldCheck, Calendar, ClipboardCheck, Box, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStepStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (s === 'confirmed' || s === 'confrom') return 2;
    return 1; // pending
  };

  const OrderStepper = ({ status }) => {
    const currentStep = getStepStatus(status);
    const steps = [
      { id: 1, label: 'Registry Established', icon: ClipboardCheck },
      { id: 2, label: 'Quality Protocol', icon: Box },
      { id: 3, label: 'Neural Transit', icon: Plane },
      { id: 4, label: 'Successful Arrival', icon: Truck }
    ];

    return (
      <div className="luxury-stepper mb-16 mt-8 px-4 md:px-10 scale-[0.85] md:scale-100 origin-center">
        <div className="stepper-line bg-luxury-sand/30"></div>
        <motion.div 
          className="stepper-progress bg-luxury-gold shadow-none" 
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        ></motion.div>
        
        <div className="stepper-path-container">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="step-node bg-white border-luxury-sand/40">
                   <Icon size={20} className={`transition-colors duration-500 ${isCompleted || isActive ? 'text-white' : 'text-gray-300'}`} />
                   {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-sm">
                         <CheckCircle2 size={10} className="text-white" />
                      </div>
                   )}
                </div>
                <span className={`step-label text-[8px] font-black italic ${isCompleted || isActive ? 'text-luxury-gold' : 'text-gray-400'}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/order/my-orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Fetch orders error", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-orange-400 bg-orange-50';
      case 'confirmed': return 'text-blue-500 bg-blue-50';
      case 'shipped': return 'text-purple-500 bg-purple-50';
      case 'delivered': return 'text-green-500 bg-green-50';
      default: return 'text-gray-400 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-luxury-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] min-h-screen pt-40 pb-40 font-outfit text-luxury-charcoal">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Editorial Header */}
        <div className="max-w-4xl mx-auto mb-24 text-center">
          <span className="text-luxury-gold uppercase tracking-[1em] text-[10px] font-black mb-6 block">Private Archives</span>
          <h1 className="text-6xl md:text-8xl font-playfair tracking-tighter mb-12 italic text-luxury-charcoal">My <span className="font-black not-italic text-luxury-charcoal">Acquisitions.</span></h1>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {orders.length === 0 ? (
            <div className="bg-white p-24 rounded-[4rem] border border-luxury-sand text-center">
              <ShoppingBag size={64} className="mx-auto text-luxury-sand mb-8" strokeWidth={1} />
              <h3 className="text-3xl font-playfair mb-6">The vault is empty.</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-black mb-12">Start your collection today.</p>
              <Link to="/products" className="luxury-btn luxury-btn-primary inline-block">Explore Collection</Link>
            </div>
          ) : (
            orders.map((order, idx) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[4rem] border border-luxury-sand overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 group"
              >
                {/* Order Header */}
                <div className="p-10 border-b border-luxury-sand bg-luxury-pearl flex flex-wrap justify-between items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-luxury-charcoal text-white rounded-3xl flex items-center justify-center font-playfair text-xl">
                      #{order._id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400 mb-1">Acquisition Date</p>
                      <p className="text-sm font-black text-luxury-charcoal">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400 mb-1">Status</p>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-luxury-gold mb-1">Total Valuation</p>
                      <p className="text-2xl font-black text-luxury-charcoal font-outfit tracking-tighter">${formatPrice(order.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                </div>

                {/* Logistics Journey */}
                <div className="bg-luxury-pearl/20 border-b border-luxury-sand py-4">
                  <OrderStepper status={order.status} />
                </div>

                {/* Order Items */}
                <div className="p-10 space-y-8">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-8 items-center">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-luxury-pearl border border-luxury-sand shrink-0">
                        <img src={item.productId?.images?.[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xl font-playfair font-black text-luxury-charcoal">{item.productId?.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black tracking-tighter text-luxury-charcoal">${formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information Section */}
                {order.deliveryDate && (
                  <div className="mx-10 mb-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-luxury-gold shadow-sm">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Scheduled Delivery</p>
                        <p className="text-sm font-black text-luxury-charcoal uppercase italic tracking-tighter">Your acquisition arrives on {new Date(order.deliveryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    {order.status === 'shipped' && (
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        In Transit
                      </div>
                    )}
                  </div>
                )}

                {/* Order Footer */}
                <div className="px-10 py-8 bg-luxury-pearl/30 border-t border-luxury-sand flex justify-between items-center">
                   <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                      <ShieldCheck size={16} className="text-luxury-gold" /> Authenticity Guaranteed
                   </div>
                   <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-black text-luxury-charcoal hover:text-luxury-gold transition-colors">
                      View Certificate <ChevronRight size={14} />
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Back Link */}
        <div className="max-w-5xl mx-auto mt-20 text-center">
           <Link to="/" className="text-[10px] uppercase tracking-[0.6em] font-black text-gray-400 hover:text-luxury-charcoal transition-colors">
              Return to Maison Home
           </Link>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
