import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, ShieldCheck, MapPin, Package, Heart, LogOut, Settings, Bell, CreditCard, ChevronRight, Edit3, FileText, HelpCircle, Award, ArrowLeft, Key, Lock, Phone, Save, X, CheckCircle2, Trash2, Calendar, Truck, Fingerprint, Globe, ClipboardCheck, Box, Plane, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api/api';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialSection = queryParams.get('tab') || 'overview';
  
  const [activeSection, setActiveSection] = useState(initialSection);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Forms State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: user?.username || '', email: user?.email || '' });
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ 
    street: user?.address?.street || '', 
    city: user?.address?.city || '', 
    state: user?.address?.state || '', 
    zip: user?.address?.zip || '', 
    country: user?.address?.country || 'India' 
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      <div className="luxury-stepper mb-20 px-10">
        <div className="stepper-line"></div>
        <motion.div 
          className="stepper-progress" 
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
                <div className="step-node shadow-2xl">
                   <Icon size={24} className="step-icon" />
                   {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-lg border border-white/20">
                         <CheckCircle2 size={10} className="text-white" />
                      </div>
                   )}
                </div>
                <span className="step-label font-black italic">{step.label}</span>
                <span className="step-number uppercase tracking-widest">Protocol 0{step.id}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab) setActiveSection(tab);
  }, [location.search]);

  useEffect(() => {
    if (activeSection === 'orders' || activeSection === 'overview') {
      fetchOrders();
    }
  }, [activeSection]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await API.get('/order/my-orders');
      console.log("Orders Response:", res.data);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Fetch orders error", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/user/update', {
        username: profileForm.username,
        email: profileForm.email
      });
      
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Registry Updated Successfully');
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Profile update error", err);
      toast.error(err.response?.data?.message || 'Failed to update registry');
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/user/update', {
        address: addressForm
      });
      
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Shipping Registry Updated');
      setIsEditingAddress(false);
    } catch (err) {
      console.error("Address update error", err);
      toast.error('Failed to update shipping registry');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (passwordForm.newPassword.length < 6) {
        return toast.error("New password must be 6+ chars");
      }
      
      const res = await API.put('/user/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });

      toast.success(res.data.message || 'Key Rotation Successful. Password Updated.');
      setIsChangingPassword(false);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      console.error("Password change error", err);
      toast.error(err.response?.data?.message || "Security vault access denied");
    }
  };

  const downloadManifest = (order) => {
    const doc = new jsPDF();
    const orderId = order._id.slice(-4).toUpperCase();
    
    // Aesthetic Styling
    doc.setFillColor(17, 24, 39); // Midnight Navy
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(201, 168, 76); // Gold
    doc.setFont("playfair", "bold");
    doc.setFontSize(22);
    doc.text("LUXE | ACQUISITION MANIFEST", 105, 25, { align: "center" });
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`REFERENCE ID: #${orderId}`, 20, 55);
    doc.text(`DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 190, 55, { align: "right" });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 60, 190, 60);
    
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.text("CLIENT REGISTRY", 20, 75);
    doc.setFontSize(11);
    doc.text(`NAME: ${user.username.toUpperCase()}`, 20, 85);
    doc.text(`DESTINATION: ${order.shippingAddress || 'VERIFIED MAISON ADDRESS'}`, 20, 95);
    
    doc.line(20, 105, 190, 105);
    
    doc.setFontSize(14);
    doc.text("ACQUISITION DETAILS", 20, 120);
    
    let yPos = 135;
    order.items.forEach((item, index) => {
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(`${index + 1}. ${item.productId?.name || 'MASTERPIECE'}`, 20, yPos);
      doc.text(`QTY: ${item.quantity}`, 130, yPos);
      doc.text(`$${item.price.toLocaleString()}`, 190, yPos, { align: "right" });
      yPos += 10;
    });
    
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39);
    doc.text("TOTAL VALUATION", 20, yPos + 20);
    doc.setTextColor(201, 168, 76);
    doc.text(`$${order.totalAmount.toLocaleString()}`, 190, yPos + 20, { align: "right" });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("CERTIFIED BY GENEVA REGISTRY PROTOCOL", 105, 280, { align: "center" });
    doc.text("© 2026 LUXE PREMIUM HOLDINGS - CONFIDENTIAL", 105, 285, { align: "center" });
    
    doc.save(`LUXE_MANIFEST_${orderId}.pdf`);
    toast.success('Professional Manifest PDF Generated');
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'confirmed': return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
      case 'shipped': return 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/20';
      case 'delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b]">
        <div className="text-center">
           <h1 className="text-4xl font-playfair text-white mb-8 tracking-tighter italic">Registry Entrance Required</h1>
           <Link to="/login" className="px-12 py-4 bg-[#facc15] text-black rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all">Authenticate Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] text-slate-300 font-outfit overflow-x-hidden">
      
      {/* Premium Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-luxury-gold/10 blur-[150px] rounded-full"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-luxury-gold/10 blur-[120px] rounded-full"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-10 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-12">
           <Link to="/" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 hover:text-white transition-all">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-luxury-gold/50 group-hover:bg-luxury-gold/10 transition-all shadow-xl">
                 <ArrowLeft size={16} />
              </div>
              Exit To Sanctuary
           </Link>
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 bg-white/5 px-6 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Maison Terminal v2.0</span>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <button onClick={logout} className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg group">
                 <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-8">
             {/* Profile Spotlight */}
             <div className="bg-gradient-to-br from-luxury-gold to-indigo-700 p-1 rounded-[3rem] shadow-2xl group transition-all duration-700 hover:scale-[1.02]">
                <div className="bg-[#111827] rounded-[2.9rem] p-10 text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="relative z-10">
                      <div className="w-28 h-28 rounded-[2.5rem] p-1 bg-gradient-to-tr from-luxury-gold to-indigo-400 mx-auto mb-6 shadow-2xl relative">
                         <div className="w-full h-full rounded-[2.3rem] bg-[#111827] flex items-center justify-center text-4xl font-playfair font-black text-luxury-gold italic">
                            {user.username?.[0] || 'U'}
                         </div>
                         <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-emerald-500 rounded-xl border-4 border-[#111827] flex items-center justify-center text-white shadow-xl">
                            <CheckCircle2 size={16} />
                         </div>
                      </div>
                      <h2 className="text-2xl font-playfair font-black text-white tracking-tight mb-2 italic uppercase">{user.username}</h2>
                      <p className="text-[9px] text-luxury-gold font-black uppercase tracking-[0.4em] italic bg-luxury-gold/10 py-1.5 rounded-full inline-block px-4 border border-luxury-gold/20">Elite Tier Access</p>
                   </div>
                </div>
             </div>

             {/* Dynamic Menu */}
             <nav className="bg-white/5 border border-white/10 p-5 rounded-[3rem] space-y-12 backdrop-blur-2xl shadow-2xl">
                <div>
                   <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-6 mb-6">Activity Hub</h4>
                   <div className="space-y-2">
                      {[
                        { id: 'overview', label: 'Dashboard', icon: User },
                        { id: 'orders', label: 'My Acquisitions', icon: Package },
                        { id: 'wishlist', label: 'The Registry', icon: Heart },
                      ].map((item) => (
                        <button 
                          key={item.id} 
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 group ${activeSection === item.id ? 'bg-luxury-gold text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)] transform translate-x-2' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                        >
                          <div className="flex items-center gap-4">
                             <item.icon size={16} className={activeSection === item.id ? 'text-white' : 'group-hover:text-luxury-gold transition-colors'} />
                             {item.label}
                          </div>
                          <ChevronRight size={14} className={activeSection === item.id ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-100 transition-all'} />
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-6 mb-6">Management</h4>
                   <div className="space-y-2">
                      {[
                        { id: 'address', label: 'Logistics Center', icon: MapPin },
                        { id: 'security', label: 'Security Vault', icon: Lock },
                        { id: 'support', label: 'Private Concierge', icon: Phone },
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 group ${activeSection === item.id ? 'bg-luxury-gold text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)] transform translate-x-2' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                        >
                          <div className="flex items-center gap-4">
                             <item.icon size={16} className={activeSection === item.id ? 'text-white' : 'group-hover:text-luxury-gold transition-colors'} />
                             {item.label}
                          </div>
                          <ChevronRight size={14} className={activeSection === item.id ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-100 transition-all'} />
                        </button>
                      ))}
                   </div>
                </div>
             </nav>
          </div>

          {/* Dynamic Content Terminal */}
          <div className="lg:col-span-9">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-10"
                >
                   {activeSection === 'overview' && (
                     <div className="space-y-10">
                        {/* Welcome Spotlight */}
                        <div className="bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] relative overflow-hidden group shadow-2xl">
                           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxury-gold/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-luxury-gold/20 transition-all duration-1000"></div>
                           <div className="relative z-10 max-w-2xl">
                              <div className="flex items-center gap-5 mb-10">
                                 <span className="w-3 h-3 bg-luxury-gold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></span>
                                 <span className="text-[10px] font-black uppercase tracking-[0.8em] text-luxury-gold">Authenticated Terminal Access</span>
                              </div>
                              <h1 className="text-7xl lg:text-8xl font-playfair font-black text-white leading-none tracking-tighter mb-10 italic">
                                 The <br /> <span className="not-italic text-luxury-gold">Registry.</span>
                              </h1>
                              <p className="text-slate-400 text-sm leading-relaxed uppercase tracking-[0.3em] font-medium max-w-md italic opacity-80">
                                 Welcome back, {user.username}. Your secure horological profile and verified acquisitions are live in this terminal.
                              </p>
                           </div>
                        </div>

                        {/* Logistics Overview */}
                        {orders.some(o => o.deliveryDate) && (
                           <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                              <div className="flex justify-between items-center mb-10 relative z-10 px-4">
                                 <div>
                                    <h3 className="text-3xl font-playfair font-black text-white italic tracking-tight">Active Deployments</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-3 italic">Scheduled & In-Transit Assets</p>
                                 </div>
                                 <div className="w-16 h-16 bg-luxury-gold/10 rounded-[2rem] flex items-center justify-center text-luxury-gold shadow-2xl border border-luxury-gold/20">
                                    <Truck size={30} className="animate-pulse" />
                                 </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                 {orders.filter(o => o.deliveryDate).slice(0, 4).map(o => (
                                    <div key={o._id} className="flex items-center justify-between p-8 bg-white/[0.03] rounded-[3rem] border border-white/5 hover:border-luxury-gold/30 transition-all duration-500">
                                       <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-luxury-gold transition-colors">
                                             <Package size={22} />
                                          </div>
                                          <div>
                                             <p className="text-[11px] font-black text-white uppercase tracking-widest">Order #{o._id.slice(-4).toUpperCase()}</p>
                                             <p className="text-[9px] font-bold text-luxury-gold uppercase tracking-[0.2em] mt-2 italic">Expected Arrival: {new Date(o.deliveryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                             <div className="mt-2 flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${o.status?.toLowerCase() === 'shipped' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{o.status}</span>
                                             </div>
                                          </div>
                                       </div>
                                       <button 
                                          onClick={() => { setActiveSection('orders'); setSelectedOrder(o); }}
                                          className="px-8 py-3 bg-white/10 text-[9px] font-black uppercase tracking-widest text-white rounded-xl hover:bg-luxury-gold transition-all shadow-xl"
                                       >
                                          Track Asset
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {[
                              { label: 'Security Status', value: 'High Fidelity', icon: ShieldCheck, color: 'text-emerald-400' },
                              { label: 'Member Standing', value: 'Elite Tier', icon: Award, color: 'text-luxury-gold' },
                              { label: 'Registry ID', value: user._id?.slice(-8).toUpperCase(), icon: Key, color: 'text-white' },
                           ].map((stat, i) => (
                              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center hover:border-luxury-gold/30 hover:bg-white/[0.07] transition-all duration-700 group shadow-lg">
                                 <div className="w-14 h-14 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-luxury-gold group-hover:scale-110 transition-transform">
                                    <stat.icon size={26} />
                                 </div>
                                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">{stat.label}</h3>
                                 <p className={`text-sm font-black uppercase tracking-widest ${stat.color}`}>{stat.value}</p>
                              </div>
                           ))}
                        </div>

                        {/* Identity Center */}
                        <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                           <div className="flex justify-between items-center mb-16 relative z-10">
                              <div>
                                 <h3 className="text-3xl font-playfair font-black text-white italic tracking-tight">Identity Registry</h3>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-3">Verified Personal Records</p>
                              </div>
                              {!isEditingProfile ? (
                                <button 
                                  onClick={() => setIsEditingProfile(true)}
                                  className="flex items-center gap-3 px-8 py-4 bg-luxury-gold text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-[0_15px_30px_rgba(37,99,235,0.3)]"
                                >
                                   <Edit3 size={16} /> Update Registry
                                </button>
                              ) : (
                                <div className="flex gap-4">
                                   <button onClick={() => setIsEditingProfile(false)} className="px-6 py-4 bg-white/5 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Cancel</button>
                                   <button onClick={handleProfileUpdate} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Save Changes</button>
                                </div>
                              )}
                           </div>
                           
                           <form className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-6 italic">Member Username</label>
                                 <input 
                                    type="text"
                                    disabled={!isEditingProfile}
                                    value={profileForm.username}
                                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                                    className={`w-full px-10 py-6 bg-white/5 border ${isEditingProfile ? 'border-luxury-gold/50 outline-none ring-2 ring-luxury-gold/20' : 'border-white/10'} rounded-[2rem] text-sm font-black text-white uppercase tracking-widest transition-all`}
                                 />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-6 italic">Secure Email Address</label>
                                 <input 
                                    type="email"
                                    disabled={!isEditingProfile}
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                    className={`w-full px-10 py-6 bg-white/5 border ${isEditingProfile ? 'border-luxury-gold/50 outline-none ring-2 ring-luxury-gold/20' : 'border-white/10'} rounded-[2rem] text-sm font-black text-slate-400 italic transition-all`}
                                 />
                              </div>
                           </form>
                        </div>
                     </div>
                   )}

                   {activeSection === 'orders' && (
                     <div className="space-y-12">
                        <div className="flex items-end justify-between px-10">
                           <div>
                              <span className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.8em] mb-4 block italic">Acquisition Archives</span>
                              <h2 className="text-6xl font-playfair font-black text-white tracking-tighter italic">Collections.</h2>
                           </div>
                           <div className="text-right bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
                              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1 italic">Validated Entries</p>
                              <p className="text-4xl font-black text-white tracking-widest">{orders.length}</p>
                           </div>
                        </div>

                        {loadingOrders ? (
                           <div className="flex flex-col items-center justify-center py-40 bg-white/5 rounded-[4rem] border border-white/10 shadow-2xl">
                              <div className="w-14 h-14 border-t-2 border-luxury-gold rounded-full animate-spin mb-10 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600">Consulting Private Archives...</p>
                           </div>
                        ) : orders.length === 0 ? (
                           <div className="bg-white/5 p-24 rounded-[4rem] border border-white/10 text-center shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                              <div className="absolute inset-0 bg-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <Package size={64} className="mx-auto text-luxury-gold/20 mb-10 group-hover:scale-110 transition-transform" strokeWidth={1} />
                              <h3 className="text-3xl font-playfair font-black text-white mb-6 italic tracking-tight">The Vault is Silent.</h3>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mb-12 max-w-sm mx-auto leading-loose italic opacity-80">
                                 No acquisitions have been recorded under this registry. Your journey into horological excellence begins today.
                              </p>
                              <Link to="/products" className="inline-flex px-14 py-5 bg-luxury-gold text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.6em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 transition-all">
                                 Explore The Catalog
                              </Link>
                           </div>
                        ) : (
                           <div className="space-y-10">
                              {orders.map((order, idx) => (
                                 <motion.div 
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white/5 rounded-[4rem] border border-white/10 overflow-hidden hover:border-luxury-gold/30 transition-all duration-700 group shadow-2xl backdrop-blur-2xl"
                                 >
                                    <div className="p-12 border-b border-white/5 bg-white/[0.02] flex flex-wrap justify-between items-center gap-12">
                                       <div className="flex items-center gap-8">
                                          <div className="w-16 h-16 bg-white text-black rounded-[1.8rem] flex items-center justify-center font-playfair text-xl font-black italic shadow-2xl group-hover:bg-luxury-gold group-hover:text-white transition-all duration-500">
                                             #{order._id.slice(-4).toUpperCase()}
                                          </div>
                                          <div>
                                             <p className="text-[9px] uppercase tracking-[0.5em] font-black text-slate-500 mb-3 italic">Acquisition Entry</p>
                                             <p className="text-sm font-black text-white tracking-[0.2em] uppercase italic">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-12">
                                          <div className="text-right">
                                             <p className="text-[9px] uppercase tracking-[0.5em] font-black text-slate-500 mb-3 italic">Status Registry</p>
                                             <div className={`px-5 py-2.5 rounded-2xl text-[9px] uppercase tracking-widest font-black border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                             </div>
                                             {order.deliveryDate && (
                                               <p className="mt-3 text-[10px] font-black text-luxury-gold uppercase tracking-[0.2em] italic text-right">
                                                  Arrival: {new Date(order.deliveryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                               </p>
                                             )}
                                          </div>
                                          <div className="text-right">
                                             <p className="text-[9px] uppercase tracking-[0.5em] font-black text-luxury-gold mb-3 italic">Final Valuation</p>
                                             <p className="text-4xl font-black text-white tracking-tighter">${formatPrice(order.totalAmount)}</p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="p-12 space-y-12">
                                       {order.items.map((item, i) => (
                                          <div key={i} className="flex items-center gap-12 group/item">
                                             <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 p-3 shrink-0 group-hover/item:border-luxury-gold/50 transition-all duration-500 shadow-2xl">
                                                <img src={item.productId?.images?.[0]} alt="" className="w-full h-full object-cover rounded-[2rem] grayscale group-hover/item:grayscale-0 transition-all duration-700" />
                                             </div>
                                             <div className="flex-grow">
                                                <h4 className="text-3xl font-playfair font-black text-white group-hover/item:text-luxury-gold transition-colors italic tracking-tight leading-none mb-3">{item.productId?.name}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] italic opacity-80">Certified Asset • Security Access x{item.quantity}</p>
                                             </div>
                                             <div className="text-right">
                                                <p className="text-2xl font-black text-white tracking-tighter">${formatPrice(item.price)}</p>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                    <div className="px-12 py-8 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                                       <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">
                                          <ShieldCheck size={18} className="text-emerald-500" /> Authenticity Protocol Verified
                                       </div>
                                       <button 
                                          onClick={() => setSelectedOrder(order)}
                                          className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.5em] hover:text-white transition-all flex items-center gap-2 group/btn"
                                       >
                                          View Acquisition Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                       </button>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        )}
                     </div>
                   )}

                   {activeSection === 'address' && (
                     <div className="space-y-12">
                        <div className="flex items-center gap-8 px-10">
                           <div className="w-20 h-20 bg-luxury-gold/10 border border-luxury-gold/20 rounded-[2.5rem] flex items-center justify-center text-luxury-gold shadow-2xl">
                              <MapPin size={36} />
                           </div>
                           <div>
                              <h3 className="text-4xl font-playfair font-black text-white italic tracking-tight">Logistics Registry</h3>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mt-3 italic opacity-70">Primary Destination Registry</p>
                           </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
                           <div className="flex justify-between items-center mb-16">
                              <div>
                                 <h4 className="text-xl font-playfair font-black text-white italic">Current Registry</h4>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Validated Delivery Protocol</p>
                              </div>
                              {!isEditingAddress ? (
                                <button 
                                  onClick={() => setIsEditingAddress(true)}
                                  className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-luxury-gold uppercase tracking-[0.4em] hover:bg-luxury-gold hover:text-white transition-all shadow-xl"
                                >
                                   <Edit3 size={16} /> Configure Address
                                </button>
                              ) : (
                                <div className="flex gap-4">
                                   <button onClick={() => setIsEditingAddress(false)} className="px-6 py-4 bg-white/5 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Cancel</button>
                                   <button onClick={handleAddressUpdate} className="px-8 py-4 bg-luxury-gold text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Save Logistics</button>
                                </div>
                              )}
                           </div>

                           <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="md:col-span-2 space-y-4">
                                 <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] ml-6 italic">Street Architecture</label>
                                 <input 
                                    disabled={!isEditingAddress}
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                    className="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-black text-white tracking-widest disabled:opacity-50 outline-none focus:border-luxury-gold/50"
                                 />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] ml-6 italic">Urban Hub (City)</label>
                                 <input 
                                    disabled={!isEditingAddress}
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                    className="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-black text-white tracking-widest disabled:opacity-50 outline-none focus:border-luxury-gold/50"
                                 />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] ml-6 italic">Logistics Code (ZIP)</label>
                                 <input 
                                    disabled={!isEditingAddress}
                                    value={addressForm.zip}
                                    onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                                    className="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-black text-white tracking-widest disabled:opacity-50 outline-none focus:border-luxury-gold/50"
                                 />
                              </div>
                           </form>
                        </div>
                     </div>
                   )}

                   {activeSection === 'security' && (
                     <div className="bg-white/5 border border-white/10 p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-8 mb-20 relative z-10">
                           <div className="w-20 h-20 bg-luxury-gold/10 border border-luxury-gold/20 rounded-[2.5rem] flex items-center justify-center text-indigo-400 shadow-2xl">
                              <Lock size={36} />
                           </div>
                           <div>
                              <h3 className="text-4xl font-playfair font-black text-white italic tracking-tight">Security Vault</h3>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mt-3 italic opacity-70">Registry Access Protocols</p>
                           </div>
                        </div>
                        
                        <div className="space-y-8 relative z-10">
                           {!isChangingPassword ? (
                              <div className="p-12 bg-white/[0.03] border border-white/10 rounded-[3.5rem] flex justify-between items-center group hover:border-luxury-gold/50 transition-all duration-700 shadow-xl">
                                 <div className="flex items-center gap-8">
                                    <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-400/5 transition-all">
                                       <Key size={24} />
                                    </div>
                                    <div>
                                       <p className="text-xl font-black text-white uppercase tracking-widest italic font-bold">Master Password</p>
                                       <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 italic font-medium">Last Authenticated Recently</p>
                                    </div>
                                 </div>
                                 <button onClick={() => setIsChangingPassword(true)} className="px-10 py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.5em] hover:bg-luxury-gold hover:text-white transition-all shadow-2xl">Rotate Access Key</button>
                              </div>
                           ) : (
                              <motion.form 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                onSubmit={handlePasswordChange}
                                className="p-12 bg-white/[0.05] border border-luxury-gold/30 rounded-[3.5rem] space-y-8 shadow-2xl"
                              >
                                 <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.5em]">Rotating Security Key</h4>
                                    <button type="button" onClick={() => setIsChangingPassword(false)}><X size={18} /></button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-6 italic">Old Password</label>
                                       <input 
                                          type="password"
                                          value={passwordForm.oldPassword}
                                          onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                                          className="w-full px-8 py-5 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-luxury-gold"
                                          placeholder="••••••••"
                                       />
                                    </div>
                                    <div className="space-y-4">
                                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-6 italic">New Security Key</label>
                                       <input 
                                          type="password"
                                          value={passwordForm.newPassword}
                                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                          className="w-full px-8 py-5 bg-black/20 border border-white/10 rounded-2xl text-white outline-none focus:border-luxury-gold"
                                          placeholder="••••••••"
                                       />
                                    </div>
                                 </div>
                                 <button type="submit" className="w-full py-5 bg-luxury-gold text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-[1.01] transition-all">Update Security Key</button>
                              </motion.form>
                           )}

                           <div className="p-12 bg-white/[0.03] border border-white/10 rounded-[3.5rem] flex justify-between items-center group hover:border-luxury-gold/50 transition-all duration-700 opacity-60 cursor-not-allowed shadow-xl">
                              <div className="flex items-center gap-8">
                                 <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-slate-400">
                                    <ShieldCheck size={24} />
                                 </div>
                                 <div>
                                    <p className="text-xl font-black text-white uppercase tracking-widest italic">Biometric Encryption</p>
                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-2 italic">AUTHORIZED PERSONNEL ONLY</p>
                                 </div>
                              </div>
                              <div className="w-16 h-8 bg-white/10 rounded-full relative p-1.5 shadow-inner">
                                 <div className="w-5 h-5 bg-slate-700 rounded-lg shadow-2xl"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeSection === 'wishlist' && (
                     <div className="space-y-12">
                        <div className="flex items-center justify-between px-10">
                           <div>
                              <span className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.8em] mb-4 block italic underline decoration-luxury-gold/30 decoration-2 underline-offset-8">Curated Assets</span>
                              <h2 className="text-5xl font-playfair font-black text-white tracking-tighter italic leading-none">The Registry.</h2>
                           </div>
                           <div className="bg-white/5 px-8 py-5 rounded-3xl border border-white/10 text-right">
                              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1 italic">Saved Timepieces</p>
                              <p className="text-4xl font-black text-white tracking-widest">{wishlist.length}</p>
                           </div>
                        </div>

                        {wishlist.length === 0 ? (
                           <div className="bg-white/5 p-32 rounded-[5rem] border border-white/10 text-center shadow-3xl backdrop-blur-3xl relative overflow-hidden group">
                              <Heart size={80} className="mx-auto text-luxury-gold/20 mb-12" strokeWidth={1} />
                              <h3 className="text-4xl font-playfair font-black text-white mb-8 italic tracking-tighter leading-none">Registry Empty.</h3>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em] max-w-sm mx-auto leading-loose mb-16 italic opacity-80">
                                 Your horological wishlist registry is currently empty. Start curating your dream collection.
                              </p>
                              <Link to="/products" className="inline-flex px-16 py-6 bg-luxury-gold text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.7em] shadow-2xl hover:scale-105 transition-all">
                                 Explore Catalog
                              </Link>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {wishlist.map((product, idx) => (
                                 <motion.div 
                                    key={product._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden group hover:border-luxury-gold/30 transition-all duration-700 shadow-2xl backdrop-blur-xl"
                                 >
                                    <div className="relative h-64 overflow-hidden">
                                       <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                                       <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-80"></div>
                                       <button 
                                          onClick={() => removeFromWishlist(product._id)}
                                          className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-red-500 transition-all shadow-2xl group/trash"
                                       >
                                          <Trash2 size={18} className="group-hover/trash:rotate-12 transition-transform" />
                                       </button>
                                       <div className="absolute bottom-6 left-10">
                                          <p className="text-[9px] font-black text-luxury-gold uppercase tracking-[0.5em] mb-2 italic">{product.brand}</p>
                                          <h4 className="text-2xl font-playfair font-black text-white italic tracking-tight">{product.name}</h4>
                                       </div>
                                    </div>
                                    <div className="p-10 flex justify-between items-center">
                                       <p className="text-xl font-black text-white tracking-tighter">${formatPrice(product.price)}</p>
                                       <Link to={`/product/${product._id}`} className="px-8 py-3.5 bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] hover:bg-luxury-gold transition-all">View Asset</Link>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        )}
                     </div>
                   )}

                   {activeSection === 'support' && (
                     <div className="bg-white/5 border border-white/10 p-24 rounded-[5rem] backdrop-blur-3xl shadow-3xl text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <Phone size={64} className="mx-auto text-luxury-gold/30 mb-12 group-hover:scale-110 transition-transform" strokeWidth={1} />
                        <h3 className="text-5xl font-playfair font-black text-white mb-10 italic tracking-tighter leading-none">Private <br/> <span className="not-italic text-luxury-gold">Concierge.</span></h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em] leading-loose mb-16 italic opacity-80 max-w-md mx-auto">
                           For private inquiries, bespoke requests, or secure logistics assistance, our dedicated concierge team is available 24/7.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="p-12 bg-white/5 border border-white/10 rounded-[3.5rem] text-center group hover:bg-white hover:text-black transition-all duration-500 shadow-2xl">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 group-hover:text-black/50 transition-colors">Direct Inquiry</p>
                              <p className="text-[10px] font-black text-luxury-gold tracking-[0.3em] group-hover:text-luxury-gold transition-colors uppercase">CONCIERGE@MAISONLUXE.COM</p>
                           </div>
                           <div className="p-12 bg-white/5 border border-white/10 rounded-[3.5rem] text-center group hover:bg-white hover:text-black transition-all duration-500 shadow-2xl">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 group-hover:text-black/50 transition-colors">Secure Hotline</p>
                              <p className="text-[10px] font-black text-luxury-gold tracking-[0.3em] group-hover:text-luxury-gold transition-colors uppercase">+91 (800) LUXE-777</p>
                           </div>
                        </div>
                     </div>
                   )}
                </motion.div>
             </AnimatePresence>
          </div>

        </div>
        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl"
                onClick={() => setSelectedOrder(null)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#111827] w-full max-w-4xl max-h-[85vh] rounded-[4rem] border border-white/10 overflow-hidden relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col"
              >
                 {/* Modal Header */}
                 <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-luxury-gold text-white rounded-2xl flex items-center justify-center font-playfair text-xl font-black italic shadow-xl">
                          #{selectedOrder._id.slice(-4).toUpperCase()}
                       </div>
                       <div>
                          <p className="text-[9px] uppercase tracking-[0.5em] font-black text-slate-500 mb-1">Manifest Registry</p>
                          <h3 className="text-2xl font-playfair font-black text-white italic">Acquisition Details.</h3>
                       </div>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-all">
                       <X size={20} />
                    </button>
                 </div>

                 {/* Modal Body */}
                 <div className="flex-grow overflow-y-auto p-10 space-y-12">
                    {/* Dynamic Stepper Protocol */}
                    <OrderStepper status={selectedOrder.status} />

                    {/* Logistics & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                          <p className="text-[8px] uppercase tracking-[0.4em] font-black text-slate-500 mb-4 flex items-center gap-2"><MapPin size={12} className="text-luxury-gold"/> Logistics Center</p>
                          <p className="text-[11px] text-white font-medium leading-relaxed italic opacity-80">{selectedOrder.shippingAddress || 'Verified Destination Registry'}</p>
                       </div>
                       <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                          <p className="text-[8px] uppercase tracking-[0.4em] font-black text-slate-500 mb-4 flex items-center gap-2"><Package size={12} className="text-luxury-gold"/> Acquisition Status</p>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                             {selectedOrder.status}
                          </span>
                       </div>
                       <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-right">
                          <p className="text-[8px] uppercase tracking-[0.4em] font-black text-luxury-gold mb-4">Final Valuation</p>
                          <p className="text-3xl font-black text-white tracking-tighter">${formatPrice(selectedOrder.totalAmount)}</p>
                       </div>
                    </div>

                    {/* Delivery & Tracking Protocol */}
                    {(selectedOrder.deliveryDate || selectedOrder.trackingId) && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {selectedOrder.deliveryDate && (
                             <div className="bg-gradient-to-br from-luxury-gold/20 to-transparent p-8 rounded-[2.5rem] border border-luxury-gold/20 flex items-center justify-between shadow-xl">
                                <div>
                                   <p className="text-[8px] uppercase tracking-[0.4em] font-black text-luxury-gold mb-2 flex items-center gap-2"><Calendar size={12}/> Deployment Schedule</p>
                                   <p className="text-xl font-black text-white tracking-widest uppercase italic">{new Date(selectedOrder.deliveryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold shadow-inner">
                                   <Truck size={24} />
                                </div>
                             </div>
                          )}
                          {selectedOrder.trackingId && (
                             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between shadow-xl">
                                <div>
                                   <p className="text-[8px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2 flex items-center gap-2"><Fingerprint size={12}/> Neural Relay Link</p>
                                   <p className="text-sm font-black text-indigo-400 tracking-[0.2em] uppercase">{selectedOrder.trackingId}</p>
                                   <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1">Carrier: {selectedOrder.courierPartner || 'Global Relay'}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                                   <Globe size={20} />
                                </div>
                             </div>
                          )}
                       </div>
                    )}

                    {/* Itemized Registry */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-4">Itemized Registry</h4>
                       <div className="space-y-4">
                          {selectedOrder.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-8 bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/5 transition-all">
                               <div className="w-20 h-20 bg-white/5 rounded-3xl overflow-hidden p-2">
                                  <img src={item.productId?.images?.[0]} className="w-full h-full object-cover rounded-2xl" alt="" />
                               </div>
                               <div className="flex-grow">
                                  <h5 className="text-xl font-playfair font-black text-white italic">{item.productId?.name}</h5>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity} • Unit Price: ${formatPrice(item.price)}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-lg font-black text-white tracking-tight">${formatPrice(item.total || item.price * item.quantity)}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Modal Footer */}
                 <div className="p-10 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <Award size={16} className="text-luxury-gold" /> Authorized Manifest v2.1
                    </div>
                    <button 
                       onClick={() => downloadManifest(selectedOrder)}
                       className="px-10 py-4 bg-luxury-gold text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-luxury-gold transition-all shadow-2xl"
                    >
                       Download Manifest
                    </button>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
