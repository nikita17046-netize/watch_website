import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, ShieldCheck, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await API.get('/admin/faqs');
        // Show only first 5 FAQs to keep Home page clean
        setFaqs(res.data?.slice(0, 5) || []);
      } catch (err) {
        console.error("FAQ Section Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // Only show on the Home page
  if (location.pathname !== '/') {
    return null;
  }

  if (loading && faqs.length === 0) return <div className="py-20 text-center animate-pulse text-slate-300 font-black uppercase tracking-widest text-[10px]">Synchronizing Registry...</div>;
  if (faqs.length === 0 && !loading) return null;

  return (
    <section className="py-32 bg-white border-t border-gray-50">
      <div className="container mx-auto px-6 lg:px-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Side: Branding & CTA */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-40"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0F1115] text-[#D4AF37] rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                <HelpCircle size={14} /> Concierge Registry
              </div>
              <h2 className="text-5xl md:text-6xl font-playfair font-black text-[#0F1115] mb-8 leading-tight">
                Frequently Asked <br />
                <span className="text-[#D4AF37] italic">Questions.</span>
              </h2>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] mb-12 leading-loose max-w-md">
                Our specialists have curated a registry of common inquiries regarding our horological protocols and logistics.
              </p>
              
              <Link 
                to="/faq" 
                className="group inline-flex items-center gap-4 px-10 py-5 bg-[#0F1115] text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl"
              >
                View Full Registry <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Accordion with Category Badges */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={faq._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-500 ${activeIndex === index ? 'bg-slate-50 border-transparent shadow-inner' : 'hover:border-slate-200 bg-white'}`}
              >
                <button 
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-8 py-7 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">{faq.category || 'General'}</span>
                       <span className="text-xs lg:text-sm font-black text-[#0F1115] uppercase tracking-tight">{faq.question}</span>
                    </div>
                  </div>
                  <div className={`transition-transform duration-500 ${activeIndex === index ? 'rotate-180 text-[#D4AF37]' : 'text-slate-300'}`}>
                    <ChevronDown size={18} />
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
                      <div className="px-8 pb-8 pl-[3.5rem]">
                        <div className="h-[1px] bg-slate-200/50 mb-6 w-full"></div>
                        <p className="text-slate-500 text-[13px] leading-relaxed font-medium italic">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            
            <div className="pt-8 text-center lg:text-left">
               <Link to="/faq" className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] hover:text-black transition-all border-b border-[#D4AF37]/30 pb-2">
                  View More Inquiry Records →
               </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
