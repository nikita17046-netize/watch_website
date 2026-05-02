import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';
import API from '../api/api';

const GlobalReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const res = await API.get('/review/recent');
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Global reviews error", err);
      }
      setLoading(false);
    };
    fetchRecentReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-32 bg-[#FFFCF8] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-20">
           <span className="text-[#C9A84C] uppercase tracking-[0.7em] text-[10px] font-black mb-4 block">Client Testimonials</span>
           <h2 className="text-5xl font-playfair font-black text-slate-900 italic">The Global <span className="font-light">Experience.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews.map((rev, i) => (
            <motion.div 
              key={rev._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-[#F0E6D2] relative group hover:shadow-2xl transition-all duration-700"
            >
              <div className="absolute top-8 right-10 text-[#C9A84C]/10 group-hover:text-[#C9A84C]/20 transition-colors">
                 <Quote size={40} />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#F9F5EF] bg-gray-50 flex items-center justify-center">
                   {rev.productId?.images?.[0] ? (
                     <img src={rev.productId.images[0]} className="w-full h-full object-cover" alt="Product" />
                   ) : (
                     <Sparkles size={20} className="text-[#C9A84C]" />
                   )}
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{rev.productId?.name || 'Limited Edition'}</p>
                   <div className="flex gap-0.5">
                     {[...Array(5)].map((_, idx) => (
                       <Star key={idx} size={10} fill={idx < rev.rating ? "#C9A84C" : "none"} color={idx < rev.rating ? "#C9A84C" : "#D1D5DB"} strokeWidth={3} />
                     ))}
                   </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm italic leading-relaxed mb-8 font-light">
                 "{rev.comment || 'An exceptional acquisition experience.'}"
              </p>

              <div className="pt-6 border-t border-[#F9F5EF] flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{rev.userId?.username || 'Private Client'}</span>
                 <span className="text-[9px] text-gray-300 font-bold tracking-tighter uppercase">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Recent'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalReviews;
