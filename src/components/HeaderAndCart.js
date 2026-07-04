'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag,
  User,
  Sun,
  Moon,
  X,
  Trash2,
  Plus,
  Minus,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Home,
  Package,
  Mail,
  Box
} from 'lucide-react';

export default function HeaderAndCart() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    theme,
    toggleTheme,
    user,
    logout,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartItemCount,
    toasts,
    addToCart
  } = useApp();

  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState(false);
  const [realRecentOrder, setRealRecentOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [recommendedProduct, setRecommendedProduct] = useState(null);

  useEffect(() => {
    fetch('/api/products?limit=1')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setRecommendedProduct(data.products[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (orderTrackerOpen && user) {
      setLoadingOrder(true);
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.orders && data.orders.length > 0) {
            setRealRecentOrder(data.orders[0]);
          }
          setLoadingOrder(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingOrder(false);
        });
    }
  }, [orderTrackerOpen, user]);

  const recentOrder = {
    id: 'ORD-9823X',
    status: 'In Transit',
    item: 'Start Shopping',
    date: 'No recent orders found',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200'
  };

  const displayOrder = realRecentOrder ? {
    id: realRecentOrder.id,
    status: realRecentOrder.status === 'PAID' ? 'Processing' : realRecentOrder.status === 'SHIPPED' ? 'In Transit' : realRecentOrder.status,
    item: realRecentOrder.items[0]?.product?.name || 'Multiple Items',
    date: new Date(realRecentOrder.createdAt).toLocaleDateString(),
    image: realRecentOrder.items[0]?.product?.image || recentOrder.image
  } : recentOrder;


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      {/* Dynamic Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <header className="header-glass">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: '20px' }}>
          
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', perspective: '1000px' }}>
            <Box size={28} style={{ color: 'var(--accent-primary)', animation: 'spin-3d 6s linear infinite', filter: 'drop-shadow(0px 4px 8px rgba(236, 72, 153, 0.4))' }} />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              textShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              transform: 'rotateX(5deg)',
              display: 'inline-block'
            }}>
              VORTEX
            </span>
          </Link>

          {/* Search bar (only show on home/shop related routes or search redirects) */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '400px', display: 'flex' }}>
            <input
              type="text"
              placeholder="Search products..."
              className="input-field"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '8px' }}
            />
          </form>

          {/* Navigation Controls */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ fontSize: '0.95rem', fontWeight: 500, color: pathname === '/' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
              Catalog
            </Link>

            <Link href="/#about" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              About
            </Link>

            {user?.role === 'ADMIN' && (
              <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem', fontWeight: 600, color: pathname.startsWith('/admin') ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                <LayoutDashboard size={16} />
                Admin
              </Link>
            )}
          </nav>

          {/* User Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* Contact Icon */}
            <Link href="/#contact" className="btn-secondary" style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Contact Us">
              <Mail size={18} />
            </Link>

            {/* Orders Tracking Icon */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setOrderTrackerOpen(!orderTrackerOpen); setRecommendationOpen(false); }}
                  className="btn-secondary"
                  style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Track Orders"
                >
                  <Package size={18} style={{ color: orderTrackerOpen ? 'var(--accent-primary)' : 'inherit' }} />
                </button>
                {orderTrackerOpen && (
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '40px',
                    right: '-20px',
                    width: '260px',
                    padding: '16px',
                    zIndex: 110,
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-glass)',
                  }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={14} style={{ color: 'var(--accent-primary)' }} /> Recent Order
                    </h4>
                    {loadingOrder ? (
                      <div style={{ textAlign: 'center', padding: '10px 0' }}>Loading...</div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                          <img src={displayOrder.image} alt={displayOrder.item} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{displayOrder.item}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{displayOrder.date}</p>
                          </div>
                        </div>
                        {realRecentOrder && (
                          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px', marginBottom: '12px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              ● {displayOrder.status}
                            </span>
                          </div>
                        )}
                        {!realRecentOrder && (
                          <Link href="/" onClick={() => setOrderTrackerOpen(false)} className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: '0.85rem', marginBottom: '12px', padding: '8px' }}>
                            Start Shopping
                          </Link>
                        )}
                        <Link href="/order-history" onClick={() => setOrderTrackerOpen(false)} style={{ display: 'block', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'underline' }}>
                          View Full History
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Recommendation Icon */}
            {recommendedProduct && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setRecommendationOpen(!recommendationOpen); setOrderTrackerOpen(false); }}
                  className="btn-secondary"
                  style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}
                  title="Today's Recommendation"
                >
                  <Home size={18} />
                  <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', backgroundColor: 'var(--accent-primary)', borderRadius: '50%', border: '1px solid var(--bg-glass)' }} />
                </button>
                {recommendationOpen && (
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '40px',
                    right: '-60px',
                    width: '240px',
                    padding: '16px',
                    zIndex: 110,
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                      Recommended for You
                    </h4>
                    <img src={recommendedProduct.image} alt={recommendedProduct.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{recommendedProduct.name}</h5>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>${recommendedProduct.price}</p>
                    </div>
                    <button onClick={() => { addToCart(recommendedProduct); setRecommendationOpen(false); }} className="btn btn-primary" style={{ padding: '8px', fontSize: '0.85rem' }}>
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Theme Switcher */}
            <button onClick={toggleTheme} className="btn-secondary" style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ShoppingBag size={22} style={{ color: 'var(--text-primary)' }} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Session Dropdown */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px' }}
                  className="btn-secondary"
                >
                  <User size={18} />
                  <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <ChevronDown size={14} />
                </button>
                
                {dropdownOpen && (
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    minWidth: '160px',
                    padding: '8px',
                    zIndex: 110,
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)', marginBottom: '4px' }}>
                      Signed in as<br />
                      <strong style={{ color: 'var(--text-primary)' }}>{user.email}</strong>
                    </div>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '0.9rem', borderRadius: '6px' }}>
                        Dashboard
                      </Link>
                    )}
                    <Link href="/order-history" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '0.9rem', borderRadius: '6px' }}>
                      My Orders
                    </Link>
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '0.9rem', borderRadius: '6px', color: 'var(--danger)', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/login" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  Log In
                </Link>
                <Link href="/register" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Cart Side Drawer Panel */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease'
        }} onClick={() => setIsCartOpen(false)}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '420px',
            height: '100%',
            borderRadius: 0,
            borderLeft: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Drawer Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={22} style={{ color: 'var(--accent-primary)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Your Shopping Cart</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer', padding: '4px' }}>
                <X size={24} />
              </button>
            </div>

            {/* Drawer Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3 }} />
                  <p>Your cart is empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Shop Products
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-glass)', borderRadius: '6px', padding: '2px 6px' }}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)} style={{ cursor: 'pointer' }}><Minus size={14} /></button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)} style={{ cursor: 'pointer' }}><Plus size={14} /></button>
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ cursor: 'pointer', height: 'fit-content', color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '24px', borderTop: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 600 }}>
                  <span>Subtotal</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700 }}>${cartTotal.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taxes and shipping calculated at checkout.</p>
                <button onClick={handleCheckoutClick} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  Proceed to Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Drawer Animations styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
