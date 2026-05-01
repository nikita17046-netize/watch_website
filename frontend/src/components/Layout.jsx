import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X, LogOut, ChevronRight, MapPin, Mic, Package, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-sm border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-[#0F1115] text-[#D4AF37] h-8 flex items-center justify-center overflow-hidden">
         <p className="text-[9px] font-black uppercase tracking-[0.4em]">Elite Registry Authorized Access Only</p>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-10 h-20 flex items-center justify-between">
        {/* Left Side: Brand & Quick Links */}
        <div className="flex items-center gap-12">
          {/* Logo & Text in One Row */}
          <Link to="/" className="flex items-center gap-4 group">
             <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-[#D4AF37] font-playfair font-black text-lg italic">L</span>
             </div>
             <span className="text-xl font-playfair font-black tracking-[0.3em] text-black">LUXE</span>
          </Link>

          <div className="h-6 w-[1.5px] bg-gray-100"></div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 focus-within:border-[#D4AF37] focus-within:bg-white transition-all w-64">
               <Search size={16} className="text-gray-400" />
               <input 
                  type="text" 
                  placeholder="SEARCH REGISTRY..." 
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none w-full placeholder:text-gray-300"
               />
            </div>
            <Link to="/products" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              Catalogue
            </Link>
          </div>
        </div>

        {/* Right Side: Essential Actions */}
        <div className="flex items-center gap-8">
          <Link to="/wishlist" className="p-2 text-gray-400 hover:text-black transition-colors relative group">
             <Heart size={20} className="group-hover:scale-110 transition-transform" />
          </Link>
          
          <Link to="/cart" className="p-2 text-gray-400 hover:text-black transition-colors relative group">
             <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
             {cartCount > 0 && (
               <span className="absolute top-0 right-0 w-4 h-4 bg-black text-[#D4AF37] rounded-full text-[8px] font-black flex items-center justify-center border border-white">
                 {cartCount}
               </span>
             )}
          </Link>

          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-3 pl-6 border-l border-gray-100 group">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-[10px] font-black text-[#D4AF37] uppercase group-hover:bg-[#D4AF37] group-hover:text-black transition-all shadow-md">
                {user.username?.[0]}
              </div>
              <div className="hidden lg:block text-left">
                 <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Session Active</p>
                 <p className="text-[10px] font-black text-black uppercase tracking-tight leading-none">
                    {user.role === 'admin' ? 'Superadmin' : 'User Panel'}
                 </p>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="px-8 py-2.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl shadow-black/10">
              Entrance
            </Link>
          )}
        </div>
      </div>

      {/* Categories Ribbon */}
      <div className="bg-white border-t border-gray-50 flex justify-center h-12 items-center">
        <div className="flex items-center gap-12">
          {[
            { label: 'Rolex Collection', path: '/products?brand=Rolex' },
            { label: 'Titan Edge', path: '/products?brand=Titan' },
            { label: 'Men', path: '/products?category=Men' },
            { label: 'Women', path: '/products?category=Women' },
            { label: 'New Arrivals', path: '/products?sort=newest' },
            { label: 'Special Offers', path: '/products?sale=true', highlight: true },
          ].map((cat) => (
            <Link 
              key={cat.label} 
              to={cat.path} 
              className={`text-[9px] font-black uppercase tracking-[0.25em] transition-all relative group ${cat.highlight ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-black'}`}
            >
              {cat.label}
              <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0F1115] pt-32 pb-16 text-white border-t border-gray-800">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24 text-center md:text-left">
          <div className="col-span-1">
            <h2 className="text-2xl font-playfair font-black tracking-[0.4em] mb-8">LUXE</h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] leading-loose">
               Redefining the standards of horological prestige since 2026.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-[#D4AF37]">Navigation</h4>
            <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
               <Link to="/products" className="hover:text-white">Catalogue</Link>
               <Link to="/faq" className="hover:text-white">Knowledge Base</Link>
               <Link to="/profile" className="hover:text-white">User Panel</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-[#D4AF37]">Maison</h4>
            <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
               <Link to="#" className="hover:text-white transition-colors">Privacy Registry</Link>
               <Link to="#" className="hover:text-white transition-colors">T&C Logistics</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-[#D4AF37]">Concierge</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6 italic">Private Inquiry Registry</p>
            <div className="flex border-b border-gray-700 pb-2">
               <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent text-[10px] font-bold outline-none w-full text-center md:text-left" />
               <button className="text-[#D4AF37]">
                  <ChevronRight size={18} />
               </button>
            </div>
          </div>
        </div>
        <div className="text-center pt-12 border-t border-gray-800 text-[9px] font-black text-gray-600 uppercase tracking-[0.5em]">
           © 2026 LUXE PREMIUM HOLDINGS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideLayout && <Navbar />}
      <main className={`flex-grow ${!hideLayout ? 'pt-40' : ''}`}>{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
