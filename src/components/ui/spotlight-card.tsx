import React, { useEffect, useRef, ReactNode } from 'react';

/**
 * GlowCard Component
 * A premium card that features a "Spotlight" lighting effect following the cursor.
 * Uses CSS variables and radial gradients to create a dynamic glow.
 */
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'sage' | 'gold' | 'sky' | 'purple' | 'blue';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const glowColorMap = {
  sage: { base: 143, spread: 35 }, // Matches --brand-sage
  gold: { base: 35, spread: 60 },  // Matches --brand-gold
  sky: { base: 209, spread: 58 },   // Matches --brand-sky
  purple: { base: 280, spread: 300 },
  blue: { base: 220, spread: 200 },
};

export const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'sage',
  size = 'full'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tracking global pointer movements to update the lighting effect variables
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  // Sizing definitions
  const sizeClasses = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80',
    lg: 'w-80 h-96',
    full: 'w-full h-full'
  }[size];

  const inlineStyles = {
    '--base': base,
    '--spread': spread,
    '--radius': '24',
    '--border': '2',
    '--backdrop': 'rgba(255, 255, 255, 0.01)',
    '--size': '300',
    '--border-size': 'calc(var(--border) * 1px)',
    '--spotlight-size': 'calc(var(--size) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) 80% 80% / 0.05), transparent
    )`,
    backgroundAttachment: 'fixed',
    position: 'relative' as const,
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue) 100% 70% / 0.8), transparent 100%
      );
      filter: brightness(1.5);
    }
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        white, transparent 100%
      );
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={inlineStyles}
        className={`
          ${sizeClasses}
          rounded-[2rem] 
          overflow-hidden 
          relative 
          transition-all 
          duration-300
          ${className}
        `}
      >
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </>
  );
};
