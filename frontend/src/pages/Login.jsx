import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Access Granted. Welcome back.');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication Failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-luxury-sand/30 flex items-center justify-center p-6 md:p-12">
      {/* Contained Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-6xl bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-white"
      >
        {/* Left: Cinematic Image Section (Contained) */}
        <div className="hidden md:flex md:w-1/2 relative bg-luxury-charcoal items-center justify-center p-16 overflow-hidden">
          <img
            src="/luxury_login_bg_1777480747179.png"
            alt="Luxury Watch Detail"
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
          />

          <div className="relative z-10 text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-luxury-gold"></div>
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-luxury-gold">Maison Horlogère</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-playfair font-black leading-tight mb-8">
              The Registry <br />
              <span className="italic font-light opacity-80">Access.</span>
            </h1>
            <p className="text-sm text-gray-300 font-medium leading-loose tracking-wide opacity-80 uppercase text-[9px] max-w-xs">
              Enter the private vault of curated excellence and high-horology treasures.
            </p>
          </div>

          <div className="absolute bottom-12 left-12">
            <Link to="/" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-black">Back to House</span>
            </Link>
          </div>
        </div>

        {/* Right: Authentication Form (Contained) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-16 lg:p-20 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
                <svg width="44" height="44" viewBox="0 0 200 200" className="transition-transform duration-700 group-hover:rotate-[8deg]">
                  <defs>
                    <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C9A84C" /><stop offset="50%" stopColor="#F0D080" /><stop offset="100%" stopColor="#A07830" />
                    </linearGradient>
                    <linearGradient id="logoNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0F2044" /><stop offset="100%" stopColor="#1A3366" />
                    </linearGradient>
                    <linearGradient id="logoDial" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EAF0F8" /><stop offset="100%" stopColor="#C8D8EC" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="97" fill="url(#logoGold)" />
                  <circle cx="100" cy="100" r="88" fill="url(#logoNavy)" />
                  <clipPath id="lRightHalf"><rect x="100" y="12" width="88" height="176" /></clipPath>
                  <circle cx="100" cy="100" r="72" fill="url(#logoDial)" clipPath="url(#lRightHalf)" />
                  <text x="72" y="118" fontFamily="Georgia, serif" fontWeight="bold" fontSize="72" fill="url(#logoGold)" textAnchor="middle" style={{ fontStyle: 'italic' }}>L</text>
                  <circle cx="100" cy="100" r="5" fill="url(#logoGold)" />
                </svg>
                <span className="text-xl font-playfair font-black tracking-[0.35em] text-luxury-charcoal">LUXE</span>
              </Link>
              <span className="text-luxury-gold uppercase tracking-[0.6em] text-[10px] font-black mb-3 block">Secured Entrance</span>
              <h2 className="text-4xl font-playfair font-black text-black mb-3">Welcome.</h2>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-bold">Please authenticate to access your collection.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-3 group">
                <label className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400 ml-1 group-focus-within:text-black">Email Identity</label>
                <div className="relative border-b border-luxury-sand py-4 focus-within:border-black transition-colors">
                  <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="email"
                    placeholder="member@luxury.com"
                    className="w-full pl-10 bg-transparent outline-none text-sm font-bold tracking-widest text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400 group-focus-within:text-black">Security Cipher</label>
                  <button type="button" className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold hover:text-black transition-colors">Recover?</button>
                </div>
                <div className="relative border-b border-luxury-sand py-4 focus-within:border-black transition-colors">
                  <Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 bg-transparent outline-none text-sm font-bold tracking-widest text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.5em] font-black rounded-xl hover:bg-luxury-gold transition-all duration-500 shadow-xl flex items-center justify-center gap-6 group relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Authenticate"}
                  </span>
                  {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />}
                </button>
              </div>
            </form>

            <div className="mt-16 pt-10 border-t border-luxury-sand text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold mb-4">Not a member yet?</p>
              <Link to="/register" className="text-black font-black text-[10px] uppercase tracking-widest hover:text-luxury-gold transition-colors">Request Access</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Simple ChevronRight icon as lucide-react might not have it in the same name or to avoid import issues if not explicitly added
const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default Login;
