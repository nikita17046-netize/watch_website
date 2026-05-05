import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Shield, Clock, ArrowRight } from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact/submit', formData);
      toast.success('Inquiry transmitted to the Concierge Registry');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      toast.error('Transmission failure. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF8] pt-20 pb-32">
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#0F1115]">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2000" 
            alt="Luxury" 
            className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FFFCF8]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#C9A84C] uppercase tracking-[0.8em] text-[10px] font-black mb-6 block"
          >
            Private Client Relations
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-playfair font-black text-white italic mb-8"
          >
            Concierge <span className="font-light not-italic">Services.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-xs uppercase tracking-[0.3em] font-medium max-w-xl mx-auto leading-loose"
          >
            Experience unparalleled personalized support. Our master horologists and logistics specialists are at your disposal.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-20 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Information Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-black/5 border border-gray-50 h-full">
              <h3 className="text-2xl font-playfair font-bold text-slate-900 mb-12">Registry <br/><span className="text-[#C9A84C] italic">Information.</span></h3>
              
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F9F5EF] flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Electronic Inquiry</p>
                    <p className="text-sm font-bold text-slate-900">concierge@maisonluxe.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F9F5EF] flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Direct Line</p>
                    <p className="text-sm font-bold text-slate-900">+1 (800) LUXE-GENEVA</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F9F5EF] flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Global Headquarters</p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">Rue du Rhône 12,<br/>1204 Genève, Switzerland</p>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-10 border-t border-gray-50">
                 <div className="flex items-center gap-4 text-[#C9A84C]">
                    <Shield size={24} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight">Secure & Private <br/>Registry Transmission</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="bg-white p-12 lg:p-20 rounded-[4rem] shadow-2xl shadow-black/5 border border-gray-50">
              <div className="mb-16">
                <h2 className="text-4xl font-playfair font-black text-slate-900 mb-6 italic">Secure <span className="font-light not-italic">Inquiry Form.</span></h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Please provide your credentials and the nature of your inquiry.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Identity</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ENTER FULL NAME"
                      className="w-full bg-[#F9F5EF] px-8 py-5 rounded-3xl text-xs font-bold tracking-widest outline-none border-2 border-transparent focus:border-[#C9A84C] focus:bg-white transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Electronic Mail</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="EMAIL@PROTOCOL.COM"
                      className="w-full bg-[#F9F5EF] px-8 py-5 rounded-3xl text-xs font-bold tracking-widest outline-none border-2 border-transparent focus:border-[#C9A84C] focus:bg-white transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nature of Inquiry</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[#F9F5EF] px-8 py-5 rounded-3xl text-xs font-bold tracking-widest outline-none border-2 border-transparent focus:border-[#C9A84C] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Authentication Request</option>
                    <option>Logistics & Shipping</option>
                    <option>Private Procurement</option>
                    <option>Technical Assistance</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message Content</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="DESCRIBE YOUR INQUIRY IN DETAIL..."
                    rows="6"
                    className="w-full bg-[#F9F5EF] px-8 py-6 rounded-[2.5rem] text-xs font-bold tracking-widest outline-none border-2 border-transparent focus:border-[#C9A84C] focus:bg-white transition-all uppercase resize-none"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-[#0F1115] text-[#C9A84C] py-6 rounded-full text-[11px] font-black uppercase tracking-[0.5em] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-6 disabled:opacity-50"
                  >
                    {loading ? 'Transmitting Registry...' : <>Transmit Inquiry <Send size={18} className="group-hover:translate-x-2 transition-transform" /></>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
