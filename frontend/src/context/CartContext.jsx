import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await API.get('/cart/all');
      const mappedItems = (res.data.cart.items || []).map(item => ({
        ...item,
        product: item.productId
      }));
      setCart(mappedItems);
    } catch (err) {
      console.error("Fetch cart error", err);
    }
    setLoading(false);
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Identity Verification Required. Please login to acquire this masterpiece.', {
        style: { background: '#1A1A1A', color: '#fff', fontSize: '10px', border: '1px solid #C9A84C' }
      });
      return false;
    }

    try {
      const res = await API.post('/cart/add', { 
        item: { productId, quantity } 
      });
      const mappedItems = (res.data.cart.items || []).map(item => ({
        ...item,
        product: item.productId
      }));
      setCart(mappedItems);
      toast.success('Piece added to your collection', {
        style: { background: '#C9A84C', color: '#fff', fontSize: '12px' }
      });
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Unable to update registry";
      toast.error(errorMsg);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {

    try {
      const res = await API.delete(`/cart/product/${productId}`);
      const mappedItems = (res.data.cart.items || []).map(item => ({
        ...item,
        product: item.productId
      }));
      setCart(mappedItems);
      toast.success('Registry updated successfully');
    } catch (err) {
      console.error("Remove from cart error", err);
      toast.error('Unable to remove item from registry');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await API.post('/cart/update', { productId, quantity });
      const mappedItems = (res.data.cart.items || []).map(item => ({
        ...item,
        product: item.productId
      }));
      setCart(mappedItems);
    } catch (err) {
      console.error("Update cart error", err);
    }
  };

  const clearCart = async () => {
    try {
      await API.post('/cart/clear');
      setCart([]);
    } catch (err) {
      console.error("Clear cart error", err);
      // Fallback: clear local state anyway to unblock user
      setCart([]);
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
