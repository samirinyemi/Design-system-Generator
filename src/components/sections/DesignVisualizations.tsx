import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as htmlToImage from 'html-to-image';
import { DesignSystem } from '../../types';
import { BarChart3, Globe, Smartphone, Download, Layers, Shuffle } from 'lucide-react';
import { UIKitPreview } from '../previews/UIKitPreview';
import { DashboardPreviews } from '../previews/DashboardPreviews';
import { WebsitePreviews } from '../previews/WebsitePreviews';
import { MobilePreviews } from '../previews/MobilePreviews';
import { getAccessibleColor } from '../../utils/accessibility';

interface DesignVisualizationsProps {
  system: DesignSystem;
  activeTheme: string;
}

export const DesignVisualizations: React.FC<DesignVisualizationsProps> = ({ system, activeTheme }) => {
  const [activeTab, setActiveTab] = useState<'ui-kit' | 'dashboard' | 'website' | 'mobile'>('ui-kit');
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const theme = system.themes[activeTheme];

  const baseColors = [
    theme.primary,
    theme.secondary,
    theme.accent,
    system.colors?.success?.hex || '#28A745',
    system.colors?.warning?.hex || '#FFC107',
    system.colors?.info?.hex || '#17A2B8',
  ];

  const [shuffledColors, setShuffledColors] = useState(baseColors);

  // Reset shuffled colors when theme changes
  useEffect(() => {
    setShuffledColors([
      theme.primary,
      theme.secondary,
      theme.accent,
      system.colors?.success?.hex || '#28A745',
      system.colors?.warning?.hex || '#FFC107',
      system.colors?.info?.hex || '#17A2B8',
    ]);
  }, [theme, system.colors]);

  const handleShuffleColors = () => {
    setShuffledColors([...shuffledColors].sort(() => Math.random() - 0.5));
  };

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

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const getFont = (type: 'display' | 'body' | 'mono') => {
    if (type === 'display') return `"${system.typography?.displayFont?.name || 'Playfair Display'}", serif`;
    if (type === 'body') return `"${system.typography?.bodyFont?.name || 'Inter'}", sans-serif`;
    return `"${system.typography?.monoFont?.name || 'JetBrains Mono'}", monospace`;
  };

  const getRadius = (name: string) => {
    const scale = system.borderRadius?.scale?.find(s => s.name === name);
    return scale ? scale.value : '8px';
  };

  const getShadow = (name: string) => {
    const scale = system.shadows?.scale?.find(s => s.name === name);
    return scale ? scale.value : 'none';
  };

  const headerColor = getAccessibleColor(theme.textPrimary, theme.background);
  const subHeaderColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');

  const downloadScreen = async () => {
    if (!contentRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(contentRef.current, {
        backgroundColor: theme.background,
        pixelRatio: 2,
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${system.brandName || 'design-system'}-${activeTab}-preview.png`;
      link.click();
    } catch (error) {
      console.error('Failed to download screen:', error);
    }
  };

  return (
    <section ref={sectionRef} className="w-full pt-16 border-t" style={{ borderColor: theme.borderSubtle }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h3 
            className="text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: getFont('display'), color: headerColor }}
          >
            See in action
          </h3>
          <p className="text-lg opacity-70 max-w-xl" style={{ color: subHeaderColor, fontFamily: getFont('body') }}>
            Preview how your generated design system looks applied to realistic interfaces.
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-2">
            <button 
              onClick={handleShuffleColors}
              className="px-4 py-2 text-sm font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
              style={{ background: theme.surface, color: getAccessibleColor(theme.textPrimary, theme.surface), border: `1px solid ${theme.borderSubtle}` }}
            >
              <Shuffle size={16} />
              Shuffle Colors
            </button>
            <button 
              onClick={downloadScreen}
              className="px-4 py-2 text-sm font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 hover:opacity-90"
              style={{ background: theme.primary, color: theme.primaryForeground }}
            >
              <Download size={16} />
              Download Screen
            </button>
          </div>
          <div className="flex p-1 rounded-full overflow-x-auto max-w-full no-scrollbar" style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}` }}>
            <TabButton 
              active={activeTab === 'ui-kit'} 
              onClick={() => setActiveTab('ui-kit')} 
              icon={<Layers size={16} />} 
              label="UI Kits" 
              theme={theme}
            />
            <TabButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<BarChart3 size={16} />} 
              label="Dashboard" 
              theme={theme}
            />
            <TabButton 
              active={activeTab === 'website'} 
              onClick={() => setActiveTab('website')} 
              icon={<Globe size={16} />} 
              label="Website" 
              theme={theme}
            />
            <TabButton 
              active={activeTab === 'mobile'} 
              onClick={() => setActiveTab('mobile')} 
              icon={<Smartphone size={16} />} 
              label="Mobile App" 
              theme={theme}
            />
          </div>
        </div>
      </div>

      <div ref={contentRef} className="w-full flex justify-center p-8 rounded-3xl" style={{ background: theme.surfaceSecondary }}>
        {activeTab === 'ui-kit' && <UIKitPreview system={system} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} shuffledColors={shuffledColors} />}
        {activeTab === 'dashboard' && <DashboardPreviews system={system} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} shuffledColors={shuffledColors} />}
        {activeTab === 'website' && <WebsitePreviews system={system} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} shuffledColors={shuffledColors} />}
        {activeTab === 'mobile' && <MobilePreviews system={system} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} shuffledColors={shuffledColors} />}
      </div>
    </section>
  );
};

const TabButton = ({ active, onClick, icon, label, theme }: any) => {
  const activeColor = getAccessibleColor(theme.textPrimary, theme.surface);
  const inactiveColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');

  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        active ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        background: active ? theme.surface : 'transparent',
        color: active ? activeColor : inactiveColor,
      }}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};
