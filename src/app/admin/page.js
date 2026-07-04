'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  PlusCircle,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const { showToast } = useApp();

  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin dashboard analytics
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load statistics.');
        
        setStats(data.stats);
        setLowStockProducts(data.lowStockProducts);
        setRecentOrders(data.recentOrders);
      } catch (err) {
        console.error(err);
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID': return <span className="badge badge-paid">PAID</span>;
      case 'SHIPPED': return <span className="badge badge-shipped">SHIPPED</span>;
      case 'CANCELLED': return <span className="badge badge-cancelled">CANCELLED</span>;
      default: return <span className="badge badge-pending">PENDING</span>;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Loader2 className="spinner" />
      </div>
    );
  }

  return (
    <div className="container">
      {/* Dashboard Subheader */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Admin Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>Monitor transactional statistics, store orders, and stock levels.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin/products" className="btn btn-primary">
            <PlusCircle size={16} /> Manage Inventory
          </Link>
        </div>
      </div>

      {/* Grid Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Revenue */}
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
              <span>Total Revenue</span>
              <DollarSign size={18} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>
              ${stats.totalRevenue.toFixed(2)}
            </h2>
          </div>

          {/* Orders */}
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
              <span>Total Orders</span>
              <ShoppingBag size={18} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>
              {stats.totalOrders}
            </h2>
          </div>

          {/* Customers */}
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #a855f7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
              <span>Total Customers</span>
              <Users size={18} style={{ color: '#a855f7' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>
              {stats.totalCustomers}
            </h2>
          </div>

          {/* Low Stock warnings */}
          <div className="glass-panel" style={{
            padding: '20px',
            borderLeft: `4px solid ${stats.lowStockAlerts > 0 ? 'var(--danger)' : 'var(--success)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
              <span>Low Stock Alerts</span>
              <AlertTriangle size={18} style={{ color: stats.lowStockAlerts > 0 ? 'var(--danger)' : 'var(--success)' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>
              {stats.lowStockAlerts}
            </h2>
          </div>
        </div>
      )}

      {/* Main Stats layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="admin-grid">
        
        {/* Left Column: Recent Orders Table */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} /> Recent Orders
          </h3>

          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>No orders recorded yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 8px' }}>Order ID</th>
                  <th style={{ padding: '10px 8px' }}>Customer</th>
                  <th style={{ padding: '10px 8px' }}>Date</th>
                  <th style={{ padding: '10px 8px' }}>Total</th>
                  <th style={{ padding: '10px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 500, fontFamily: 'monospace' }}>{ord.id.slice(0, 8)}...</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ display: 'block', fontWeight: 500 }}>{ord.user.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ord.user.email}</span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>{formatDate(ord.createdAt)}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>${ord.total.toFixed(2)}</td>
                    <td style={{ padding: '12px 8px' }}>{getStatusBadge(ord.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Column: Inventory Stock alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Low stock card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} style={{ color: 'var(--danger)' }} /> Inventory Replenishments
            </h3>

            {lowStockProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--success)', fontSize: '0.9rem' }}>
                ✓ All items have healthy stock levels.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {lowStockProducts.map((prod) => (
                  <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{prod.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge badge-cancelled" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {prod.stock} left
                      </span>
                      <Link href="/admin/products" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        Restock
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (min-width: 992px) {
          .admin-grid {
            grid-template-columns: 1.6fr 0.9fr !important;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
