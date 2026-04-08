import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { DesignSystem } from '../../types';
import { useToast } from '../Toast';
import { getAccessibleColor } from '../../utils/accessibility';
import { ColorInput } from '../ui/ColorInput';
import ColorPicker from 'react-best-gradient-color-picker';
import { getStyleModifiers } from '../../utils/designStyleUtils';

interface ColorSystemProps {
  system: DesignSystem;
  activeTheme: string;
  setDesignSystem: React.Dispatch<React.SetStateAction<DesignSystem | null>>;
}

export const ColorSystem: React.FC<ColorSystemProps> = ({ system, activeTheme, setDesignSystem }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

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

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex}`);
  };

  const handleColorChange = (key: string, newHex: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      
      // Update the color in the colors object
      const updatedColors = { ...prev.colors };
      if (key in updatedColors) {
        (updatedColors as any)[key] = {
          ...(updatedColors as any)[key],
          hex: newHex
        };
      }
      
      // Also update the theme if it's a primary/secondary/accent color
      const updatedThemes = { ...prev.themes };
      if (key === 'primary' || key === 'secondary' || key === 'accent') {
        Object.keys(updatedThemes).forEach(themeKey => {
          updatedThemes[themeKey] = {
            ...updatedThemes[themeKey],
            [key]: newHex
          };
        });
      }

      return {
        ...prev,
        colors: updatedColors,
        themes: updatedThemes
      };
    });
  };

  const handleThemeColorChange = (key: string, newHex: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      
      const updatedThemes = { ...prev.themes };
      const themeToUpdate = { ...updatedThemes[activeTheme], [key]: newHex };

      // Automatically update foreground colors for better contrast
      if (key === 'primary' || key === 'secondary' || key === 'accent') {
        const hex = newHex.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) || 0;
        const g = parseInt(hex.substr(2, 2), 16) || 0;
        const b = parseInt(hex.substr(4, 2), 16) || 0;
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        const foregroundColor = (yiq >= 128) ? '#000000' : '#FFFFFF';
        
        themeToUpdate[`${key}Foreground`] = foregroundColor;
      }

      updatedThemes[activeTheme] = themeToUpdate;

      return {
        ...prev,
        themes: updatedThemes
      };
    });
  };

  const theme = system.themes[activeTheme];
  const designStyle = system.designStyle || 'flat';
  const headerColor = getAccessibleColor(theme.textPrimary, theme.background);
  const subHeaderColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');

  const panelStyleModifiers = getStyleModifiers(designStyle, theme, 'panel', false);

  return (
    <section ref={sectionRef} className="w-full relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-0"></div>
      
      <div className="relative z-10">
        <h3 
          className="text-4xl font-bold mb-12 tracking-tight"
          style={{ fontFamily: `"${system.typography?.displayFont?.name || 'Playfair Display'}", serif`, color: headerColor }}
        >
          Color System
        </h3>

        <div className="space-y-12">
          {/* Theme Specific Colors */}
          <div>
            <h4 className="text-xl font-medium mb-4" style={{ color: subHeaderColor }}>Theme Colors ({activeTheme})</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SemanticSwatch color={{ hex: theme.background }} label="Background" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleThemeColorChange('background', hex)} />
              <SemanticSwatch color={{ hex: theme.surface }} label="Surface" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleThemeColorChange('surface', hex)} />
              <SemanticSwatch color={{ hex: theme.textPrimary }} label="Text Primary" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleThemeColorChange('textPrimary', hex)} />
              <SemanticSwatch color={{ hex: theme.textSecondary }} label="Text Secondary" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleThemeColorChange('textSecondary', hex)} />
            </div>
          </div>

          {/* Primary, Secondary, Accent */}
          <div>
            <h4 className="text-xl font-medium mb-4" style={{ color: subHeaderColor }}>Brand Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {system.colors?.primary && (
                <ColorSwatch 
                  color={{ ...system.colors.primary, hex: theme.primary || system.colors.primary.hex }} 
                  label="Primary" 
                  onCopy={handleCopy} 
                  theme={theme}
                  onChange={(hex: string) => handleThemeColorChange('primary', hex)}
                />
              )}
              {system.colors?.secondary && (
                <ColorSwatch 
                  color={{ ...system.colors.secondary, hex: theme.secondary || system.colors.secondary.hex }} 
                  label="Secondary" 
                  onCopy={handleCopy} 
                  theme={theme}
                  onChange={(hex: string) => handleThemeColorChange('secondary', hex)}
                />
              )}
              {system.colors?.accent && (
                <ColorSwatch 
                  color={{ ...system.colors.accent, hex: theme.accent || system.colors.accent.hex }} 
                  label="Accent" 
                  onCopy={handleCopy} 
                  theme={theme}
                  onChange={(hex: string) => handleThemeColorChange('accent', hex)}
                />
              )}
            </div>
          </div>

          {/* Primary Scale */}
          {system.colors?.primaryScale?.length > 0 && (
            <div>
              <h4 className="text-xl font-medium mb-4" style={{ color: subHeaderColor }}>Primary Scale</h4>
              <div className="flex w-full h-24 rounded-2xl overflow-hidden shadow-sm border" style={{ border: `1px solid ${theme.borderSubtle}`, ...panelStyleModifiers }}>
                {system.colors.primaryScale.map((shade, idx) => (
                  <ColorStrip 
                    key={idx} 
                    shade={shade.shade} 
                    hex={shade.hex} 
                    onCopy={handleCopy} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Neutral Scale */}
          {system.colors?.neutrals?.length > 0 && (
            <div>
              <h4 className="text-xl font-medium mb-4" style={{ color: subHeaderColor }}>Neutral Scale</h4>
              <div className="flex w-full h-24 rounded-2xl overflow-hidden shadow-sm border" style={{ border: `1px solid ${theme.borderSubtle}`, ...panelStyleModifiers }}>
                {system.colors.neutrals.map((shade, idx) => (
                  <ColorStrip 
                    key={idx} 
                    shade={shade.shade} 
                    hex={shade.hex} 
                    onCopy={handleCopy} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Semantics */}
          <div>
            <h4 className="text-xl font-medium mb-4" style={{ color: subHeaderColor }}>Semantic Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {system.colors?.success && <SemanticSwatch color={system.colors.success} label="Success" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleColorChange('success', hex)} />}
              {system.colors?.warning && <SemanticSwatch color={system.colors.warning} label="Warning" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleColorChange('warning', hex)} />}
              {system.colors?.error && <SemanticSwatch color={system.colors.error} label="Error" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleColorChange('error', hex)} />}
              {system.colors?.info && <SemanticSwatch color={system.colors.info} label="Info" onCopy={handleCopy} theme={theme} onChange={(hex: string) => handleColorChange('info', hex)} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ColorSwatch = ({ color, label, onCopy, theme, onChange }: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const designStyle = theme.designStyle || 'flat'; // Assuming theme might have it, or fallback
  const styleModifiers = getStyleModifiers(designStyle, theme, 'card', false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const safeHex = color?.hex || '';
  const isGradient = safeHex.includes('gradient');
  let textColor = '#FFFFFF';
  
  if (!isGradient && safeHex) {
    const hex = safeHex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    textColor = (yiq >= 128) ? '#000000' : '#FFFFFF';
  }
  
  const usageTextColor = getAccessibleColor(theme.textSecondary, theme.surface, '#E5E7EB', '#4B5563');

  return (
    <div 
      className={`flex flex-col rounded-3xl shadow-md group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative ${showPicker ? 'z-50' : 'z-10'}`}
      style={{ background: theme.surface, border: `1px solid ${theme.border}`, ...styleModifiers }}
    >
      <div 
        className="h-32 p-6 flex flex-col justify-between transition-colors duration-500 cursor-pointer rounded-t-3xl"
        style={{ background: color.hex, color: textColor }}
        onClick={() => onCopy(color.hex)}
      >
        <div className="flex justify-between items-start">
          <span className="font-medium opacity-80 uppercase tracking-wider text-xs">{label}</span>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div 
              className="w-6 h-6 rounded-full border-2 border-white/50 shadow-sm flex items-center justify-center bg-transparent cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setShowPicker(!showPicker)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
            </div>
            {showPicker && (
              <div ref={popoverRef} className="absolute z-50 top-full right-0 mt-2 p-0.5 bg-white dark:bg-[#2A2A2A] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 w-[300px] max-w-[90vw] flex justify-center translate-x-1/2 -mr-3">
                <ColorPicker value={color.hex} onChange={onChange} />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-end gap-2">
          <span className="text-2xl font-bold">{color.name}</span>
          <div className="w-32" onClick={(e) => e.stopPropagation()}>
            <ColorInput 
              value={color?.hex || ''} 
              onChange={onChange} 
              theme={theme} 
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: textColor
              }} 
            />
          </div>
        </div>
      </div>
      <div className="p-6 rounded-b-3xl" style={{ color: usageTextColor }}>
        <p className="text-sm leading-relaxed">{color.usage}</p>
      </div>
    </div>
  );
};

const ColorStrip = ({ shade, hex, onCopy }: any) => {
  return (
    <div 
      className="flex-1 h-full flex flex-col justify-end p-2 cursor-pointer group transition-all duration-300 hover:flex-[1.5]"
      style={{ background: hex }}
      onClick={() => onCopy(hex)}
      title={`${shade}: ${hex}`}
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center h-full">
        <span className="text-xs font-bold mix-blend-difference text-white">{shade}</span>
        <span className="text-[10px] font-mono mix-blend-difference text-white">{hex}</span>
      </div>
    </div>
  );
};

const SemanticSwatch = ({ color, label, onCopy, theme, onChange }: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const designStyle = theme.designStyle || 'flat';
  const styleModifiers = getStyleModifiers(designStyle, theme, 'card', false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const textColor = getAccessibleColor(theme.textPrimary, theme.surfaceSecondary);
  const secondaryTextColor = getAccessibleColor(theme.textSecondary, theme.surfaceSecondary, '#D1D5DB', '#4B5563');

  return (
    <div 
      className={`flex items-center p-4 rounded-2xl group transition-all duration-300 hover:shadow-md relative ${showPicker ? 'z-50' : 'z-10'}`}
      style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}`, ...styleModifiers }}
    >
      <div 
        className="w-12 h-12 rounded-full shadow-sm mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
        style={{ background: color.hex }}
        onClick={() => onCopy(color.hex)}
      />
      <div className="flex flex-col flex-1 cursor-pointer" onClick={() => onCopy(color.hex)}>
        <span className="font-medium text-sm mb-1" style={{ color: textColor }}>{label}</span>
        <div className="w-full max-w-[120px]" onClick={(e) => e.stopPropagation()}>
          <ColorInput 
            value={color?.hex || ''} 
            onChange={onChange} 
            theme={theme} 
            style={{ 
              background: 'transparent', 
              borderColor: theme.borderSubtle,
              color: secondaryTextColor
            }} 
          />
        </div>
      </div>
      <div className="relative ml-2" onClick={(e) => e.stopPropagation()}>
        <div 
          className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-transparent cursor-pointer hover:scale-110 transition-transform" 
          style={{ color: secondaryTextColor }}
          onClick={() => setShowPicker(!showPicker)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
        </div>
        {showPicker && (
          <div ref={popoverRef} className="absolute z-50 top-full right-0 mt-2 p-0.5 bg-white dark:bg-[#2A2A2A] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 w-[300px] max-w-[90vw] flex justify-center translate-x-1/2 -mr-3">
            <ColorPicker value={color.hex} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};
