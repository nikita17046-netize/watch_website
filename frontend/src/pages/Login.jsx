import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

// Use the generated image path
const LOGIN_BG = "/luxury_watch_login_bg_1777638198174.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
              
              <span className="text-luxury-gold uppercase tracking-[0.7em] text-[10px] font-black mb-6 block">Identity Verification Suite</span>
              <h2 className="text-7xl font-playfair font-black text-luxury-charcoal mb-6 leading-tight">Welcome.</h2>
              <p className="text-luxury-charcoal/60 text-[11px] uppercase tracking-[0.5em] font-black max-w-[280px] leading-relaxed">Please authenticate to access your private collection.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.6em] font-black text-slate-500 ml-1 group-focus-within:text-luxury-gold transition-colors font-outfit">Registry Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luxury-gold transition-all duration-300" />
                  <input
                    type="email"
                    placeholder="MEMBER@LUXE.COM"
                    className="luxury-input pl-16 py-4 text-[13px] font-black tracking-[0.2em] uppercase font-outfit"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] uppercase tracking-[0.6em] font-black text-slate-400 group-focus-within:text-luxury-gold transition-colors font-outfit">Security Key</label>
                  <button type="button" className="text-[9px] uppercase tracking-[0.4em] text-luxury-gold font-bold hover:text-luxury-charcoal transition-colors">Recover?</button>
                </div>
                <div className="relative">
                  <Lock size={20} className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luxury-gold transition-all duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="luxury-input pl-16 pr-12 py-4 text-[13px] font-black tracking-[1em] font-outfit"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="pt-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="luxury-btn w-full shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_30px_60px_-10px_rgba(15,23,42,0.5)] active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <div className="flex items-center justify-center gap-6 w-full">
                      <span className="text-[11px] font-black uppercase tracking-[0.5em]">Enter The Vault</span>
                      <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="relative my-14">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-luxury-sand/50"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.5em] font-black">
                <span className="bg-white px-8 text-slate-400">Neural Sync</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-5 py-5 bg-white border border-luxury-sand rounded-3xl hover:bg-slate-50 transition-all shadow-sm group active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-luxury-charcoal group-hover:text-luxury-gold transition-colors">Continue with Google</span>
            </button>

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
