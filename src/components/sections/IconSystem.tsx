import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { DesignSystem, IconStyle } from '../../types';
import * as LucideIcons from 'lucide-react';
import { getAccessibleColor } from '../../utils/accessibility';
import { Plus, X } from 'lucide-react';
import { getStyleModifiers } from '../../utils/designStyleUtils';

interface IconSystemProps {
  system: DesignSystem;
  activeTheme: string;
  setDesignSystem: React.Dispatch<React.SetStateAction<DesignSystem | null>>;
}

export const IconSystem: React.FC<IconSystemProps> = ({ system, activeTheme, setDesignSystem }) => {
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
  const inputStyleModifiers = getStyleModifiers(designStyle, theme, 'input', false);
  const buttonStyleModifiers = getStyleModifiers(designStyle, theme, 'button', false);

  const [customIcons, setCustomIcons] = useState<string[]>([]);
  const [customSvgIcons, setCustomSvgIcons] = useState<{ name: string, svg: string }[]>([]);
  const [newIconName, setNewIconName] = useState('');
  const [iconError, setIconError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const iconsToDisplay = [
    'Home', 'Search', 'Settings', 'User', 'Heart', 'Mail', 
    'Bell', 'ShoppingCart', 'ArrowRight', 'Star', 'Check', 'X', 'Menu', 'Plus',
    ...customIcons
  ];

  const handleAddIcon = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newIconName.trim();
    if (!name) return;
    
    // Normalize input to match Lucide's PascalCase exports (e.g., "arrow-right" or "arrow right" -> "arrowright")
    const normalizedInput = name.toLowerCase().replace(/[-_ ]+/g, '');
    const availableIcons = Object.keys(LucideIcons);
    const matchedIconName = availableIcons.find(
      iconName => iconName.toLowerCase() === normalizedInput
    );
    
    if (!matchedIconName) {
      setIconError(`Icon "${name}" not found in Lucide.`);
      return;
    }
    
    if (iconsToDisplay.includes(matchedIconName)) {
      setIconError(`Icon "${matchedIconName}" is already in the list.`);
      return;
    }

    setCustomIcons(prev => [...prev, matchedIconName]);
    setNewIconName('');
    setIconError('');
  };

  const handleRemoveIcon = (nameToRemove: string) => {
    setCustomIcons(prev => prev.filter(name => name !== nameToRemove));
  };

  const handleRemoveSvgIcon = (nameToRemove: string) => {
    setCustomSvgIcons(prev => prev.filter(icon => icon.name !== nameToRemove));
  };

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/svg+xml') {
      setIconError('Please upload a valid SVG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const svgContent = event.target?.result as string;
      if (svgContent) {
        // Basic sanitization/validation could go here
        const iconName = file.name.replace('.svg', '');
        
        // Check for duplicates
        if (customSvgIcons.some(icon => icon.name === iconName)) {
          setIconError(`An SVG icon named "${iconName}" already exists.`);
          return;
        }

        setCustomSvgIcons(prev => [...prev, { name: iconName, svg: svgContent }]);
        setIconError('');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStyleChange = (field: keyof IconStyle, value: string | string[]) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        iconStyle: {
          ...prev.iconStyle,
          [field]: value
        }
      };
    });
  };

  const handleSizeChange = (index: number, value: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      const newSizes = [...(prev.iconStyle?.sizes || ['16px', '20px', '24px', '32px'])];
      newSizes[index] = value;
      return {
        ...prev,
        iconStyle: {
          ...prev.iconStyle,
          sizes: newSizes
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
        Iconography
      </h3>

      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-sm border" style={{ border: `1px solid ${theme.borderSubtle}`, background: theme.surface, ...panelStyleModifiers }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b" style={{ borderColor: theme.borderSubtle }}>
          <div className="mb-6 md:mb-0 flex flex-col gap-2">
            <input 
              type="text" 
              value={system.iconStyle?.recommended || 'Lucide'}
              onChange={(e) => handleStyleChange('recommended', e.target.value)}
              className="text-xl font-medium bg-transparent border-b outline-none w-48"
              style={{ color: theme.textPrimary, borderColor: theme.borderSubtle }}
            />
            <div className="flex items-center gap-2 text-sm opacity-80" style={{ color: subHeaderColor }}>
              <input 
                type="text" 
                value={system.iconStyle?.style || 'Outlined'}
                onChange={(e) => handleStyleChange('style', e.target.value)}
                className="bg-transparent border-b outline-none w-24"
                style={{ borderColor: theme.borderSubtle }}
              />
              <span>•</span>
              <input 
                type="text" 
                value={system.iconStyle?.strokeWidth || '2px'}
                onChange={(e) => handleStyleChange('strokeWidth', e.target.value)}
                className="bg-transparent border-b outline-none w-16"
                style={{ borderColor: theme.borderSubtle }}
              />
            </div>
            <input 
              type="text" 
              value={system.iconStyle?.reason || 'Clean and modern icons'}
              onChange={(e) => handleStyleChange('reason', e.target.value)}
              className="text-xs italic opacity-60 mt-2 max-w-md bg-transparent border-b outline-none w-full"
              style={{ color: theme.textTertiary, borderColor: theme.borderSubtle }}
            />
          </div>
          <div className="flex gap-4">
            {(system.iconStyle?.sizes || ['16px', '20px', '24px', '32px']).map((size, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}` }}
                >
                  <LucideIcons.Star size={parseInt(size) || 24} color={theme.textPrimary} strokeWidth={parseFloat(system.iconStyle?.strokeWidth || '2') || 2} />
                </div>
                <input 
                  type="text" 
                  value={size}
                  onChange={(e) => handleSizeChange(idx, e.target.value)}
                  className="font-mono text-xs opacity-70 bg-transparent border-b outline-none text-center w-12"
                  style={{ color: subHeaderColor, borderColor: theme.borderSubtle }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6">
          {iconsToDisplay.map((iconName, idx) => {
            const IconComponent = (LucideIcons as any)[iconName];
            if (!IconComponent) return null;
            const isCustom = customIcons.includes(iconName);

            return (
              <div key={`lucide-${idx}`} className="flex flex-col items-center group relative">
                {isCustom && (
                  <button 
                    onClick={() => handleRemoveIcon(iconName)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={12} />
                  </button>
                )}
                <div className="flex gap-2 mb-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}` }}
                  >
                    <IconComponent size={24} color={theme.textPrimary} strokeWidth={parseFloat(system.iconStyle?.strokeWidth || '2') || 2} />
                  </div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: String(theme.primary).includes('gradient')  ? theme.primary  : (String(theme.primary).includes('gradient') ? theme.primary : theme.primary + '15'), border: `1px solid ${theme.primary}30` }}
                  >
                    <IconComponent size={24} color={theme.primary} strokeWidth={parseFloat(system.iconStyle?.strokeWidth || '2') || 2} />
                  </div>
                </div>
                <span className="font-mono text-[10px] opacity-60 uppercase tracking-wider text-center" style={{ color: subHeaderColor }}>{iconName}</span>
              </div>
            );
          })}

          {customSvgIcons.map((icon, idx) => (
            <div key={`svg-${idx}`} className="flex flex-col items-center group relative">
              <button 
                onClick={() => handleRemoveSvgIcon(icon.name)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={12} />
              </button>
              <div className="flex gap-2 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden"
                  style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}` }}
                >
                  <div 
                    className="w-6 h-6 flex items-center justify-center" 
                    style={{ color: theme.textPrimary }}
                    dangerouslySetInnerHTML={{ __html: icon.svg.replace(/<svg/, `<svg width="24" height="24" fill="currentColor" stroke="currentColor" stroke-width="${parseFloat(system.iconStyle?.strokeWidth || '2') || 2}"`) }} 
                  />
                </div>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden"
                  style={{ background: String(theme.primary).includes('gradient')  ? theme.primary  : (String(theme.primary).includes('gradient') ? theme.primary : theme.primary + '15'), border: `1px solid ${theme.primary}30` }}
                >
                  <div 
                    className="w-6 h-6 flex items-center justify-center" 
                    style={{ color: theme.primary }}
                    dangerouslySetInnerHTML={{ __html: icon.svg.replace(/<svg/, `<svg width="24" height="24" fill="currentColor" stroke="currentColor" stroke-width="${parseFloat(system.iconStyle?.strokeWidth || '2') || 2}"`) }} 
                  />
                </div>
              </div>
              <span className="font-mono text-[10px] opacity-60 uppercase tracking-wider text-center truncate w-full px-1" style={{ color: subHeaderColor }} title={icon.name}>{icon.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: theme.borderSubtle }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4" style={{ color: theme.textPrimary }}>Add Custom Lucide Icon</h4>
              <form onSubmit={handleAddIcon} className="flex items-center gap-4">
                <div className="flex-grow max-w-xs">
                  <input 
                    type="text" 
                    value={newIconName}
                    onChange={(e) => { setNewIconName(e.target.value); setIconError(''); }}
                    placeholder="e.g. Camera, Zap, Activity"
                    className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2"
                    style={{ 
                      background: theme.surfaceSecondary, 
                      borderColor: theme.borderSubtle,
                      color: theme.textPrimary,
                      '--tw-ring-color': theme.primary,
                      ...inputStyleModifiers
                    } as any}
                  />
                </div>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-opacity hover:opacity-90 whitespace-nowrap"
                  style={{ background: theme.primary, color: getAccessibleColor(theme.primary, theme.primary, '#FFFFFF', '#000000'), ...buttonStyleModifiers }}
                >
                  <Plus size={16} />
                  Add Icon
                </button>
              </form>
              <p className="text-xs opacity-60 mt-2" style={{ color: theme.textSecondary }}>
                Enter the exact PascalCase name of any <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="underline hover:opacity-100">Lucide icon</a>.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4" style={{ color: theme.textPrimary }}>Upload Custom SVG</h4>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept=".svg" 
                  onChange={handleSvgUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-opacity hover:opacity-90 whitespace-nowrap"
                  style={{ 
                    background: theme.surfaceSecondary, 
                    color: theme.textPrimary,
                    border: `1px solid ${theme.borderSubtle}`,
                    ...buttonStyleModifiers
                  }}
                >
                  <Plus size={16} />
                  Upload SVG
                </button>
              </div>
              <p className="text-xs opacity-60 mt-2" style={{ color: theme.textSecondary }}>
                Upload your own SVG icons. They will be styled to match the current theme.
              </p>
            </div>
          </div>
          {iconError && (
            <p className="text-red-500 text-sm mt-4">{iconError}</p>
          )}
        </div>
      </div>
    </section>
  );
};
