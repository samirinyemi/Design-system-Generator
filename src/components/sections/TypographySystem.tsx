import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { DesignSystem } from '../../types';
import { getAccessibleColor } from '../../utils/accessibility';
import { TypeScaleEditor } from './TypeScaleEditor';
import { FontDropdown } from './FontDropdown';
import { getStyleModifiers } from '../../utils/designStyleUtils';

interface TypographySystemProps {
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

export const TypographySystem: React.FC<TypographySystemProps> = ({ system, activeTheme, setDesignSystem }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog.');
  const [customFonts, setCustomFonts] = useState<Record<string, string>>({});

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

  const inputStyleModifiers = getStyleModifiers(designStyle, theme, 'input', false);
  const buttonStyleModifiers = getStyleModifiers(designStyle, theme, 'button', false);

  const handleWeightChange = (type: 'displayFont' | 'bodyFont', weight: number) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        typography: {
          ...prev.typography,
          [type]: {
            ...prev.typography[type],
            selectedWeight: weight
          }
        }
      };
    });
  };

  const handleFontChange = (type: 'displayFont' | 'bodyFont', newFontName: string) => {
    if (!newFontName) return;
    
    // If it's not a custom font, load it from Google Fonts
    if (!customFonts[newFontName]) {
      const linkId = `google-font-${newFontName.replace(/\s+/g, '-')}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${newFontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
        document.head.appendChild(link);
      }
    }

    setDesignSystem(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        typography: {
          ...prev.typography,
          [type]: {
            ...prev.typography[type],
            name: newFontName
          }
        }
      };
    });
  };

  const handleCustomFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const fontName = file.name.split('.')[0];
      
      const styleId = `custom-font-${fontName}`;
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @font-face {
            font-family: '${fontName}';
            src: url('${dataUrl}');
          }
        `;
        document.head.appendChild(style);
      }

      setCustomFonts(prev => ({ ...prev, [fontName]: dataUrl }));
      handleFontChange('displayFont', fontName); // Default to setting it as display font
    };
    reader.readAsDataURL(file);
  };

  return (
    <section ref={sectionRef} className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <h3 
          className="text-4xl font-bold tracking-tight"
          style={{ fontFamily: `"${system.typography?.displayFont?.name || 'Playfair Display'}", serif`, color: headerColor, fontWeight: system.typography?.displayFont?.selectedWeight || 700 }}
        >
          Typography
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input 
            type="text" 
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Type here to preview text..."
            className="px-4 py-2 rounded-lg border text-sm w-full sm:w-64 focus:outline-none focus:ring-2"
            style={{ 
              background: theme.surface, 
              borderColor: theme.borderSubtle, 
              color: theme.textPrimary,
              outlineColor: theme.primary,
              ...inputStyleModifiers
            }}
          />
          <label className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center whitespace-nowrap" style={{ background: theme.primary, color: theme.primaryForeground, ...buttonStyleModifiers }}>
            Upload Custom Font
            <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleCustomFontUpload} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {system.typography?.displayFont && (
          <FontCard 
            font={system.typography.displayFont} 
            label="Display Font" 
            sample="Aa" 
            theme={theme} 
            onWeightChange={(w: number) => handleWeightChange('displayFont', w)}
            onFontChange={(name: string) => handleFontChange('displayFont', name)}
            customFonts={Object.keys(customFonts)}
            previewText={previewText}
          />
        )}
        {system.typography?.bodyFont && (
          <FontCard 
            font={system.typography.bodyFont} 
            label="Body Font" 
            sample="Aa" 
            theme={theme} 
            onWeightChange={(w: number) => handleWeightChange('bodyFont', w)}
            onFontChange={(name: string) => handleFontChange('bodyFont', name)}
            customFonts={Object.keys(customFonts)}
            previewText={previewText}
          />
        )}
      </div>

      {system.typography?.scale?.length > 0 && (
        <TypeScaleEditor system={system} activeTheme={activeTheme} setDesignSystem={setDesignSystem} />
      )}
    </section>
  );
};

const FontCard = ({ font, label, sample, theme, onWeightChange, onFontChange, customFonts, previewText }: any) => {
  const currentWeight = font.selectedWeight || font.weights?.[0] || 400;
  const subHeaderColor = getAccessibleColor(theme.textSecondary, theme.surfaceSecondary, '#D1D5DB', '#4B5563');
  const designStyle = theme.designStyle || 'flat';
  const panelStyleModifiers = getStyleModifiers(designStyle, theme, 'panel', false);

  return (
    <div 
      className="rounded-3xl p-8 shadow-sm border flex flex-col justify-between"
      style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}`, ...panelStyleModifiers }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col w-full max-w-[200px]">
          <span className="text-sm font-medium uppercase tracking-wider opacity-70 mb-2" style={{ color: subHeaderColor }}>{label}</span>
          
          <div className="mt-1 mb-2">
            <FontDropdown value={font.name} onChange={onFontChange} theme={theme} />
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono opacity-60" style={{ color: theme.textTertiary }}>{font.category}</span>
            {customFonts.includes(font.name) && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-500/10 text-blue-500 font-medium">Custom</span>
            )}
          </div>
        </div>
        <div 
          className="text-6xl md:text-8xl leading-none flex-shrink-0"
          style={{ fontFamily: `"${font.name}", ${font.category === 'serif' ? 'serif' : 'sans-serif'}`, color: theme.textPrimary, fontWeight: currentWeight }}
        >
          {sample}
        </div>
      </div>
      
      <div className="mb-8">
        <span className="text-xs font-medium uppercase tracking-wider opacity-70 mb-2 block" style={{ color: subHeaderColor }}>Select Weight</span>
        <div className="flex flex-wrap gap-2">
          {[300, 400, 500, 600, 700, 800, 900].map((w: number) => (
            <button
              key={w}
              onClick={() => onWeightChange(w)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${currentWeight === w ? 'border-transparent' : 'bg-transparent'}`}
              style={{
                background: currentWeight === w ? theme.primary : 'transparent',
                color: currentWeight === w ? theme.primaryForeground : theme.textPrimary,
                borderColor: currentWeight === w ? 'transparent' : theme.borderSubtle
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <p 
          className="text-xl md:text-2xl leading-relaxed mb-6 break-words"
          style={{ fontFamily: `"${font.name}", ${font.category === 'serif' ? 'serif' : 'sans-serif'}`, color: theme.textPrimary, fontWeight: currentWeight }}
        >
          {previewText || (
            <>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
              abcdefghijklmnopqrstuvwxyz<br/>
              0123456789 !@#$%^&*()
            </>
          )}
        </p>
        <p className="text-sm italic opacity-80" style={{ color: subHeaderColor }}>
          "{font.reason}"
        </p>
      </div>
    </div>
  );
};
