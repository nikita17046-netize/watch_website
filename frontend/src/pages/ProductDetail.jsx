import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Shield, RefreshCw, Truck, ChevronRight, Star, Minus, Plus, Share2, Info, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlist as useLuxeWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { addToWishlist, isInWishlist } = useLuxeWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
        toast.error("Piece not found");
      }
      setLoading(false);
    };

    const fetchReviews = async () => {
      try {
        const res = await API.get(`/review/product/${id}`);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Reviews error", err);
      }
      setReviewsLoading(false);
    };

    const checkPurchase = async () => {
      if (!user) return;
      try {
        const res = await API.get('/order/my-orders');
        const userOrders = res.data.orders || [];
        const hasPurchased = userOrders.some(order => 
          order.status === 'delivered' && 
          order.items.some(item => (item.productId?._id === id || item.productId === id))
        );
        setIsPurchased(hasPurchased);
      } catch (err) {
        console.error("Purchase check failed", err);
      }
    };

    fetchProduct();
    fetchReviews();
    checkPurchase();
  }, [id, user]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (product) {
        try {
          const res = await API.get('/product/all', {
            params: { category: product.category }
          });
          setRelatedProducts(res.data.products.filter(p => p._id !== product._id).slice(0, 4));
        } catch (err) {
          console.error("Related fetch error", err);
        }
      }
    };
    fetchRelated();
  }, [product]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const success = await addToCart(product._id, quantity);
      if (success === false) {
        navigate('/login');
      }
    } catch (err) {
      console.error("Cart error", err);
    }
    setAdding(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to share your experience");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please share your thoughts first");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await API.post('/review/add', {
        productId: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setReviews([res.data.review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success("Review shared with the community");
    } catch (err) {
      toast.error("Unable to process review at this moment");
    }
    setSubmittingReview(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF8]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">Luxe</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFCF8] p-6 text-center">
      <h2 className="text-3xl font-playfair text-[#1A1A1A] mb-4">Product Not Found</h2>
      <Link to="/products" className="text-[#C9A84C] text-xs uppercase tracking-widest font-bold hover:underline">Back to Gallery</Link>
    </div>
  );

  return (
    <div className="bg-[#FFFCF8] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-10">
        
        {/* Simple Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
          <Link to="/" className="hover:text-[#C9A84C]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#C9A84C]">Watches</Link>
          <span>/</span>
          <span className="text-[#C9A84C]">{product.brand}</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#F0E6D2] mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Vibrant Image Showcase */}
            <div className="p-8 lg:p-12 bg-[#F9F5EF] flex flex-col gap-6">
              <motion.div 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-3xl overflow-hidden shadow-xl bg-white border-4 border-white"
              >
                <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              </motion.div>
              
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#C9A84C] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Clean Info & Action */}
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-8">
                <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest mb-4">
                  {product.brand} Original
                </span>
                <h1 className="text-4xl lg:text-5xl font-playfair font-medium text-[#1A1A1A] mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-3xl font-black text-[#C9A84C]">${product.price.toLocaleString()}</span>
                  <div className="flex items-center text-[#FFB800]">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" className="opacity-30" />
                    <span className="ml-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">({reviews.length} Experiences)</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {product.description}
                </p>
              </div>

              <div className="space-y-8">
                {/* Specs in a simple grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F9F5EF] rounded-2xl">
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">Category</span>
                    <span className="text-[11px] font-black uppercase text-[#1A1A1A]">{product.category}</span>
                  </div>
                  <div className="p-4 bg-[#F9F5EF] rounded-2xl">
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">Movement</span>
                    <span className="text-[11px] font-black uppercase text-[#1A1A1A]">Automatic</span>
                  </div>
                </div>

                {/* Selection Section */}
                <div className="flex items-center gap-6 p-2 bg-[#F9F5EF] rounded-full max-w-fit">
                  <div className="flex items-center gap-4 px-4">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-[#C9A84C] transition-colors"><Minus size={14} /></button>
                    <span className="text-sm font-black w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-[#C9A84C] transition-colors"><Plus size={14} /></button>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className="flex-1 bg-[#C9A84C] text-white py-5 px-8 text-xs uppercase tracking-[0.2em] font-black rounded-full hover:bg-[#1A1A1A] transition-all duration-500 shadow-xl shadow-[#C9A84C]/20 flex items-center justify-center gap-4 disabled:bg-gray-200 disabled:shadow-none"
                  >
                    {product.stock === 0 ? 'Out of Stock' : (adding ? 'Adding...' : <>Add To Shopping Bag <ShoppingBag size={18} /></>)}
                  </button>
                  <button 
                    onClick={() => addToWishlist(product)}
                    className={`w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center ${isInWishlist(product._id) ? 'bg-[#FF4D4D] border-[#FF4D4D] text-white shadow-lg' : 'border-[#F9F5EF] text-gray-300 hover:bg-[#FFE4E4] hover:border-[#FFE4E4] hover:text-[#FF4D4D]'}`}
                  >
                    <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} strokeWidth={2} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-8 border-t border-gray-100 grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Truck size={18} className="text-[#C9A84C]" />
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield size={18} className="text-[#C9A84C]" />
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Authentic</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw size={18} className="text-[#C9A84C]" />
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Easy Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ & REVIEW SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* FAQ Section */}
          <div className="space-y-10">
            <h3 className="text-4xl font-playfair text-[#1A1A1A]">Concierge <span className="italic font-light">FAQ.</span></h3>
            <div className="space-y-6">
              {[
                { q: "Is this piece authentic?", a: "Every timepiece in our registry is certified genuine and comes with original manufacturer documentation." },
                { q: "What is the warranty period?", a: "We provide a 2-year international warranty covering movement and manufacturing defects." },
                { q: "Can I return the product?", a: "Yes, we offer a 14-day complimentary return policy for items in their original, unworn condition." }
              ].map((faq, i) => (
                <div key={i} className="p-8 bg-white border border-[#F0E6D2] rounded-3xl">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#C9A84C] mb-4 flex items-center gap-4">
                    <Info size={16} /> {faq.q}
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed font-bold tracking-widest uppercase">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Section */}
          <div className="space-y-10">
            <h3 className="text-4xl font-playfair text-[#1A1A1A]">Client <span className="italic font-light">Gallery.</span></h3>
            
            {/* Add Review Form */}
            {user && isPurchased ? (
              <form onSubmit={handleSubmitReview} className="bg-white p-8 rounded-3xl border-2 border-dashed border-[#C9A84C]/30 mb-12">
                <div className="flex items-center gap-4 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setNewReview({ ...newReview, rating: s })} className="transition-transform hover:scale-125">
                      <Star size={20} fill={s <= newReview.rating ? "#C9A84C" : "none"} color={s <= newReview.rating ? "#C9A84C" : "#D1D5DB"} />
                    </button>
                  ))}
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-4">Rate your piece</span>
                </div>
                <textarea 
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this masterpiece..."
                  className="w-full bg-[#F9F5EF] rounded-2xl p-6 text-xs font-bold tracking-widest outline-none border-2 border-transparent focus:border-[#C9A84C] transition-all resize-none mb-6"
                  rows="3"
                />
                <button 
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-[#1A1A1A] text-white py-4 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-[#C9A84C] transition-all disabled:opacity-50"
                >
                  {submittingReview ? 'Transmitting...' : 'Post Experience'}
                </button>
              </form>
            ) : user && (
              <div className="bg-white p-10 rounded-3xl border border-[#F0E6D2] mb-12 text-center">
                 <div className="w-16 h-16 bg-[#F9F5EF] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C9A84C]">
                    <ShieldCheck size={32} />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] mb-3">Verification Required</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                   Experiences are reserved for verified collectors. <br/> 
                   Acquire this masterpiece to share your gallery documentation.
                 </p>
              </div>
            )}

            <div className="space-y-8">
              {reviewsLoading ? (
                <p className="text-center text-gray-300 italic">Curating reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#F0E6D2]">
                  <Sparkles size={32} className="text-[#C9A84C]/20 mx-auto mb-4" />
                  <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">No experiences shared yet. Be the first.</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={rev._id} className="bg-white p-8 rounded-3xl border border-[#F0E6D2] relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-1 text-[#C9A84C] mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} strokeWidth={3} />
                          ))}
                        </div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">{rev.userId?.username || 'Client'}</h5>
                      </div>
                      <span className="text-[8px] text-gray-300 font-bold tracking-tighter">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 italic leading-relaxed">"{rev.comment}"</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-40 pt-32 border-t border-gray-100">
            <div className="flex justify-between items-end mb-20">
              <div>
                <span className="text-[#C9A84C] uppercase tracking-[0.7em] text-[10px] font-black mb-4 block">Editorial Curation</span>
                <h3 className="text-5xl font-playfair font-black text-slate-900 italic">Discover Similar <span className="font-light">Masterpieces.</span></h3>
              </div>
              <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors border-b-2 border-gray-100 pb-2 mb-2">View Full Collection</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map((p, idx) => (
                <motion.div 
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="group"
                >
                  <Link to={`/product/${p._id}`}>
                    <div className="relative aspect-[4/5] rounded-[3rem] bg-[#F9F5EF] mb-8 overflow-hidden">
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700 flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <span className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-700">View Piece</span>
                      </div>
                    </div>
                    <div className="px-2">
                      <p className="text-[9px] font-black text-[#C9A84C] uppercase tracking-[0.4em] mb-2">{p.brand}</p>
                      <h4 className="text-lg font-playfair font-bold text-slate-900 group-hover:text-[#C9A84C] transition-colors mb-2">{p.name}</h4>
                      <p className="text-sm font-black text-slate-400">${p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
