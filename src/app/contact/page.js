'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleInputChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const contactMethods = [
    { icon: <Mail size={20} />, label: 'Email Us', val: 'hello@vortexgear.com', actionText: 'Send message' },
    { icon: <Phone size={20} />, label: 'Call Support', val: '+1 (800) 555-0199', actionText: 'Call support' },
    { icon: <MapPin size={20} />, label: 'Flagship Showroom', val: '320 Branden St, San Francisco, CA', actionText: 'Get directions' }
  ];

  const faqs = [
    { q: 'How long does shipping take?', a: 'Standard continental US shipping takes 3-5 business days. International express takes 5-7 business days depending on customs processing.' },
    { q: 'Do you offer custom dimensions for desk mats?', a: 'Currently we offer three standard sizes (Medium, Large, and Extra Large). Custom-sized collaborations are offered seasonally for design firms.' },
    { q: 'What is your returns policy?', a: 'We offer a 30-day hassle-free returns policy. Items must be returned in their original packaging and unused condition.' },
    { q: 'Where are your products manufactured?', a: 'We source responsibly. Our leather is tanned in Tuscany, Italy, and final assembly is handled in our zero-waste partners in San Francisco, CA.' }
  ];

  return (
    <div className="container" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Gradients */}
      <div className="animate-float-2" style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{ textAlign: 'center', padding: '60px 0 30px' }}>
        <ScrollReveal>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.12)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, margin: '16px 0 12px', letterSpacing: '-0.02em' }}>
            We'd Love to Hear From You
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about products, custom designs, or shipping? Fill out the form or reach out directly to support.
          </p>
        </ScrollReveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', margin: '40px 0 60px', position: 'relative', zIndex: 1 }}>
        
        {/* Left Side: Contact Methods & FAQs */}
        <div>
          <ScrollReveal>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
              {contactMethods.map((m, idx) => (
                <TiltCard key={idx} maxTilt={5} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' }}>
                    {m.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</h4>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{m.val}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </ScrollReveal>

          {/* Interactive Showroom Map Card */}
          <ScrollReveal delay={150}>
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glass)', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px' }}>San Francisco Showroom</h3>
              {/* Mock Stylized Map */}
              <div style={{
                height: '180px',
                background: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }} className="grid-bg">
                {/* Visual Radar Pulse */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    borderRadius: '50%',
                    border: '2px solid var(--accent-primary)',
                    animation: 'pulse 2s infinite',
                    opacity: 0
                  }}></div>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(18, 18, 22, 0.9)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  border: '1px solid var(--border-glass)',
                  fontWeight: 500
                }}>
                  Showroom Hub
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* FAQs Accordion */}
          <ScrollReveal delay={200}>
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glass)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} style={{ color: 'var(--accent-primary)' }} />
                Common Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                      <button
                        onClick={() => toggleFaq(idx)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          padding: '4px 0',
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={16}
                          style={{
                            color: 'var(--text-secondary)',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-fast)'
                          }}
                        />
                      </button>
                      
                      <div style={{
                        maxHeight: isOpen ? '120px' : '0',
                        overflow: 'hidden',
                        opacity: isOpen ? 1 : 0,
                        transition: 'max-height var(--transition-normal), opacity var(--transition-normal)',
                        paddingTop: isOpen ? '8px' : '0',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        lineHeight: 1.5
                      }}>
                        {faq.a}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side: Glowing Interactive Contact Form */}
        <ScrollReveal delay={100}>
          <div className="glass-panel" style={{
            padding: '36px',
            border: '1px solid var(--border-glass)',
            background: 'linear-gradient(135deg, rgba(18, 18, 22, 0.8) 0%, rgba(30, 27, 75, 0.2) 100%)',
            position: 'relative'
          }}>
            
            {/* Subtle glow edge border */}
            <div style={{
              position: 'absolute',
              top: '-1px',
              left: '10%',
              right: '10%',
              height: '1px',
              background: 'linear-gradient(to right, transparent, var(--accent-primary), transparent)',
              opacity: 0.5
            }}></div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--success)',
                  marginBottom: '20px'
                }}>
                  <Send size={24} style={{ transform: 'rotate(-45deg) translate(2px, -2px)' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Message Dispatched</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Thank you for reaching out! We've received your request and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-secondary"
                  style={{ marginTop: '24px', fontSize: '0.85rem' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Send a Message</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Our team reads and responds to every single inquiry.
                </p>

                <div style={{ display: 'grid', gap: '20px' }}>
                  
                  {/* Name field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="input-field"
                      placeholder="Jane Doe"
                      value={formState.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="input-field"
                      placeholder="jane@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Subject field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject (Optional)</label>
                    <input
                      type="text"
                      name="subject"
                      className="input-field"
                      placeholder="How can we help?"
                      value={formState.subject}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Message</label>
                    <textarea
                      name="message"
                      required
                      className="input-field"
                      placeholder="Tell us what you have in mind..."
                      rows={5}
                      style={{ resize: 'vertical' }}
                      value={formState.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{
                      marginTop: '10px',
                      padding: '12px 24px',
                      fontSize: '0.9rem',
                      width: '100%',
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? (
                      <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                    ) : (
                      <>
                        <Send size={16} /> Dispatch Message
                      </>
                    )}
                  </button>

                </div>
              </form>
            )}
          </div>
        </ScrollReveal>

      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
