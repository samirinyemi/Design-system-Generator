import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Trash2 } from 'lucide-react';
import { presets } from '../data/presets';
import { DesignSystem } from '../types';

interface PresetGridProps {
  onSelect: (system: DesignSystem) => void;
}

export const PresetGrid: React.FC<PresetGridProps> = ({ onSelect }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customSystems, setCustomSystems] = useState<DesignSystem[]>([]);

  useEffect(() => {
    const loadCustomSystems = () => {
      try {
        const saved = localStorage.getItem('SAVED_DESIGN_SYSTEMS');
        if (saved) {
          setCustomSystems(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to load custom systems', err);
      }
    };

    loadCustomSystems();
    
    // Listen for storage events in case it's updated in another tab
    window.addEventListener('storage', loadCustomSystems);
    return () => window.removeEventListener('storage', loadCustomSystems);
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      const header = gridRef.current.querySelector('.preset-header');
      const items = gridRef.current.querySelectorAll('.preset-item');
      
      gsap.fromTo(
        [header, ...Array.from(items)],
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.2)', delay: 0.1 }
      );
    }
  }, [activeTab, customSystems.length]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = customSystems.filter(s => s.id !== id);
    setCustomSystems(updated);
    localStorage.setItem('SAVED_DESIGN_SYSTEMS', JSON.stringify(updated));
  };

  const displayItems = activeTab === 'presets' ? presets : customSystems;

  return (
    <div ref={gridRef} className="w-full mt-24 mb-12">
      <div className="preset-header flex flex-col md:flex-row md:items-center justify-between mb-8 opacity-0 gap-4">
        <div className="flex bg-gray-100 dark:bg-[#2A2A2A] p-1 rounded-full w-fit">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'presets' 
                ? 'bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'custom' 
                ? 'bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            My System
          </button>
        </div>
        
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {activeTab === 'presets' ? 'Choose a preset from the existing presets' : 'Colors and systems you have generated'}
        </span>
      </div>
      
      {displayItems.length === 0 && activeTab === 'custom' ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-[#333] rounded-2xl">
          <p>You haven't generated any custom design systems yet.</p>
          <p className="text-sm mt-2">Generate one above and it will be saved here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayItems.map((preset, idx) => {
            const theme = preset.themes.light || Object.values(preset.themes)[0];
            return (
              <button
                key={preset.id || idx}
                onClick={() => onSelect(preset)}
                className="preset-item relative group flex flex-col text-left bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl p-4 hover:border-gray-300 dark:hover:border-[#444] hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-app-accent)] opacity-0"
              >
                {activeTab === 'custom' && preset.id && (
                  <div 
                    onClick={(e) => handleDelete(e, preset.id!)}
                    className="absolute top-2 right-2 z-20 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30"
                    title="Delete saved system"
                  >
                    <Trash2 size={14} />
                  </div>
                )}
                
                <div 
                  className="w-full h-24 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                  style={{ background: theme.background }}
                >
                  {/* Mini preview of the design system */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '12px 12px', color: theme.textPrimary }}></div>
                  <div className="flex gap-2 z-10">
                    <div className="w-8 h-8 rounded-full shadow-sm" style={{ background: theme.primary }}></div>
                    <div className="w-8 h-8 rounded-full shadow-sm" style={{ background: theme.secondary }}></div>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 dark:text-white truncate w-full">
                  {preset.brandName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate w-full">
                  {preset.brandTagline}
                </p>
                
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-[#2A2A2A] overflow-hidden">
                    <div className="h-full rounded-full" style={{ background: theme.primary, width: '40%' }}></div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400 dark:text-gray-500">
                    {preset.typography.displayFont.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
