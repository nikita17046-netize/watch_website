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
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      setWishlist(guestWishlist);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await API.get('/wishlist/all');
      // More robust parsing of wishlist items
      const items = (res.data.wishlist?.productIds || [])
        .map(p => p?.item?.productId)
        .filter(p => p && typeof p === 'object');
      setWishlist(items);
    } catch (err) {
      console.error("Fetch wishlist error", err);
    }
    setLoading(false);
  };

  const addToWishlist = async (product) => {
    // Check existence by ID string to be safe
    const isExist = wishlist.some(item => (item._id || item).toString() === product._id.toString());

    if (!user) {
      let updatedWishlist;
      if (isExist) {
        updatedWishlist = wishlist.filter(item => (item._id || item).toString() !== product._id.toString());
        toast.error(`${product.name} removed from registry`, {
          style: { borderRadius: '15px', background: '#fff', color: '#1A1A1A', fontSize: '12px', fontWeight: 'bold' }
        });
      } else {
        updatedWishlist = [...wishlist, product];
        toast.success(`${product.name} added to registry!`, {
          icon: '❤️',
          style: { borderRadius: '15px', background: '#fff', color: '#1A1A1A', fontSize: '12px', fontWeight: 'bold' }
        });
      }
      setWishlist(updatedWishlist);
      localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      return;
    }

    try {
      if (isExist) {
        const res = await API.post('/wishlist/remove', { productId: product._id });
        const items = (res.data.wishlist?.productIds || [])
          .map(p => p?.item?.productId)
          .filter(p => p && typeof p === 'object');
        setWishlist(items);
        toast.error(`${product.name} removed from registry`, {
          style: { borderRadius: '15px', background: '#fff', color: '#1A1A1A', fontSize: '12px', fontWeight: 'bold' }
        });
      } else {
        const res = await API.post('/wishlist/add', { 
          item: { productId: product._id } 
        });
        const items = (res.data.wishlist?.productIds || [])
          .map(p => p?.item?.productId)
          .filter(p => p && typeof p === 'object');
        setWishlist(items);
        toast.success(`${product.name} added to registry!`, {
          icon: '❤️',
          style: { borderRadius: '15px', background: '#fff', color: '#1A1A1A', fontSize: '12px', fontWeight: 'bold' }
        });
      }
    } catch (err) {
      console.error("Wishlist action error", err);
      toast.error("Unable to update registry");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      const updatedWishlist = wishlist.filter(item => (item._id || item).toString() !== productId.toString());
      setWishlist(updatedWishlist);
      localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      toast.error(`Item removed from your registry`, {
        style: { borderRadius: '15px', background: '#fff', color: '#1A1A1A', fontSize: '12px', fontWeight: 'bold' }
      });
      return;
    }

    try {
      const res = await API.post('/wishlist/remove', { productId });
      const items = (res.data.wishlist?.productIds || [])
        .map(p => p?.item?.productId)
        .filter(p => p && typeof p === 'object');
      setWishlist(items);
      toast.error(`Item removed from your registry`, {
        style: { borderRadius: '15px', background: '#fff', color: '#1A1A1A', fontSize: '12px', fontWeight: 'bold' }
      });
    } catch (err) {
      console.error("Remove from wishlist error", err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item).toString() === productId.toString());
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
