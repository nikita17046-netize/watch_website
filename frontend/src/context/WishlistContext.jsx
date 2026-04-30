import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await API.get('/wishlist/all');
      const items = (res.data.wishlist?.productIds || []).map(p => p.item.productId).filter(p => p);
      setWishlist(items);
    } catch (err) {
      console.error("Fetch wishlist error", err);
    }
    setLoading(false);
  };

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error('Please login to curate your collection', {
        style: { background: '#1A1A1A', color: '#fff', fontSize: '12px' }
      });
      return;
    }

    const isExist = wishlist.some(item => item._id === product._id);
    
    try {
      if (isExist) {
        const res = await API.post('/wishlist/remove', { productId: product._id });
        const items = (res.data.wishlist?.productIds || []).map(p => p.item.productId).filter(p => p);
        setWishlist(items);
        toast.error(`${product.name} removed from registry`, {
          style: { borderRadius: '15px', background: '#fff', color: '#0F2044', fontSize: '12px', fontWeight: 'bold' }
        });
      } else {
        const res = await API.post('/wishlist/add', { 
          item: { productId: product._id } 
        });
        const items = (res.data.wishlist?.productIds || []).map(p => p.item.productId).filter(p => p);
        setWishlist(items);
        toast.success(`${product.name} added to registry!`, {
          icon: '❤️',
          style: { borderRadius: '15px', background: '#fff', color: '#0F2044', fontSize: '12px', fontWeight: 'bold' }
        });
      }
    } catch (err) {
      console.error("Wishlist action error", err);
      toast.error("Unable to update registry");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await API.post('/wishlist/remove', { productId });
      const items = (res.data.wishlist?.productIds || []).map(p => p.item.productId).filter(p => p);
      setWishlist(items);
    } catch (err) {
      console.error("Remove from wishlist error", err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
