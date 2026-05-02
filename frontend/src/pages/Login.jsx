import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

// Use the generated image path
const LOGIN_BG = "/luxury_watch_login_bg_1777638198174.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Access Granted. Welcome back.');
      
      const userData = data.checkUser || data.user;
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication Failed');
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
            src={LOGIN_BG}
            alt="Luxury Watch Movement"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/90 via-luxury-navy/40 to-transparent" />

          <div className="relative z-10 w-full h-full flex flex-col justify-between p-20">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-luxury-gold shimmer"></div>
                <span className="text-[10px] uppercase tracking-[0.7em] font-black text-luxury-gold">Maison LUXE</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-playfair font-black text-white leading-[0.85] tracking-tighter mb-10">
                THE <br />
                <span className="italic font-light text-luxury-gold">VAULT.</span>
              </h1>
            </div>

            <div className="space-y-12">
               <div className="max-w-xs">
                 <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 mb-4">Registry Access</p>
                 <p className="text-white/60 text-xs leading-loose font-medium tracking-widest uppercase">
                    Authenticated access for verified horology collectors and boutique members.
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
            <div className="mb-20">
              <Link to="/" className="inline-flex items-center gap-4 mb-14 group">
                <div className="w-12 h-12 bg-luxury-charcoal rounded-2xl flex items-center justify-center text-luxury-gold shadow-lg transition-transform group-hover:rotate-[10deg] duration-500">
                   <span className="font-playfair font-black text-2xl italic">L</span>
                </div>
                <span className="text-2xl font-playfair font-black tracking-[0.4em] text-luxury-charcoal">LUXE</span>
              </Link>
              
              <span className="text-luxury-gold uppercase tracking-[0.7em] text-[9px] font-black mb-4 block">Identity Verification</span>
              <h2 className="text-5xl font-playfair font-black text-luxury-charcoal mb-4">Welcome.</h2>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-bold">Please authenticate to access your collection.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 ml-1 group-focus-within:text-luxury-gold transition-colors">Registry Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
                  <input
                    type="email"
                    placeholder="MEMBER@LUXE.COM"
                    className="luxury-input pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 group-focus-within:text-luxury-gold transition-colors">Security Key</label>
                  <button type="button" className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold hover:text-luxury-charcoal transition-colors">Recover?</button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="luxury-input pl-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="luxury-btn w-full"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      <span>Enter the Vault</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-24 pt-12 border-t border-luxury-sand text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black mb-6">Not a member yet?</p>
              <Link to="/register" className="group inline-flex items-center gap-3 text-luxury-charcoal font-black text-[10px] uppercase tracking-widest hover:text-luxury-gold transition-all">
                 Request Membership Access
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
