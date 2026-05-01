import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, MapPin, Package, Heart, LogOut, Settings, Bell, CreditCard, ChevronRight, Edit3, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-pearl">
        <div className="text-center">
           <h1 className="text-2xl font-playfair mb-4">Please enter the registry</h1>
           <Link to="/login" className="px-8 py-3 bg-black text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-widest">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-pearl pt-40 pb-20">
      <div className="container mx-auto px-6 lg:px-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-[#0F1115]"></div>
                <div className="relative pt-12">
                   <div className="w-24 h-24 rounded-full bg-white border-4 border-luxury-pearl mx-auto flex items-center justify-center text-3xl font-black text-[#D4AF37] shadow-xl">
                      {user.username?.[0] || 'U'}
                   </div>
                   <h2 className="mt-6 text-xl font-playfair font-black text-[#0F1115]">{user.username}</h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{user.role} Member</p>
                </div>
             </div>

             <nav className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-1">
                {[
                  { id: 'overview', label: 'Dashboard', icon: User },
                  { id: 'orders', label: 'My Orders', path: '/my-orders', icon: Package },
                  { id: 'wishlist', label: 'Wishlist', path: '/wishlist', icon: Heart },
                  { id: 'address', label: 'Shipping Address', icon: MapPin },
                  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
                  { id: 'faqs', label: 'Concierge FAQ', icon: FileText },
                  { id: 'security', label: 'Security', icon: ShieldCheck },
                ].map((item) => (
                  item.path ? (
                    <Link 
                      key={item.id} 
                      to={item.path}
                      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-black transition-all"
                    >
                      <div className="flex items-center gap-4">
                         <item.icon size={16} />
                         {item.label}
                      </div>
                      <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <button 
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === item.id ? 'bg-[#0F1115] text-[#D4AF37] shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-black'}`}
                    >
                      <div className="flex items-center gap-4">
                         <item.icon size={16} />
                         {item.label}
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  )
                ))}
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all"
                >
                   <LogOut size={16} />
                   Logout Archive
                </button>
             </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
             
             {activeSection === 'overview' && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="bg-[#0F1115] p-12 rounded-[4rem] text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
                     <div className="relative z-10">
                        <span className="px-4 py-1.5 bg-[#D4AF37] text-black rounded-full text-[9px] font-black uppercase tracking-widest">Member Registry</span>
                        <h1 className="text-4xl lg:text-5xl font-playfair italic mt-6 mb-4">Welcome back, <br/> {user.username}</h1>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em] leading-loose max-w-lg">
                           Your private collection and horological preferences are managed within this secure terminal.
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[
                        { label: 'Verified Status', value: 'Authorized', icon: ShieldCheck, color: 'text-emerald-500' },
                        { label: 'Member Since', value: 'May 2026', icon: Bell, color: 'text-indigo-500' },
                        { label: 'Loyalty Tier', value: 'Elite', icon: Award, color: 'text-[#D4AF37]' },
                     ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
                              <stat.icon size={22} />
                           </div>
                           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h3>
                           <p className={`text-sm font-black uppercase ${stat.color}`}>{stat.value}</p>
                        </div>
                     ))}
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                           <h3 className="text-lg font-black text-[#0F1115] uppercase italic">Account Intel</h3>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Identity Information</p>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:text-black transition-colors">
                           <Edit3 size={14} /> Update Registry
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Registry Name</label>
                           <div className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-[11px] font-black uppercase text-slate-800 border border-transparent">
                              {user.username}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Direct Email</label>
                           <div className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-[11px] font-black text-slate-500 border border-transparent flex items-center gap-3 italic">
                              <Mail size={16} /> {user.email}
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
             )}

             {activeSection === 'faqs' && (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-[#0F1115] rounded-2xl flex items-center justify-center text-[#D4AF37]">
                           <HelpCircle size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-playfair font-black text-[#0F1115]">Concierge FAQ</h3>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Common Inquiries & Protocols</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        {[
                           { q: "How do I verify my watch's authenticity?", a: "Every timepiece purchased from LUXE comes with a Geneva Registry certificate. You can verify the serial number in your account settings under 'Digital Assets'." },
                           { q: "What is the standard delivery timeline?", a: "We provide white-glove logistics globally. Standard transit takes 3-5 business days, fully insured." },
                           { q: "Can I upgrade my membership tier?", a: "Membership tiers are based on your annual collection value. Platinum status is reached after ₹25L in verified acquisitions." }
                        ].map((faq, i) => (
                           <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                              <p className="text-xs font-black text-[#0F1115] uppercase tracking-tight mb-3 flex items-center gap-2">
                                 <span className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[10px] text-[#D4AF37]">?</span>
                                 {faq.q}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed ml-8">{faq.a}</p>
                           </div>
                        ))}
                     </div>
                     <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                        <Link to="/faq" className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] hover:text-black transition-all">
                           View Full Knowledge Base Registry →
                        </Link>
                     </div>
                  </div>
               </motion.div>
             )}

             {activeSection === 'address' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-[#D4AF37]">
                     <MapPin size={32} />
                  </div>
                  <h3 className="text-2xl font-playfair font-black text-[#0F1115] mb-4">Shipping Destination</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed mb-10">
                     Authorize your primary residence for worldwide logistics and white-glove delivery protocols.
                  </p>
                  <button className="px-12 py-5 bg-[#0F1115] text-[#D4AF37] rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all">
                     Configure Address
                  </button>
               </motion.div>
             )}

             {/* Other sections can be added here */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
