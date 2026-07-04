'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CreditCard, ShoppingBag, MapPin, Loader2, AlertCircle, Banknote, QrCode } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, showToast, clearCart } = useApp();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [upiId, setUpiId] = useState('');
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
  });
  
  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const handleInputChange = (e) => {
    setShippingForm({
      ...shippingForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.address || !shippingForm.city || !shippingForm.zipCode) {
      showToast('Please complete all shipping address fields.', 'error');
      return;
    }

    setLoading(true);

    if (paymentMethod === 'upi' && !upiId) {
      showToast('Please enter your UPI ID.', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          cartItems: cart.map(i => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout initialization failed.');

      if (paymentMethod === 'upi' || paymentMethod === 'cod') {
        showToast(`Order placed successfully via ${paymentMethod.toUpperCase()}!`, 'success');
        clearCart();
        router.push('/order-history');
        return;
      }

      showToast('Redirecting to payment gateway...', 'success');
      
      // Redirect to target URL (could be Stripe checkout or mock success url)
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL returned.');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
      setLoading(false);
    }
  };

  const estimatedTax = cartTotal * 0.08;
  const shippingCost = cartTotal > 150 ? 0 : 15.00;
  const orderTotal = cartTotal + estimatedTax + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Loader2 className="spinner" />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', letterSpacing: '-0.02em' }}>
        Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="checkout-layout">
        
        {/* Left Column: Form Details */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Shipping Section */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <MapPin size={18} style={{ color: 'var(--accent-primary)' }} /> Shipping Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shippingForm.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingForm.address}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="123 Workspace Dr."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingForm.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={shippingForm.zipCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="94107"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info Section */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <CreditCard size={18} style={{ color: 'var(--accent-primary)' }} /> Payment Details
            </h2>

            {/* Payment Method Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <button type="button" onClick={() => setPaymentMethod('credit_card')} className={`btn ${paymentMethod === 'credit_card' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px', fontSize: '0.85rem' }}>
                <CreditCard size={16} /> Card
              </button>
              <button type="button" onClick={() => setPaymentMethod('upi')} className={`btn ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px', fontSize: '0.85rem' }}>
                <QrCode size={16} /> UPI
              </button>
              <button type="button" onClick={() => setPaymentMethod('cod')} className={`btn ${paymentMethod === 'cod' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px', fontSize: '0.85rem' }}>
                <Banknote size={16} /> COD
              </button>
            </div>

            {paymentMethod === 'credit_card' && (
              <>
                <div style={{ padding: '12px 16px', background: 'var(--accent-glow)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <AlertCircle size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Stripe Developer Mode</strong><br />
                    If your Stripe API Key is set in your `.env` file, clicking pay redirects you to Stripe&apos;s checkout page. Otherwise, we will automatically run a simulated checkout flow inside your browser.
                  </div>
                </div>

                {/* Mock Credit Card Graphics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Card Number</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="•••• •••• •••• ••••"
                      disabled={loading}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Expiration</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="MM / YY"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>CVC</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="•••"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input-field"
                    placeholder="example@upi"
                    disabled={loading}
                  />
                </div>
                <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed var(--border-glass)', borderRadius: '8px' }}>
                  <QrCode size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Scan QR code from your UPI app (Simulated)</p>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div style={{ padding: '20px', textAlign: 'center', border: '1px solid var(--border-glass)', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
                <Banknote size={32} style={{ color: 'var(--accent-primary)', margin: '0 auto 10px' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Cash on Delivery</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>You will pay the total amount when the order is delivered to your address.</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" style={{ width: '18px', height: '18px', borderLeftColor: '#fff' }} /> Processing Payment...
              </>
            ) : (
              `Pay $${orderTotal.toFixed(2)}`
            )}
          </button>
        </form>

        {/* Right Column: Basket Summary */}
        <div>
          <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <ShoppingBag size={18} style={{ color: 'var(--accent-primary)' }} /> Order Items
            </h2>

            {/* Items row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-glass)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifycontent: 'space-between', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifycontent: 'space-between', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span>{shippingCost === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifycontent: 'space-between', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifycontent: 'space-between', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '12px', marginTop: '4px', fontSize: '1.05rem', fontWeight: 700 }}>
                <span>Grand Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (min-width: 992px) {
          .checkout-layout {
            grid-template-columns: 1.5fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
