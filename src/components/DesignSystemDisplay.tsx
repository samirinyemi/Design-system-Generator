import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DesignSystem } from '../types';
import { ThemeBar } from './ThemeBar';
import { BrandOverview } from './sections/BrandOverview';
import { ColorSystem } from './sections/ColorSystem';
import { TypographySystem } from './sections/TypographySystem';
import { SpacingSystem } from './sections/SpacingSystem';
import { BorderRadiusSystem } from './sections/BorderRadiusSystem';
import { ShadowSystem } from './sections/ShadowSystem';
import { IconSystem } from './sections/IconSystem';
import { ComponentPreviews } from './sections/ExpandedComponentPreviews';
import { ComponentPlayground } from './sections/ComponentPlayground';
import { DesignVisualizations } from './sections/DesignVisualizations';
import { DataVisualizations } from './sections/DataVisualizations';
import { AccessibilityReport } from './sections/AccessibilityReport';

interface DesignSystemDisplayProps {
  system: DesignSystem;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  setDesignSystem: React.Dispatch<React.SetStateAction<DesignSystem | null>>;
  onOpenSettings: () => void;
}

export const DesignSystemDisplay: React.FC<DesignSystemDisplayProps> = ({
  system,
  activeTheme,
  setActiveTheme,
  setDesignSystem,
  onOpenSettings
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject Google Fonts dynamically
    const displayFont = system.typography?.displayFont?.name || 'Playfair Display';
    const bodyFont = system.typography?.bodyFont?.name || 'Inter';
    const monoFont = system.typography?.monoFont?.name || 'JetBrains Mono';
    const displayWeights = system.typography?.displayFont?.weights?.join(';') || '400;700';
    const bodyWeights = system.typography?.bodyFont?.weights?.join(';') || '400;500;600';
    const monoWeights = system.typography?.monoFont?.weights?.join(';') || '400;500';

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${displayFont.replace(/ /g, '+')}:wght@${displayWeights}&family=${bodyFont.replace(/ /g, '+')}:wght@${bodyWeights}&family=${monoFont.replace(/ /g, '+')}:wght@${monoWeights}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [system.typography]);

  useEffect(() => {
    // Apply theme colors to CSS variables on the container
    if (containerRef.current) {
      const theme = system.themes?.[activeTheme];
      if (theme) {
        Object.entries(theme).forEach(([key, value]) => {
          containerRef.current?.style.setProperty(`--theme-${key}`, value);
        });
        
        // Also set fonts
        const displayFont = system.typography?.displayFont?.name || 'Playfair Display';
        const bodyFont = system.typography?.bodyFont?.name || 'Inter';
        const monoFont = system.typography?.monoFont?.name || 'JetBrains Mono';

        containerRef.current.style.setProperty('--theme-font-display', `"${displayFont}", serif`);
        containerRef.current.style.setProperty('--theme-font-body', `"${bodyFont}", sans-serif`);
        containerRef.current.style.setProperty('--theme-font-mono', `"${monoFont}", monospace`);
        
        // Set spacing unit
        containerRef.current.style.setProperty('--theme-spacing-unit', system.spacing?.unit || '4px');
      }
    }
  }, [system, activeTheme]);

  return (
    <div 
      id="design-system-display" 
      ref={containerRef} 
      className="w-full relative mt-16 pb-32 rounded-[3rem] px-4 md:px-12 transition-colors duration-500"
      style={{ background: system.themes?.[activeTheme]?.background }}
    >
      <ThemeBar 
        system={system} 
        activeTheme={activeTheme} 
        setActiveTheme={setActiveTheme} 
        setDesignSystem={setDesignSystem}
        onOpenSettings={onOpenSettings}
      />
      
      <div className="space-y-32 mt-12">
        <BrandOverview system={system} activeTheme={activeTheme} />
        <ColorSystem system={system} activeTheme={activeTheme} setDesignSystem={setDesignSystem} />
        <TypographySystem system={system} activeTheme={activeTheme} setDesignSystem={setDesignSystem} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <SpacingSystem system={system} activeTheme={activeTheme} setDesignSystem={setDesignSystem} />
          <BorderRadiusSystem system={system} activeTheme={activeTheme} setDesignSystem={setDesignSystem} />
        </div>
        
        <ShadowSystem system={system} activeTheme={activeTheme} setDesignSystem={setDesignSystem} />
        <IconSystem system={system} activeTheme={activeTheme} setDesignSystem={setDesignSystem} />
        <AccessibilityReport system={system} activeTheme={activeTheme} />
        <DataVisualizations system={system} activeTheme={activeTheme} />
        <ComponentPlayground system={system} activeTheme={activeTheme} />
        <ComponentPreviews system={system} activeTheme={activeTheme} />
        <DesignVisualizations system={system} activeTheme={activeTheme} />
      </div>
    </div>
  );
};
