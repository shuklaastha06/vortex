'use client';

import React, { useState, useRef } from 'react';

export default function TiltCard({
  children,
  className = '',
  style = {},
  maxTilt = 8,
  glowColor = 'rgba(249, 115, 22, 0.18)'
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('rotateX(0deg) rotateY(0deg) scale(1)');
  const [glowStyle, setGlowStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position relative to card center, normalized between -1 and 1
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);

    // Calculate rotation angles
    const rX = -y * maxTilt;
    const rY = x * maxTilt;

    setTransformStyle(`rotateX(${rX}deg) rotateY(${rY}deg) scale(1.015)`);

    // Cursor position in percentage for radial gradient overlay
    const px = ((e.clientX - rect.left) / width) * 100;
    const py = ((e.clientY - rect.top) / height) * 100;

    setGlowStyle({
      opacity: 1,
      background: `radial-gradient(circle 180px at ${px}% ${py}%, ${glowColor}, transparent)`,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('rotateX(0deg) rotateY(0deg) scale(1)');
    setGlowStyle({ opacity: 0, transition: 'opacity 0.5s ease, background 0.5s ease' });
  };

  return (
    <div className="perspective-container" style={{ height: '100%' }}>
      <div
        ref={cardRef}
        className={`tilt-card ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          ...style,
          transform: transformStyle,
          position: 'relative',
        }}
      >
        {/* Glow overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            zIndex: 1,
            mixBlendMode: 'screen',
            transition: 'opacity 0.1s ease',
            ...glowStyle
          }}
        />
        {/* Content container */}
        <div className="tilt-card-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
