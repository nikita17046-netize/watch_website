import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, MapPin, Package, Search, ChevronRight, CheckCircle2, 
  Clock, AlertCircle, ExternalLink, Filter, MoreHorizontal, ShieldCheck,
  TrendingUp, Activity, Box, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogisticsHub = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchLogistics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/orders');
      const allOrders = res.data.orders || [];
      // Only show orders that have been dispatched (Shipped or Delivered)
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.trackingId?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.post(`/admin/orders/status/${orderId}`, { status: newStatus });
      toast.success(`Protocol Updated: Asset marked as ${newStatus.toUpperCase()}`);
      fetchLogistics();
    } catch (err) {
      toast.error("Handshake Failed: Unauthorized Access");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancel': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-inter">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <ArrowLeft size={20} className="text-slate-400" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Truck className="text-indigo-600" size={24} />
                LOGISTICS HUB <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">V1.0</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Global Acquisition Fulfillment Registry</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Tracking ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-6 py-2.5 bg-slate-50 border border-transparent focus:border-indigo-100 rounded-2xl outline-none text-xs font-bold w-64 transition-all"
              />
            </div>
            <button onClick={fetchLogistics} className="p-2.5 bg-slate-50 rounded-2xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all">
              <Activity size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* STATS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Shipments', value: orders.filter(o => o.status === 'shipped').length, color: 'indigo', icon: Package },
            { label: 'Pending Dispatch', value: orders.filter(o => o.status === 'pending').length, color: 'amber', icon: Clock },
            { label: 'Fulfilled Today', value: orders.filter(o => o.status === 'delivered').length, color: 'emerald', icon: CheckCircle2 },
            { label: 'Fulfillment Rate', value: '98.4%', color: 'rose', icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex gap-2">
              {['all', 'pending', 'shipped', 'delivered'].map((s) => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterStatus === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'}`}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>

        {/* LOGISTICS LIST */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode='popLayout'>
            {filteredOrders.length > 0 ? filteredOrders.map((order, idx) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-8">
                  <div className="flex items-center gap-6 flex-1 min-w-[200px]">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <Box size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-black text-slate-900 tracking-tight">REF: #{order._id.slice(-8).toUpperCase()}</p>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} className="text-indigo-500" /> {order.shippingAddress || 'Verified Destination'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Logistics Registry</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-50">
                        {order.courierPartner?.[0] || 'T'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{order.trackingId || 'PENDING ASSIGNMENT'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.courierPartner || 'Internal Fleet'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-8">
                    {order.status === 'shipped' && (
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                        className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        Confirm Delivery
                      </button>
                    )}
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Acquisition Date</p>
                      <p className="text-xs font-black text-slate-800">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-6">
                  <ShieldCheck size={40} />
                </div>
                <p className="text-lg font-black text-slate-400 uppercase italic tracking-widest">No Active Logistics Entries</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default LogisticsHub;
