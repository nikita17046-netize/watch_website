import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, ChevronDown, Grid, List, Search, X, ArrowLeft, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToWishlist, isInWishlist } = useWishlist();

  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');
  const saleFilter = searchParams.get('sale');
  const isNewFilter = searchParams.get('isNew');
  const queryParam = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get('/product/all', {
          params: {
            category: categoryFilter,
            brand: brandFilter,
            sale: saleFilter,
            isNewProduct: isNewFilter,
            sort,
            search: queryParam
          }
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categoryFilter, brandFilter, saleFilter, isNewFilter, sort, queryParam]);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const updateSearch = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const categories = ['Men', 'Women', 'Luxury', 'Sport', 'Smart', 'Classic'];
  const brands = ['Rolex', 'Omega', 'Patek Philippe', 'Tag Heuer', 'Cartier', 'Seiko'];

  return (
    <div className="bg-luxury-pearl min-h-screen pt-10">
      {/* Editorial Header */}
      <section className="relative py-20 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Back Button - Aligned Left */}
          <div className="absolute left-6 lg:left-12 top-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="back-btn-box">
                <div className="icon-container">
                  <ArrowLeft size={14} />
                </div>
                <span>Return to House</span>
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-center mt-8 sm:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="h-[1px] w-12 bg-luxury-gold/30"></div>
                <span className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] font-black shimmer">The Registry</span>
                <div className="h-[1px] w-12 bg-luxury-gold/30"></div>
              </div>
              <h1 className="text-6xl md:text-8xl font-playfair font-black text-luxury-charcoal tracking-tighter leading-none mb-4">
                Curated <span className="italic font-light">Collections.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
                A selection of the world's most prestigious timepieces, <br />
                rigorously authenticated and curated for the modern collector.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Floating Toolbar */}
      <section className="sticky top-[110px] z-40 mx-auto px-6 lg:px-12 max-w-7xl mb-12">
        <div className="bg-white/70 backdrop-blur-2xl border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 text-[11px] uppercase tracking-widest font-bold text-luxury-charcoal hover:text-gray-500 transition-all font-inter group"
            >
              <div className="p-2 bg-luxury-charcoal text-white rounded-lg group-hover:bg-gray-800 transition-colors">
                <SlidersHorizontal size={14} />
              </div>
              Filter {showFilters && <span className="w-1.5 h-1.5 bg-luxury-charcoal rounded-full"></span>}
            </button>
            
            <div className="h-8 w-px bg-gray-100 hidden md:block"></div>

            <div className="relative group flex-grow md:flex-grow-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find Timepiece..." 
                className="pl-12 pr-6 py-2.5 bg-gray-50 rounded-xl text-xs font-medium text-luxury-charcoal outline-none focus:bg-white focus:ring-1 focus:ring-black/10 transition-all w-full md:w-64 border border-gray-100 font-inter"
                value={searchQuery}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold font-inter">Sort by</span>
              <div className="relative group">
                <button className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-luxury-charcoal border-b border-luxury-charcoal/20 pb-1 font-inter hover:border-luxury-charcoal transition-colors">
                  {sort.replace('-', ' ')} <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-3 bg-white shadow-2xl rounded-xl border border-gray-100 p-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {['newest', 'price-low', 'price-high', 'rating'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => updateFilter('sort', s)}
                      className="block w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest hover:bg-gray-50 rounded-lg transition-colors font-bold text-gray-600 hover:text-luxury-charcoal font-inter"
                    >
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="lg:w-72 shrink-0 space-y-16"
              >
                <div>
                  <h3 className="text-[10px] uppercase tracking-ultra-widest font-black text-luxury-gold mb-10">Categories</h3>
                  <div className="flex flex-col gap-6">
                    {['All Pieces', ...categories].map(cat => {
                      const value = cat === 'All Pieces' ? '' : cat;
                      const isActive = (categoryFilter || '') === value;
                      return (
                        <button 
                          key={cat}
                          onClick={() => updateFilter('category', value)}
                          className={`text-left text-[10px] uppercase tracking-[0.3em] font-black transition-all hover:pl-2 ${isActive ? 'text-luxury-charcoal border-l-2 border-luxury-gold pl-2' : 'text-gray-400 hover:text-luxury-charcoal'}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-ultra-widest font-black text-luxury-gold mb-10">Boutique Brands</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {brands.map(brand => (
                      <button 
                        key={brand}
                        onClick={() => updateFilter('brand', brand)}
                        className={`px-4 py-3 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all border ${brandFilter === brand ? 'bg-luxury-charcoal text-white border-luxury-charcoal' : 'bg-transparent text-gray-400 border-luxury-sand hover:border-luxury-gold'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-luxury-sand aspect-[4/5] rounded-[3rem] mb-8"></div>
                    <div className="h-4 bg-luxury-sand w-1/4 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${showFilters ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-x-12 gap-y-20`}>
                {products.map((product, idx) => (
                  <motion.div 
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link to={`/product/${product._id}`}>
                      <div className="relative aspect-[4/5] rounded-[3.5rem] bg-white premium-card mb-8 overflow-hidden group/card">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                        />
                        <div className="absolute top-8 right-8 z-20">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToWishlist(product);
                            }}
                            className={`p-4 rounded-2xl backdrop-blur-xl border border-white/20 transition-all duration-500 shadow-xl group/like active:scale-90 ${isInWishlist(product._id) ? 'bg-red-500 text-white border-red-400' : 'bg-white/80 text-luxury-charcoal hover:bg-white hover:text-red-500'}`}
                          >
                            <Heart size={18} className={`transition-transform duration-500 ${isInWishlist(product._id) ? 'scale-110' : 'group-hover/like:scale-125'}`} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                           <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[8px] uppercase tracking-[0.3em] font-black shadow-sm text-luxury-charcoal">
                            {product.brand}
                           </span>
                           {product.isNewProduct && (
                             <span className="bg-luxury-gold px-5 py-2 rounded-full text-[8px] uppercase tracking-[0.3em] font-black shadow-xl text-white">
                               NEW
                             </span>
                           )}
                        </div>
                      </div>
                      
                      <div className="px-4">
                        <h3 className="text-xl font-playfair font-medium text-luxury-charcoal mb-4 group-hover:text-luxury-gold transition-colors duration-500 line-clamp-1">{product.name}</h3>
                        <div className="flex justify-between items-center border-t border-luxury-sand/50 pt-4">
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{product.category}</p>
                          <p className="text-xl font-black text-luxury-charcoal tracking-tight">${product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            {products.length === 0 && !loading && (
              <div className="text-center py-60 bg-white rounded-[4rem] border border-luxury-sand">
                <h2 className="text-5xl font-playfair font-black text-luxury-charcoal italic mb-8">No matching pieces.</h2>
                <button 
                  onClick={() => { setSearchParams({}); setSearchQuery(''); }}
                  className="luxury-btn luxury-btn-primary rounded-full"
                >
                  Clear Catalogue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
