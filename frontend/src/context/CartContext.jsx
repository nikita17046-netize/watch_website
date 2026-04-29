import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';

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
      const res = await API.get('/cart');
      setCart(res.data.cart.items || []);
    } catch (err) {
      console.error("Fetch cart error", err);
    }
    setLoading(false);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await API.post('/cart/add', { productId, quantity });
      setCart(res.data.cart.items);
      return res.data;
    } catch (err) {
      console.error("Add to cart error", err);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.post('/cart/remove', { productId });
      setCart(res.data.cart.items);
    } catch (err) {
      console.error("Remove from cart error", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await API.post('/cart/update', { productId, quantity });
      setCart(res.data.cart.items);
    } catch (err) {
      console.error("Update cart error", err);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
