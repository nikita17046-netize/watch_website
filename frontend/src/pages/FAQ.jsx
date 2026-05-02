import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, ShieldCheck, Clock, Award, Search, Globe, Mail, Phone, MapPin } from 'lucide-react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await API.get('/admin/faqs');
        setFaqs(res.data || []);
      } catch (err) {
        console.error("FAQ Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ['All', 'Shipping & Logistics', 'Warranty & Repair', 'Authenticity & Certification', 'Membership & Rewards', 'Payment & Security'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = (faq.question || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (faq.answer || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || (faq.category || '').trim() === activeCategory.trim();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-luxury-pearl pt-40 pb-20">
      <div className="container mx-auto px-6 lg:px-20 max-w-6xl">
        
        {/* Back Button */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-12"
        >
           <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-[#D4AF37] transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Sanctuary
           </Link>
        </motion.div>

        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <HelpCircle size={14} /> Concierge Registry
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-playfair font-black text-[#0F1115] mb-8 italic"
          >
            How Can We <span className="text-[#D4AF37]">Assist You?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose"
          >
            Explore our curated knowledge base for inquiries regarding horological authenticity, 
            worldwide logistics, and elite membership protocols.
          </motion.p>
        </div>

        {/* Search & Filter */}
        <div className="space-y-10 mb-24">
           {/* Search Bar - Full Width */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="relative group max-w-4xl mx-auto"
           >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] group-focus-within:scale-110 transition-transform" size={20} />
              <input 
                 type="text" 
                 placeholder="SEARCH THE KNOWLEDGE REGISTRY..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white border border-slate-100 py-6 pl-16 pr-8 rounded-3xl outline-none focus:border-[#D4AF37]/30 shadow-sm text-[11px] font-black uppercase tracking-widest placeholder:text-slate-300 transition-all focus:shadow-xl focus:shadow-slate-200/50"
              />
           </motion.div>

           {/* Categories - Grid to ensure all are visible without scrolling */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-7xl mx-auto px-4"
           >
              {categories.map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter md:tracking-normal transition-all duration-300 border text-center ${activeCategory === cat ? 'bg-[#0F1115] text-[#D4AF37] border-[#0F1115] shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-[#0F1115]'}`}
                 >
                    {cat}
                 </button>
              ))}
           </motion.div>
        </div>

          <div className="lg:col-span-3 space-y-6">
            {loading ? (
               <div className="space-y-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/50 animate-pulse rounded-3xl"></div>)}
               </div>
            ) : filteredFaqs.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div 
                      key={faq._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden transition-all duration-500 ${activeIndex === index ? 'shadow-2xl shadow-slate-200/50 border-[#D4AF37]/20' : 'hover:border-slate-200'}`}
                    >
                      <button 
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        className="w-full px-10 py-8 flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-6">
                           <span className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-[#D4AF37] group-hover:bg-[#0F1115] transition-all">
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                           </span>
                           <span className="text-xs lg:text-sm font-black text-[#0F1115] uppercase tracking-tight">{faq.question}</span>
                        </div>
                        <div className={`transition-transform duration-500 ${activeIndex === index ? 'rotate-180 text-[#D4AF37]' : 'text-slate-300'}`}>
                           <ChevronDown size={20} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {activeIndex === index && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          >
                            <div className="px-10 pb-10 pl-24">
                               <div className="h-[1px] bg-slate-50 mb-8 w-full"></div>
                               <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                                  {faq.answer}
                                </p>
                               <div className="mt-8 flex gap-4">
                                  <span className="px-3 py-1 bg-slate-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">{faq.category}</span>
                                  <span className="px-3 py-1 bg-slate-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Updated Recently</span>
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
               </div>
            ) : (
              <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No Inquiry Records Found</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default FAQ;
