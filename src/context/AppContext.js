'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export function AppProvider({ children }) {
  const router = useRouter();
  
  // Theme State
  const [theme, setTheme] = useState('dark');

  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  // Fetch current user on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkSession();
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-dismiss in 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Auth Functions
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setUser(data.user);
      showToast('Logged in successfully!', 'success');
      return { success: true };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, error: error.message };
    }
  };

  const register = async (email, name, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setUser(data.user);
      showToast('Registration successful!', 'success');
      return { success: true };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      showToast('Logged out successfully', 'info');
      router.push('/');
      router.refresh();
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  // Local Storage Cart persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        let parsed = JSON.parse(savedCart);
        // Auto-fix stale mock products
        parsed = parsed.filter(item => item.id !== 'rec-001');
        setCart(parsed);
        localStorage.setItem('cart', JSON.stringify(parsed));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((item) => item.id === product.id);
    let updatedCart;
    if (existing) {
      // Validate bounds against stock
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        showToast(`Cannot add more. Only ${product.stock} items in stock.`, 'error');
        return;
      }
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: newQty } : item
      );
    } else {
      if (quantity > product.stock) {
        showToast(`Cannot add item. Only ${product.stock} items in stock.`, 'error');
        return;
      }
      updatedCart = [...cart, { ...product, quantity }];
    }
    saveCartToStorage(updatedCart);
    showToast(`Added ${product.name} to cart.`, 'success');
    setIsCartOpen(true); // Open drawer automatically
  };

  const removeFromCart = (productId) => {
    const item = cart.find((i) => i.id === productId);
    const updatedCart = cart.filter((i) => i.id !== productId);
    saveCartToStorage(updatedCart);
    if (item) {
      showToast(`Removed ${item.name} from cart.`, 'info');
    }
  };

  const updateQuantity = (productId, newQuantity, maxStock) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (newQuantity > maxStock) {
      showToast(`Only ${maxStock} items available in stock.`, 'error');
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        authLoading,
        login,
        register,
        logout,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
