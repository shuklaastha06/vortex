'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Calendar, Package, ArrowRight, Loader2 } from 'lucide-react';

export default function OrderHistoryPage() {
  const { showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
        showToast('Could not load order history.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PAID':
        return 'badge-paid';
      case 'SHIPPED':
        return 'badge-shipped';
      case 'CANCELLED':
        return 'badge-cancelled';
      default:
        return 'badge-pending';
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', letterSpacing: '-0.02em' }}>
        Order History
      </h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
          <Package size={64} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--accent-primary)' }} />
          <h2>You haven&apos;t placed any orders yet.</h2>
          <p style={{ fontSize: '0.95rem', marginTop: '6px', marginBottom: '24px' }}>
            Browse our catalog and place your first order.
          </p>
          <Link href="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-panel" style={{
              padding: '24px',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Order Metadata Header */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                borderBottom: '1px solid var(--border-glass)',
                paddingBottom: '14px'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Order Placed</span>
                    <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {formatDate(order.createdAt)}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Order ID</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{order.id}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Total Amount</span>
                    <strong style={{ color: 'var(--accent-primary)' }}>${order.total.toFixed(2)}</strong>
                  </div>
                </div>
                <div>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.product?.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <span>Qty: {item.quantity}</span>
                        <span>Price Snapshot: ${item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                    <div>
                      <Link href={`/product/${item.productId}`} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                        Buy Again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
