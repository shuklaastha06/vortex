'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ProductDetailClient({ product }) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQtyChange = (val) => {
    if (val < 1) return;
    if (val > product.stock) return;
    setQuantity(val);
  };

  const handleAddToCartClick = () => {
    addToCart(product, quantity);
  };

  // Mock specifications based on category
  const getSpecs = () => {
    switch (product.category) {
      case 'Electronics':
        return [
          { label: 'Connectivity', value: 'Wireless / USB-C Wired' },
          { label: 'Compatibility', value: 'Windows, macOS, Linux' },
          { label: 'Warranty', value: '2-Year Limited Warranty' },
          { label: 'Latency', value: '1ms ultra-low latency' }
        ];
      case 'Accessories':
        return [
          { label: 'Material', value: 'Full-Grain Leather & Brass Accent' },
          { label: 'Waterproof', value: 'Yes (Waxed canvas outer layers)' },
          { label: 'Hardware', value: 'Custom YKK Zippers' },
          { label: 'Size', value: 'Fits up to 16" device screen sizes' }
        ];
      case 'Apparel':
        return [
          { label: 'Composition', value: '80% Italian Wool, 20% Cachemire' },
          { label: 'Fit Type', value: 'Slim / Tailored Fit' },
          { label: 'Origin', value: 'Made in Florence, Italy' },
          { label: 'Care', value: 'Dry Clean Only' }
        ];
      case 'Home Decor':
        return [
          { label: 'Illumination', value: 'Dimmable 2700K Warm LED' },
          { label: 'Power Source', value: 'AC adapter with braided cable' },
          { label: 'Dimensions', value: '14" height x 8" base diameter' },
          { label: 'Material', value: 'Eco-conscious frosted matte ceramic' }
        ];
      default:
        return [
          { label: 'Quality Grade', value: 'Premium Grade' },
          { label: 'Dimensions', value: 'Standard size' },
          { label: 'Origin', value: 'Imported' }
        ];
    }
  };

  return (
    <div className="container">
      {/* Back to Catalog Link */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="details-grid">
        
        {/* Left Column: Product Image Panel */}
        <div className="glass-panel" style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-glass)',
          height: 'fit-content'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '8px' }}
          />
        </div>

        {/* Right Column: Information Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Metadata */}
          <div>
            <span className="badge" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', marginBottom: '10px' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '8px' }}>
              {product.name}
            </h1>
            
            {/* Rating Stars Mockup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--warning)', letterSpacing: '2px' }}>★★★★★</span>
              <span>4.9 / 5.0 (42 client reviews)</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="glass-panel" style={{ padding: '16px 24px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Stock Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            {isOutOfStock ? (
              <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <AlertTriangle size={16} /> Out of stock. Restocking soon.
              </span>
            ) : isLowStock ? (
              <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <AlertTriangle size={16} /> Hurray! Only {product.stock} items left in stock.
              </span>
            ) : (
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                ✓ In Stock and ready to ship ({product.stock} items)
              </span>
            )}
          </div>

          {/* Tab Navigation */}
          <div>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '14px' }}>
              <button
                onClick={() => setActiveTab('description')}
                style={{
                  padding: '10px 16px',
                  color: activeTab === 'description' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'description' ? '2px solid var(--accent-primary)' : 'none',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                style={{
                  padding: '10px 16px',
                  color: activeTab === 'specifications' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'specifications' ? '2px solid var(--accent-primary)' : 'none',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Specifications
              </button>
            </div>

            {/* Tab content */}
            {activeTab === 'description' ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {product.description}
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  {getSpecs().map((spec) => (
                    <tr key={spec.label} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '8px 0', color: 'var(--text-muted)', fontWeight: 500, width: '40%' }}>{spec.label}</td>
                      <td style={{ padding: '8px 0', color: 'var(--text-primary)' }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Add to Cart Actions */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '6px 12px', backgroundColor: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty:</span>
                <button
                  onClick={() => handleQtyChange(quantity - 1)}
                  style={{ cursor: 'pointer', padding: '4px', fontWeight: 'bold' }}
                >
                  -
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => handleQtyChange(quantity + 1)}
                  style={{ cursor: 'pointer', padding: '4px', fontWeight: 'bold' }}
                >
                  +
                </button>
              </div>

              <button onClick={handleAddToCartClick} className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>
                <ShoppingCart size={18} /> Add {(quantity > 1) ? `${quantity} items` : 'to cart'}
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Truck size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Free Express Shipping</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Secure Transactions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <RefreshCw size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>30-Day Free Returns</span>
            </div>
          </div>

        </div>

      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .details-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
      `}</style>
    </div>
  );
}
