'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, ShoppingBag, History, Loader2, AlertCircle } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const { clearCart, showToast } = useApp();

  const isSimulated = searchParams.get('simulated') === 'true';
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  // Clear cart and finalize payment status
  useEffect(() => {
    // Clear cart immediately on successful checkout mount
    clearCart();

    async function processOrderCompletion() {
      if (!orderId) {
        setLoading(false);
        setError('Missing order identifier.');
        return;
      }

      try {
        if (isSimulated) {
          // Finalize mock checkout status
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'finalize-mock', orderId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to finalize simulated order.');
          setOrder(data.order);
        } else {
          // Stripe verification / Fetch order info
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get-order', orderId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to fetch order information.');
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Success order fetch error:', err);
        setError(err.message);
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    }

    processOrderCompletion();
  }, [orderId, isSimulated, sessionId]);

  return (
    <div className="container" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 className="spinner" />
          <h3>Confirming your transaction...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We are securing your reserved inventory items.</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 24px', border: '1px solid var(--danger)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <AlertCircle size={48} style={{ color: 'var(--danger)' }} />
          <h3>Transaction Verification Error</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Return to Catalog
          </Link>
        </div>
      ) : (
        /* Order Confirmed Screen */
        <div className="glass-panel" style={{
          padding: '40px',
          textAlign: 'center',
          border: '1px solid var(--border-glass)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(18, 18, 22, 0.8) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Success Check Circle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid var(--success)', marginBottom: '8px' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--success)' }} />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Payment Successful!
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto' }}>
            Thank you for purchasing with Vortex. We have verified your credentials, checked the inventory limits, and finalized your order.
          </p>

          {isSimulated && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 500 }}>
              💡 Simulated Development Sandbox: Stripe Webhook Simulated Successfully.
            </div>
          )}

          {/* Invoice Summary */}
          {order && (
            <div className="glass-panel" style={{
              width: '100%',
              padding: '20px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              textAlign: 'left',
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Order ID: {order.id}</span>
                <span className="badge badge-paid">PAID</span>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.product.name} <strong style={{ color: 'var(--text-muted)' }}>x {item.quantity}</strong>
                    </span>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* total */}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700 }}>
                <span>Total Amount Charged</span>
                <span style={{ color: 'var(--accent-primary)' }}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', width: '100%', gap: '12px', marginTop: '16px' }}>
            <Link href="/" className="btn btn-primary" style={{ flex: 1 }}>
              <ShoppingBag size={16} /> Shop More
            </Link>
            <Link href="/order-history" className="btn btn-secondary" style={{ flex: 1 }}>
              <History size={16} /> My Orders
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="spinner"></div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
export const dynamic = 'force-dynamic';
