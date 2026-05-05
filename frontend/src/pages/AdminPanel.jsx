import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
   LayoutDashboard, Package, ShoppingBag, Users, Gift, Ticket, MessageSquare,
   Settings, LogOut, Plus, Edit, Trash2, X, ChevronRight, TrendingUp,
   DollarSign, Briefcase, Search, Filter, Download, MoreVertical, Ban, CheckCircle2,
   AlertCircle, Sparkles, Star, Globe, Award, Zap, Compass, ArrowUpRight, Menu, Bell, ShieldCheck,
   Activity, Layers, Fingerprint, Eye, ArrowDownRight, Maximize2, Clock, Calendar, History, Monitor, Smartphone, Tablet, AlertTriangle, ShoppingCart, Heart,
   Info, Tag, Percent, Hash, FileText, MapPin, Truck, CreditCard, RefreshCcw, Flame, UserCheck, Mail, ShieldAlert, Brain, Cpu, Wand2, Megaphone, BellRing, Inbox
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status, type = 'order' }) => {
   const config = {
      order: {
         Delivered: { icon: <CheckCircle2 size={12} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
         'delivered': { icon: <CheckCircle2 size={12} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
         Cancelled: { icon: <AlertCircle size={12} />, color: 'bg-rose-50 text-rose-600 border-rose-100' },
         'cancelled': { icon: <AlertCircle size={12} />, color: 'bg-rose-50 text-rose-600 border-rose-100' },
         Pending: { icon: <Clock size={12} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
         'pending': { icon: <Clock size={12} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
         Shipped: { icon: <Truck size={12} />, color: 'bg-indigo-50 text-luxury-gold border-indigo-100' },
         'shipped': { icon: <Truck size={12} />, color: 'bg-indigo-50 text-luxury-gold border-indigo-100' },
         Processing: { icon: <Activity size={12} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
         'processing': { icon: <Activity size={12} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
      },
      user: {
         active: { icon: <UserCheck size={12} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
         suspended: { icon: <Ban size={12} />, color: 'bg-rose-50 text-rose-600 border-rose-100' },
      },
      inventory: {
         instock: { icon: <Package size={12} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
         lowstock: { icon: <AlertTriangle size={12} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
         outofstock: { icon: <ShieldAlert size={12} />, color: 'bg-rose-50 text-rose-600 border-rose-100' },
      }
   };

   const statusMap = config[type] || config.order;
   const style = statusMap[status] || (type === 'inventory' ? statusMap.instock : statusMap.Pending);

   return (
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.color} shadow-sm w-fit`}>
         {style.icon}
         {status}
      </div>
   );
};

const AdminPanel = () => {
   const { logout } = useAuth();
   const [activeTab, setActiveTab] = useState('dashboard');
   const [stats, setStats] = useState({
      totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0,
      pendingOrders: 0, deliveredOrders: 0, cancelledOrders: 0, averageOrderValue: 0
   });
   const [recentOrders, setRecentOrders] = useState([]);
   const [topProducts, setTopProducts] = useState([]);
   const [salesData, setSalesData] = useState([]);
   const [products, setProducts] = useState([]);
   const [users, setUsers] = useState([]);
   const [orders, setOrders] = useState([]);
   const [inquiries, setInquiries] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedCategory, setSelectedCategory] = useState('All');
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [selectedOrder, setSelectedOrder] = useState(null);
   const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
   const [newProduct, setNewProduct] = useState({
      name: '', description: '', stock: 0, price: 0, discount: 0,
      isNewProduct: true, sku: '', images: [''], brand: '', category: ''
   });

   // Offer State for specialized boxes
   const [offers, setOffers] = useState([
      { id: 1, title: 'Grand Rolex Sale', discount: 25, product: 'Rolex Day-Date', expiry: '2026-06-10' },
      { id: 2, title: 'Elite Member Deal', discount: 40, product: 'Titan Stellar', expiry: '2026-05-20' },
      { id: 3, title: 'New Arrival Promo', discount: 15, product: 'All New Assets', expiry: '2026-05-30' }
   ]);
   const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
   const [editingOffer, setEditingOffer] = useState(null);
   const [newOffer, setNewOffer] = useState({ title: '', discount: 0, product: '', expiry: '' });

   // FAQ State
   const [faqs, setFaqs] = useState([]);
   const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
   const [editingFaq, setEditingFaq] = useState(null);
   const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General', order: 0 });
   const [trackingForm, setTrackingForm] = useState({ trackingId: '', courierPartner: 'BlueDart' });
   const [searchTerm, setSearchTerm] = useState("");
   const [isDarkMode, setIsDarkMode] = useState(false);
   const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
   const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });
   const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });

   const categories = ['All', 'New Arrivals', 'Rolex', 'Titan', ...new Set(products?.map(p => p?.category).filter(Boolean))];

   const filteredProducts = products?.filter(p => {
      const matchesCategory = selectedCategory === 'All' ||
         (selectedCategory === 'New Arrivals' && p?.isNewProduct) ||
         (selectedCategory === 'Rolex' && p?.brand === 'Rolex') ||
         (selectedCategory === 'Titan' && p?.brand === 'Titan') ||
         p?.category === selectedCategory;

      const matchesSearch = !searchTerm ||
         p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p?.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
   }) || [];

   const filteredOrders = orders?.filter(o => {
      const term = searchTerm.toLowerCase();
      return !searchTerm ||
         o._id?.toLowerCase().includes(term) ||
         o.userId?.username?.toLowerCase().includes(term) ||
         o.trackingId?.toLowerCase().includes(term);
   }) || [];

   const filteredUsers = (Array.isArray(users) ? users : [])?.filter(u => {
      const term = searchTerm.toLowerCase();
      return !searchTerm ||
         u.username?.toLowerCase().includes(term) ||
         u.email?.toLowerCase().includes(term);
   }) || [];

   const formatPrice = (price) => {
      if (price === undefined || price === null || isNaN(Number(price))) return '0';
      return Number(price).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
   };

   const fetchAllData = useCallback(async () => {
      setLoading(true);
      
      // 1. Fetch Stats Priority (Dashboard basic view)
      try {
         const statsRes = await API.get('/admin/stats');
         setStats(statsRes.data.stats || {});
         setSalesData(statsRes.data.salesData || []);
         setRecentOrders(statsRes.data.recentOrders || []);
         setTopProducts(statsRes.data.topProducts || []);
      } catch (err) {
         console.error('Stats sync FAILED:', err);
      } finally {
         setLoading(false); // Hide global loader after stats
      }

      // 2. Fetch Other Data in Background (Non-blocking)
      const fetchBackground = async () => {
         try {
            const [productsRes, usersRes, ordersRes, faqsRes, inquiriesRes] = await Promise.allSettled([
               API.get('/product/all'),
               API.get('/admin/users'),
               API.get('/admin/orders'),
               API.get('/admin/faqs'),
               API.get('/contact/all')
            ]);

            if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data.products || []);
            if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data.users || []);
            if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data.orders || []);
            if (faqsRes.status === 'fulfilled') setFaqs(faqsRes.value.data || []);
            if (inquiriesRes.status === 'fulfilled') setInquiries(inquiriesRes.value.data || []);

            if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data.products || []);
            if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data.users || usersRes.value.data || []);
            if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data.orders || []);
            if (faqsRes.status === 'fulfilled') setFaqs(Array.isArray(faqsRes.value.data) ? faqsRes.value.data : []);
         } catch (err) {
            console.error('Background sync encounterd issues');
         }
      };

      fetchBackground();
   }, []);


   useEffect(() => {
      fetchAllData();
   }, [fetchAllData]);

   const handleUpdateOrderStatus = async (orderId, newStatus) => {
      try {
         const payload = { status: newStatus };
         if (newStatus === 'shipped') {
            payload.trackingId = trackingForm.trackingId;
            payload.courierPartner = trackingForm.courierPartner;
         }
         await API.post(`/admin/orders/status/${orderId}`, payload);
         toast.success(`Order status migrated to ${newStatus}`);
         if (selectedOrder) setSelectedOrder({ ...selectedOrder, ...payload });
         fetchAllData();
      } catch (err) {
         toast.error("Authorization check failed");
      }
   };

    const handleAddProduct = async (e) => {
       e.preventDefault();
       
       // Client-side validation
       if (!newProduct.name || newProduct.name.length < 3) {
          return toast.error('Name must be at least 3 characters');
       }
       if (!newProduct.description || newProduct.description.length < 10) {
          return toast.error('Description must be at least 10 characters');
       }
       if (!newProduct.sku) {
          return toast.error('Product SKU is required');
       }
       if (!newProduct.brand) {
          return toast.error('Boutique Brand is required');
       }
       if (!newProduct.category) {
          return toast.error('Registry Category is required');
       }
       if (!newProduct.images[0]) {
          return toast.error('Gallery Media URL is required');
       }

       try {
          const res = await API.post('/product/add', newProduct);
          toast.success(res.data.message || 'Product Asset Authorized');
          setIsAddModalOpen(false);
          setNewProduct({
             name: '', description: '', stock: 0, price: 0, discount: 0,
             isNewProduct: true, sku: '', images: [''], brand: '', category: ''
          });
          fetchAllData();
       } catch (err) {
          toast.error(err.response?.data?.message || 'Injection failed');
       }
    };

   const [supportTickets, setSupportTickets] = useState([
      { id: 'TK-892', user: 'Rahul Sharma', subject: 'Payment Verification Pending', priority: 'High', date: '2 hours ago' },
      { id: 'TK-451', user: 'Ananya Iyer', subject: 'Order tracking link broken', priority: 'Medium', date: '5 hours ago' },
      { id: 'TK-120', user: 'Vikram Singh', subject: 'Requesting SKU availability', priority: 'Low', date: '1 day ago' },
   ]);

   const handleResolveTicket = (id) => {
      setSupportTickets(supportTickets.filter(t => t.id !== id));
      toast.success(`Ticket ${id} marked as RESOLVED`);
   };

   const handleSaveOffer = (e) => {
      e.preventDefault();
      if (editingOffer) {
         setOffers(offers.map(o => o.id === editingOffer.id ? { ...newOffer, id: o.id } : o));
         toast.success('Offer Protocol UPDATED');
      } else {
         const offer = { ...newOffer, id: Date.now() };
         setOffers([offer, ...offers]);
         toast.success('New Offer Box ACTIVATED');
      }
      setIsOfferModalOpen(false);
      setEditingOffer(null);
      setNewOffer({ title: '', discount: 0, product: '', expiry: '' });
   };

   const handleSaveFaq = async (e) => {
      e.preventDefault();
      try {
         if (editingFaq) {
            await API.patch(`/admin/faqs/${editingFaq._id}`, newFaq);
            toast.success('FAQ Protocol UPDATED');
         } else {
            await API.post('/admin/faqs', newFaq);
            toast.success('New FAQ Entry AUTHORIZED');
         }
         setIsFaqModalOpen(false);
         setEditingFaq(null);
         setNewFaq({ question: '', answer: '', category: 'General', order: 0 });
         fetchAllData();
      } catch (err) {
         toast.error('FAQ Injection FAILED');
      }
   };

   const handleDeleteFaq = async (id) => {
      try {
         await API.delete(`/admin/faqs/${id}`);
         toast.success('FAQ Deleted from Registry');
         fetchAllData();
      } catch (err) {
         toast.error('Deletion Protocol BLOCKED');
      }
   };



   const handleAddAdmin = async (e) => {
      e.preventDefault();
      try {
         await API.post('/user/register', { ...newAdmin, role: 'admin' });
         toast.success('New Administrator AUTHORIZED');
         setNewAdmin({ username: '', email: '', password: '' });
      } catch (err) {
         toast.error(err.response?.data?.message || 'Admin Injection FAILED');
      }
   };

   const handleChangePassword = async (e) => {
      e.preventDefault();
      try {
         await API.put('/user/change-password', passwordForm);
         toast.success('Security Protocol UPDATED');
         setPasswordForm({ oldPassword: '', newPassword: '' });
      } catch (err) {
         toast.error(err.response?.data?.message || 'Update FAILED');
      }
   };

   const handleToggleUserStatus = async (id) => {
      try {
         const res = await API.patch(`/admin/user/${id}/status`);
         toast.success(`User is now ${res.data.status.toUpperCase()}`);
         fetchAllData();
      } catch (err) {
         toast.error('Status rotation FAILED');
      }
   };

   const handleUpdateRole = async (id, newRole) => {
      try {
         await API.put(`/admin/user/${id}/role`, { role: newRole });
         toast.success(`Access Level ELEVATED to ${newRole.toUpperCase()}`);
         fetchAllData();
      } catch (err) {
         toast.error('Authorization update BLOCKED');
      }
   };

   const [userInsights, setUserInsights] = useState(null);
   const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);

   const handleFetchUserInsights = async (id) => {
      console.log('Initiating Intelligence Retrieval for ID:', id);
      try {
         const res = await API.get(`/test-insights/${id}`);
         console.log('Intelligence Profile DATA:', res.data);
         if (res.data) {
            setUserInsights(res.data);
            setIsInsightsModalOpen(true);
            // alert('Success: Data Received. Opening Popup...');
         }
      } catch (err) {
         console.error('Intelligence Retrieval FAILED:', err);
         const errMsg = err.response?.data?.message || err.message || 'Unknown Error';
         toast.error(`FAILED: ${errMsg}`);
      }
   };


   return (
      <div className={`min-h-screen flex font-inter transition-colors duration-500 ${isDarkMode ? 'bg-[#0F1115] text-white' : 'bg-[#F9FAFB] text-slate-800'}`}>

         {/* SIDEBAR */}
         <aside className={`w-72 flex flex-col fixed h-screen z-50 shadow-sm border-r transition-colors duration-500 ${isDarkMode ? 'border-white/5 bg-[#0A0C10]' : 'border-slate-200 bg-[#1C2536]'}`}>
            <div className="p-8">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-luxury-gold rounded-xl flex items-center justify-center shadow-lg">
                     <LayoutDashboard className="text-white" size={24} />
                  </div>
                  <div>
                     <h1 className="text-white font-bold text-lg tracking-tight uppercase tracking-widest">LUXE</h1>
                     <p className="text-slate-400 text-[10px] font-bold">CONTROL PANEL v2.0</p>
                  </div>
               </div>
            </div>

            <nav className="flex-grow p-4 space-y-1">
               {[
                  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, link: '/admin' },
                  { id: 'inventory', label: 'Inventory Registry', icon: Package, link: null },
                  { id: 'orders', label: 'Fulfillment Desk', icon: ShoppingBag, link: null },
                  { id: 'clients', label: 'User Panel', icon: Users, link: null },
                  { id: 'watchlist', label: 'Watchlist Registry', icon: Eye, link: null },
                  { id: 'coupons', label: 'Offer Terminal', icon: Ticket },
                  { id: 'faqs', label: 'FAQ Manager', icon: FileText },
                  { id: 'support', label: 'Support Desk', icon: MessageSquare },
                  { id: 'settings', label: 'Configuration', icon: Settings },
                  { id: 'logistics', label: 'Logistics Hub', icon: Truck, link: '/logistics', special: true },
                  { id: 'neural', label: 'Neural Intelligence', icon: Brain, special: true },

               ].map((item) => (
                  item.link ? (
                     <Link
                        key={item.id}
                        to={item.link}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${item.special ? 'text-indigo-400 border-l-4 border-luxury-gold bg-luxury-gold/5' : activeTab === item.id ? 'text-luxury-gold bg-white/5 border-l-4 border-luxury-gold pl-3' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                     >
                        <item.icon size={18} />
                        {item.label}
                     </Link>
                  ) : (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${activeTab === item.id ? 'text-luxury-gold bg-white/5 border-l-4 border-luxury-gold pl-3' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                     >
                        <item.icon size={18} />
                        {item.label}
                     </button>
                  )
               ))}
            </nav>

            <div className="p-4 space-y-1 border-t border-white/5">
               <Link to="/" className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5">
                  <Globe size={18} /> Storefront
               </Link>
               <button 
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 transition-all"
               >
                  <LogOut size={18} /> Exit
               </button>
            </div>
         </aside>

         {/* MAIN CONTENT */}
         <main className="flex-grow ml-72">
            <header className={`h-16 px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-500 ${isDarkMode ? 'bg-[#0F1115]/80 backdrop-blur-md border-b border-white/5' : 'bg-white border-b border-slate-200'}`}>
               <div className="flex items-center gap-4 group">
                  <div className="relative flex items-center">
                     <Search size={16} className={`absolute left-3 transition-colors ${searchTerm ? 'text-luxury-gold' : 'text-slate-400 group-focus-within:text-luxury-gold'}`} />
                     <input
                        type="text"
                        placeholder="Global search across all registries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`text-[11px] font-bold rounded-xl py-2.5 pl-10 pr-4 focus:ring-4 focus:ring-luxury-gold/5 focus:border-indigo-200 outline-none w-80 transition-all placeholder:text-slate-400 placeholder:font-medium ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`}
                     />
                     {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 text-slate-300 hover:text-slate-500"><X size={14} /></button>
                     )}
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
                     {/* Theme Toggle */}
                     <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 ${isDarkMode ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' : 'bg-slate-50 border-slate-100 text-luxury-gold hover:bg-indigo-50'}`}
                     >
                        {isDarkMode ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5 }}><Zap size={18} /></motion.div> : <motion.div animate={{ rotate: 0 }}><Compass size={18} /></motion.div>}
                        <span className="text-[9px] font-black uppercase tracking-widest">{isDarkMode ? 'Night Vision' : 'Daylight'}</span>
                     </button>

                     <Link to="/logistics" className="flex items-center gap-3 group ml-2">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg group-hover:bg-luxury-gold group-hover:text-white transition-all shadow-sm ${isDarkMode ? 'bg-white/5 text-indigo-400 border border-white/5' : 'bg-indigo-50 text-luxury-gold'}`}>
                           <Truck size={16} />
                        </div>
                     </Link>
                  </div>

                  <div className={`flex items-center gap-3 ml-4 border-l pl-4 ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
                     <div className="text-right">
                        <p className={`text-[10px] font-black leading-tight uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Chief Administrator</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Operational Hub</p>
                     </div>
                     <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center border-2 border-white shadow-md overflow-hidden group hover:scale-105 transition-all cursor-pointer">
                        <img src={`https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&bold=true`} alt="" />
                     </div>
                  </div>
               </div>
            </header>

            <div className="p-8 max-w-[1600px] mx-auto">
               <AnimatePresence mode="wait">
                  {loading ? (
                     <motion.div
                        key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="h-[70vh] flex flex-col items-center justify-center gap-8"
                     >
                        <div className="relative w-20 h-20">
                           <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                           <div className="absolute inset-0 border-4 border-t-luxury-gold rounded-full animate-spin"></div>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[1em] text-luxury-gold animate-pulse">Syncing Protocols</p>
                     </motion.div>
                  ) : (
                     <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                     >
                        <>
                        {activeTab === 'neural' && (
                           <div className="space-y-10">
                              <div className="flex items-center justify-between">
                                 <div>
                                    <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-none">Global Intelligence</h2>
                                    <p className="text-[11px] text-luxury-gold font-black uppercase tracking-[0.4em] mt-3 animate-pulse flex items-center gap-2"><Sparkles size={14} /> System Core Operational</p>
                                 </div>
                                 <button className="px-10 py-5 bg-luxury-gold text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-slate-900 transition-all shadow-2xl shadow-luxury-gold/30 group">
                                    <Wand2 size={16} className="group-hover:rotate-12 transition-transform" /> Trigger Global Optimization
                                 </button>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                 {/* MARKETING AI SECTION */}
                                 <div className="p-10 bg-white rounded-[4rem] border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-5 mb-10">
                                       <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center"><Megaphone size={24} /></div>
                                       <div>
                                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Marketing AI</h3>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Campaign Outreach Logic</p>
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                       {[
                                          { label: 'Ad Performance', value: '4.2x ROI', color: 'text-luxury-gold' },
                                          { label: 'Social Reach', value: '180K+', color: 'text-rose-600' },
                                          { label: 'Conv. Rate', value: '3.8%', color: 'text-emerald-600' },
                                          { label: 'CAC', value: '₹420', color: 'text-amber-600' }
                                       ].map((m, i) => (
                                          <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                                             <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{m.label}</p>
                                             <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 {/* INVENTORY GUARD (LOW STOCK NOTIFICATIONS) */}
                                 <div className="p-10 bg-[#0F172A] rounded-[4rem] shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-full h-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between mb-10 relative z-10">
                                       <div className="flex items-center gap-5">
                                          <div className="w-12 h-12 bg-white/10 text-luxury-gold rounded-2xl flex items-center justify-center"><BellRing size={24} /></div>
                                          <div>
                                             <h3 className="text-xl font-black text-white tracking-tight leading-none uppercase italic">Inventory Guard</h3>
                                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Low Stock Protocol</p>
                                          </div>
                                       </div>
                                       <div className="px-5 py-2 bg-emerald-500/10 text-luxury-gold rounded-full text-[10px] font-black uppercase tracking-widest">Active Scan</div>
                                    </div>

                                    <div className="space-y-4 relative z-10 max-h-[160px] overflow-y-auto no-scrollbar">
                                       {products.filter(p => p.stock <= 5).length > 0 ? (
                                          products.filter(p => p.stock <= 5).map((p, i) => (
                                             <div key={i} className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-black text-xs">{p.stock}</div>
                                                <div className="flex-grow">
                                                   <p className="text-[11px] text-white font-black uppercase tracking-widest truncate max-w-[150px]">{p.name}</p>
                                                   <p className="text-[8px] text-rose-400 font-bold uppercase tracking-widest mt-1">Refill Required</p>
                                                </div>
                                                <button onClick={() => setActiveTab('inventory')} className="p-2 bg-luxury-gold rounded-lg text-white"><ChevronRight size={14} /></button>
                                             </div>
                                          ))
                                       ) : (
                                          <div className="text-center py-10 opacity-30">
                                             <Inbox className="text-white mx-auto mb-4" size={32} />
                                             <p className="text-white text-[10px] font-black uppercase tracking-widest">No Critical Alerts</p>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-[#0A0C10] p-12 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-[40%] h-full bg-luxury-gold/5 blur-[100px] rounded-full animate-pulse" />
                                 <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                                    <div>
                                       <div className="flex items-center gap-4 mb-8">
                                          <div className="w-12 h-12 bg-luxury-gold/20 text-indigo-400 rounded-xl flex items-center justify-center"><Fingerprint size={24} /></div>
                                          <div>
                                             <h3 className="text-white text-xl font-black tracking-tight">Neural Registry Scan</h3>
                                             <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Cross-Database Analytics Stream</p>
                                          </div>
                                       </div>
                                       <div className="space-y-6">
                                          {[
                                             { label: 'Inventory Leakage', status: '0.0%', color: 'bg-emerald-500' },
                                             { label: 'Conversion Lift', status: '+4.2%', color: 'bg-luxury-gold' },
                                             { label: 'Risk Anomaly', status: 'Low', color: 'bg-blue-500' }
                                          ].map((item, i) => (
                                             <div key={i} className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                   <span className="text-slate-400">{item.label}</span>
                                                   <span className="text-white">{item.status}</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                   <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2, delay: i * 0.3 }} className={`h-full ${item.color} shadow-[0_0_10px_rgba(99,102,241,0.5)]`} />
                                                </div>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-10 bg-white/5 rounded-[3rem] border border-white/10 relative group cursor-pointer">
                                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="relative w-40 h-40">
                                          <div className="absolute inset-0 border-2 border-luxury-gold/20 rounded-full" />
                                          <div className="absolute inset-2 border border-indigo-400/10 rounded-full" />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                             <Brain className="text-indigo-400" size={48} />
                                          </div>
                                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-luxury-gold rounded-full shadow-[0_0_20px_#6366f1]" />
                                       </motion.div>
                                       <div className="text-center mt-10">
                                          <p className="text-white text-[12px] font-black uppercase tracking-[0.4em] mb-2">Neural Core v2.0</p>
                                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Processing Storefront Node</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {activeTab === 'support' && (
                           <div className="space-y-10 pb-20">
                              <div className="flex items-center justify-between">
                                 <div>
                                    <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-none">Support Desk</h2>
                                    <p className="text-[11px] text-luxury-gold font-black uppercase tracking-[0.4em] mt-3 flex items-center gap-2"><MessageSquare size={14} /> Client Communication Registry</p>
                                 </div>
                              </div>

                              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                 <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50">
                                       <tr>
                                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Identity</th>
                                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquiry Nature</th>
                                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentation</th>
                                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Date</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                       {inquiries.length > 0 ? inquiries.map((inq) => (
                                          <tr key={inq._id} className="hover:bg-slate-50/50 transition-all">
                                             <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                   <span className="text-xs font-black text-slate-900 uppercase">{inq.name}</span>
                                                   <span className="text-[10px] font-bold text-slate-400">{inq.email}</span>
                                                </div>
                                             </td>
                                             <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">{inq.subject}</span>
                                             </td>
                                             <td className="px-8 py-6 max-w-xs">
                                                <p className="text-[11px] text-slate-600 leading-relaxed italic truncate hover:text-clip hover:whitespace-normal cursor-help">"{inq.message}"</p>
                                             </td>
                                             <td className="px-8 py-6">
                                                <select 
                                                   value={inq.status}
                                                   onChange={async (e) => {
                                                      try {
                                                         await API.patch(`/contact/status/${inq._id}`, { status: e.target.value });
                                                         toast.success('Inquiry status updated');
                                                         fetchAllData();
                                                      } catch (err) {
                                                         toast.error('Failed to update status');
                                                      }
                                                   }}
                                                   className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border outline-none ${inq.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : inq.status === 'read' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                                                >
                                                   <option value="pending">Pending</option>
                                                   <option value="read">Read</option>
                                                   <option value="resolved">Resolved</option>
                                                </select>
                                             </td>
                                             <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(inq.createdAt).toLocaleDateString()}</span>
                                             </td>
                                          </tr>
                                       )) : (
                                          <tr>
                                             <td colSpan="5" className="px-8 py-20 text-center">
                                                <Inbox size={40} className="text-slate-200 mx-auto mb-4" />
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Active Inquiries Found</p>
                                             </td>
                                          </tr>
                                       )}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        )}

                        {activeTab === 'dashboard' && (
                           <div className="space-y-8 pb-10">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {[
                                    { label: 'GROSS REVENUE', value: `₹${formatPrice(stats?.totalRevenue)}`, icon: Briefcase, color: "bg-luxury-gold" },
                                    { label: 'TOTAL CUSTOMERS', value: stats?.totalUsers || 0, icon: Users, color: "bg-emerald-500" },
                                    { label: 'ACTIVE INVENTORY', value: products?.length || 0, icon: Package, color: "bg-blue-500" },
                                    { label: 'AVG ORDER VALUE', value: `₹${formatPrice(stats?.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}`, icon: Layers, color: "bg-amber-500" },
                                 ].map((stat, i) => (
                                    <div key={i} className={`p-6 rounded-[2rem] border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}>
                                       <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                                          <stat.icon size={24} />
                                       </div>
                                       <h3 className="text-slate-400 text-[10px] font-black tracking-widest uppercase mb-1">{stat.label}</h3>
                                       <p className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
                                    </div>
                                 ))}
                              </div>

                              {/* STRATEGIC FEATURE HUB */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {[
                                    { label: 'Inventory Alert', value: '2 Rare Assets', sub: 'Low Stock Protocol', icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", action: () => setActiveTab('inventory') },
                                    { label: 'Market Demand', value: 'Rolex Day-Date', sub: 'Most Wishlisted', icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", action: () => { setActiveTab('inventory'); toast.success('Market Pulse: Rolex is Trending'); } },
                                    { label: 'Global Pricing', value: 'Valuation Active', sub: 'Bulk Price Modifier', icon: DollarSign, color: "text-luxury-gold", bg: "bg-luxury-gold/10", action: () => setIsBulkPriceModalOpen(true) },
                                    { label: 'Billing Terminal', value: 'Ready to Sync', sub: 'PDF Invoice Generator', icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10", action: () => setActiveTab('orders') },
                                 ].map((feature, i) => (
                                    <div key={i} onClick={feature.action} className={`p-6 rounded-[2.5rem] border group cursor-pointer transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-luxury-gold/10 hover:border-luxury-gold/20' : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-luxury-gold/10'}`}>
                                       <div className="flex justify-between items-start mb-6">
                                          <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6`}>
                                             <feature.icon size={22} />
                                          </div>
                                          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/10 text-white/40' : 'bg-slate-50 text-slate-400'}`}>Strategic</div>
                                       </div>
                                       <h4 className="text-slate-400 text-[10px] font-black tracking-widest uppercase mb-1">{feature.label}</h4>
                                       <p className={`text-lg font-black tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{feature.value}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{feature.sub}</p>
                                    </div>
                                 ))}
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                 <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <div className="mb-10">
                                       <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue Trajectory</h3>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">7-Day Global Sales Analysis</p>
                                    </div>
                                    <div className="h-80">
                                       <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={salesData}>
                                             <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                             </defs>
                                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                             <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={15} />
                                             <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                             <Tooltip />
                                             <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={5} fill="url(#colorSales)" />
                                          </AreaChart>
                                       </ResponsiveContainer>
                                    </div>
                                 </div>

                                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                                    <div className="mb-8">
                                       <h3 className="text-lg font-black text-slate-800 tracking-tight">Logistics Status</h3>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Order Lifecycle</p>
                                    </div>
                                    <div className="flex-grow flex flex-col items-center justify-center">
                                       <div className="relative w-full h-64">
                                          <ResponsiveContainer width="100%" height="100%">
                                             <PieChart>
                                                <Pie
                                                   data={[
                                                      { name: 'Delivered', value: stats?.deliveredOrders || 0 },
                                                      { name: 'Processing', value: stats?.pendingOrders || 0 },
                                                      { name: 'Cancelled', value: stats?.cancelledOrders || 0 },
                                                   ].filter(d => d.value > 0)}
                                                   cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none"
                                                >
                                                   <Cell fill="#10b981" />
                                                   <Cell fill="#6366f1" />
                                                   <Cell fill="#ef4444" />
                                                </Pie>
                                                <Tooltip />
                                             </PieChart>
                                          </ResponsiveContainer>
                                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                             <p className="text-3xl font-black text-slate-800 leading-none">{stats?.totalOrders || 0}</p>
                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Orders</p>
                                          </div>
                                       </div>
                                       <div className="w-full space-y-3 mt-8">
                                          {[
                                             { label: 'Delivered', value: stats?.deliveredOrders, color: 'bg-emerald-500' },
                                             { label: 'Processing', value: stats?.pendingOrders, color: 'bg-luxury-gold' },
                                             { label: 'Cancelled', value: stats?.cancelledOrders, color: 'bg-red-500' },
                                          ].map((item, i) => (
                                             <div key={i} className="flex justify-between items-center px-4 py-2.5 bg-slate-50/50 rounded-2xl border border-slate-50">
                                                <div className="flex items-center gap-2.5">
                                                   <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                                                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-800">{item.value || 0}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">Recent Transactions</h3>
                                    <div className="space-y-4">
                                       {recentOrders?.slice(0, 5).map((order) => (
                                          <div key={order?._id} onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }} className="flex items-center justify-between p-5 bg-slate-50/30 rounded-[2rem] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group cursor-pointer">
                                             <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-luxury-gold group-hover:text-white transition-all">
                                                   <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                   <p className="text-xs font-black text-slate-800 uppercase tracking-tight">#{order?._id?.slice(-8).toUpperCase()}</p>
                                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                             </div>
                                             <div className="text-right">
                                                <p className="text-sm font-black text-slate-900">₹{formatPrice(order?.totalAmount)}</p>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${order?.status === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'}`}>{order?.status}</span>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">Portfolio Highlights</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                       {topProducts?.slice(0, 4).map((p) => {
                                          const product = p.productInfo || p;
                                          return (
                                             <div key={product?._id} className="p-6 bg-slate-50/50 rounded-3xl flex flex-col items-center text-center group">
                                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm mb-4 group-hover:scale-105 transition-all">
                                                   <img src={product?.images?.[0]} alt="" className="w-full h-full object-contain drop-shadow-md" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-800 truncate w-full px-2 uppercase">{product?.name}</p>
                                                <p className="text-xs font-black text-luxury-gold mt-2">₹{formatPrice(product?.price)}</p>
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </div>
                              </div>
                           </div>
                     )}

                        {activeTab === 'inventory' && (
                           <div className="space-y-6">
                              <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                 <div className="flex items-center gap-3">
                                    {categories?.map(cat => (
                                       <button
                                          key={cat} onClick={() => setSelectedCategory(cat)}
                                          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-luxury-gold text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                                       >{cat}</button>
                                    ))}
                                 </div>
                                 <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-luxury-gold transition-all flex items-center gap-3">
                                    <Plus size={16} /> Add Asset
                                 </button>
                              </div>
                              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                 <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                                       <tr><th className="p-6 pl-10">Asset</th><th className="p-6">Class</th><th className="p-6">Value</th><th className="p-6">Units</th><th className="p-6 text-center pr-10">Protocol</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                       {filteredProducts?.map((p) => (
                                          <tr key={p?._id} className="hover:bg-slate-50/50 transition-all group">
                                             <td className="p-6 pl-10 flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl border border-slate-100 p-2 bg-white shadow-sm">
                                                   <img src={p?.images?.[0]} className="w-full h-full object-contain" alt="" />
                                                </div>
                                                <div>
                                                   <div className="flex items-center gap-2">
                                                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{p?.name}</p>
                                                      {p?.isNewProduct && <span className="bg-luxury-gold text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">NEW</span>}
                                                   </div>
                                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p?.brand}</p>
                                                </div>
                                             </td>
                                             <td className="p-6"><span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{p?.category}</span></td>
                                             <td className="p-6 text-sm font-black text-slate-900 tracking-tighter">₹{formatPrice(p?.price)}</td>
                                             <td className="p-6">
                                                <StatusBadge 
                                                   status={p?.stock > 10 ? 'instock' : p?.stock > 0 ? 'lowstock' : 'outofstock'} 
                                                   type="inventory" 
                                                />
                                                <span className="text-[10px] font-black uppercase text-slate-400 mt-1 block">{p?.stock} Units</span>
                                             </td>
                                             <td className="p-6 text-center pr-10"><div className="flex justify-center gap-3"><button className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-luxury-gold shadow-sm"><Edit size={16} /></button><button className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm"><Trash2 size={16} /></button></div></td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        )}

                        {activeTab === 'clients' && (
                           <div className="space-y-8">
                              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                                 <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">User Panel</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Authorized User Registry</p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                       <Users size={18} className="text-luxury-gold" />
                                       <span className="text-xs font-black text-slate-800">{users.length} Total Users</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                 <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                                       <tr><th className="p-8 pl-12">Client Profile</th><th className="p-8">Acquisition Stats</th><th className="p-8">Join Date</th><th className="p-8">Access & Status</th><th className="p-8 text-center pr-12">Action</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                       {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                          <tr key={u?._id} className="hover:bg-slate-50/50 group">
                                             <td className="p-8 pl-12">
                                                <div className="flex items-center gap-4">
                                                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-luxury-gold border border-indigo-100 text-[11px] font-black uppercase shadow-sm">
                                                      {u?.username?.[0] || 'U'}
                                                   </div>
                                                   <div>
                                                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{u?.username || 'Unknown Profile'}</p>
                                                      <p className="text-[9px] text-slate-400 font-bold lowercase">{u?.email}</p>
                                                   </div>
                                                </div>
                                             </td>
                                             <td className="p-8">
                                                <div className="space-y-1">
                                                   <p className="text-xs font-black text-slate-800">₹{formatPrice(u?.totalSpent)}</p>
                                                   <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">{u?.orderCount || 0} Orders</p>
                                                </div>
                                             </td>
                                             <td className="p-8">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                   <Calendar size={14} className="text-indigo-400" />
                                                   <p className="text-[11px] font-black">{u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Historical'}</p>
                                                </div>
                                             </td>
                                             <td className="p-8">
                                                <div className="flex flex-col gap-2">
                                                   <select 
                                                      value={u?.role || 'user'} 
                                                      onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                                                      className="bg-transparent text-[9px] font-black uppercase tracking-widest text-slate-600 focus:outline-none border-b border-slate-100 cursor-pointer"
                                                   >
                                                      <option value="user">Normal User</option>
                                                      <option value="manager">Manager</option>
                                                      <option value="admin">Administrator</option>
                                                   </select>
                                                   <StatusBadge status={u?.status || 'active'} type="user" />
                                                </div>
                                             </td>
                                             <td className="p-8 text-center pr-12">
                                                <div className="flex justify-center gap-2">
                                                   <button onClick={() => handleFetchUserInsights(u._id)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-luxury-gold hover:bg-indigo-50 shadow-sm transition-all">
                                                      <Eye size={16} />
                                                   </button>
                                                   <button onClick={() => handleToggleUserStatus(u._id)} className={`w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm transition-all ${u?.status === 'suspended' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-rose-500 hover:bg-rose-50'}`}>
                                                      {u?.status === 'suspended' ? <UserCheck size={16} /> : <Ban size={16} />}
                                                   </button>
                                                   <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-luxury-gold shadow-sm transition-all"><MessageSquare size={16} /></button>
                                                </div>
                                             </td>
                                          </tr>
                                       )) : (
                                          <tr>
                                             <td colSpan="5" className="p-20 text-center text-slate-400 font-black uppercase tracking-widest italic">
                                                No users found in registry
                                             </td>
                                          </tr>
                                       )}
                                    </tbody>
                                 </table>
                           </div>
                        </div>
                     )}

                     {activeTab === 'watchlist' && (
                        <div className="space-y-8">
                           <div className="bg-[#0A0C10] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/10 blur-[100px] rounded-full" />
                              <div className="relative z-10 flex justify-between items-center">
                                 <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Intelligence Ledger</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Behavioral Registry & Acquisition Tracking</p>
                                 </div>
                                 <div className="flex gap-4">
                                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                       <Sparkles size={18} className="text-indigo-400" />
                                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Scan Active</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                                    <tr>
                                       <th className="p-8 pl-12">User Profile</th>
                                       <th className="p-8">Acquisitions (Purchased)</th>
                                       <th className="p-8">Cart Registry</th>
                                       <th className="p-8">Watchlist (Favorites)</th>
                                       <th className="p-8 text-center pr-12">Insights</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                    {users.map((u) => (
                                       <tr key={u._id} className="hover:bg-slate-50/80 transition-all group">
                                          <td className="p-8 pl-12">
                                             <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-black uppercase">
                                                   {u.username?.[0]}
                                                </div>
                                                <div>
                                                   <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{u.username}</p>
                                                   <p className="text-[9px] text-slate-400 font-bold lowercase">{u.email}</p>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="p-8">
                                             <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {u.orderCount > 0 ? (
                                                   <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase">{u.orderCount} Successions</span>
                                                ) : (
                                                   <span className="text-[9px] text-slate-300 font-black uppercase italic">No Acquisitions</span>
                                                )}
                                             </div>
                                          </td>
                                          <td className="p-8">
                                             <div className="flex items-center gap-2">
                                                <ShoppingCart size={14} className="text-amber-500" />
                                                <span className="text-[10px] font-black text-slate-600 uppercase">{u.cartCount || 0} Items</span>
                                             </div>
                                          </td>
                                          <td className="p-8">
                                             <div className="flex items-center gap-2">
                                                <Heart size={14} className="text-rose-500" />
                                                <span className="text-[10px] font-black text-slate-600 uppercase">{u.wishlistCount || 0} Saved</span>
                                             </div>
                                          </td>
                                          <td className="p-8 text-center pr-12">
                                             <button 
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   e.stopPropagation();
                                                   handleFetchUserInsights(u._id);
                                                }}
                                                className="px-4 py-2 bg-luxury-gold text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md relative z-20"
                                             >
                                                Full Profile
                                             </button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     )}

                     {activeTab === 'coupons' && (
                        <div className="space-y-8">
                           <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">

                                 <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Offer Injection Center</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage Special Promo Boxes</p>
                                 </div>
                                 <button onClick={() => setIsOfferModalOpen(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-luxury-gold transition-all flex items-center gap-3">
                                    <Plus size={18} /> Add Offer Box
                                 </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                                 {offers.map((offer) => (
                                    <div key={offer.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
                                       <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-100 transition-all"></div>
                                       <div className="relative z-10">
                                          <div className="w-12 h-12 bg-luxury-gold rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                                             <Flame size={24} />
                                          </div>
                                          <h4 className="text-lg font-black text-slate-800 uppercase italic mb-1">{offer.title}</h4>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                             <Clock size={12} className="text-luxury-gold" /> Ends: {offer.expiry}
                                          </p>

                                          <div className="space-y-3 mb-8">
                                             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset</span>
                                                <span className="text-[11px] font-black text-slate-800 uppercase">{offer.product}</span>
                                             </div>
                                             <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Discount</span>
                                                <span className="text-xl font-black text-emerald-700">{offer.discount}% OFF</span>
                                             </div>
                                          </div>

                                          <div className="flex gap-2">
                                             <button
                                                onClick={() => {
                                                   setEditingOffer(offer);
                                                   setNewOffer(offer);
                                                   setIsOfferModalOpen(true);
                                                }}
                                                className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-luxury-gold transition-all"
                                             ><Edit size={16} /></button>
                                             <button
                                                onClick={() => toast.success(`${offer.title} campaign DEACTIVATED`)}
                                                className="flex-grow py-3.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-luxury-gold transition-all"
                                             >Deactivate</button>
                                             <button
                                                onClick={() => {
                                                   setOffers(offers.filter(o => o.id !== offer.id));
                                                   toast.error(`${offer.title} box REMOVED from terminal`);
                                                }}
                                                className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 transition-all"
                                             ><Trash2 size={16} /></button>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>

                           </div>
                        )}

                        {activeTab === 'orders' && (
                           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                                    <tr><th className="p-8 pl-12">Registry ID</th><th className="p-8">Consignee</th><th className="p-8">Valuation</th><th className="p-8">Status</th><th className="p-8 text-center pr-12">Action</th></tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                    {filteredOrders?.length > 0 ? filteredOrders.map((o) => (
                                       <tr key={o?._id} className="hover:bg-slate-50/50 group">
                                          <td className="p-8 pl-12 font-mono text-[11px] text-slate-400">#{o?._id?.slice(-12).toUpperCase()}</td>
                                          <td className="p-8"><p className="text-xs font-black text-slate-800 uppercase tracking-tight">{o?.userId?.username || 'GUEST'}</p><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{o?.userId?.email}</p></td>
                                          <td className="p-8"><p className={`text-lg font-black tracking-tighter ${o?.totalAmount === 0 ? 'text-red-500' : 'text-slate-900'}`}>₹{formatPrice(o?.totalAmount)}</p>{o?.totalAmount === 0 && <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Verification Required</span>}</td>
                                          <td className="p-8"><StatusBadge status={o?.status} /></td>
                                          <td className="p-8 text-center pr-12"><button onClick={() => { setSelectedOrder(o); setIsOrderModalOpen(true); }} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-900 shadow-sm group-hover:scale-110 transition-all"><ChevronRight size={20} /></button></td>
                                       </tr>
                                    )) : (
                                       <tr><td colSpan="5" className="p-20 text-center text-slate-400 font-black uppercase tracking-[0.3em]">No Orders Found in Registry</td></tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        )}

                        {activeTab === 'support' && (
                           <div className="space-y-8 pb-10">

                              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex justify-between items-center">
                                 <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Support Desk</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active Communication Protocol & Tickets</p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="px-6 py-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                                       <AlertCircle size={20} className="text-amber-600" />
                                       <span className="text-xs font-black text-amber-900 uppercase tracking-widest">3 Priority Tickets</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 gap-6">
                                 {supportTickets.map((ticket) => (
                                    <div key={ticket.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all flex items-center justify-between group">
                                       <div className="flex items-center gap-8">
                                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Ref</p>
                                             <p className="text-xs font-black text-slate-800 uppercase">{ticket.id}</p>
                                          </div>
                                          <div>
                                             <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-luxury-gold transition-all">{ticket.subject}</h4>
                                             <div className="flex items-center gap-4 mt-2">
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Users size={12} /> {ticket.user}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {ticket.date}</p>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-6">
                                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${ticket.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : ticket.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                             {ticket.priority === 'High' ? <AlertCircle size={12} /> : ticket.priority === 'Medium' ? <Zap size={12} /> : <Info size={12} />}
                                             {ticket.priority} Priority
                                          </div>
                                          <button
                                             onClick={() => handleResolveTicket(ticket.id)}
                                             className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-luxury-gold shadow-sm transition-all"
                                          >Resolve Ticket</button>
                                       </div>
                                    </div>
                                 ))}
                                 {supportTickets.length === 0 && (
                                    <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                                       <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                          <CheckCircle2 size={40} />
                                       </div>
                                       <p className="text-sm font-black text-slate-800 uppercase tracking-widest">All Protocols Secured</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">No pending tickets in registry</p>
                                    </div>
                                 )}
                              </div>

                           </div>
                        )}

                        {activeTab === 'faqs' && (
                           <div className="space-y-8">
                              <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                 <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Knowledge Registry</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Frequently Asked Questions Management</p>
                                 </div>
                                 <button onClick={() => { setEditingFaq(null); setNewFaq({ question: '', answer: '', category: 'General', order: 0 }); setIsFaqModalOpen(true); }} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-luxury-gold transition-all flex items-center gap-3">
                                    <Plus size={18} /> New Entry
                                 </button>
                              </div>

                              <div className="grid grid-cols-1 gap-6 pb-10">
                                 {faqs.map((faq) => (
                                    <div key={faq._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group">
                                       <div className="flex justify-between items-start mb-6">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-luxury-gold font-black">?</div>
                                             <span className="px-4 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-100">{faq.category}</span>
                                          </div>
                                          <div className="flex gap-2">
                                             <button onClick={() => { setEditingFaq(faq); setNewFaq(faq); setIsFaqModalOpen(true); }} className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-luxury-gold shadow-sm transition-all"><Edit size={16} /></button>
                                             <button onClick={() => handleDeleteFaq(faq._id)} className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 shadow-sm transition-all"><Trash2 size={16} /></button>
                                          </div>
                                       </div>
                                       <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-3">{faq.question}</h4>
                                       <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.answer}</p>
                                    </div>
                                 ))}
                                 {faqs.length === 0 && (
                                    <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                                       <FileText className="mx-auto text-slate-200 mb-4" size={48} />
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No FAQ entries found in registry</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}


                        {activeTab === 'settings' && (
                           <div className="space-y-8 pb-10 max-w-4xl">
                              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                 <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic mb-10">System Configuration</h3>
                                 <div className="space-y-10">
                                    <div className="grid grid-cols-2 gap-10">
                                       <div className="space-y-3">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Identity</label>
                                          <input type="text" defaultValue="LUXE Premium Watches" className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-100 font-bold text-sm" />
                                       </div>
                                       <div className="space-y-3">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Currency</label>
                                          <select className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-100 font-bold text-sm">
                                             <option>INR (₹) - Indian Rupee</option>
                                             <option>USD ($) - US Dollar</option>
                                             <option>EUR (€) - Euro</option>
                                          </select>
                                       </div>
                                    </div>

                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                       <div className="flex items-center justify-between mb-6">
                                          <div>
                                             <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Maintenance Protocol</h4>
                                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Restrict Public Access to Storefront</p>
                                          </div>
                                          <div className="w-14 h-8 bg-slate-200 rounded-full relative cursor-pointer group">
                                             <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm group-hover:translate-x-6 transition-all"></div>
                                          </div>
                                       </div>
                                       <div className="flex items-center justify-between">
                                          <div>
                                             <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Automated Invoicing</h4>
                                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dispatch Digital Receipt on Settlement</p>
                                          </div>
                                          <div className="w-14 h-8 bg-emerald-500 rounded-full relative cursor-pointer">
                                             <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                                          </div>
                                       </div>
                                    </div>

                                    <div className="flex gap-4">
                                       <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-luxury-gold transition-all flex items-center gap-3">
                                          <ShieldCheck size={18} /> Authorize Sync
                                       </button>
                                       <button className="px-10 py-5 bg-white text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:text-red-500 transition-all">Reset Factory Defaults</button>
                                    </div>

                                    <div className="pt-10 border-t border-slate-100">
                                       <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic mb-8">Administrator Management</h3>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                          <form onSubmit={handleAddAdmin} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                                             <h4 className="text-[10px] font-black text-luxury-gold uppercase tracking-ultra-widest mb-2">Inject New Admin</h4>
                                             <div className="space-y-4">
                                                <input required type="text" placeholder="USERNAME" value={newAdmin.username} onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })} className="w-full px-6 py-3 bg-white rounded-xl outline-none text-[10px] font-bold border border-transparent focus:border-indigo-100" />
                                                <input required type="email" placeholder="EMAIL@LUXE.COM" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} className="w-full px-6 py-3 bg-white rounded-xl outline-none text-[10px] font-bold border border-transparent focus:border-indigo-100" />
                                                <input required type="password" placeholder="SECURITY KEY" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} className="w-full px-6 py-3 bg-white rounded-xl outline-none text-[10px] font-bold border border-transparent focus:border-indigo-100" />
                                             </div>
                                             <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-luxury-gold transition-all">Authorize New Admin</button>
                                          </form>
                                          <form onSubmit={handleChangePassword} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                                             <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-ultra-widest mb-2">Update Credentials</h4>
                                             <div className="space-y-4">
                                                <input required type="password" placeholder="CURRENT SECURITY KEY" value={passwordForm.oldPassword} onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} className="w-full px-6 py-3 bg-white rounded-xl outline-none text-[10px] font-bold border border-transparent focus:border-indigo-100" />
                                                <input required type="password" placeholder="NEW SECURITY KEY" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full px-6 py-3 bg-white rounded-xl outline-none text-[10px] font-bold border border-transparent focus:border-indigo-100" />
                                             </div>
                                             <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Revise Credentials</button>
                                          </form>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                        </>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* --- FAQ MODAL --- */}
               <AnimatePresence>
                  {isFaqModalOpen && (
                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFaqModalOpen(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-slate-100">
                           <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">{editingFaq ? 'Update Knowledge Base' : 'New Knowledge Entry'}</h2>
                              <button onClick={() => setIsFaqModalOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-all"><X size={20} /></button>
                           </div>
                           <form onSubmit={handleSaveFaq} className="p-10 space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Protocol</label>
                                 <input required type="text" value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-100 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answer Documentation</label>
                                 <textarea required rows="4" value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium border border-transparent focus:border-indigo-100 transition-all" />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Class</label>
                                    <select value={newFaq.category} onChange={e => setNewFaq({ ...newFaq, category: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-100 transition-all">
                                       <option>General</option><option>Shipping</option><option>Warranty</option><option>Authenticity</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Order</label>
                                    <input type="number" value={newFaq.order} onChange={e => setNewFaq({ ...newFaq, order: Number(e.target.value) })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-100 transition-all" />
                                 </div>
                              </div>
                              <button type="submit" className="w-full py-5 bg-luxury-gold text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-xl hover:bg-slate-900 transition-all">Authorize Knowledge Entry</button>
                           </form>
                        </motion.div>
                     </div>
                  )}
               </AnimatePresence>

            </div>

         {/* --- ADD PRODUCT MODAL --- */}
         <AnimatePresence>
            {isAddModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-4xl overflow-hidden relative z-10 border border-white/20">
                     
                     <div className="p-10 md:p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-luxury-gold shadow-xl">
                              <Plus size={28} />
                           </div>
                           <div>
                              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic leading-none">Asset Injection</h2>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">New Horological Registry Entry</p>
                           </div>
                        </div>
                        <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-red-500 hover:rotate-90 shadow-sm transition-all border border-slate-100"><X size={20} /></button>
                     </div>

                     <form onSubmit={handleAddProduct} className="p-10 md:p-12 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                           
                           {/* Main Identity */}
                           <div className="col-span-1 md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Masterpiece Name
                              </label>
                              <input required type="text" placeholder="e.g. ROLEX SUBMARINER DATE" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-sm font-black border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all uppercase tracking-tight" />
                           </div>

                           {/* Logistics Data */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Product SKU
                              </label>
                              <input required type="text" placeholder="LX-WTC-001" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} className="w-full px-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-sm font-bold border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all" />
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Boutique Brand
                              </label>
                              <input required type="text" placeholder="e.g. PATEK PHILIPPE" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full px-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-sm font-black border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all uppercase" />
                           </div>

                           {/* Financials */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Valuation (INR ₹)
                              </label>
                              <div className="relative group">
                                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-luxury-gold font-black">₹</span>
                                 <input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full pl-12 pr-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-lg font-black text-slate-900 border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all tracking-tighter" />
                              </div>
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Initial Stock
                              </label>
                              <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="w-full px-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-sm font-bold border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all" />
                           </div>

                           {/* Metadata */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Registry Category
                              </label>
                              <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-sm font-black border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all uppercase">
                                 <option value="">SELECT CLASS</option>
                                 <option value="Rolex">Rolex Collection</option>
                                 <option value="Titan">Titan Collection</option>
                                 <option value="Men">Men's Portfolio</option>
                                 <option value="Women">Women's Portfolio</option>
                                 <option value="Limited">Limited Edition</option>
                              </select>
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Introductory Discount (%)
                              </label>
                              <input type="number" value={newProduct.discount} onChange={e => setNewProduct({ ...newProduct, discount: Number(e.target.value) })} className="w-full px-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-sm font-bold border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all" />
                           </div>

                           <div className="col-span-1 md:col-span-2 space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Gallery Media (Source URL)
                              </label>
                              <div className="flex flex-col md:flex-row gap-6 items-start">
                                 <div className="flex-grow w-full">
                                    <input required type="text" placeholder="PASTE IMAGE URL HERE..." value={newProduct.images[0]} onChange={e => setNewProduct({ ...newProduct, images: [e.target.value] })} className="w-full px-8 py-5 bg-slate-50 rounded-[1.8rem] outline-none text-[10px] font-bold border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all text-slate-600 shadow-inner" />
                                    <p className="text-[9px] text-slate-400 font-bold mt-2 ml-4 uppercase tracking-widest">Supports direct links from Unsplash, Imgur, or your own CDN</p>
                                 </div>
                                 {newProduct.images[0] && (
                                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-slate-100 bg-slate-50 shrink-0 shadow-lg group relative">
                                       <img src={newProduct.images[0]} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" onError={(e) => e.target.src = 'https://placehold.co/400x400/F1F5F9/94A3B8?text=Invalid+Link'} />
                                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Eye size={16} className="text-white" />
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>

                           <div className="col-span-1 md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div> Curated Narrative (Description)
                              </label>
                              <textarea required rows="5" placeholder="Document the heritage and specifications of this masterpiece..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] outline-none text-sm font-medium border-2 border-transparent focus:border-luxury-gold/20 focus:bg-white transition-all leading-relaxed custom-scrollbar" />
                           </div>

                           {/* Protocol Toggles */}
                           <div className="col-span-1 md:col-span-2 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${newProduct.isNewProduct ? 'bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20' : 'bg-slate-200 text-slate-400'}`}>
                                    <Sparkles size={24} />
                                 </div>
                                 <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Promotional Protocol</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Activate 'NEW ARRIVAL' Registry Tag</p>
                                 </div>
                              </div>
                              <div 
                                 onClick={() => setNewProduct({ ...newProduct, isNewProduct: !newProduct.isNewProduct })}
                                 className={`w-16 h-10 rounded-full p-1.5 cursor-pointer transition-all duration-500 ${newProduct.isNewProduct ? 'bg-luxury-gold' : 'bg-slate-300'}`}
                              >
                                 <div className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-all duration-500 ${newProduct.isNewProduct ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </div>
                           </div>

                        </div>

                        <div className="flex gap-6 pt-6">
                           <button type="submit" className="flex-grow py-6 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-luxury-gold transition-all duration-500 active:scale-95">
                              Authorize Entry
                           </button>
                           <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-10 py-6 bg-white text-slate-400 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 hover:border-red-500 hover:text-red-500 transition-all">
                              Cancel Protocol
                           </button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* --- ADD OFFER MODAL --- */}
         <AnimatePresence>
            {isOfferModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOfferModalOpen(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-slate-100">
                     <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">{editingOffer ? 'Update Promo Box' : 'Inject Promo Box'}</h2>
                        <button onClick={() => { setIsOfferModalOpen(false); setEditingOffer(null); }} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-all"><X size={20} /></button>
                     </div>
                     <form onSubmit={handleSaveOffer} className="p-10 space-y-8">
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Label</label><input required type="text" value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-100 transition-all" placeholder="Flash Sale..." /></div>
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount (%)</label><input required type="number" value={newOffer.discount} onChange={e => setNewOffer({ ...newOffer, discount: Number(e.target.value) })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-black text-luxury-gold border border-transparent focus:border-indigo-100 transition-all" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label><input required type="date" value={newOffer.expiry} onChange={e => setNewOffer({ ...newOffer, expiry: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-100 transition-all" /></div>
                        </div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Asset</label><input required type="text" value={newOffer.product} onChange={e => setNewOffer({ ...newOffer, product: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-100 transition-all" placeholder="Product SKU or Name..." /></div>
                        <button type="submit" className="w-full py-5 bg-luxury-gold text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.5em] shadow-xl hover:bg-slate-900 transition-all">Activate Promo Box</button>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* --- ORDER DETAILS MODAL --- */}
         <AnimatePresence>
            {isOrderModalOpen && selectedOrder && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOrderModalOpen(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                  <motion.div initial={{ opacity: 0, scale: 0.9, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: 100 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden relative z-10">
                     <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                        <div className="p-10 bg-slate-50 border-r border-slate-100">
                           <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 bg-luxury-gold rounded-xl flex items-center justify-center text-white shadow-lg"><ShoppingBag size={20} /></div><div><h2 className="text-sm font-black text-slate-800 uppercase italic">Logistics Ref</h2><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#{selectedOrder._id.slice(-12).toUpperCase()}</p></div></div>
                           <div className="space-y-8">
                              <div><h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Consignee Identity</h4><div className="flex items-center gap-3"><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-luxury-gold border border-indigo-100 uppercase">{selectedOrder.userId?.username?.[0] || 'G'}</div><div><p className="text-xs font-black text-slate-800 uppercase">{selectedOrder.userId?.username || 'Guest Archive'}</p><p className="text-[10px] text-slate-400 font-bold">{selectedOrder.userId?.email}</p></div></div></div>
                              <div><h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Destination</h4><div className="flex gap-3 text-slate-600"><MapPin size={16} className="shrink-0 mt-0.5 text-luxury-gold" /><p className="text-[11px] font-bold leading-relaxed">{selectedOrder.shippingAddress || 'N/A'}</p></div></div>
                              <div><h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Financial Settlement</h4><div className="flex items-center gap-3 text-slate-800"><CreditCard size={16} className="text-luxury-gold" /><p className="text-xs font-black uppercase tracking-tight">{selectedOrder.paymentMethod || 'Secure Channel'}</p></div></div>
                           </div>
                        </div>
                        <div className="p-10 md:col-span-2 flex flex-col bg-white">
                           <div className="flex justify-between items-center mb-8"><h3 className="text-lg font-black text-slate-800 uppercase italic">Manifest Items</h3><button onClick={() => setIsOrderModalOpen(false)} className="w-9 h-9 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"><X size={18} /></button></div>
                           <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[40vh]">
                              {selectedOrder.items?.map((item, i) => (
                                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                    <div className="flex items-center gap-4"><div className="w-12 h-12 bg-white rounded-xl border border-slate-100 p-2"><img src={item.productId?.images?.[0]} alt="" className="w-full h-full object-contain" /></div><div><p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{item.productId?.name || 'Redacted Asset'}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.productId?.brand || 'Luxury'}</p></div></div>
                                    <div className="text-right"><p className="text-xs font-black text-slate-900">₹{formatPrice(item.price)}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p></div>
                                 </div>
                              ))}
                           </div>
                           <div className="mt-8 pt-8 border-t border-slate-50">
                              <div className="flex justify-between items-center mb-6"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Valuation</p><p className="text-2xl font-black text-luxury-gold tracking-tighter">₹{formatPrice(selectedOrder.totalAmount)}</p></div></div>
                                 <div className="flex flex-col gap-4">
                                    {selectedOrder.status === 'pending' ? (
                                       <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                          <div className="flex gap-4">
                                             <div className="flex-1 relative group">
                                                <input
                                                   type="text"
                                                   placeholder="Enter Third-Party Tracking ID..."
                                                   value={trackingForm.trackingId}
                                                   onChange={e => setTrackingForm({ ...trackingForm, trackingId: e.target.value })}
                                                   className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-indigo-300 transition-all shadow-inner"
                                                />
                                                <button
                                                   onClick={() => {
                                                      const id = `LX${Math.random().toString(36).substring(2, 8).toUpperCase()}${Date.now().toString().slice(-4)}`;
                                                      setTrackingForm({ ...trackingForm, trackingId: id });
                                                   }}
                                                   className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all shadow-sm"
                                                >
                                                   Generate ID
                                                </button>
                                             </div>
                                             <select
                                                value={trackingForm.courierPartner}
                                                onChange={e => setTrackingForm({ ...trackingForm, courierPartner: e.target.value })}
                                                className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-indigo-300 transition-all shadow-sm"
                                             >
                                                <option value="BlueDart">BlueDart</option>
                                                <option value="Delhivery">Delhivery</option>
                                                <option value="DHL">DHL</option>
                                             </select>
                                          </div>
                                          {!trackingForm.trackingId && (
                                             <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest animate-pulse">Prerequisite: Please enter or generate a Tracking ID to authorize dispatch</p>
                                          )}
                                          <button
                                             onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'shipped')}
                                             disabled={!trackingForm.trackingId}
                                             className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${trackingForm.trackingId ? 'bg-luxury-gold text-white shadow-xl shadow-luxury-gold/20 hover:scale-[1.02] active:scale-95' : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'}`}
                                          >
                                             <Truck size={18} />
                                             {trackingForm.trackingId ? 'Authorize Dispatch & Move to Hub' : 'Awaiting Tracking Protocol'}
                                          </button>
                                          <button onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'cancelled')} className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">Cancel Acquisition</button>
                                       </div>
                                    ) : (
                                       <div className="flex flex-col gap-4">
                                          <div className="flex gap-2">
                                             {['Shipped', 'Cancelled'].map((status) => (
                                                <button key={status} onClick={() => handleUpdateOrderStatus(selectedOrder._id, status.toLowerCase())} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedOrder.status === status.toLowerCase() ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'}`}>{status}</button>
                                             ))}
                                          </div>
                                          {selectedOrder.status === 'shipped' && (
                                             <div className="space-y-4">
                                                {!selectedOrder.trackingId ? (
                                                   <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                                                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /> Tracking Protocol Missing</p>
                                                      <div className="flex gap-2">
                                                         <input type="text" placeholder="LX..." value={trackingForm.trackingId} onChange={e => setTrackingForm({ ...trackingForm, trackingId: e.target.value })} className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-xl text-[10px] font-bold outline-none" />
                                                         <button onClick={() => setTrackingForm({ ...trackingForm, trackingId: `LX${Math.random().toString(36).substring(2, 8).toUpperCase()}${Date.now().toString().slice(-4)}` })} className="px-3 py-2 bg-amber-600 text-white text-[9px] font-black uppercase rounded-xl">Auto-Gen</button>
                                                         <button onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'shipped')} className="px-3 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-xl">Fix Link</button>
                                                      </div>
                                                   </div>
                                                ) : (
                                                   <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                                                      <div>
                                                         <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Active Logistics Link</p>
                                                         <p className="text-xs font-black text-luxury-gold uppercase tracking-tight">{selectedOrder.trackingId}</p>
                                                      </div>
                                                      <div className="text-right">
                                                         <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Partner</p>
                                                         <p className="text-xs font-black text-luxury-gold uppercase tracking-tight">{selectedOrder.courierPartner}</p>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          )}
                                       </div>
                                    )}
                                 </div>
                              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <StatusBadge status={selectedOrder.status} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Status Updated</p>
                                 </div>
                                 <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedOrder.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-luxury-gold'}`}>
                                    {selectedOrder.status === 'delivered' ? 'Shipment Finalized' : 'Logistics Active'}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* BULK PRICE MODIFIER MODAL */}
         <AnimatePresence>
            {isBulkPriceModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBulkPriceModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                     className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1D23] border-white/10' : 'bg-white border-slate-100'}`}
                  >
                     <div className="p-10">
                        <div className="flex justify-between items-start mb-8">
                           <div>
                              <h2 className={`text-2xl font-black tracking-tight uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Global Valuation</h2>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bulk Price Modifier Terminal</p>
                           </div>
                           <button onClick={() => setIsBulkPriceModalOpen(false)} className={`p-3 rounded-2xl transition-all ${isDarkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}><X size={20} /></button>
                        </div>

                        <div className="space-y-6">
                           <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-luxury-gold/10 border-luxury-gold/20' : 'bg-indigo-50/50 border-indigo-50'}`}>
                              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-4">Select Target Brand</p>
                              <div className="grid grid-cols-2 gap-3">
                                 {['Rolex', 'Titan', 'Omega', 'Casio'].map(brand => (
                                    <button key={brand} className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${brand === 'Rolex' ? 'bg-luxury-gold text-white border-luxury-gold shadow-lg shadow-luxury-gold/20' : isDarkMode ? 'bg-white/5 border-white/5 text-white/40 hover:border-luxury-gold/40' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}>{brand}</button>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-3">
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Adjust Valuation (%)</p>
                              <div className="flex items-center gap-4">
                                 <button className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-xl font-black transition-all ${isDarkMode ? 'border-white/5 text-white/20 hover:bg-white/5' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>-</button>
                                 <div className={`flex-1 rounded-2xl py-4 text-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <span className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>+5%</span>
                                 </div>
                                 <button className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-xl font-black transition-all ${isDarkMode ? 'border-white/5 text-white/20 hover:bg-white/5' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>+</button>
                              </div>
                           </div>

                           <button onClick={() => { toast.success('Global Price Adjustment AUTHORIZED'); setIsBulkPriceModalOpen(false); }} className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 ${isDarkMode ? 'bg-luxury-gold text-white shadow-luxury-gold/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>Execute Price Modification</button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* CUSTOMER INTELLIGENCE HUB MODAL */}
         <AnimatePresence>
            {isInsightsModalOpen && userInsights && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-2xl bg-slate-900/10 overflow-y-auto">
                  <motion.div 
                     initial={{ opacity: 0, y: 100 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 100 }}
                     transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                     className="bg-white w-full max-w-7xl rounded-[2rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.15)] overflow-hidden relative border border-slate-100"
                  >
                     {/* Editorial Header */}
                     <div className="relative px-16 py-14 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600/80">Registry Intelligence</span>
                           </div>
                           <h2 className="text-5xl font-light text-slate-900 tracking-tight leading-none">Behavioral <span className="italic font-serif text-slate-400">Insights</span></h2>
                           <p className="text-xs text-slate-400 font-medium tracking-wide max-w-md leading-relaxed">A comprehensive analytical matrix detailing user acquisition patterns, registry preferences, and active cart engagement.</p>
                        </div>
                        <div className="flex items-center gap-10">
                           <div className="text-right">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Last Sync</p>
                              <p className="text-xs font-bold text-slate-900">{new Date().toLocaleTimeString()}</p>
                           </div>
                           <button 
                              onClick={() => setIsInsightsModalOpen(false)}
                              className="w-14 h-14 rounded-full border border-slate-100 hover:border-slate-900 flex items-center justify-center transition-all group"
                           >
                              <X size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                           </button>
                        </div>
                     </div>

                     <div className="px-16 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                           
                           {/* SECTION: ACQUISITION */}
                           <div className="space-y-10">
                              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Acquisitions</h3>
                                 <span className="text-[10px] font-bold text-slate-400 italic">{userInsights.orders.length} Records</span>
                              </div>
                              <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                 {userInsights.orders.length > 0 ? userInsights.orders.map((order, i) => (
                                    <div key={i} className="group cursor-pointer">
                                       <div className="flex justify-between items-start mb-4">
                                          <div>
                                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">ID #{order._id.slice(-6).toUpperCase()}</p>
                                             <p className="text-xs font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                          </div>
                                          <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                                       </div>
                                       <div className="space-y-2 mb-4">
                                          {order.items.map((item, j) => (
                                             <div key={j} className="flex justify-between text-[11px] text-slate-500 font-medium uppercase tracking-tight">
                                                <span>{item.productId?.name}</span>
                                                <span className="text-slate-300">x{item.quantity}</span>
                                             </div>
                                          ))}
                                       </div>
                                       <div className="flex justify-between items-end border-t border-slate-50 pt-4 group-hover:border-slate-200 transition-colors">
                                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">{order.status}</span>
                                          <span className="text-xl font-light text-slate-900 tracking-tighter">₹{formatPrice(order.totalAmount || order.totalbill)}</span>
                                       </div>
                                    </div>
                                 )) : <p className="text-xs text-slate-400 italic text-center py-20">No acquisition history available.</p>}
                              </div>
                           </div>

                           {/* SECTION: REGISTRY */}
                           <div className="space-y-10">
                              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Registry</h3>
                                 <span className="text-[10px] font-bold text-slate-400 italic">{userInsights.wishlist.length} Items</span>
                              </div>
                              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                 {userInsights.wishlist.length > 0 ? userInsights.wishlist.map((item, i) => (
                                    <Link key={i} to={`/product/${item?._id}`} className="block">
                                       <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                                          <div className="w-20 h-20 bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                                             <img src={item?.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                          </div>
                                          <div className="flex-1 border-b border-slate-50 pb-6 group-hover:border-slate-200 transition-colors">
                                             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1 truncate">{item?.name}</h4>
                                             <p className="text-[9px] text-slate-400 font-bold uppercase mb-2 tracking-tighter">{item?.brand || 'Luxury Piece'}</p>
                                             <div className="text-xs font-bold text-slate-900 italic">₹{formatPrice(item?.price)}</div>
                                          </div>
                                       </div>
                                    </Link>
                                 )) : <p className="text-xs text-slate-400 italic text-center py-20">Registry is currently unoccupied.</p>}
                              </div>
                           </div>

                           {/* SECTION: CART */}
                           <div className="space-y-10">
                              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Engagement</h3>
                                 <span className="text-[10px] font-bold text-slate-400 italic">Active Cart</span>
                              </div>
                              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                 {userInsights.cart.length > 0 ? userInsights.cart.map((item, i) => (
                                    <Link key={i} to={`/product/${item.productId?._id}`} className="block">
                                       <div className="flex items-center gap-5 bg-white/5 p-5 rounded-[32px] border border-white/5 hover:border-slate-900 transition-all group">
                                          <div className="w-20 h-20 bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                                             <img src={item.productId?.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                          </div>
                                          <div className="flex-1 border-b border-slate-50 pb-6 group-hover:border-slate-200 transition-colors">
                                             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1 truncate">{item.productId?.name}</h4>
                                             <p className="text-[9px] text-slate-400 font-bold uppercase mb-2 tracking-tighter">Qty: {item.quantity}</p>
                                             <div className="text-xs font-black text-amber-600 italic">₹{formatPrice(item.productId?.price)}</div>
                                          </div>
                                       </div>
                                    </Link>
                                 )) : <p className="text-xs text-slate-400 italic text-center py-20">No active engagement in cart.</p>}
                              </div>
                           </div>

                        </div>
                     </div>
                     
                     {/* Subtle Bottom Bar */}
                     <div className="bg-slate-50/50 px-16 py-6 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                        <span>Luxe Intelligence Matrix v4.2</span>
                        <span>Secured Terminal Access</span>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

      </main>
   </div>
    );
};

export default AdminPanel;
