import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, MapPin, Package, Search, ChevronRight, CheckCircle2,
  Clock, AlertCircle, ExternalLink, Filter, MoreHorizontal, ShieldCheck,
  TrendingUp, Activity, Box, ArrowLeft, Globe, Zap, BarChart3, Settings,
  CreditCard, Wallet, Landmark, Plus, Edit, Trash2, X, Lock, Cpu, Server, Database,
  Brain, Sparkles, Wand2, Eye, EyeOff, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogisticsHub = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // AI Intelligence State
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiInsights, setAiInsights] = useState([
    { id: 1, title: 'Neural Prediction', text: '15% surge expected in DHL traffic for North sectors.', icon: TrendingUp, color: 'indigo' },
    { id: 2, title: 'Anomalous Node', text: 'Unusual delay in BlueDart relay #42 detected.', icon: ShieldAlert, color: 'rose' },
    { id: 3, title: 'Flow Optimization', text: 'Redirecting 12% high-value settlements to Delhivery.', icon: Zap, color: 'amber' }
  ]);

  // Prompt Generator State
  const [productName, setProductName] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Dynamic Companies State
  const [companies, setCompanies] = useState([
    { id: 'BlueDart', label: 'BlueDart Terminal', icon: 'Zap', color: 'blue', password: 'admin@123' },
    { id: 'Delhivery', label: 'Delhivery Fleet', icon: 'Truck', color: 'amber', password: 'admin@123' },
    { id: 'DHL', label: 'DHL Express', icon: 'Package', color: 'rose', password: 'admin@123' }
  ]);

  // Security State
  const [authenticatedCompanies, setAuthenticatedCompanies] = useState(new Set());
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [attemptingCompany, setAttemptingCompany] = useState(null);
  const [securityKey, setSecurityKey] = useState('');

  // Config Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({ id: '', label: '', icon: 'Truck', color: 'indigo', password: 'admin@123' });

  const fetchLogistics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/orders');
      const allOrders = res.data.orders || [];
      setOrders(allOrders.filter(o => ['shipped', 'delivered'].includes(o.status)));
    } catch (err) {
      toast.error("Failed to sync with Logistics Terminal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogistics();
  }, []);

  const handleAiScan = () => {
    setIsAiScanning(true);
    setTimeout(() => {
      setIsAiScanning(false);
      toast.success("AI: Global Optimization Complete");
    }, 2500);
  };

  const handleGeneratePrompt = async (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      return toast.error("Please enter a product name");
    }

    setIsGenerating(true);
    try {
      const res = await API.post('/bot/chat', {
        message: `Act as a luxury marketing expert. Generate a high-end, sophisticated marketing prompt and product description for: "${productName}". 
        Include: 
        1. A captivating tagline.
        2. A 3-sentence luxury description.
        3. A "Prompt for AI Image Generation" to create a stunning visual for this product.
        Format it beautifully with headers.`
      });
      setGeneratedPrompt(res.data.reply);
      toast.success("Prompt Synthesized Successfully");
    } catch (err) {
      toast.error("Neural Link Failed: Could not generate prompt");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompanySelect = (company) => {
    if (authenticatedCompanies.has(company.id)) {
      setSelectedCompany(company);
      setActiveSubTab('terminal');
    } else {
      setAttemptingCompany(company);
      setIsSecurityModalOpen(true);
    }
  };

  const verifySecurityKey = (e) => {
    e.preventDefault();
    if (securityKey === attemptingCompany.password) {
      setAuthenticatedCompanies(new Set([...authenticatedCompanies, attemptingCompany.id]));
      setSelectedCompany(attemptingCompany);
      setActiveSubTab('terminal');
      setIsSecurityModalOpen(false);
      setSecurityKey('');
      toast.success(`${attemptingCompany.id} AUTHORIZED`);
    } else {
      toast.error("Invalid Key");
    }
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (editingCompany) {
      setCompanies(companies.map(c => c.id === editingCompany.id ? { ...newCompany, id: newCompany.label.replace(/\s+/g, '') } : c));
      toast.success('Updated');
    } else {
      const id = newCompany.label.replace(/\s+/g, '');
      setCompanies([...companies, { ...newCompany, id }]);
      toast.success('Authorized');
    }
    setIsConfigModalOpen(false);
    setEditingCompany(null);
    setNewCompany({ id: '', label: '', icon: 'Truck', color: 'indigo', password: 'admin@123' });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.trackingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : order.status === filterStatus;
    const matchesCompany = activeSubTab === 'terminal' ? order.courierPartner === selectedCompany?.id : true;
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const StatusBadge = ({ status }) => {
    const config = {
      pending: { icon: <Clock size={12} />, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Pending' },
      shipped: { icon: <Truck size={12} />, bg: 'bg-indigo-50', text: 'text-luxury-gold', border: 'border-indigo-100', label: 'In Transit' },
      delivered: { icon: <CheckCircle2 size={12} />, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Delivered' },
      cancelled: { icon: <AlertCircle size={12} />, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Cancelled' },
    };

    const style = config[status] || config.pending;

    return (
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.bg} ${style.text} ${style.border} shadow-sm transition-all hover:scale-105`}>
        {style.icon}
        {style.label}
      </div>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Cpu, sub: 'Control Center' },
    { id: 'neural', label: 'Neural Core', icon: Brain, sub: 'AI Intelligence' },
    { id: 'payments', label: 'Payment Hub', icon: Wallet, sub: 'Liquidity Flow' },
    { id: 'settlement', label: 'Settlement', icon: Server, sub: 'Partner Payouts' },
    { id: 'config', label: 'Configuration', icon: Settings, sub: 'System Logic' }
  ];

  return (
    <div className="min-h-screen bg-luxury-pearl text-luxury-charcoal font-inter flex relative overflow-hidden">

      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxury-gold/10 rounded-full blur-[120px]" />
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-[300px] flex-shrink-0 bg-luxury-charcoal h-screen sticky top-0 flex flex-col p-6 z-50 overflow-hidden shadow-[20px_0_60px_-15px_rgba(0,0,0,0.4)]">
        {/* BRAND SECTION */}
        <div className="flex items-center gap-5 mb-12 pl-1">
          <Link to="/admin" className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-white font-black text-xl tracking-tighter uppercase italic leading-none">Delivery<span className="text-luxury-gold">Panel</span></h1>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1.5">Luxury Logistics v4.0</p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="space-y-2 flex-grow overflow-y-auto no-scrollbar pr-1">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 ml-3">Operations Architecture</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSubTab(item.id); setSelectedCompany(null); }}
              className={`w-full group relative flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-500 ${activeSubTab === item.id ? 'bg-luxury-gold text-white shadow-xl shadow-luxury-gold/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeSubTab === item.id ? 'bg-white/20' : 'bg-white/5'}`}>
                {item.id === 'neural' && activeSubTab === 'neural' ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                    <item.icon size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <item.icon size={20} className={activeSubTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                )}
              </div>
              <div className="text-left">
                <p className="text-[12px] font-black uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                <p className={`text-[8px] font-bold uppercase tracking-widest opacity-60 ${activeSubTab === item.id ? 'text-white' : 'text-slate-500'}`}>{item.sub}</p>
              </div>
              {activeSubTab === item.id && (
                <motion.div layoutId="activeDot" className="absolute right-6 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              )}
            </button>
          ))}

          {/* TERMINALS SECTION */}
          <div className="mt-10 pt-10 border-t border-white/5">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 ml-3">Neural Node Terminals</p>
            <div className="grid grid-cols-1 gap-3">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className={`flex items-center gap-5 px-5 py-3.5 rounded-xl transition-all duration-300 border ${selectedCompany?.id === company.id ? 'bg-white/10 text-white border-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5 border-transparent'}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${company.color}-500/10 text-${company.color}-500 border border-${company.color}-500/20`}>
                    {company.icon === 'Zap' ? <Zap size={16} /> : company.icon === 'Truck' ? <Truck size={16} /> : <Package size={16} />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">{company.label}</span>
                  {authenticatedCompanies.has(company.id) && (
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAINFRAME STATUS */}
        <div className="mt-8 p-5 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-luxury-gold rounded-xl flex items-center justify-center text-white shadow-lg">
              <Database size={22} />
            </div>
            <div>
              <p className="text-[11px] text-white font-black uppercase tracking-widest leading-none mb-1.5">Mainframe</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Secure Protocol v4.0</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow h-screen overflow-y-auto relative z-10 bg-luxury-pearl">
        <div className="p-14 max-w-[1600px] mx-auto">
          <header className="flex items-center justify-between mb-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-luxury-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
                <p className="text-[10px] text-luxury-gold font-black uppercase tracking-[0.6em]">System Overdrive</p>
              </div>
              <h2 className="text-6xl font-black text-luxury-charcoal tracking-tighter uppercase italic">
                {activeSubTab === 'dashboard' ? 'Dashboard' :
                  activeSubTab === 'neural' ? 'Neural Core' :
                    activeSubTab === 'payments' ? 'Payment Hub' :
                      activeSubTab === 'settlement' ? 'Settlement' :
                        activeSubTab === 'config' ? 'Configuration' :
                          `${selectedCompany?.label}`}
              </h2>
            </motion.div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luxury-gold transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="SEARCH PROTOCOL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 pr-8 py-5 bg-white border border-luxury-sand/50 rounded-2xl w-[400px] text-[11px] font-black tracking-widest text-luxury-charcoal focus:outline-none focus:ring-4 focus:ring-luxury-gold/10 focus:border-luxury-gold transition-all shadow-sm"
                />
              </div>
              <button onClick={fetchLogistics} className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 hover:text-luxury-gold transition-all shadow-sm">
                <Activity size={28} />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeSubTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-14">
                <div className="grid grid-cols-4 gap-10">
                  {[
                    { label: 'Throughput', value: orders.length, icon: Box, color: 'indigo', desc: 'Sync Active' },
                    { label: 'In Transit', value: orders.filter(o => o.status === 'shipped').length, icon: Truck, color: 'amber', desc: 'Active flow' },
                    { label: 'Efficiency', value: '98.2%', icon: CheckCircle2, color: 'emerald', desc: 'Protocol OK' },
                    { label: 'System Health', value: '100%', icon: Activity, color: 'rose', desc: 'Nodes Online' }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-${stat.color}-100 transition-all`} />
                      <div className={`w-16 h-16 bg-${stat.color}-50 text-${stat.color}-600 rounded-3xl flex items-center justify-center mb-10 shadow-inner border border-${stat.color}-100`}><stat.icon size={32} /></div>
                      <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{stat.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-12">
                  <div className="col-span-2 bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-2xl font-black text-slate-900 uppercase italic">Real-Time Registry Stream</h3>
                      <div className="flex gap-4">
                        <button onClick={handleAiScan} className="px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-luxury-gold transition-all">
                          <Brain size={16} /> Neural Scan
                        </button>
                        <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-luxury-gold transition-all shadow-sm"><MoreHorizontal size={24} /></button>
                      </div>
                    </div>
                    <div className="space-y-8">
                      {orders.slice(0, 4).map((o, idx) => (
                        <div key={idx} className="flex items-center justify-between p-10 bg-slate-50/30 rounded-[3rem] border border-transparent hover:border-slate-100 hover:bg-white transition-all group shadow-sm">
                          <div className="flex items-center gap-10">
                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 group-hover:text-luxury-gold transition-all shadow-sm border border-slate-50"><Box size={28} /></div>
                            <div>
                              <p className="text-lg font-black text-slate-900 uppercase mb-1">Packet Hash: {o._id.slice(-12).toUpperCase()}</p>
                              <div className="flex items-center gap-4">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><MapPin size={14} className="text-luxury-gold" /> {o.shippingAddress?.slice(0, 40)}...</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-12">
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Node Relay</p>
                              <p className="text-[12px] text-luxury-gold font-black uppercase tracking-widest">{o.courierPartner}</p>
                            </div>
                            <StatusBadge status={o.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-luxury-gold p-14 rounded-[5rem] shadow-[0_40px_80px_rgba(93,92,222,0.2)] relative overflow-hidden group text-white">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl group-hover:scale-150 transition-all duration-1000" />
                    <ShieldCheck size={100} className="text-white/20 mb-12" />
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">Quantum Security</h3>
                    <p className="text-indigo-100 text-sm font-bold leading-relaxed mb-14 uppercase tracking-widest opacity-80">Full administrative override authorized. Integrity confirmed across all operational nodes.</p>
                    <button className="w-full py-6 bg-white text-luxury-gold rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all shadow-xl">Audit Ledger</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'neural' && (
              <motion.div key="neural" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-14">
                <div className="bg-slate-900 p-14 rounded-[5rem] shadow-2xl relative overflow-hidden text-white border border-slate-800">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-3 h-3 bg-luxury-gold rounded-full" />
                        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-luxury-gold">Strategic Intelligence</p>
                      </div>
                      <h3 className="text-7xl font-black tracking-tighter italic mb-10">Neural<span className="text-luxury-gold">Core</span></h3>
                      <div className="flex gap-6">
                        <button onClick={handleAiScan} className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-luxury-gold hover:text-white transition-all">
                          <Wand2 size={20} /> Initialize Neural Scan
                        </button>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="w-64 h-64 border-8 border-luxury-gold/20 rounded-full flex items-center justify-center">
                      <Brain size={80} className="text-luxury-gold" />
                    </motion.div>
                  </div>
                </div>

                {/* PROMPT GENERATOR SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-100 transition-all" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-indigo-50 text-luxury-gold rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100">
                          <Sparkles size={28} />
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 uppercase italic">Prompt Synthesis</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-10 leading-relaxed">
                        Input your product identity to generate a high-conversion marketing prompt and visual architecture.
                      </p>
                      <form onSubmit={handleGeneratePrompt} className="space-y-8">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="PRODUCT NAME (E.G. LUXE ROLEX OYSTER...)"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full pl-10 pr-10 py-7 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none text-sm font-black text-slate-900 focus:border-luxury-gold focus:bg-white transition-all shadow-inner uppercase"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isGenerating}
                          className={`w-full py-7 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-luxury-gold shadow-luxury-gold/20'}`}
                        >
                          {isGenerating ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                <Zap size={20} />
                              </motion.div>
                              Synthesizing...
                            </>
                          ) : (
                            <>
                              <Cpu size={20} /> Generate Neural Prompt
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-14 rounded-[5rem] border border-dashed border-slate-200 relative overflow-hidden flex flex-col min-h-[400px]">
                    {generatedPrompt ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow">
                        <div className="flex items-center justify-between mb-8">
                          <h5 className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.6em]">Output Stream</h5>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(generatedPrompt);
                              toast.success("Copied to Neural Clipboard");
                            }}
                            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-luxury-gold transition-all shadow-sm"
                          >
                            <Box size={18} />
                          </button>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-100 shadow-inner h-[calc(100%-60px)] overflow-y-auto no-scrollbar">
                          <pre className="whitespace-pre-wrap text-[13px] font-bold text-slate-700 leading-relaxed font-inter">
                            {generatedPrompt}
                          </pre>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 shadow-sm">
                          <Eye size={40} />
                        </div>
                        <h5 className="text-xl font-black text-slate-300 uppercase italic tracking-widest">Awaiting Pulse</h5>
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-4">Initialize synthesis to view results</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-10">
                  {aiInsights.map((insight, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm group relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-${insight.color}-50 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-${insight.color}-100 transition-all`} />
                      <div className={`w-14 h-14 bg-${insight.color}-50 text-${insight.color}-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-${insight.color}-100`}><insight.icon size={28} /></div>
                      <h4 className="text-2xl font-black text-slate-900 uppercase italic mb-4">{insight.title}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed tracking-widest">{insight.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSubTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-14">
                <div className="bg-white p-20 rounded-[6rem] border border-slate-100 shadow-xl relative overflow-hidden flex items-center justify-between">
                  <div className="relative z-10">
                    <p className="text-[12px] font-black text-luxury-gold uppercase tracking-[0.8em] mb-6">Financial Node Manager</p>
                    <h3 className="text-8xl font-black text-slate-900 tracking-tighter italic mb-12">₹{orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toLocaleString()}</h3>
                    <div className="flex gap-8">
                      <button className="px-14 py-6 bg-luxury-gold text-white rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-slate-900 transition-all shadow-2xl shadow-luxury-gold/30"><Wallet size={24} /> Release Liquidity</button>
                      <button className="px-14 py-6 bg-slate-50 border border-slate-100 text-slate-500 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white transition-all"><Landmark size={24} /> Audit Node</button>
                    </div>
                  </div>
                  <div className="w-[30rem] h-[30rem] bg-indigo-50 rounded-full blur-[120px] absolute right-[-10%] top-[-10%]" />
                </div>

                <div className="bg-white rounded-[5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-widest">Master Transaction Registry</h4>
                    <div className="flex gap-4">
                      <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-luxury-gold transition-all shadow-sm"><Filter size={20} /></button>
                      <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-luxury-gold transition-all shadow-sm"><ExternalLink size={20} /></button>
                    </div>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/30 text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <tr><th className="p-12">Hash Node</th><th className="p-12">Consignee</th><th className="p-12">Total Valuation</th><th className="p-12">Security Protocol</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="p-12 font-mono text-[12px] text-slate-400 group-hover:text-luxury-gold">TXN-{o._id.slice(-16).toUpperCase()}</td>
                          <td className="p-12">
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-[1.2rem] bg-slate-100 flex items-center justify-center text-[12px] font-black text-slate-900 uppercase border border-slate-200">{o.userId?.username?.[0] || 'G'}</div>
                              <p className="text-sm font-black text-slate-900 uppercase">{o.userId?.username || 'GUEST USER'}</p>
                            </div>
                          </td>
                          <td className="p-12"><p className="text-2xl font-black text-slate-900 tracking-tighter">₹{o.totalAmount?.toLocaleString()}</p></td>
                          <td className="p-12"><div className="flex items-center gap-4 text-emerald-600 font-black uppercase text-[11px]"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" /> Protocol Verified</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'settlement' && (
              <motion.div key="settlement" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-14">
                <div className="flex flex-col items-center text-center py-32 bg-white rounded-[6rem] border border-slate-100 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-50/50 animate-pulse" />
                  <div className="w-40 h-40 bg-indigo-50 text-luxury-gold rounded-[4rem] flex items-center justify-center mb-12 border border-indigo-100 shadow-inner"><Landmark size={80} /></div>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tight uppercase italic mb-6">Partner Settlement Registry</h3>
                  <p className="text-slate-400 max-w-2xl mx-auto text-sm font-bold uppercase tracking-widest leading-loose">All fulfilled logistics entries are automatically queued for immediate financial remittance to selected partners.</p>
                  <div className="mt-14 flex gap-6">
                    <div className="px-10 py-4 bg-slate-50 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 shadow-sm">Nodes Pending: {orders.filter(o => o.status === 'delivered').length}</div>
                    <div className="px-10 py-4 bg-emerald-50 rounded-3xl text-[11px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-200 shadow-sm">Integrity: AUTHORIZED</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 pb-32">
                  {orders.filter(o => o.status === 'delivered').map((o) => (
                    <motion.div whileHover={{ scale: 1.01 }} key={o._id} className="bg-white p-12 rounded-[4rem] border border-slate-100 flex items-center justify-between shadow-sm group hover:shadow-2xl hover:border-luxury-gold/20 transition-all">
                      <div className="flex items-center gap-12">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500"><CheckCircle2 size={40} /></div>
                        <div>
                          <p className="text-2xl font-black text-slate-900 uppercase italic leading-none mb-3">Protocol: #{o._id.slice(-12).toUpperCase()}</p>
                          <div className="flex items-center gap-4">
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-3"><Truck size={16} className="text-luxury-gold" /> Node Assignment: {o.courierPartner}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-20">
                        <div className="text-right">
                          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-2">Net Partner Share</p>
                          <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{(o.totalAmount * 0.9).toLocaleString()}</p>
                        </div>
                        <button className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-xl">Release Settlement</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSubTab === 'config' && (
              <motion.div key="config" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-14">
                <div className="flex justify-between items-center bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm">
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Operational Node Manager</h3>
                    <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.4em]">Manage Logistics Terminals & Authorization Keys</p>
                  </div>
                  <button onClick={() => { setEditingCompany(null); setNewCompany({ id: '', label: '', icon: 'Truck', color: 'indigo', password: 'admin@123' }); setIsConfigModalOpen(true); }} className="px-12 py-6 bg-luxury-gold text-white rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.3em] flex items-center gap-5 shadow-2xl shadow-luxury-gold/20 hover:bg-slate-900 transition-all">
                    <Plus size={24} /> Inject New Terminal
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-12 pb-32">
                  {companies.map((company) => (
                    <motion.div
                      key={company.id} layout
                      className="bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-700"
                    >
                      <div className={`absolute top-0 right-0 w-64 h-64 bg-${company.color}-50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-${company.color}-100 transition-all`} />
                      <div className="relative z-10 text-center">
                        <div className={`w-28 h-28 mx-auto bg-${company.color}-50 text-${company.color}-600 rounded-[3rem] flex items-center justify-center mb-12 shadow-inner border border-${company.color}-100 group-hover:scale-110 transition-all duration-700`}>
                          {company.icon === 'Zap' ? <Zap size={48} /> : company.icon === 'Truck' ? <Truck size={48} /> : <Package size={48} />}
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-4">{company.label}</h4>
                        <div className="flex items-center justify-center gap-4 mb-14">
                          <div className="px-5 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 flex items-center gap-3">
                            <ShieldCheck size={14} className="text-luxury-gold" /> PROTOCOL SECURED
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <button onClick={() => handleCompanySelect(company)} className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-xl">Launch Terminal</button>
                          <div className="flex gap-4">
                            <button onClick={() => { setEditingCompany(company); setNewCompany(company); setIsConfigModalOpen(true); }} className="flex-1 py-5 bg-white border border-slate-100 rounded-[1.8rem] flex items-center justify-center text-slate-400 hover:text-luxury-gold hover:bg-slate-50 transition-all shadow-sm"><Edit size={22} /></button>
                            <button onClick={() => setCompanies(companies.filter(c => c.id !== company.id))} className="flex-1 py-5 bg-white border border-slate-100 rounded-[1.8rem] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"><Trash2 size={22} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSubTab === 'terminal' && selectedCompany && (
              <motion.div key="terminal" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-14 pb-32">
                <div className="flex justify-between items-center bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-10">
                    <button onClick={() => setActiveSubTab('config')} className="w-16 h-16 bg-slate-50 rounded-[2rem] text-slate-400 hover:text-luxury-gold hover:bg-white transition-all border border-slate-100 flex items-center justify-center shadow-sm group"><ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" /></button>
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none">{selectedCompany.label} Node Registry</h3>
                      <p className="text-[11px] text-luxury-gold font-black uppercase tracking-[0.6em] mt-3">Connection Authenticated: MASTER NODE</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    {['all', 'shipped', 'delivered'].map((s) => (
                      <button key={s} onClick={() => setFilterStatus(s)} className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest border transition-all ${filterStatus === s ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-400 border-slate-100 hover:border-luxury-gold'}`}>{s}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {filteredOrders.length > 0 ? filteredOrders.map((o) => (
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} key={o._id} className="bg-white p-12 rounded-[4rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-2xl hover:border-luxury-gold/30 transition-all group">
                      <div className="flex items-center gap-12">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-100 group-hover:text-luxury-gold transition-all duration-700 shadow-inner border border-slate-50"><Box size={40} /></div>
                        <div>
                          <p className="text-2xl font-black text-slate-900 uppercase italic mb-2 tracking-tight">ID: #{o._id.slice(-16).toUpperCase()}</p>
                          <div className="flex items-center gap-4 mt-2 text-slate-400 font-bold uppercase text-[11px] tracking-widest leading-none">
                            <MapPin size={16} className="text-luxury-gold" /> {o.shippingAddress?.slice(0, 60)}...
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-24">
                        <div className="text-right">
                          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-2">Relay Link</p>
                          <p className="text-[16px] font-black text-slate-900 uppercase tracking-[0.1em]">{o.trackingId}</p>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-72 text-center bg-white rounded-[6rem] border border-dashed border-slate-200 flex flex-col items-center shadow-inner">
                      <ShieldCheck size={120} className="text-slate-50 mb-12" />
                      <h4 className="text-3xl font-black text-slate-100 uppercase italic tracking-[0.4em]">Registry Quiescent</h4>
                      <p className="text-[11px] text-slate-300 font-black uppercase tracking-widest mt-6">Node terminal is currently awaiting data packets...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* CONFIG MODAL */}
      <AnimatePresence>
        {isConfigModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsConfigModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 100 }} className="bg-white rounded-[5rem] shadow-[0_60px_150px_rgba(0,0,0,0.15)] w-full max-w-2xl overflow-hidden relative z-10 border border-slate-100">
              <div className="p-16 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">{editingCompany ? 'Revise Node' : 'Initialize Node'}</h2>
                  <p className="text-[11px] text-luxury-gold font-black uppercase tracking-widest mt-3">Node Protocol Authorization Suite</p>
                </div>
                <button onClick={() => setIsConfigModalOpen(false)} className="w-14 h-14 rounded-[1.5rem] bg-white flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-slate-100"><X size={28} /></button>
              </div>
              <form onSubmit={handleSaveCompany} className="p-16 space-y-10">
                <div className="space-y-4">
                  <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Label</label>
                  <input required type="text" value={newCompany.label} onChange={e => setNewCompany({ ...newCompany, label: e.target.value })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none text-base font-black text-slate-900 focus:border-luxury-gold focus:bg-white transition-all shadow-inner" placeholder="E.G. DHL TERMINAL..." />
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Signature</label>
                    <select value={newCompany.icon} onChange={e => setNewCompany({ ...newCompany, icon: e.target.value })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none text-base font-black text-slate-900 appearance-none cursor-pointer focus:border-luxury-gold shadow-inner">
                      <option value="Truck">Fleet Node (Truck)</option><option value="Zap">Flash Node (Zap)</option><option value="Package">Courier Node (Box)</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest ml-2">Color ID</label>
                    <select value={newCompany.color} onChange={e => setNewCompany({ ...newCompany, color: e.target.value })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none text-base font-black text-slate-900 appearance-none cursor-pointer focus:border-luxury-gold shadow-inner">
                      <option value="indigo">Indigo Node</option><option value="amber">Amber Fleet</option><option value="rose">Rose Node</option><option value="emerald">Emerald Node</option><option value="blue">Blue Terminal</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest ml-2">Security Authorization Key</label>
                  <div className="relative">
                    <input required type={showPassword ? "text" : "password"} value={newCompany.password} onChange={e => setNewCompany({ ...newCompany, password: e.target.value })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none text-base font-black text-slate-900 tracking-[0.8em] focus:border-luxury-gold focus:bg-white transition-all shadow-inner" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-luxury-gold p-2">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full py-8 bg-luxury-gold text-white rounded-[3rem] text-[14px] font-black uppercase tracking-[0.5em] shadow-2xl shadow-luxury-gold/30 hover:bg-slate-900 transition-all mt-8 uppercase italic leading-none">
                  {editingCompany ? 'Revise Authorization' : 'Authorize Node Protocol'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURITY MODAL */}
      <AnimatePresence>
        {isSecurityModalOpen && attemptingCompany && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSecurityModalOpen(false)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, rotateX: 20 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} exit={{ opacity: 0, scale: 0.9, rotateX: 20 }} className="bg-white rounded-[5rem] shadow-[0_80px_160px_rgba(0,0,0,0.2)] w-full max-w-md overflow-hidden relative z-10 p-16 border border-slate-100 text-center">
              <div className={`w-32 h-32 rounded-[3.5rem] bg-${attemptingCompany.color}-50 text-${attemptingCompany.color}-600 flex items-center justify-center mb-12 shadow-inner mx-auto border border-${attemptingCompany.color}-100`}><Lock size={56} /></div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic mb-6 leading-none">Auth Required</h2>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-14">Establishing Connection: {attemptingCompany.label}</p>
              <form onSubmit={verifySecurityKey} className="w-full space-y-8">
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="SECURITY KEY" value={securityKey} onChange={(e) => setSecurityKey(e.target.value)} autoFocus className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none text-center text-sm font-black tracking-[1em] text-slate-900 focus:border-luxury-gold focus:bg-white transition-all shadow-inner" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-luxury-gold p-2">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-2xl">Confirm Node Handshake</button>
                <button type="button" onClick={() => setIsSecurityModalOpen(false)} className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 pt-6 transition-all">Abort Protocol</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LogisticsHub;
