import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    category: '',
    sku: '',
    images: []
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'products') {
        const res = await API.get('/product');
        setProducts(res.data.products);
      } else if (activeTab === 'orders') {
        const res = await API.get('/order/all');
        setOrders(res.data.orders);
      } else if (activeTab === 'users') {
        const res = await API.get('/user/all');
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/admin/product/${editingProduct._id}`, formData);
        toast.success('Product updated');
      } else {
        await API.post('/admin/product', formData);
        toast.success('Product added');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this masterpiece?')) {
      try {
        await API.delete(`/admin/product/${id}`);
        toast.success('Product removed');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="bg-luxury-pearl min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-playfair mb-4">Admin Console</h1>
            <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
              <button onClick={() => setActiveTab('products')} className={`pb-2 border-b-2 transition-all ${activeTab === 'products' ? 'border-luxury-gold text-luxury-charcoal' : 'border-transparent text-gray-400'}`}>Products</button>
              <button onClick={() => setActiveTab('orders')} className={`pb-2 border-b-2 transition-all ${activeTab === 'orders' ? 'border-luxury-gold text-luxury-charcoal' : 'border-transparent text-gray-400'}`}>Orders</button>
              <button onClick={() => setActiveTab('users')} className={`pb-2 border-b-2 transition-all ${activeTab === 'users' ? 'border-luxury-gold text-luxury-charcoal' : 'border-transparent text-gray-400'}`}>Users</button>
            </div>
          </div>
          
          {activeTab === 'products' && (
            <button 
              onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', brand: '', category: '', sku: '', images: [] }); setIsModalOpen(true); }}
              className="bg-luxury-charcoal text-white px-8 py-3 text-xs tracking-widest uppercase font-bold hover:bg-luxury-gold transition-all flex items-center gap-2"
            >
              <Plus size={16} /> New Product
            </button>
          )}
        </div>

        {activeTab === 'products' && (
          <div className="bg-white luxury-border overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-luxury-pearl text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <th className="px-6 py-4">Watch</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p._id} className="text-sm">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={p.images[0]} className="w-12 h-12 object-cover luxury-border" />
                      <span className="font-bold">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 uppercase text-xs">{p.brand}</td>
                    <td className="px-6 py-4 font-bold">${p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <button onClick={() => { setEditingProduct(p); setFormData(p); setIsModalOpen(true); }} className="text-luxury-charcoal hover:text-luxury-gold transition-colors"><Edit size={16} /></button>
                        <button onClick={() => deleteProduct(p._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12 luxury-border"
            >
              <button className="absolute top-6 right-6" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              <h2 className="text-3xl font-playfair mb-10">{editingProduct ? 'Update Masterpiece' : 'Add New Timepiece'}</h2>
              
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Product Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" />
                </div>
                <div className="md:col-span-2 border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm min-h-[100px]" />
                </div>
                <div className="border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Price ($)</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" />
                </div>
                <div className="border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Stock</label>
                  <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" />
                </div>
                <div className="border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Brand</label>
                  <input required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" />
                </div>
                <div className="border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Category</label>
                  <input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" />
                </div>
                <div className="border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">SKU</label>
                  <input required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" />
                </div>
                <div className="border-b py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Image URL</label>
                  <input required value={formData.images[0] || ''} onChange={(e) => setFormData({...formData, images: [e.target.value]})} className="w-full bg-transparent outline-none py-2 text-sm" />
                </div>
                
                <button 
                  type="submit" 
                  className="md:col-span-2 bg-luxury-charcoal text-white py-5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-luxury-gold transition-all mt-6"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
