'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Instagram, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-glass)',
      padding: '60px 0 30px',
      marginTop: '60px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        
        {/* Upper Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link href="/" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              VORTEX
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Designing and crafting premium workspace gear for programmers, creators, and digital enthusiasts. Elevate your desk.
            </p>
            <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Instagram size={18} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Twitter size={18} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <Link href="/" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Shop Catalog
              </Link>
              <Link href="/#about" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                About Our Story
              </Link>
              <Link href="/#contact" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Contact & Support
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
              Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <Link href="/?category=Desk+Mats" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Desk Mats
              </Link>
              <Link href="/?category=Accessories" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Accessories
              </Link>
              <Link href="/?category=Organizers" style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Organizers
              </Link>
            </div>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
              Newsletter
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '16px' }}>
              Subscribe to get notified about product drops and designer collaborations.
            </p>
            
            {subscribed ? (
              <div style={{
                color: 'var(--success)',
                fontSize: '0.8rem',
                fontWeight: 500,
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.15)'
              }}>
                Successfully Subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: '0.8rem',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-primary)'}
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Lower Footer Divider */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'between',
          gap: '16px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ flex: 1 }}>
            &copy; {new Date().getFullYear()} Vortex Commerce. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Secure SSL Encrypted checkout</span>
            <span>Powered by Stripe</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
