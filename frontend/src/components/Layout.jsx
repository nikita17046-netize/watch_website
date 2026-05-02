import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X, LogOut, ChevronRight, MapPin, Mic, Package, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-sm border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-[#0F1115] text-[#D4AF37] h-8 flex items-center justify-center overflow-hidden">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Elite Registry Authorized Access Only</p>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-6 lg:px-10 h-24 flex items-center justify-between gap-10">
        {/* Left Side: Brand */}
        <Link to="/" className="flex items-center gap-4 flex-shrink-0 group">
          <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-[#D4AF37] font-playfair font-black text-xl italic">L</span>
          </div>
          <span className="text-2xl font-playfair font-black tracking-[0.3em] text-black">LUXE</span>
        </Link>

        {/* Center: Wide Search Bar */}
        <div className="flex-grow max-w-4xl">
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3.5 rounded-xl border border-gray-100 focus-within:border-black focus-within:bg-white focus-within:shadow-md transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for luxury timepieces, brands or collections..."
              className="bg-transparent text-sm font-medium outline-none w-full placeholder:text-gray-300 text-black tracking-wide"
            />
            <button className="text-gray-400 hover:text-black transition-colors">
               <Mic size={18} />
            </button>
          </div>
        </div>

        {/* Right Side: Essential Actions with Labels */}
        <div className="flex items-center gap-6 lg:gap-10 flex-shrink-0">
          {/* Account */}
          <Link to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'} className="flex flex-col items-center gap-1.5 group transition-colors">
            <div className="relative">
               <User size={22} className="text-gray-700 group-hover:text-black transition-colors" />
               {user && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">
               {user ? 'Account' : 'Login'}
            </span>
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="flex flex-col items-center gap-1.5 group transition-colors">
            <div className="relative">
              <Heart size={22} className="text-gray-700 group-hover:text-black transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#B8860B] text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex flex-col items-center gap-1.5 group transition-colors relative">
            <div className="relative">
               <ShoppingBag size={22} className="text-gray-700 group-hover:text-black transition-colors" />
               {cartCount > 0 && (
                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-[#D4AF37] rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
                   {cartCount}
                 </span>
               )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Cart</span>
          </Link>

          {/* Track Order */}
          <Link to="/profile?tab=orders" className="flex flex-col items-center gap-1.5 group transition-colors">
            <Package size={22} className="text-gray-700 group-hover:text-black transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black whitespace-nowrap">Track Order</span>
          </Link>
        </div>
      </div>

      {/* Categories Ribbon */}
      <div className="bg-white border-t border-gray-100 flex justify-center h-14 items-center">
        <div className="flex items-center gap-16">
          {[
            { label: 'Rolex Collection', path: '/products?brand=Rolex' },
            { label: 'Titan Edge', path: '/products?brand=Titan' },
            { label: 'Men', path: '/products?category=Men' },
            { label: 'Women', path: '/products?category=Women' },
            { label: 'New Arrivals', path: '/products?sort=newest', highlight: true },
            { label: 'Special Offers', path: '/products?sale=true', highlight: true },
          ].map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all relative group py-2 ${cat.highlight ? 'text-[#B8860B]' : 'text-gray-500 hover:text-black'}`}
            >
              {cat.label}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${cat.highlight ? 'bg-[#B8860B]' : 'bg-black'}`}></span>
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
