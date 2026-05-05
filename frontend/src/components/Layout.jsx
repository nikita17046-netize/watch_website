import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X, LogOut, ChevronRight, MapPin, Mic, Package, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import FAQSection from './FAQSection';
import GlobalReviews from './GlobalReviews';

const Navbar = () => {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchValue.trim().length > 1) {
        try {
          const res = await API.get('/product/all', {
            params: { search: searchValue.trim() }
          });
          // Limit to 5 top matches
          setSuggestions(res.data.products?.slice(0, 5) || []);
        } catch (err) {
          console.error("Suggestion error", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-sm border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-[#0F1115] text-[var(--luxury-gold)] h-8 flex items-center justify-center overflow-hidden">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Elite Registry Authorized Access Only</p>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-6 lg:px-10 h-24 flex items-center justify-between gap-10">
        {/* Left Side: Brand */}
        <Link to="/" className="flex items-center gap-4 flex-shrink-0 group">
          <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-[var(--luxury-gold)] font-playfair font-black text-xl italic">L</span>
          </div>
          <span className="text-2xl font-playfair font-black tracking-[0.3em] text-black">LUXE</span>
        </Link>

        {/* Center: Wide Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-4xl relative">
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3.5 rounded-xl border border-gray-100 focus-within:border-black focus-within:bg-white focus-within:shadow-md transition-all">
            <button 
              type="submit"
              className="text-gray-400 hover:text-black transition-colors"
            >
              <Search size={18} />
            </button>
            <input
              type="text"
              placeholder="Search for luxury timepieces, brands or collections..."
              className="bg-transparent text-sm font-medium outline-none w-full placeholder:text-gray-300 text-black tracking-wide"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="button" className="text-gray-400 hover:text-black transition-colors">
              <Mic size={18} />
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden z-[200] py-4"
              >
                <div className="px-6 py-2 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Registry Matches</span>
                </div>
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchValue('');
                    }}
                    className="flex items-center gap-5 px-6 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-50">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">{item.brand}</span>
                      <span className="text-sm font-bold text-gray-900 group-hover:text-black">{item.name}</span>
                    </div>
                    <div className="ml-auto text-xs font-black text-gray-400 group-hover:text-black">
                       ${item.price.toLocaleString()}
                    </div>
                  </Link>
                ))}
                <button 
                  onClick={handleSearchSubmit}
                  className="w-full text-center py-4 border-t border-gray-50 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                >
                  View All Search Records
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Right Side: Essential Actions with Labels */}
        <div className="flex items-center gap-6 lg:gap-10 flex-shrink-0">
          {/* Account Dropdown */}
          <div className="relative group/account flex flex-col items-center gap-1.5 cursor-pointer">
            {loading ? (
              <div className="flex flex-col items-center gap-1.5 animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-2 bg-gray-100 rounded"></div>
              </div>
            ) : user ? (
              <div className="flex flex-col items-center gap-1.5 group transition-colors">
                <div className="relative">
                  <User size={22} className="text-gray-700 group-hover:text-black transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">
                  Account
                </span>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-center gap-1.5 group transition-colors">
                <User size={22} className="text-gray-700 group-hover:text-black transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">
                  Login
                </span>
              </Link>
            )}

            {/* Dropdown Menu */}
            {user && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-300 z-[110] transform origin-top scale-95 group-hover/account:scale-100">
                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Greetings,</p>
                  <p className="text-[11px] font-black text-black uppercase truncate">{user.username}</p>
                </div>

                <Link
                  to={user.role === 'admin' ? '/admin' : '/profile'}
                  className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-[var(--luxury-gold)] hover:bg-gray-50 transition-all"
                >
                  <MapPin size={14} /> My Dashboard
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-[var(--luxury-gold)] hover:bg-gray-50 transition-all"
                >
                  <Heart size={14} /> My Registry
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border-t border-gray-50 mt-2"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="flex flex-col items-center gap-1.5 group transition-colors">
            <div className="relative">
              <Heart size={22} className="text-gray-700 group-hover:text-black transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--luxury-gold)] text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
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
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-[var(--luxury-gold)] rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
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
            { label: 'Rolex Collection', path: '/products?search=Rolex' },
            { label: 'Titan Collection', path: '/products?search=Titan' },
            { label: 'Men', path: '/products?category=Men' },
            { label: 'Women', path: '/products?category=Women' },
            { label: 'New Arrivals', path: '/products?isNew=true' },
            { label: 'Special Offers', path: '/products?sale=true' },
            { label: 'Concierge FAQ', path: '/faq' },
            { label: 'Contact Us', path: '/contact' },
            { label: 'About Us', path: '/about' },
          ].map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-all relative group py-2"
            >
              {cat.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const { user } = useAuth();
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
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-[var(--luxury-gold)]">Navigation</h4>
            <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Link to="/products" className="hover:text-white">Catalogue</Link>
              <Link to="/faq" className="hover:text-white">Knowledge Base</Link>
              <Link to="/about" className="hover:text-white">Our Story</Link>

              <Link to="/profile" className="hover:text-white">User Panel</Link>
              {user && user.role === 'admin' && (
                <Link to="/logistics" className="hover:text-white">Logistics Hub</Link>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-[var(--luxury-gold)]">Maison</h4>
            <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Link to="#" className="hover:text-white transition-colors">Privacy Registry</Link>
              <Link to="#" className="hover:text-white transition-colors">T&C Logistics</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-[var(--luxury-gold)]">Concierge</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6 italic">Private Inquiry Registry</p>
            <div className="flex border-b border-gray-700 pb-2">
              <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent text-[10px] font-bold outline-none w-full text-center md:text-left" />
              <button className="text-[var(--luxury-gold)]">
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
  const hideLayout = ['/login', '/register', '/profile', '/logistics'].includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideLayout && <Navbar />}
      <main className={`flex-grow ${!hideLayout ? 'pt-40' : ''}`}>{children}</main>
      {!hideLayout && <FAQSection />}
      {!hideLayout && <GlobalReviews />}
      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
