import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X, LogOut, ChevronRight, MapPin, Mic, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="bg-luxury-pearl border-b border-luxury-sand sticky top-0 z-[100]">
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2 px-4 text-center">
        <p className="text-[10px] font-inter font-bold uppercase tracking-[0.2em]">
          Complimentary Worldwide Shipping &amp; Extended Returns
        </p>
      </div>
      <div className="container mx-auto px-4 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-10">

          {/* Logo Section */}
          <Link to="/" className="group shrink-0 flex items-center gap-3">
            {/* Luxury Watch Clock Logo */}
            <svg width="44" height="44" viewBox="0 0 200 200" className="transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[8deg] drop-shadow-lg">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C9A84C"/>
                  <stop offset="50%" stopColor="#F0D080"/>
                  <stop offset="100%" stopColor="#A07830"/>
                </linearGradient>
                <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0F2044"/>
                  <stop offset="100%" stopColor="#1A3366"/>
                </linearGradient>
                <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EAF0F8"/>
                  <stop offset="100%" stopColor="#C8D8EC"/>
                </linearGradient>
              </defs>

              {/* Outer bezel ring */}
              <circle cx="100" cy="100" r="97" fill="url(#goldGrad)"/>
              {/* Gear teeth on outer ring */}
              {Array.from({length: 36}).map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180;
                const x1 = 100 + 90 * Math.cos(angle);
                const y1 = 100 + 90 * Math.sin(angle);
                const x2 = 100 + 97 * Math.cos(angle);
                const y2 = 100 + 97 * Math.sin(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8B6520" strokeWidth="3"/>;
              })}

              {/* Navy body */}
              <circle cx="100" cy="100" r="88" fill="url(#navyGrad)"/>

              {/* Inner gold ring */}
              <circle cx="100" cy="100" r="88" fill="none" stroke="url(#goldGrad)" strokeWidth="3"/>

              {/* Clock dial face (right half) */}
              <clipPath id="rightHalf">
                <rect x="100" y="12" width="88" height="176"/>
              </clipPath>
              <circle cx="100" cy="100" r="72" fill="url(#dialGrad)" clipPath="url(#rightHalf)"/>
              <circle cx="100" cy="100" r="72" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5"/>

              {/* Hour markers on dial */}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
                const rad = (deg - 90) * Math.PI / 180;
                const isMajor = i % 3 === 0;
                const r1 = isMajor ? 58 : 62;
                const r2 = 70;
                return (
                  <line
                    key={deg}
                    x1={100 + r1 * Math.cos(rad)}
                    y1={100 + r1 * Math.sin(rad)}
                    x2={100 + r2 * Math.cos(rad)}
                    y2={100 + r2 * Math.sin(rad)}
                    stroke="#A07830"
                    strokeWidth={isMajor ? 2.5 : 1.2}
                    clipPath="url(#rightHalf)"
                  />
                );
              })}

              {/* Stylized L (left side) */}
              <text
                x="72" y="118"
                fontFamily="Georgia, serif"
                fontWeight="bold"
                fontSize="72"
                fill="url(#goldGrad)"
                textAnchor="middle"
                style={{fontStyle:'italic'}}
              >L</text>

              {/* Clock hands */}
              {/* Hour hand */}
              <line x1="100" y1="100" x2="120" y2="62" stroke="url(#navyGrad)" strokeWidth="4" strokeLinecap="round" clipPath="url(#rightHalf)"/>
              {/* Minute hand */}
              <line x1="100" y1="100" x2="148" y2="88" stroke="#2A4A7A" strokeWidth="3" strokeLinecap="round" clipPath="url(#rightHalf)"/>
              {/* Center jewel */}
              <circle cx="100" cy="100" r="5" fill="url(#goldGrad)"/>
              <circle cx="100" cy="100" r="2.5" fill="#0F2044"/>

              {/* Curved gold swoosh at bottom */}
              <path d="M 30 148 Q 100 175 170 148" fill="none" stroke="url(#goldGrad)" strokeWidth="3" opacity="0.7"/>
              <path d="M 40 158 Q 100 182 160 158" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.4"/>

              {/* Small gear (bottom left) */}
              <circle cx="42" cy="145" r="14" fill="none" stroke="url(#goldGrad)" strokeWidth="2"/>
              {Array.from({length: 10}).map((_, i) => {
                const angle = (i * 36 * Math.PI) / 180;
                const gx1 = 42 + 12 * Math.cos(angle);
                const gy1 = 145 + 12 * Math.sin(angle);
                const gx2 = 42 + 16 * Math.cos(angle);
                const gy2 = 145 + 16 * Math.sin(angle);
                return <line key={i} x1={gx1} y1={gy1} x2={gx2} y2={gy2} stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round"/>;
              })}
              <circle cx="42" cy="145" r="4" fill="url(#goldGrad)"/>
            </svg>
            {/* Wordmark */}
            <span className="text-xl font-playfair font-black tracking-[0.35em] text-luxury-charcoal">LUXE</span>

          </Link>

          {/* Search Bar Section */}
          <div className="flex-1 max-w-3xl hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400 group-focus-within:text-black transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search products, brands and more..."
                className="w-full bg-luxury-sand border border-luxury-sand/50 rounded-lg py-3 pl-12 pr-12 outline-none focus:bg-white focus:border-luxury-gold/30 transition-all text-sm font-inter"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button title="Voice Search" className="text-gray-400 hover:text-black transition-colors">
                  <Mic size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-8 lg:gap-10 shrink-0">
            {/* Account */}
            <div className="relative group">
              <Link to={user ? "/profile" : "/login"} className="flex flex-col items-center gap-1.5 group text-gray-700 hover:text-black transition-colors">
                <User size={26} strokeWidth={1.2} />
                <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block font-inter">Account</span>
              </Link>
              {user && (
                <div className="absolute right-0 top-full mt-4 w-56 bg-luxury-pearl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-luxury-sand rounded-xl p-2 z-[110]">
                  <div className="px-4 py-3 border-b border-luxury-sand mb-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase font-inter">Welcome back,</p>
                    <p className="text-sm font-bold truncate font-inter">{user.username}</p>
                  </div>
                  <Link to="/profile" className="flex items-center px-4 py-2 text-xs font-bold hover:bg-luxury-sand rounded-lg transition-colors font-inter">Profile</Link>
                  <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors font-inter">Logout</button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="flex flex-col items-center gap-1.5 text-gray-700 hover:text-black transition-colors">
              <Heart size={26} strokeWidth={1.2} />
              <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block font-inter">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex flex-col items-center gap-1.5 relative text-gray-700 hover:text-black transition-colors">
              <div className="relative">
                <ShoppingBag size={26} strokeWidth={1.2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-inter">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block font-inter">Cart</span>
            </Link>

            {/* Track Order */}
            <Link to="/orders" className="flex flex-col items-center gap-1.5 text-gray-700 hover:text-black transition-colors group">
              <Package size={26} strokeWidth={1.2} className="group-hover:translate-y-[-2px] transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block font-inter">Track</span>
            </Link>
          </div>

        </div>
      </div>


      {/* Sub-Navbar: Categories */}
      <div className="bg-luxury-pearl border-b border-luxury-sand hidden sm:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 lg:gap-10 py-4 overflow-x-auto no-scrollbar">
            {[
              { name: 'New Arrivals', path: '/products?sort=newest', highlight: false },
              { name: 'Rolex Collection', path: '/products?brand=Rolex', highlight: false },
              { name: 'Titan Edge', path: '/products?brand=Titan', highlight: false },
              { name: 'Men', path: '/products?category=Men', highlight: false },
              { name: 'Women', path: '/products?category=Women', highlight: false },
              { name: 'Accessories', path: '/products?category=Accessories', highlight: false },
              { name: 'Lifestyle', path: '/products?category=Lifestyle', highlight: false },

              { name: 'Special Offers', path: '/products?sale=true', highlight: true },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`group relative text-[13px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap font-inter ${cat.highlight ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-black'}`}
              >
                {cat.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${cat.highlight ? 'bg-red-600' : 'bg-black'}`}></span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search for Mobile (only visible on small screens) */}
      <div className="md:hidden px-4 pb-4 pt-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 outline-none text-sm"
          />
        </div>
      </div>
    </nav>
  );
};


const Footer = () => {
  return (
    <footer className="bg-luxury-pearl pt-40 pb-20 border-t border-luxury-sand">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-10 group">
              <svg width="36" height="36" viewBox="0 0 200 200" className="transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[8deg] drop-shadow-lg">
                <defs>
                  <linearGradient id="fGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C9A84C"/>
                    <stop offset="50%" stopColor="#F0D080"/>
                    <stop offset="100%" stopColor="#A07830"/>
                  </linearGradient>
                  <linearGradient id="fNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0F2044"/>
                    <stop offset="100%" stopColor="#1A3366"/>
                  </linearGradient>
                  <linearGradient id="fDialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EAF0F8"/>
                    <stop offset="100%" stopColor="#C8D8EC"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="97" fill="url(#fGoldGrad)"/>
                {Array.from({length: 36}).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180;
                  return <line key={i} x1={100 + 90 * Math.cos(angle)} y1={100 + 90 * Math.sin(angle)} x2={100 + 97 * Math.cos(angle)} y2={100 + 97 * Math.sin(angle)} stroke="#8B6520" strokeWidth="3"/>;
                })}
                <circle cx="100" cy="100" r="88" fill="url(#fNavyGrad)"/>
                <circle cx="100" cy="100" r="88" fill="none" stroke="url(#fGoldGrad)" strokeWidth="3"/>
                <clipPath id="fRightHalf">
                  <rect x="100" y="12" width="88" height="176"/>
                </clipPath>
                <circle cx="100" cy="100" r="72" fill="url(#fDialGrad)" clipPath="url(#fRightHalf)"/>
                <circle cx="100" cy="100" r="72" fill="none" stroke="url(#fGoldGrad)" strokeWidth="1.5"/>
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
                  const rad = (deg - 90) * Math.PI / 180;
                  const isMajor = i % 3 === 0;
                  return <line key={deg} x1={100 + (isMajor ? 58 : 62) * Math.cos(rad)} y1={100 + (isMajor ? 58 : 62) * Math.sin(rad)} x2={100 + 70 * Math.cos(rad)} y2={100 + 70 * Math.sin(rad)} stroke="#A07830" strokeWidth={isMajor ? 2.5 : 1.2} clipPath="url(#fRightHalf)"/>;
                })}
                <text x="72" y="118" fontFamily="Georgia, serif" fontWeight="bold" fontSize="72" fill="url(#fGoldGrad)" textAnchor="middle" style={{fontStyle:'italic'}}>L</text>
                <line x1="100" y1="100" x2="120" y2="62" stroke="url(#fNavyGrad)" strokeWidth="4" strokeLinecap="round" clipPath="url(#fRightHalf)"/>
                <line x1="100" y1="100" x2="148" y2="88" stroke="#2A4A7A" strokeWidth="3" strokeLinecap="round" clipPath="url(#fRightHalf)"/>
                <circle cx="100" cy="100" r="5" fill="url(#fGoldGrad)"/>
                <circle cx="100" cy="100" r="2.5" fill="#0F2044"/>
                <path d="M 30 148 Q 100 175 170 148" fill="none" stroke="url(#fGoldGrad)" strokeWidth="3" opacity="0.7"/>
                {Array.from({length: 10}).map((_, i) => {
                  const angle = (i * 36 * Math.PI) / 180;
                  return <line key={i} x1={42 + 12 * Math.cos(angle)} y1={145 + 12 * Math.sin(angle)} x2={42 + 16 * Math.cos(angle)} y2={145 + 16 * Math.sin(angle)} stroke="url(#fGoldGrad)" strokeWidth="2.5" strokeLinecap="round"/>;
                })}
                <circle cx="42" cy="145" r="14" fill="none" stroke="url(#fGoldGrad)" strokeWidth="2"/>
                <circle cx="42" cy="145" r="4" fill="url(#fGoldGrad)"/>
              </svg>
              <span className="text-xl font-playfair font-black tracking-[0.35em] text-luxury-charcoal">LUXE</span>
            </Link>
            <p className="text-gray-400 text-xs font-medium leading-loose uppercase tracking-widest max-w-xs font-inter">
              Defining excellence in lifestyle since 2026.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-gray-900 font-bold mb-8 font-inter">Catalogue</h4>
            <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 font-inter">
              <Link to="#" className="hover:text-black transition-colors">Men's Edition</Link>
              <Link to="#" className="hover:text-black transition-colors">Women's Edition</Link>
              <Link to="#" className="hover:text-black transition-colors">Limited Series</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-gray-900 font-bold mb-8 font-inter">Maison</h4>
            <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 font-inter">
              <Link to="#" className="hover:text-black transition-colors">Our Heritage</Link>

              <Link to="#" className="hover:text-black transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-gray-900 font-bold mb-8 font-inter">Concierge</h4>
            <div className="flex border-b border-gray-200 pb-4">
              <input type="email" placeholder="JOIN REGISTRY" className="bg-transparent text-[10px] font-bold tracking-widest outline-none w-full font-inter" />
              <button className="text-black text-[11px] font-bold uppercase font-inter">→</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-12 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center font-inter">
          © 2026 LUXE PREMIUM. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col selection:bg-luxury-gold selection:text-white bg-luxury-pearl">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
