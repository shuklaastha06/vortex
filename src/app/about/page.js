'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Layers, Globe, Users, Award } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';

export default function AboutPage() {
  const values = [
    {
      icon: <Layers size={24} className="text-accent" />,
      title: 'Precision Craftsmanship',
      desc: 'Every accessory is designed in-house and engineered with materials like grade-5 titanium, solid walnut, and vegetable-tanned leather.'
    },
    {
      icon: <ShieldCheck size={24} className="text-accent" />,
      title: 'Built to Last',
      desc: 'We reject the cycle of planned obsolescence. Our products come with lifetime guarantees because true sustainability means buying it once.'
    },
    {
      icon: <Globe size={24} className="text-accent" />,
      title: 'Ethical Production',
      desc: 'Our manufacturing facilities run on 100% renewable energy, and we partner exclusively with certified fair-labor workshops.'
    }
  ];

  const milestones = [
    { year: '2022', title: 'The Genesis', desc: 'Vortex started in a small workshop with a single product: the minimalist MagSafe desk stand.' },
    { year: '2023', title: 'Growing Community', desc: 'Expanded our catalog to premium desk mats and leather accessories, serving over 10,000 workspaces.' },
    { year: '2024', title: 'Sustainable Leap', desc: 'Transitioned to 100% recycled packaging and carbon-neutral shipping operations globally.' },
    { year: '2026', title: 'Global Presence', desc: 'Now shipping to over 85 countries with active design studios in San Francisco and Tokyo.' }
  ];

  return (
    <div className="container" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Background Lights */}
      <div className="animate-float-1" style={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div className="animate-float-2" style={{
        position: 'absolute',
        bottom: '20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 0 40px', position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
            <Sparkles size={14} />
            Our Vision & Journey
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Designing Workspace <br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Masterpieces
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            At Vortex, we believe your workspace is a reflection of your state of mind. We design beautiful, hyper-functional accessories to elevate your focus, creativity, and flow.
          </p>
        </ScrollReveal>

        {/* Floating Showcase Mock Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', margin: '40px 0 60px' }}>
          {values.map((v, idx) => (
            <ScrollReveal key={idx} delay={idx * 150}>
              <TiltCard className="glass-panel" style={{ padding: '30px', textAlign: 'left', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{v.desc}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ margin: '60px 0', position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <div className="glass-panel" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            padding: '40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(18, 18, 22, 0.8) 0%, rgba(30, 27, 75, 0.3) 100%)',
            border: '1px solid var(--border-glass)'
          }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>45K+</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Happy Desk Owners</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>99.8%</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Customer Satisfaction</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>15+</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>International Awards</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>100%</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Carbon Neutral shipping</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Interactive Timeline */}
      <section style={{ padding: '60px 0', position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '50px' }}>Our Milestones</h2>
        </ScrollReveal>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          {/* Vertical Center Line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, var(--border-glass) 0%, var(--accent-primary) 50%, var(--border-glass) 100%)',
            transform: 'translateX(-50%)',
            zIndex: 0
          }}></div>

          {milestones.map((m, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <ScrollReveal key={idx} delay={idx * 100} className="timeline-item-container">
                <div style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  alignItems: 'center',
                  marginBottom: '40px',
                  width: '100%',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {/* Timeline Card */}
                  <div className="glass-panel" style={{
                    width: '45%',
                    padding: '24px',
                    position: 'relative',
                    border: '1px solid var(--border-glass)'
                  }}>
                    {/* Floating badge for year */}
                    <span style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      background: 'rgba(99, 102, 241, 0.12)',
                      padding: '4px 10px',
                      borderRadius: '12px'
                    }}>
                      {m.year}
                    </span>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px', paddingRight: '45px' }}>{m.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{m.desc}</p>
                  </div>

                  {/* Center Dot Indicator */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    border: '4px solid var(--bg-primary)',
                    boxShadow: '0 0 10px var(--accent-primary)',
                    transform: 'translateX(-50%)'
                  }}></div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Styles for responsive mobile layout timeline override */}
      <style jsx>{`
        @media (max-width: 768px) {
          .timeline-item-container :global(div) {
            justify-content: flex-start !important;
          }
          .timeline-item-container :global(.glass-panel) {
            width: 85% !important;
            margin-left: 15% !important;
          }
          .timeline-item-container :global(div:last-child) {
            left: 7% !important;
          }
        }
      `}</style>
    </div>
  );
}
