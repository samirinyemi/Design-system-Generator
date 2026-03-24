import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DesignSystem, ShadowScale } from '../../types';
import { getAccessibleColor } from '../../utils/accessibility';

interface ShadowSystemProps {
  system: DesignSystem;
  activeTheme: string;
  setDesignSystem: React.Dispatch<React.SetStateAction<DesignSystem | null>>;
}

export const ShadowSystem: React.FC<ShadowSystemProps> = ({ system, activeTheme, setDesignSystem }) => {
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
  const headerColor = getAccessibleColor(theme.textPrimary, theme.background);
  const subHeaderColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');

  const handleScaleChange = (index: number, field: keyof ShadowScale, value: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      const newScale = [...prev.shadows.scale];
      newScale[index] = { ...newScale[index], [field]: value };
      return {
        ...prev,
        shadows: {
          ...prev.shadows,
          scale: newScale
        }
      };
    });
  };

  return (
    <section ref={sectionRef} className="w-full">
      <h3 
        className="text-4xl font-bold mb-12 tracking-tight"
        style={{ fontFamily: `"${system.typography?.displayFont?.name || 'Playfair Display'}", serif`, color: headerColor }}
      >
        Elevation & Shadows
      </h3>

      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-sm border" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(system.shadows?.scale || []).map((scale, idx) => (
            <div 
              key={idx} 
              className="group relative flex flex-col items-center p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{ 
                background: theme.surfaceSecondary, 
                border: `1px solid ${theme.border}`,
                boxShadow: scale.value 
              }}
            >
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <input 
                  type="text" 
                  value={scale.name}
                  onChange={(e) => handleScaleChange(idx, 'name', e.target.value)}
                  className="font-mono text-sm font-bold bg-transparent border-b outline-none w-24"
                  style={{ color: theme.textPrimary, borderColor: theme.borderSubtle }}
                />
                <input 
                  type="text" 
                  value={scale.usage || ''}
                  onChange={(e) => handleScaleChange(idx, 'usage', e.target.value)}
                  className="text-xs italic opacity-60 bg-transparent border-b outline-none text-right w-24"
                  style={{ color: theme.textTertiary, borderColor: theme.borderSubtle }}
                  placeholder="Usage"
                />
              </div>
              
              <div 
                className="w-24 h-24 mt-8 mb-6 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                style={{ background: theme.surface, boxShadow: scale.value }}
              >
                <div className="w-8 h-8 rounded-full opacity-20" style={{ background: theme.primary }} />
              </div>
              
              <div className="text-center w-full px-4">
                <textarea 
                  value={scale.value}
                  onChange={(e) => handleScaleChange(idx, 'value', e.target.value)}
                  className="font-mono text-[10px] leading-relaxed opacity-70 break-words bg-transparent border-b outline-none w-full text-center resize-none"
                  style={{ color: subHeaderColor, borderColor: theme.borderSubtle }}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
