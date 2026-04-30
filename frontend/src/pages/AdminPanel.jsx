import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Gift, Ticket, MessageSquare, 
  Settings, LogOut, Plus, Edit, Trash2, X, ChevronRight, TrendingUp, 
  DollarSign, Briefcase, Search, Filter, Download, MoreVertical, Ban, CheckCircle2, 
  AlertCircle, Sparkles, Star, Globe, Award, Zap, Compass, ArrowUpRight, Menu, Bell, ShieldCheck,
  Activity, Layers, Fingerprint, Eye, ArrowDownRight, Maximize2, Clock, Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STUNNING DARK BLUE (MIDNIGHT SAPPHIRE) PALETTE ---
  const DARK_BLUE = "#0F172A"; // Midnight Navy
  const SAPPHIRE = "#2563EB";  // Vibrant Sapphire
  const PLATINUM = "#F8FAFC"; // Ice White Background
  const SILVER = "#E2E8F0";

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await API.get('/admin/stats');
        setStats(res.data.stats);
        setSalesData(res.data.monthlySales);
        setRecentOrders(res.data.recentOrders);
      } else if (activeTab === 'inventory') {
        const res = await API.get('/product');
        setProducts(res.data.products);
      } else if (activeTab === 'orders') {
        const res = await API.get('/admin/orders');
        setOrders(res.data.orders || []);
      } else if (activeTab === 'clients') {
        const res = await API.get('/admin/users');
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Sapphire Sync Failure");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen flex font-outfit" style={{ backgroundColor: PLATINUM }}>
      
      {/* --- FLOATING SAPPHIRE SIDEBAR --- */}
      <aside className="w-80 flex flex-col fixed h-screen z-50 shadow-[20px_0_60px_rgba(15,23,42,0.1)] transition-all duration-700" style={{ backgroundColor: DARK_BLUE }}>
        <div className="p-12 border-b border-white/5 flex flex-col items-center gap-8">
           <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center font-playfair text-4xl font-black italic shadow-2xl relative z-10 transition-transform duration-1000 group-hover:rotate-[360deg]" style={{ color: DARK_BLUE }}>L</div>
           </div>
           <div className="text-center">
              <h1 className="text-2xl font-playfair font-black tracking-[0.4em] text-white leading-none">MAISON</h1>
              <span className="text-[10px] uppercase tracking-[0.6em] font-black text-blue-400 mt-2 block">Sapphire Admin</span>
           </div>
        </div>
        
        <nav className="flex-grow p-8 space-y-4 mt-6">
           {[
             { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
             { id: 'inventory', label: 'The Vault', icon: Package },
             { id: 'orders', label: 'Logistics', icon: ShoppingBag },
             { id: 'clients', label: 'Registry', icon: Users },
           ].map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-6 px-8 py-5 rounded-[2rem] text-[11px] font-bold uppercase tracking-widest transition-all duration-500 relative group ${activeTab === item.id ? 'text-white bg-white/10 shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 1.5} className={activeTab === item.id ? 'text-blue-400' : ''} />
               {item.label}
               {activeTab === item.id && (
                  <motion.div layoutId="sapphireNav" className="absolute left-0 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-[0_0_20px_#3b82f6]" />
               )}
             </button>
           ))}
        </nav>

        <div className="p-8 space-y-6 border-t border-white/5">
           <Link to="/" className="w-full flex items-center justify-center gap-4 px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-white/10 text-white bg-white/5 hover:bg-white hover:text-slate-900 transition-all duration-500">
              <Globe size={20} className="text-blue-400" /> Storefront
           </Link>
           <button className="w-full flex items-center justify-center gap-4 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-red-400 transition-all">
              <LogOut size={20} /> Exit Terminal
           </button>
        </div>
      </aside>

      {/* --- MAIN SAPPHIRE CANVAS --- */}
      <main className="flex-grow ml-80">
        <header className="h-28 px-16 flex items-center justify-between sticky top-0 z-40 bg-white/70 backdrop-blur-3xl border-b border-slate-100 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-800">{activeTab}</h2>
           </div>
           
           <div className="flex items-center gap-12">
              <div className="relative group max-w-sm w-72">
                 <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                 <input type="text" placeholder="QUERY ARCHIVE..." className="w-full bg-slate-50 border border-transparent rounded-[2rem] py-4 pl-16 pr-24 text-[11px] font-black tracking-widest outline-none focus:bg-white focus:border-blue-100 transition-all shadow-inner" />
              </div>
              <div className="flex items-center gap-8 pl-12 border-l border-slate-100">
                 <div className="text-right">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">Director 01</p>
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Master Key Privileged</span>
                 </div>
                 <div className="w-14 h-14 bg-slate-900 rounded-[1.8rem] flex items-center justify-center font-playfair text-2xl font-black italic text-white shadow-2xl overflow-hidden relative">A</div>
              </div>
           </div>
        </header>

        <div className="p-16 max-w-[1400px] mx-auto">
           <AnimatePresence mode="wait">
              {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-8">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                   <p className="text-[11px] font-black uppercase tracking-[1em] text-blue-600 animate-pulse">Syncing Protocols</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  
                  {activeTab === 'dashboard' && (
                    <div className="space-y-16 pb-20">
                       {/* Header Section */}
                       <div className="flex justify-between items-end border-b border-slate-100 pb-12">
                          <div className="space-y-4">
                             <h1 className="text-7xl font-playfair font-black text-slate-800 leading-none tracking-tighter">System <span className="italic text-blue-600 font-light">Sapphire.</span></h1>
                             <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[1em] mt-6 ml-4">Real-Time Performance Architecture</p>
                          </div>
                          <div className="hidden xl:block">
                             <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400"><Calendar size={18} /></div>
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400"><Bell size={18} /></div>
                             </div>
                          </div>
                       </div>

                       {/* Stats Grid */}
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                          {[
                            { label: 'Net Revenue', value: `$${formatPrice(stats.totalRevenue)}`, icon: DollarSign, change: '+18.4%' },
                            { label: 'Registry Logs', value: stats.totalOrders, icon: ShoppingBag, change: '+12.1%' },
                            { label: 'Client Count', value: stats.totalUsers, icon: Users, change: '+5.7%' },
                            { label: 'Asset Vault', value: stats.totalProducts, icon: Package, change: 'SECURED' },
                          ].map((s, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-[0_30px_60px_rgba(0,0,0,0.02)] hover:shadow-[0_50px_100px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-1000 group relative overflow-hidden">
                               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 opacity-0 group-hover:opacity-[0.03] rounded-full transition-opacity" />
                               <div className="flex justify-between items-start mb-8">
                                  <div className="p-5 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all"><s.icon size={24} /></div>
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{s.change}</span>
                               </div>
                               <p className="text-[11px] uppercase tracking-[0.5em] font-black text-slate-300 mb-2">{s.label}</p>
                               <h4 className="text-4xl font-playfair font-black text-slate-800 tracking-tighter">{s.value}</h4>
                            </div>
                          ))}
                       </div>
                       
                       {/* Visual Analysis */}
                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                          <div className="lg:col-span-8 bg-white p-16 rounded-[4rem] border border-slate-50 shadow-2xl relative overflow-hidden">
                             <div className="flex justify-between items-center mb-16 relative z-10">
                                <div>
                                   <h3 className="text-2xl font-black uppercase tracking-widest text-slate-800">Growth Index</h3>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.5em] mt-2">Sapphire Economic Projections</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl text-blue-600"><TrendingUp size={20} /></div>
                             </div>
                             <div className="h-[450px]">
                               <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={salesData}>
                                   <defs>
                                     <linearGradient id="sapG" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor={SAPPHIRE} stopOpacity={0.2}/>
                                       <stop offset="95%" stopColor={SAPPHIRE} stopOpacity={0}/>
                                     </linearGradient>
                                   </defs>
                                   <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                   <XAxis dataKey="_id" stroke="#CBD5E1" fontSize={10} axisLine={false} tickLine={false} />
                                   <YAxis stroke="#CBD5E1" fontSize={10} axisLine={false} tickLine={false} />
                                   <Tooltip contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
                                   <Area type="monotone" dataKey="total" stroke={SAPPHIRE} fillOpacity={1} fill="url(#sapG)" strokeWidth={4} />
                                 </AreaChart>
                               </ResponsiveContainer>
                             </div>
                          </div>
                          
                          <div className="lg:col-span-4 p-16 rounded-[4rem] shadow-3xl text-white flex flex-col justify-between overflow-hidden relative group" style={{ backgroundColor: DARK_BLUE }}>
                             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                             <div>
                                <h3 className="text-3xl font-playfair font-black mb-12 italic">Maison <br/>Archives.</h3>
                                <div className="space-y-10 relative z-10">
                                   {recentOrders.map((o, i) => (
                                     <div key={i} className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.8rem] flex items-center justify-center font-black text-xs group-hover/item:bg-white group-hover/item:text-slate-900 transition-all duration-500">
                                           {o.userId?.username?.[0] || 'C'}
                                        </div>
                                        <div className="flex-grow">
                                           <p className="text-xs font-black uppercase tracking-widest">{o.userId?.username || 'Client'}</p>
                                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Confirmed Log</p>
                                        </div>
                                        <p className="text-sm font-black text-blue-400">${formatPrice(o.totalAmount)}</p>
                                     </div>
                                   ))}
                                </div>
                             </div>
                             <button className="w-full mt-16 py-6 text-[10px] font-black uppercase tracking-[0.8em] text-blue-400 border border-white/10 rounded-[2rem] hover:bg-white hover:text-slate-900 transition-all duration-700">Explore Archives</button>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'inventory' && (
                    <div className="space-y-16 pb-20">
                       <div className="flex justify-between items-end gap-12 border-b border-slate-100 pb-16">
                          <div>
                             <h1 className="text-8xl font-playfair font-black text-slate-800 leading-none tracking-tighter">The <span className="italic text-blue-600 font-light">Vault.</span></h1>
                             <p className="text-[12px] uppercase tracking-[1em] font-black text-slate-300 mt-8 ml-4">Global Asset Registry</p>
                          </div>
                          <button className="px-16 py-7 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.6em] shadow-2xl hover:bg-slate-900 transition-all duration-700">+ Add Entry</button>
                       </div>

                       <div className="bg-white rounded-[4rem] border border-slate-50 shadow-2xl overflow-hidden">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">
                                <tr>
                                  <th className="p-12 pl-16">Asset Particulars</th>
                                  <th className="p-12">Registry ID</th>
                                  <th className="p-12">Valuation</th>
                                  <th className="p-12">Maison Status</th>
                                  <th className="p-12 text-center pr-16">Action</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {products.map((p) => (
                                  <tr key={p._id} className="hover:bg-slate-50 transition-all group duration-700">
                                     <td className="p-12 pl-16 flex items-center gap-10">
                                        <div className="w-20 h-20 rounded-[2rem] overflow-hidden border border-slate-100 p-2 bg-white shadow-inner group-hover:scale-110 transition-transform duration-1000">
                                           <img src={p.images[0]} className="w-full h-full object-contain" alt="" />
                                        </div>
                                        <div>
                                           <p className="text-lg font-black uppercase tracking-tight text-slate-800">{p.name}</p>
                                           <p className="text-[11px] text-blue-500 font-bold uppercase tracking-[0.3em] mt-1">{p.brand}</p>
                                        </div>
                                     </td>
                                     <td className="p-12 font-mono text-[11px] text-slate-300">#{p._id.slice(-8).toUpperCase()}</td>
                                     <td className="p-12 text-2xl font-black text-slate-800 tracking-tighter">${formatPrice(p.price)}</td>
                                     <td className="p-12">
                                        <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest ${p.stock > 5 ? 'bg-slate-900 text-white' : 'bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)]'}`}>
                                           {p.stock} Units
                                        </span>
                                     </td>
                                     <td className="p-12 text-center pr-16">
                                        <div className="flex justify-center gap-6">
                                           <button className="w-14 h-14 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-300 hover:text-blue-600 transition-all shadow-md"><Edit size={20} /></button>
                                           <button className="w-14 h-14 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-300 hover:text-red-500 transition-all shadow-md"><Trash2 size={20} /></button>
                                        </div>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="space-y-16 pb-20">
                       <h1 className="text-8xl font-playfair font-black text-slate-800 leading-none tracking-tighter italic">Logistics.</h1>
                       <div className="bg-white rounded-[4rem] border border-slate-50 shadow-2xl overflow-hidden">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">
                                <tr>
                                  <th className="p-12 pl-16">Ref ID</th>
                                  <th className="p-12">Client</th>
                                  <th className="p-12">Total Amount</th>
                                  <th className="p-12">Status</th>
                                  <th className="p-12 text-center pr-16">Protocol</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {orders.map((o) => (
                                  <tr key={o._id} className="hover:bg-slate-50 transition-all duration-700 group">
                                     <td className="p-12 pl-16 font-mono text-[11px] text-slate-300">#{o._id.slice(-8).toUpperCase()}</td>
                                     <td className="p-12">
                                        <p className="text-sm font-black uppercase text-slate-800">{o.userId?.username || 'Private Archive'}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{o.userId?.email}</p>
                                     </td>
                                     <td className="p-12 text-2xl font-black text-slate-800 tracking-tighter">${formatPrice(o.totalAmount)}</td>
                                     <td className="p-12">
                                        <span className="px-8 py-3 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                           {o.status}
                                        </span>
                                     </td>
                                     <td className="p-12 text-center pr-16">
                                        <button className="w-16 h-16 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all shadow-md group-hover:translate-x-3"><ChevronRight size={26} /></button>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                  )}

                  {activeTab === 'clients' && (
                    <div className="space-y-16 pb-20">
                       <h1 className="text-8xl font-playfair font-black text-slate-800 leading-none tracking-tighter">Identity <span className="italic text-blue-600 font-light">Registry.</span></h1>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                          {users.map((u, i) => (
                            <motion.div key={u._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-white p-16 rounded-[5rem] border border-slate-50 shadow-xl text-center group hover:shadow-3xl transition-all duration-1000 relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-12 text-blue-600 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                  <Fingerprint size={120} strokeWidth={0.5} />
                               </div>
                               <div className="w-28 h-28 bg-slate-50 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 font-playfair text-5xl font-black text-slate-900 border border-white shadow-2xl group-hover:rotate-[360deg] transition-all duration-1000">{u.username[0]}</div>
                               <h4 className="text-3xl font-playfair font-black mb-2 text-slate-800">{u.username}</h4>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-12">{u.email}</p>
                               <div className={`inline-flex px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.5em] ${u.isBlocked ? 'bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.4)]' : 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)]'}`}>
                                  {u.isBlocked ? 'ACCESS DENIED' : 'ACTIVE STATUS'}
                               </div>
                               <div className="mt-16 flex justify-center gap-8 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                  <button className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-md"><Ban size={22} /></button>
                                  <button className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-md"><MoreVertical size={22} /></button>
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </div>
                  )}

                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
