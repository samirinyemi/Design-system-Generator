import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DesignSystem, SpacingScale } from '../../types';
import { getAccessibleColor } from '../../utils/accessibility';
import { ValueUnitInput } from '../ui/ValueUnitInput';
import { getStyleModifiers } from '../../utils/designStyleUtils';

interface SpacingSystemProps {
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

export const SpacingSystem: React.FC<SpacingSystemProps> = ({ system, activeTheme, setDesignSystem }) => {
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

  const handleScaleChange = (index: number, field: keyof SpacingScale, value: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      const newScale = [...prev.spacing.scale];
      newScale[index] = { ...newScale[index], [field]: value };
      return {
        ...prev,
        spacing: {
          ...prev.spacing,
          scale: newScale
        }
      };
    });
  };

  const handleUnitChange = (value: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        spacing: {
          ...prev.spacing,
          unit: value
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
        Spacing Scale
      </h3>

      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-sm border flex-grow" style={{ border: `1px solid ${theme.borderSubtle}`, background: theme.surface, ...panelStyleModifiers }}>
        <div className="flex justify-between items-center mb-8 pb-4 border-b" style={{ borderColor: theme.borderSubtle }}>
          <span className="text-sm font-medium uppercase tracking-wider" style={{ color: subHeaderColor }}>Base Unit</span>
          <div className="w-32">
            <ValueUnitInput 
              value={system.spacing?.unit || '4px'}
              onChange={handleUnitChange}
              units={['px', 'rem', 'em']}
              theme={theme}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-6">
          {(system.spacing?.scale || []).map((scale, idx) => (
            <div key={idx} className="flex items-center group">
              <div className="w-48 flex-shrink-0 flex flex-col gap-2 pr-4">
                <input 
                  type="text" 
                  value={scale.name}
                  onChange={(e) => handleScaleChange(idx, 'name', e.target.value)}
                  className="font-mono text-sm font-bold bg-transparent border-b outline-none w-full"
                  style={{ color: theme.textPrimary, borderColor: theme.borderSubtle }}
                />
                <div className="flex flex-col gap-1">
                  <ValueUnitInput 
                    value={scale.value}
                    onChange={(val) => handleScaleChange(idx, 'value', val)}
                    units={['rem', 'px', 'em']}
                    theme={theme}
                    step={0.1}
                  />
                  <span className="font-mono text-[10px] opacity-70" style={{ color: subHeaderColor }}>
                    ({remToPx(scale.value)})
                  </span>
                </div>
              </div>
              <div className="flex-grow flex items-center h-8 relative">
                <div 
                  className="h-full rounded-md transition-all duration-500 ease-out group-hover:opacity-80"
                  style={{ 
                    width: scale.value, 
                    background: theme.primary,
                    opacity: 0.6
                  }}
                />
                <div className="absolute inset-y-0 left-0 border-l border-r border-dashed opacity-30" style={{ width: scale.value, borderColor: theme.textPrimary }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
