import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DesignSystem, BorderRadiusScale } from '../../types';
import { getAccessibleColor } from '../../utils/accessibility';
import { ValueUnitInput } from '../ui/ValueUnitInput';
import { getStyleModifiers } from '../../utils/designStyleUtils';

interface BorderRadiusSystemProps {
  system: DesignSystem;
  activeTheme: string;
  setDesignSystem: React.Dispatch<React.SetStateAction<DesignSystem | null>>;
}

const remToPx = (remStr: string) => {
  if (!remStr || !remStr.includes('rem')) return remStr;
  const val = parseFloat(remStr.replace('rem', ''));
  if (isNaN(val)) return remStr;
  return `${Math.round(val * 16)}px`;
};

export const BorderRadiusSystem: React.FC<BorderRadiusSystemProps> = ({ system, activeTheme, setDesignSystem }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const theme = system.themes[activeTheme];
  const designStyle = system.designStyle || 'flat';
  const headerColor = getAccessibleColor(theme.textPrimary, theme.background);
  const subHeaderColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');

  const panelStyleModifiers = getStyleModifiers(designStyle, theme, 'panel', false);

  const handleScaleChange = (index: number, field: keyof BorderRadiusScale, value: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      const newScale = [...prev.borderRadius.scale];
      newScale[index] = { ...newScale[index], [field]: value };
      return {
        ...prev,
        borderRadius: {
          ...prev.borderRadius,
          scale: newScale
        }
      };
    });
  };

  return (
    <section ref={sectionRef} className="w-full h-full flex flex-col">
      <h3 
        className="text-4xl font-bold mb-12 tracking-tight"
        style={{ fontFamily: `"${system.typography?.displayFont?.name || 'Playfair Display'}", serif`, color: headerColor }}
      >
        Border Radius
      </h3>

      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-sm border flex-grow" style={{ border: `1px solid ${theme.borderSubtle}`, background: theme.surface, ...panelStyleModifiers }}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {(system.borderRadius?.scale || []).map((scale, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div 
                className="w-24 h-24 mb-6 shadow-md border flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                style={{ 
                  borderRadius: scale.value, 
                  background: theme.surfaceSecondary,
                  borderColor: theme.border,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
              >
                <div 
                  className="w-12 h-12 border-2 border-dashed opacity-30"
                  style={{ borderRadius: scale.value, borderColor: theme.primary }}
                />
              </div>
              <input 
                type="text" 
                value={scale.name}
                onChange={(e) => handleScaleChange(idx, 'name', e.target.value)}
                className="font-mono text-sm font-bold mb-1 bg-transparent border-b outline-none text-center w-full"
                style={{ color: theme.textPrimary, borderColor: theme.borderSubtle }}
              />
              <div className="flex flex-col items-center justify-center gap-1 mb-2 w-full">
                <ValueUnitInput 
                  value={scale.value}
                  onChange={(val) => handleScaleChange(idx, 'value', val)}
                  units={['rem', 'px', 'em', '%']}
                  theme={theme}
                  step={0.1}
                />
                <span className="font-mono text-[10px] opacity-70" style={{ color: subHeaderColor }}>
                  ({remToPx(scale.value)})
                </span>
              </div>
              <input 
                type="text" 
                value={scale.usage || ''}
                onChange={(e) => handleScaleChange(idx, 'usage', e.target.value)}
                className="text-xs italic opacity-60 bg-transparent border-b outline-none text-center w-full"
                style={{ color: theme.textTertiary, borderColor: theme.borderSubtle }}
                placeholder="Usage"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
