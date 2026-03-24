import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { DesignSystem } from '../../types';
import { Search, Bell, User, Heart, Star, Check, X, ArrowRight, ChevronDown } from 'lucide-react';
import { getAccessibleColor } from '../../utils/accessibility';

interface ComponentPreviewsProps {
  system: DesignSystem;
  activeTheme: string;
}

export const ComponentPreviews: React.FC<ComponentPreviewsProps> = ({ system, activeTheme }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);

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

  const getRadius = (name: string) => {
    const scale = system.borderRadius?.scale?.find(s => s.name === name);
    return scale ? scale.value : '8px';
  };

  const getSpacing = (name: string) => {
    const scale = system.spacing?.scale?.find(s => s.name === name);
    return scale ? scale.value : '16px';
  };

  const getShadow = (name: string) => {
    const scale = system.shadows?.scale?.find(s => s.name === name);
    return scale ? scale.value : 'none';
  };

  const getFont = (type: 'display' | 'body' | 'mono') => {
    if (type === 'display') return `"${system.typography?.displayFont?.name || 'Playfair Display'}", serif`;
    if (type === 'body') return `"${system.typography?.bodyFont?.name || 'Inter'}", sans-serif`;
    return `"${system.typography?.monoFont?.name || 'JetBrains Mono'}", monospace`;
  };

  const headerColor = getAccessibleColor(theme.textPrimary, theme.background);
  const subHeaderColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');
  const cardTextColor = getAccessibleColor(theme.textSecondary, theme.surface, '#E5E7EB', '#4B5563');
  const cardHeaderColor = getAccessibleColor(theme.textPrimary, theme.surface);

  return (
    <section ref={sectionRef} className="w-full">
      <h3 
        className="text-4xl font-bold mb-12 tracking-tight"
        style={{ fontFamily: getFont('display'), color: headerColor }}
      >
        Components
      </h3>

      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-sm border space-y-16" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
        
        {/* Buttons */}
        <div>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-70" style={{ color: subHeaderColor }}>Buttons</h4>
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              className="px-6 py-3 font-medium transition-transform hover:scale-105 active:scale-95"
              style={{ 
                background: theme.primary, 
                color: theme.primaryForeground, 
                borderRadius: getRadius('md'),
                boxShadow: getShadow('sm'),
                fontFamily: getFont('body')
              }}
            >
              Primary Button
            </button>
            <button 
              className="px-6 py-3 font-medium transition-transform hover:scale-105 active:scale-95"
              style={{ 
                background: 'transparent', 
                color: theme.primary, 
                border: `1px solid ${theme.primary}`,
                borderRadius: getRadius('md'),
                fontFamily: getFont('body')
              }}
            >
              Secondary Button
            </button>
            <button 
              className="px-6 py-3 font-medium transition-transform hover:scale-105 active:scale-95"
              style={{ 
                background: 'transparent', 
                color: theme.textSecondary, 
                borderRadius: getRadius('md'),
                fontFamily: getFont('body')
              }}
            >
              Ghost Button
            </button>
            <button 
              className="px-6 py-3 font-medium opacity-50 cursor-not-allowed"
              style={{ 
                background: theme.surfaceSecondary, 
                color: theme.textSecondary, 
                border: `1px solid ${theme.borderSubtle}`,
                borderRadius: getRadius('md'),
                fontFamily: getFont('body')
              }}
              disabled
            >
              Disabled
            </button>
            <button 
              className="p-3 font-medium transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{ 
                background: theme.primary, 
                color: theme.primaryForeground, 
                borderRadius: getRadius('md'),
                boxShadow: getShadow('sm')
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-70" style={{ color: subHeaderColor }}>Inputs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: cardHeaderColor, fontFamily: getFont('body') }}>Default Input</label>
              <input 
                type="text" 
                placeholder="Placeholder text"
                className="px-4 py-3 outline-none transition-shadow"
                style={{ 
                  background: theme.surfaceSecondary, 
                  color: cardHeaderColor, 
                  border: `1px solid ${theme.border}`,
                  borderRadius: getRadius('md'),
                  fontFamily: getFont('body')
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: cardHeaderColor, fontFamily: getFont('body') }}>Focused Input</label>
              <input 
                type="text" 
                defaultValue="Filled text"
                className="px-4 py-3 outline-none"
                style={{ 
                  background: theme.surfaceSecondary, 
                  color: cardHeaderColor, 
                  border: `1px solid ${theme.primary}`,
                  boxShadow: `0 0 0 2px ${theme.primary}30`,
                  borderRadius: getRadius('md'),
                  fontFamily: getFont('body')
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: system.colors?.error?.hex || '#DC3545', fontFamily: getFont('body') }}>Error Input</label>
              <input 
                type="text" 
                defaultValue="Invalid text"
                className="px-4 py-3 outline-none"
                style={{ 
                  background: theme.surfaceSecondary, 
                  color: system.colors?.error?.hex || '#DC3545', 
                  border: `1px solid ${system.colors?.error?.hex || '#DC3545'}`,
                  borderRadius: getRadius('md'),
                  fontFamily: getFont('body')
                }}
              />
              <span className="text-xs" style={{ color: system.colors?.error?.hex || '#DC3545' }}>This field is required</span>
            </div>
          </div>
        </div>

        {/* Badges & Pills */}
        <div>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-70" style={{ color: subHeaderColor }}>Badges & Pills</h4>
          <div className="flex flex-wrap gap-3 items-center">
            <span 
              className="px-3 py-1 text-xs font-medium uppercase tracking-wider"
              style={{ background: String(system.colors?.success?.hex || '#28A745').includes('gradient') ? (system.colors?.success?.hex || '#28A745') : (system.colors?.success?.hex || '#28A745') + '20', color: system.colors?.success?.hex || '#28A745', borderRadius: getRadius('full'), fontFamily: getFont('body') }}
            >
              Success
            </span>
            <span 
              className="px-3 py-1 text-xs font-medium uppercase tracking-wider"
              style={{ background: String(system.colors?.warning?.hex || '#FFC107').includes('gradient') ? (system.colors?.warning?.hex || '#FFC107') : (system.colors?.warning?.hex || '#FFC107') + '20', color: system.colors?.warning?.hex || '#FFC107', borderRadius: getRadius('full'), fontFamily: getFont('body') }}
            >
              Warning
            </span>
            <span 
              className="px-3 py-1 text-xs font-medium uppercase tracking-wider"
              style={{ background: String(system.colors?.error?.hex || '#DC3545').includes('gradient') ? (system.colors?.error?.hex || '#DC3545') : (system.colors?.error?.hex || '#DC3545') + '20', color: system.colors?.error?.hex || '#DC3545', borderRadius: getRadius('full'), fontFamily: getFont('body') }}
            >
              Error
            </span>
            <span 
              className="px-3 py-1 text-xs font-medium uppercase tracking-wider"
              style={{ background: String(system.colors?.info?.hex || '#17A2B8').includes('gradient') ? (system.colors?.info?.hex || '#17A2B8') : (system.colors?.info?.hex || '#17A2B8') + '20', color: system.colors?.info?.hex || '#17A2B8', borderRadius: getRadius('full'), fontFamily: getFont('body') }}
            >
              Info
            </span>
            <span 
              className="px-3 py-1 text-xs font-medium uppercase tracking-wider"
              style={{ background: theme.surfaceSecondary, color: theme.textSecondary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('full'), fontFamily: getFont('body') }}
            >
              Neutral
            </span>
          </div>
        </div>

        {/* Cards */}
        <div>
          <h4 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-70" style={{ color: subHeaderColor }}>Cards</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div 
              className="p-6 transition-transform hover:-translate-y-1"
              style={{ 
                background: theme.surfaceSecondary, 
                border: `1px solid ${theme.borderSubtle}`,
                borderRadius: getRadius('lg'),
                boxShadow: getShadow('md')
              }}
            >
              <h5 className="text-lg font-bold mb-2" style={{ color: cardHeaderColor, fontFamily: getFont('display') }}>Basic Card</h5>
              <p className="text-sm leading-relaxed mb-4" style={{ color: cardTextColor, fontFamily: getFont('body') }}>
                A simple container for content, with a title, description, and an action button.
              </p>
              <button 
                className="text-sm font-medium flex items-center gap-1"
                style={{ color: theme.primary, fontFamily: getFont('body') }}
              >
                Read more <ArrowRight size={16} />
              </button>
            </div>

            {/* Stat Card */}
            <div 
              className="p-6 flex flex-col justify-between transition-transform hover:-translate-y-1"
              style={{ 
                background: theme.surfaceSecondary, 
                border: `1px solid ${theme.borderSubtle}`,
                borderRadius: getRadius('lg'),
                boxShadow: getShadow('md')
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: String(theme.primary).includes('gradient')  ? theme.primary  : (String(theme.primary).includes('gradient') ? theme.primary : theme.primary + '20'), color: theme.primary }}
                >
                  <Star size={20} />
                </div>
                <span 
                  className="px-2 py-1 text-xs font-medium"
                  style={{ background: String(system.colors.success.hex).includes('gradient')  ? system.colors.success.hex  : (String(system.colors.success.hex).includes('gradient') ? system.colors.success.hex : system.colors.success.hex + '20'), color: system.colors.success.hex, borderRadius: getRadius('sm') }}
                >
                  +12.5%
                </span>
              </div>
              <div>
                <p className="text-sm mb-1 opacity-70" style={{ color: cardTextColor, fontFamily: getFont('body') }}>Total Revenue</p>
                <h5 className="text-3xl font-bold" style={{ color: cardHeaderColor, fontFamily: getFont('display') }}>$45,231.89</h5>
              </div>
            </div>

            {/* Profile Card */}
            <div 
              className="p-6 flex items-center gap-4 transition-transform hover:-translate-y-1"
              style={{ 
                background: theme.surfaceSecondary, 
                border: `1px solid ${theme.borderSubtle}`,
                borderRadius: getRadius('lg'),
                boxShadow: getShadow('md')
              }}
            >
              <div 
                className="w-16 h-16 rounded-full bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: 'url(https://picsum.photos/seed/avatar/100/100)' }}
              />
              <div className="flex flex-col">
                <h5 className="text-lg font-bold" style={{ color: cardHeaderColor, fontFamily: getFont('display') }}>Jane Doe</h5>
                <p className="text-sm mb-2" style={{ color: cardTextColor, fontFamily: getFont('body') }}>Product Designer</p>
                <div className="flex gap-2">
                  <span 
                    className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                    style={{ background: String(theme.primary).includes('gradient')  ? theme.primary  : (String(theme.primary).includes('gradient') ? theme.primary : theme.primary + '20'), color: theme.primary, borderRadius: getRadius('sm') }}
                  >
                    Pro
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggles & Avatars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-70" style={{ color: subHeaderColor }}>Toggles</h4>
            <div className="flex items-center gap-6">
              <div 
                className="w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300"
                style={{ background: toggle1 ? theme.primary : theme.borderSubtle }}
                onClick={() => setToggle1(!toggle1)}
              >
                <div 
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{ left: toggle1 ? 'calc(100% - 20px)' : '4px' }}
                />
              </div>
              <div 
                className="w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300"
                style={{ background: toggle2 ? theme.primary : theme.borderSubtle }}
                onClick={() => setToggle2(!toggle2)}
              >
                <div 
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{ left: toggle2 ? 'calc(100% - 20px)' : '4px' }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 opacity-70" style={{ color: subHeaderColor }}>Avatar Group</h4>
            <div className="flex items-center">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-10 h-10 rounded-full bg-cover bg-center border-2 -ml-3 first:ml-0"
                  style={{ 
                    backgroundImage: `url(https://picsum.photos/seed/avatar${i}/100/100)`,
                    borderColor: theme.surface
                  }}
                />
              ))}
              <div 
                className="w-10 h-10 rounded-full border-2 -ml-3 flex items-center justify-center text-xs font-medium"
                style={{ 
                  background: theme.surfaceSecondary,
                  borderColor: theme.surface,
                  color: theme.textSecondary
                }}
              >
                +4
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
