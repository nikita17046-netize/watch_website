import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

// Use the generated image path
const REGISTER_BG = "/luxury_boutique_register_bg_1777638212970.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Membership granted. Welcome to the Circle.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error?.[0]?.msg || 'Application Failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-luxury-pearl flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl bg-white rounded-[4rem] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col md:flex-row min-h-[750px] border border-white relative"
      >
        {/* Left Section: Cinematic Image */}
        <div className="hidden md:flex md:w-1/2 relative bg-luxury-charcoal overflow-hidden group">
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5 }}
            src={REGISTER_BG}
            alt="Luxury Boutique Interior"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/90 via-luxury-navy/40 to-transparent" />

          <div className="relative z-10 w-full h-full flex flex-col justify-between p-20">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-luxury-gold shimmer"></div>
                <span className="text-[10px] uppercase tracking-[0.7em] font-black text-luxury-gold">Exclusive Membership</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-playfair font-black text-white leading-[0.85] tracking-tighter mb-10">
                JOIN THE <br />
                <span className="italic font-light text-luxury-gold">CIRCLE.</span>
              </h1>
            </div>

            <div className="space-y-12">
               <div className="max-w-xs">
                 <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 mb-4">Registry Enrollment</p>
                 <p className="text-white/60 text-xs leading-loose font-medium tracking-widest uppercase">
                    Begin your journey into the world of elite horology and private acquisitions.
                 </p>
               </div>
               
               <Link to="/" className="back-btn-box inline-flex">
                 <div className="icon-container">
                    <ArrowLeft size={14} />
                 </div>
                 <span>Return to House</span>
               </Link>
            </div>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 bg-white relative">
          <div className="w-full max-w-sm">
            <div className="mb-14">
              <Link to="/" className="inline-flex items-center gap-4 mb-12 group">
                <div className="w-12 h-12 bg-luxury-charcoal rounded-2xl flex items-center justify-center text-luxury-gold shadow-lg transition-transform group-hover:rotate-[10deg] duration-500">
                   <span className="font-playfair font-black text-2xl italic">L</span>
                </div>
                <span className="text-2xl font-playfair font-black tracking-[0.4em] text-luxury-charcoal">LUXE</span>
              </Link>
              
              <span className="text-luxury-gold uppercase tracking-[0.7em] text-[10px] font-black mb-6 block">Membership Application Suite</span>
              <h2 className="text-7xl font-playfair font-black text-luxury-charcoal mb-6 leading-tight">Register.</h2>
              <p className="text-luxury-charcoal/60 text-[11px] uppercase tracking-[0.5em] font-black max-w-[280px] leading-relaxed">Initiate your journey into curated excellence.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4 group">
                <label className="text-[10px] uppercase tracking-[0.5em] font-black text-slate-500 ml-1 group-focus-within:text-luxury-gold transition-colors">Identity Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luxury-gold transition-all duration-300" />
                  <input
                    name="username"
                    type="text"
                    placeholder="E.G. ARTHUR MORGAN"
                    className="luxury-input pl-16 py-4 text-[13px] font-black tracking-[0.2em] uppercase font-outfit"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 group">
                <label className="text-[10px] uppercase tracking-[0.5em] font-black text-slate-500 ml-1 group-focus-within:text-luxury-gold transition-colors">Registry Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luxury-gold transition-all duration-300" />
                  <input
                    name="email"
                    type="email"
                    placeholder="MEMBER@LUXE.COM"
                    className="luxury-input pl-16 py-4 text-[13px] font-black tracking-[0.2em] uppercase font-outfit"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 group">
                <label className="text-[10px] uppercase tracking-[0.5em] font-black text-slate-500 ml-1 group-focus-within:text-luxury-gold transition-colors">Security Key</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luxury-gold transition-all duration-300" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="luxury-input pl-16 pr-12 py-4 text-[13px] font-black tracking-[1em] font-outfit"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-luxury-gold transition-colors p-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="luxury-btn w-full shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_30px_60px_-10px_rgba(15,23,42,0.5)] active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <div className="flex items-center justify-center gap-6 w-full">
                      <span className="text-[11px] font-black uppercase tracking-[0.5em]">Apply for Membership</span>
                      <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-16 pt-10 border-t border-luxury-sand text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black mb-4">Already have access?</p>
              <Link to="/login" className="group inline-flex items-center gap-3 text-luxury-charcoal font-black text-[10px] uppercase tracking-widest hover:text-luxury-gold transition-all">
                 Sign In to the House
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
