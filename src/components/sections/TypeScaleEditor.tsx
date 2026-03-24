import React, { useState } from 'react';
import { DesignSystem, TypographyScale } from '../../types';
import { Monitor, Smartphone, Tablet, Info } from 'lucide-react';
import { ValueUnitInput } from '../ui/ValueUnitInput';

interface TypeScaleEditorProps {
  system: DesignSystem;
  activeTheme: string;
  setDesignSystem: React.Dispatch<React.SetStateAction<DesignSystem | null>>;
}

const calculateResponsiveValue = (val: string, ratio: number) => {
  const match = val.match(/^([\d.]+)([a-zA-Z%]*)$/);
  if (!match) return val;
  const num = parseFloat(match[1]);
  const unit = match[2];
  
  // Don't scale down if it's already quite small (e.g. <= 1.2rem or <= 18px)
  let adjustedRatio = ratio;
  if ((unit === 'rem' || unit === 'em') && num <= 1.2) {
    adjustedRatio = 1;
  } else if (unit === 'px' && num <= 18) {
    adjustedRatio = 1;
  }
  
  const calculated = Math.round(num * adjustedRatio * 100) / 100;
  return `${calculated}${unit}`;
};

export const TypeScaleEditor: React.FC<TypeScaleEditorProps> = ({ system, activeTheme, setDesignSystem }) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const theme = system.themes[activeTheme];

  const handleScaleChange = (index: number, field: keyof TypographyScale, value: string) => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      const newScale = [...prev.typography.scale];
      const currentItem = { ...newScale[index], [field]: value };
      
      // Auto-calculate for tablet and mobile if desktop size is changed
      if (field === 'desktopSize') {
        currentItem.tabletSize = calculateResponsiveValue(value, 0.85);
        currentItem.mobileSize = calculateResponsiveValue(value, 0.75);
      }
      
      // Sync line height if desktop line height is changed
      if (field === 'desktopLineHeight') {
        currentItem.tabletLineHeight = value;
        currentItem.mobileLineHeight = value;
      }

      newScale[index] = currentItem;
      
      return {
        ...prev,
        typography: {
          ...prev.typography,
          scale: newScale
        }
      };
    });
  };

  const getSizeField = () => {
    if (viewMode === 'mobile') return 'mobileSize';
    if (viewMode === 'tablet') return 'tabletSize';
    return 'desktopSize';
  };

  const getLineHeightField = () => {
    if (viewMode === 'mobile') return 'mobileLineHeight';
    if (viewMode === 'tablet') return 'tabletLineHeight';
    return 'desktopLineHeight';
  };

  return (
    <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-sm border" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-medium" style={{ color: theme.textPrimary }}>Type Scale</h4>
          <div className="flex items-center gap-1.5 text-xs opacity-70" style={{ color: theme.textSecondary }}>
            <Info size={12} />
            <span>Tablet and mobile sizes are auto-calculated when you edit desktop sizes.</span>
          </div>
        </div>
        <div className="flex p-1 rounded-lg border" style={{ background: theme.surfaceSecondary, borderColor: theme.borderSubtle }}>
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'desktop' ? 'shadow-sm' : ''}`}
            style={{ 
              background: viewMode === 'desktop' ? theme.surface : 'transparent',
              color: viewMode === 'desktop' ? theme.textPrimary : theme.textSecondary
            }}
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'tablet' ? 'shadow-sm' : ''}`}
            style={{ 
              background: viewMode === 'tablet' ? theme.surface : 'transparent',
              color: viewMode === 'tablet' ? theme.textPrimary : theme.textSecondary
            }}
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'mobile' ? 'shadow-sm' : ''}`}
            style={{ 
              background: viewMode === 'mobile' ? theme.surface : 'transparent',
              color: viewMode === 'mobile' ? theme.textPrimary : theme.textSecondary
            }}
          >
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-8">
        {system.typography.scale.map((scale, idx) => {
          const sizeField = getSizeField();
          const lineHeightField = getLineHeightField();
          
          const currentSize = scale[sizeField] || scale.size;
          const currentLineHeight = scale[lineHeightField] || scale.lineHeight;

          return (
            <div key={idx} className="flex flex-col md:flex-row border-b pb-8 last:border-0 last:pb-0 gap-6" style={{ borderColor: theme.borderSubtle }}>
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                <span className="font-mono text-sm font-bold" style={{ color: theme.textPrimary }}>{scale.name}</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider opacity-70" style={{ color: theme.textSecondary }}>Size</label>
                    <ValueUnitInput 
                      value={currentSize}
                      onChange={(val) => handleScaleChange(idx, sizeField, val)}
                      units={['rem', 'px', 'em']}
                      theme={theme}
                      step={0.1}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider opacity-70" style={{ color: theme.textSecondary }}>Line Height</label>
                    <ValueUnitInput 
                      value={currentLineHeight}
                      onChange={(val) => handleScaleChange(idx, lineHeightField, val)}
                      units={['none', 'px', 'rem', '%']}
                      theme={theme}
                      step={0.1}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider opacity-70" style={{ color: theme.textSecondary }}>Letter Spacing</label>
                    <ValueUnitInput 
                      value={scale.letterSpacing || 'normal'}
                      onChange={(val) => handleScaleChange(idx, 'letterSpacing', val)}
                      units={['em', 'px']}
                      theme={theme}
                      step={0.01}
                      allowNegative={true}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider opacity-70" style={{ color: theme.textSecondary }}>Transform</label>
                    <select 
                      value={scale.textTransform || 'none'}
                      onChange={(e) => handleScaleChange(idx, 'textTransform', e.target.value)}
                      className="w-full p-1.5 text-xs border rounded outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="none">None</option>
                      <option value="uppercase">Uppercase</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </div>
                </div>
                
                <span className="text-xs mt-1" style={{ color: theme.textTertiary }}>{scale.usage}</span>
              </div>
              
              <div className="w-full md:w-2/3 overflow-hidden flex items-center">
                <p 
                  className="truncate w-full"
                  style={{ 
                    fontFamily: `"${system.typography?.bodyFont?.name || 'Inter'}", sans-serif`,
                    fontSize: currentSize,
                    lineHeight: currentLineHeight,
                    letterSpacing: scale.letterSpacing !== 'normal' ? scale.letterSpacing : undefined,
                    textTransform: scale.textTransform !== 'none' ? (scale.textTransform as any) : undefined,
                    textDecoration: scale.textDecoration !== 'none' ? scale.textDecoration : undefined,
                    color: theme.textPrimary,
                    fontWeight: system.typography?.bodyFont?.selectedWeight || 400
                  }}
                >
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
