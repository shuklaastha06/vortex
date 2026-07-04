'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Eye, Sparkles, PackageCheck, AlertTriangle, Layers, ShieldCheck, Globe, Mail, Phone, MapPin, Send, HelpCircle, ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';

function CatalogContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useApp();
  
  const search = searchParams.get('search') || '';
  
  const [products, setProducts] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Contact form state
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const aboutValues = [
    { icon: <Layers size={22} />, title: 'Precision Craftsmanship', desc: 'Every accessory is designed in-house and engineered with materials like grade-5 titanium, solid walnut, and vegetable-tanned leather.' },
    { icon: <ShieldCheck size={22} />, title: 'Built to Last', desc: 'We reject planned obsolescence. Our products come with lifetime guarantees — true sustainability means buying it once.' },
    { icon: <Globe size={22} />, title: 'Ethical Production', desc: 'Our facilities run on 100% renewable energy, and we partner exclusively with certified fair-labor workshops.' }
  ];

  const milestones = [
    { year: '2022', title: 'The Genesis', desc: 'Vortex launched with a single product: the minimalist MagSafe desk stand.' },
    { year: '2023', title: 'Growing Community', desc: 'Expanded to premium desk mats and leather accessories, serving over 10,000 workspaces.' },
    { year: '2024', title: 'Sustainable Leap', desc: 'Transitioned to 100% recycled packaging and carbon-neutral shipping globally.' },
    { year: '2026', title: 'Global Presence', desc: 'Now shipping to 85+ countries with design studios in San Francisco and Tokyo.' }
  ];

  const faqs = [
    { q: 'How long does shipping take?', a: 'Standard US shipping takes 3–5 business days. International express takes 5–7 days depending on customs.' },
    { q: 'Do you offer custom dimensions?', a: 'We offer Medium, Large, and XL standard sizes. Custom collaborations are offered seasonally for design firms.' },
    { q: 'What is your returns policy?', a: '30-day hassle-free returns. Items must be in original, unused condition with original packaging.' },
    { q: 'Where are products manufactured?', a: 'Leather is tanned in Tuscany, Italy. Final assembly is handled at our zero-waste partner facility in San Francisco.' }
  ];

  const contactMethods = [
    { icon: <Mail size={18} />, label: 'Email Us', val: 'hello@vortexgear.com' },
    { icon: <Phone size={18} />, label: 'Call Support', val: '+1 (800) 555-0199' },
    { icon: <MapPin size={18} />, label: 'Showroom', val: '320 Branden St, San Francisco, CA' }
  ];

  // Fetch catalog from database based on filters
  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (selectedCategory && selectedCategory !== 'All') {
          query.set('category', selectedCategory);
        }

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, [search, selectedCategory]);

  return (
    <div className="container">
      {/* Premium Hero Banner */}
      <ScrollReveal>
        <section
          className="glass-panel"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          style={{
            padding: '60px 40px',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.45) 0%, rgba(18, 18, 22, 0.85) 100%)',
            border: '1px solid var(--border-glass)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Dense 3D Showcase Box */}
          <div
            className="glass-panel hidden-mobile"
            style={{
              position: 'absolute',
              top: '10%',
              right: '8%',
              width: '320px',
              height: '320px',
              transformStyle: 'preserve-3d',
              perspective: '1200px',
              transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px) rotateX(${mousePos.y * 10}deg) rotateY(${mousePos.x * -10}deg)`,
              transition: 'transform 0.15s ease-out',
              display: 'block',
              zIndex: 1,
              background: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(59,130,246,0.1) 100%)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {/* Item 1 - Top Left */}
            <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
              <div className="animate-float-1" style={{ width: '80px', height: '80px', backgroundImage: 'url("https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=200")', backgroundSize: 'cover', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }} />
            </div>
            {/* Item 2 - Top Right */}
            <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
              <div className="animate-float-2" style={{ width: '70px', height: '70px', backgroundImage: 'url("https://images.unsplash.com/photo-1527814050087-379381547330?auto=format&fit=crop&q=80&w=200")', backgroundSize: 'cover', borderRadius: '50%', boxShadow: 'var(--shadow-md)' }} />
            </div>
            {/* Item 3 - Bottom Left */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
              <div className="animate-float-1" style={{ width: '75px', height: '75px', backgroundImage: 'url("https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200")', backgroundSize: 'cover', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', animationDelay: '-2s' }} />
            </div>
            {/* Item 4 - Bottom Right */}
            <div style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
              <div className="animate-float-2" style={{ width: '75px', height: '75px', backgroundImage: 'url("https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=200")', backgroundSize: 'cover', borderRadius: '20px', boxShadow: 'var(--shadow-md)', animationDelay: '-5s' }} />
            </div>
            {/* Center Core Glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', background: 'var(--accent-primary)', filter: 'blur(30px)', borderRadius: '50%', opacity: 0.6, pointerEvents: 'none' }} />
          </div>

          {/* Glow Element */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '350px',
            height: '350px',
            background: 'rgba(249, 115, 22, 0.2)',
            filter: 'blur(80px)',
            borderRadius: '50%',
            pointerEvents: 'none',
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            transition: 'transform 0.15s ease-out'
          }}></div>

          <div style={{
            maxWidth: '600px',
            zIndex: 2,
            position: 'relative',
            transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s ease-out'
          }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', 
              background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(59,130,246,0.15))', 
              border: '1px solid rgba(236,72,153,0.3)', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 600, 
              color: 'transparent', backgroundImage: 'linear-gradient(135deg, var(--accent-primary), #3b82f6)', backgroundClip: 'text', WebkitBackgroundClip: 'text' 
            }}>
              <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
              Elevate Your Setup
            </div>
            <h1 style={{ 
              fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '14px', letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-primary) 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Handcrafted Gear for Modern Workspaces
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Discover our curated collection of desk accessories, apparel, and hardware designed for clean aesthetics and performance.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelectedCategory('All')} className="btn btn-primary">
                Browse Collection
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Top Recommendations Row */}
      {products.length > 0 && (
        <ScrollReveal delay={50}>
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ color: 'var(--accent-primary)' }} /> Top Recommendations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {products.slice(0, 3).map((product) => (
                <TiltCard key={`rec-${product.id}`} maxTilt={8} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <Link href={`/product/${product.id}`} style={{ display: 'block', overflow: 'hidden', borderRadius: '12px', marginBottom: '16px', flexGrow: 1 }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'transform 0.4s ease' }} className="hover-zoom" />
                  </Link>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>{product.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{product.category}</p>
                    </div>
                    <p style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>${product.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(product); }}
                    className="btn btn-secondary" style={{ width: '100%', marginTop: '16px', padding: '10px' }}
                  >
                    <ShoppingCart size={16} /> Quick Add
                  </button>
                </TiltCard>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Catalog Navigation & Filters */}
      <ScrollReveal delay={100}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '30px' }}>
          {/* Categories Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  borderRadius: '99px',
                  background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: selectedCategory === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Active search text indicator */}
          {search && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Search results for: <strong style={{ color: 'var(--text-primary)' }}>&ldquo;{search}&rdquo;</strong>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Loading Skeletal Frames */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel" style={{ height: '380px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '200px', background: 'var(--bg-tertiary)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ height: '24px', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '70%', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ height: '16px', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '50%', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ height: '36px', background: 'var(--bg-tertiary)', borderRadius: '8px', marginTop: 'auto', animation: 'pulse 1.5s infinite' }}></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
          <PackageCheck size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3>No products match your criteria.</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Try adjusting your keywords or clearing selected filters.</p>
        </div>
      ) : (
        /* Products Grid Catalog */
        <ScrollReveal delay={200}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {products.map((product, idx) => {
              const isLowStock = product.stock > 0 && product.stock <= 5;
              const isOutOfStock = product.stock <= 0;

              return (
                <ScrollReveal key={product.id} delay={idx * 50} style={{ height: '100%' }}>
                  <TiltCard className="glass-panel" style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative'
                  }}>
                    {/* Category tag badge */}
                    <span className="badge" style={{
                      position: 'absolute',
                      top: '26px',
                      left: '26px',
                      zIndex: 2,
                      background: 'rgba(18, 18, 22, 0.8)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-secondary)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.7rem'
                    }}>
                      {product.category}
                    </span>

                    {/* Product Image Frame */}
                    <div style={{
                      height: '200px',
                      width: '100%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: 'var(--bg-tertiary)',
                      marginBottom: '16px',
                      border: '1px solid var(--border-glass)'
                    }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform var(--transition-normal)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>

                    {/* Title & Desc */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{product.name}</h3>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {product.description}
                      </p>
                    </div>

                    {/* Stock Warning Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {isOutOfStock ? (
                        <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={14} /> Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={14} /> Only {product.stock} left
                        </span>
                      ) : (
                        <span style={{ color: 'var(--success)' }}>
                          In Stock ({product.stock})
                        </span>
                      )}
                    </div>

                    {/* Price and Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ${product.price.toFixed(2)}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link href={`/product/${product.id}`} className="btn btn-secondary" style={{ padding: '8px' }}>
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={isOutOfStock}
                          className="btn btn-primary"
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.8rem',
                            opacity: isOutOfStock ? 0.5 : 1,
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                      </div>
                    </div>

                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </ScrollReveal>
      )}

      {/* ========== ABOUT SECTION ========== */}
      <section id="about" style={{ padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div className="animate-float-1" style={{ position: 'absolute', top: '0', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
        <div className="animate-float-2" style={{ position: 'absolute', bottom: '0', right: '-10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

        {/* Section Header */}
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-primary)', background: 'rgba(249,115,22,0.12)', padding: '5px 14px', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.2)' }}>Our Vision &amp; Journey</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.1, margin: '16px 0 14px', letterSpacing: '-0.02em' }}>
              Designing Workspace{' '}
              <span style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Masterpieces</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
              At Vortex, we believe your workspace is a reflection of your state of mind. We design beautiful, hyper-functional accessories to elevate your focus, creativity, and flow.
            </p>
          </div>
        </ScrollReveal>

        {/* Core Values Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '60px', position: 'relative', zIndex: 1 }}>
          {aboutValues.map((v, idx) => (
            <ScrollReveal key={idx} delay={idx * 120}>
              <TiltCard className="glass-panel" style={{ padding: '28px', height: '100%', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: '18px', color: 'var(--accent-primary)' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>{v.desc}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Stats Row */}
        <ScrollReveal delay={100}>
          <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', padding: '36px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(21,18,16,0.9) 0%, rgba(40,25,10,0.4) 100%)', marginBottom: '60px' }}>
            {[['45K+', 'Happy Desk Owners'], ['99.8%', 'Customer Satisfaction'], ['15+', 'International Awards'], ['100%', 'Carbon Neutral Shipping']].map(([num, label]) => (
              <div key={label}>
                <h3 style={{ fontSize: '2.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px' }}>{num}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Milestones Timeline */}
        <ScrollReveal>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, textAlign: 'center', marginBottom: '40px' }}>Our Milestones</h3>
        </ScrollReveal>
        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--border-glass) 0%, var(--accent-primary) 50%, var(--border-glass) 100%)', transform: 'translateX(-50%)' }} />
          {milestones.map((m, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div style={{ display: 'flex', justifyContent: idx % 2 === 0 ? 'flex-start' : 'flex-end', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
                <div className="glass-panel" style={{ width: '44%', padding: '20px', border: '1px solid var(--border-glass)' }}>
                  <span style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', background: 'rgba(249,115,22,0.12)', padding: '3px 8px', borderRadius: '10px' }}>{m.year}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', paddingRight: '40px' }}>{m.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>{m.desc}</p>
                </div>
                <div style={{ position: 'absolute', left: '50%', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--accent-primary)', border: '3px solid var(--bg-primary)', boxShadow: '0 0 10px var(--accent-primary)', transform: 'translateX(-50%)', top: '18px' }} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section id="contact" style={{ padding: '60px 0 80px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-primary)', background: 'rgba(249,115,22,0.12)', padding: '5px 14px', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.2)' }}>Get In Touch</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, margin: '16px 0 12px', letterSpacing: '-0.02em' }}>We&apos;d Love to Hear From You</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
              Have questions about products, custom designs, or shipping? Fill out the form or reach out directly.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* Left: Contact Methods + FAQ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ScrollReveal>
              {contactMethods.map((m, idx) => {
                const isEmail = m.label === 'Email Us';
                const isPhone = m.label === 'Call Support';
                const href = isEmail ? `mailto:${m.val}` : isPhone ? `tel:${m.val.replace(/[^0-9+]/g, '')}` : null;
                const CardWrapper = href ? 'a' : 'div';
                return (
                  <CardWrapper 
                    key={idx} 
                    href={href}
                    className="glass-panel" 
                    style={{ 
                      padding: '22px 18px', display: 'flex', alignItems: 'center', gap: '14px', 
                      border: '1px solid var(--border-glass)', marginBottom: '16px',
                      textDecoration: 'none', color: 'inherit',
                      background: 'var(--bg-glass)',
                      cursor: href ? 'pointer' : 'default',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)', color: 'var(--accent-primary)', flexShrink: 0 }}>{m.icon}</div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)' }}>{m.val}</p>
                    </div>
                  </CardWrapper>
                );
              })}
            </ScrollReveal>

          </div>

          {/* Right: Contact Form (Moved here for better DOM order: Info -> Form -> FAQ) */}
          <ScrollReveal delay={100}>
            <div className="glass-panel" style={{ padding: '34px', border: '1px solid var(--border-glass)', background: 'linear-gradient(135deg, rgba(18,18,22,0.8) 0%, rgba(30,27,75,0.2) 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1px', left: '10%', right: '10%', height: '1px', background: 'linear-gradient(to right, transparent, var(--accent-primary), transparent)', opacity: 0.5 }} />
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success)', marginBottom: '18px' }}>
                    <Send size={22} style={{ transform: 'rotate(-45deg) translate(2px,-2px)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '8px' }}>Message Dispatched!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>Thank you! We&apos;ve received your message and will respond within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '22px', fontSize: '0.82rem' }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '6px' }}>Send a Message</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '22px' }}>Our team reads and responds to every single inquiry.</p>
                  <div style={{ display: 'grid', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                      <input type="text" name="name" required className="input-field" placeholder="Jane Doe" value={formState.name} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                      <input type="email" name="email" required className="input-field" placeholder="jane@example.com" value={formState.email} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject (Optional)</label>
                      <input type="text" name="subject" className="input-field" placeholder="How can we help?" value={formState.subject} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Message</label>
                      <textarea name="message" required className="input-field" placeholder="Tell us what you have in mind..." rows={5} style={{ resize: 'vertical' }} value={formState.message} onChange={handleInputChange} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '12px', fontSize: '0.88rem', width: '100%', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '6px' }}>
                      {isSubmitting ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span> : <><Send size={15} /> Dispatch Message</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* FAQ Accordion */}
          <ScrollReveal delay={150}>
            <div className="glass-panel" style={{ padding: '22px', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={16} style={{ color: 'var(--accent-primary)' }} /> Common Questions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {faqs.map((faq, idx) => (
                  <div key={idx} style={{ borderBottom: idx < faqs.length - 1 ? '1px solid var(--border-glass)' : 'none', paddingBottom: '10px' }}>
                    <button onClick={() => toggleFaq(idx)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', padding: '4px 0', fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer' }}>
                      <span>{faq.q}</span>
                      <ChevronDown size={15} style={{ color: 'var(--text-secondary)', transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)', flexShrink: 0, marginLeft: '8px' }} />
                    </button>
                    <div style={{ maxHeight: openFaq === idx ? '120px' : '0', overflow: 'hidden', opacity: openFaq === idx ? 1 : 0, transition: 'max-height var(--transition-normal), opacity var(--transition-normal)', paddingTop: openFaq === idx ? '8px' : '0', color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.55 }}>
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Local keyframe animations for loaders */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="spinner"></div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
export const dynamic = 'force-dynamic';
