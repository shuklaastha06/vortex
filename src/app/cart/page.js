'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useApp();

  const shippingCost = cartTotal > 150 ? 0 : 15.00;
  const estimatedTax = cartTotal * 0.08; // 8% tax
  const orderTotal = cartTotal + shippingCost + estimatedTax;

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', letterSpacing: '-0.02em' }}>
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
          <ShoppingBag size={64} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--accent-primary)' }} />
          <h2>Your cart is currently empty.</h2>
          <p style={{ fontSize: '0.95rem', marginTop: '6px', marginBottom: '24px' }}>
            Before checking out, you must add some products to your shopping cart.
          </p>
          <Link href="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="cart-layout">
          
          {/* Left Column: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)', alignItems: 'center' }}>
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
                  />

                  {/* Title and Category */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      <Link href={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '6px 12px', backgroundColor: 'var(--bg-secondary)' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                      style={{ cursor: 'pointer', padding: '2px', fontWeight: 'bold' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                      style={{ cursor: 'pointer', padding: '2px', fontWeight: 'bold' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Pricing Breakdown */}
                  <div style={{ textAlign: 'right', minWidth: '90px' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button onClick={() => removeFromCart(item.id)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Trash2 size={18} />
                  </button>

                </div>
              ))}

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
                <button onClick={clearCart} style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 500 }}>
                  Clear Cart
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ fontWeight: 600 }}>
                    {shippingCost === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax</span>
                  <span style={{ fontWeight: 600 }}>${estimatedTax.toFixed(2)}</span>
                </div>

                {shippingCost > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'var(--accent-glow)', padding: '6px 10px', borderRadius: '6px' }}>
                    Add <strong>${(150 - cartTotal).toFixed(2)}</strong> more to get free shipping!
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '4px' }}>
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary" style={{ padding: '14px', width: '100%' }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      )}

      <style jsx global>{`
        @media (min-width: 992px) {
          .cart-layout {
            grid-template-columns: 1.6fr 0.9fr !important;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
