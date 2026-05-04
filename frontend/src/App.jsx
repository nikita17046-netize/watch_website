import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components & Layout
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import OfferProducts from './pages/OfferProducts';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';
import LogisticsHub from './pages/LogisticsHub';



// Protected Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/profile" />;
  return children;
};

const AdminAutoRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  // If logged in as admin, always go to admin panel first on root access
  if (user && user.role === 'admin') return <Navigate to="/admin" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1A1A1A',
                  color: '#FDFDFD',
                  borderRadius: '0',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }
              }}
            />
            <Layout>
              <Routes>
                {/* Public Entrance */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Always show Home page first, no auto-redirect */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/offer/:id" element={<OfferProducts />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/faq" element={<FAQ />} />


                <Route path="/profile" element={<Profile />} />


                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />

                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } />
                <Route path="/logistics" element={
                  <AdminRoute>
                    <LogisticsHub />
                  </AdminRoute>
                } />
              </Routes>
            </Layout>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
