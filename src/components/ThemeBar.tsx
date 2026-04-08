import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Plus, X, Download, Palette } from 'lucide-react';
import { DesignSystem } from '../types';
import { ExportModal } from './ExportModal';

interface ThemeBarProps {
  system: DesignSystem;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  setDesignSystem: React.Dispatch<React.SetStateAction<DesignSystem | null>>;
  onOpenSettings: () => void;
}

export const ThemeBar: React.FC<ThemeBarProps> = ({
  system,
  activeTheme,
  setActiveTheme,
  setDesignSystem,
  onOpenSettings
}) => {
  const [showNewThemeModal, setShowNewThemeModal] = useState(false);
  const [newThemePrompt, setNewThemePrompt] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeKeys = system?.themes ? Object.keys(system.themes) : [];
  const activeIndex = themeKeys.indexOf(activeTheme);
  const highlightRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const styleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the highlight pill to the active tab
    if (highlightRef.current && tabsRef.current[activeIndex]) {
      const activeTab = tabsRef.current[activeIndex];
      if (activeTab) {
        gsap.to(highlightRef.current, {
          x: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
          duration: 0.4,
          ease: 'power3.out'
        });
      }
    }
  }, [activeTheme, activeIndex, themeKeys.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(event.target as Node)) {
        setShowStyleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemePrompt.trim()) return;

    if (themeKeys.length >= 7) {
      setError('Maximum 5 custom themes allowed.');
      return;
    }

    // Create a safe key name from the prompt
    const themeKey = newThemePrompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `custom-${Date.now()}`;

    if (themeKeys.includes(themeKey)) {
      setError('A theme with this name already exists.');
      return;
    }

    // Copy the colors from the currently active theme
    const currentThemeColors = system.themes?.[activeTheme] || {};

    setDesignSystem(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        themes: {
          ...prev.themes,
          [themeKey]: { ...currentThemeColors }
        }
      };
    });

    setActiveTheme(themeKey);
    setShowNewThemeModal(false);
    setNewThemePrompt('');
    setError(null);
  };

  const handleDeleteTheme = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (key === 'light' || key === 'dark') return;

    setDesignSystem(prev => {
      if (!prev) return prev;
      const newThemes = { ...prev.themes };
      delete newThemes[key];
      return { ...prev, themes: newThemes };
    });

    if (activeTheme === key) {
      setActiveTheme('light');
    }
  };

  const handleStyleChange = (style: 'flat' | 'glassmorphism' | 'brutalism' | 'claymorphism') => {
    setDesignSystem(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        designStyle: style
      };
    });
    setShowStyleDropdown(false);
  };

  const styles = [
    { id: 'flat', name: 'Flat Design', desc: 'Clean, minimal, solid colors' },
    { id: 'glassmorphism', name: 'Glassmorphism', desc: 'Frosted glass, blur, transparency' },
    { id: 'brutalism', name: 'Brutalism', desc: 'Raw, bold borders, hard shadows' },
    { id: 'claymorphism', name: 'Claymorphism', desc: 'Soft, 3D, inner shadows' }
  ];

  return (
    <>
      <div className="sticky top-20 z-30 w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 glass-panel rounded-2xl px-4 shadow-sm border border-black/5 dark:border-white/5">
        
        <div className="relative flex items-center p-1 bg-black/5 dark:bg-white/5 rounded-full overflow-x-auto no-scrollbar max-w-full">
          <div 
            ref={highlightRef}
            className="absolute top-1 bottom-1 left-0 bg-white dark:bg-[#2A2A2A] rounded-full shadow-sm border border-black/5 dark:border-white/5"
            style={{ width: 0, transform: 'translateX(0)' }}
          />
          
          {themeKeys.map((key, idx) => (
            <button
              key={key}
              ref={el => tabsRef.current[idx] = el}
              onClick={() => setActiveTheme(key)}
              className={`relative z-10 flex items-center px-5 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                activeTheme === key 
                  ? 'text-black dark:text-white' 
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
              }`}
            >
              <span className="capitalize">{key.replace(/-/g, ' ')}</span>
              {key !== 'light' && key !== 'dark' && (
                <div 
                  className="ml-2 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 opacity-50 hover:opacity-100 transition-all"
                  onClick={(e) => handleDeleteTheme(e, key)}
                >
                  <X size={12} />
                </div>
              )}
            </button>
          ))}

          {themeKeys.length < 7 && (
            <button
              onClick={() => setShowNewThemeModal(true)}
              className="relative z-10 flex items-center px-4 py-2 ml-1 text-sm font-medium rounded-full text-[var(--color-app-accent)] hover:bg-[var(--color-app-accent)]/10 transition-colors whitespace-nowrap"
            >
              <Plus size={16} className="mr-1" />
              Custom
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={styleDropdownRef}>
            <button
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              className="flex items-center px-4 py-2.5 bg-black/5 dark:bg-white/5 text-sm font-medium rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <Palette size={16} className="mr-2 opacity-70" />
              <span className="capitalize">{system.designStyle || 'Flat Design'}</span>
            </button>
            
            {showStyleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-black/10 dark:border-white/10 overflow-hidden z-50 transform origin-top-right transition-all">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider">
                    Design Style
                  </div>
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id as any)}
                      className={`w-full text-left px-3 py-3 rounded-xl flex flex-col transition-colors ${
                        (system.designStyle || 'flat') === style.id
                          ? 'bg-[var(--color-app-accent)]/10 text-[var(--color-app-accent)]'
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="font-medium text-sm">{style.name}</span>
                      <span className="text-xs opacity-70 mt-0.5">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center px-5 py-2.5 bg-[var(--color-app-accent)] text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            <Download size={16} className="mr-2" />
            Export System
          </button>
        </div>
      </div>

      {/* New Theme Modal */}
      {showNewThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div 
            className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-black/10 dark:border-white/10"
            style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Create My System</h3>
              <button 
                onClick={() => setShowNewThemeModal(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTheme}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 opacity-80">System Name</label>
                <input
                  type="text"
                  value={newThemePrompt}
                  onChange={(e) => setNewThemePrompt(e.target.value)}
                  placeholder="e.g., Ocean breeze, Neon cyberpunk..."
                  className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[var(--color-app-accent)] focus:ring-1 focus:ring-[var(--color-app-accent)] outline-none transition-all"
                  autoFocus
                />
                <p className="text-xs mt-2 opacity-60">
                  This will create a copy of the current <strong>{activeTheme}</strong> system. You can then modify its colors using the color pickers below.
                </p>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewThemeModal(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newThemePrompt.trim()}
                  className={`flex items-center px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    !newThemePrompt.trim()
                      ? 'bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/40 cursor-not-allowed'
                      : 'bg-[var(--color-app-accent)] text-white hover:shadow-md'
                  }`}
                >
                  Create System
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal 
          system={system} 
          activeTheme={activeTheme}
          onClose={() => setShowExportModal(false)} 
        />
      )}
      
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};
