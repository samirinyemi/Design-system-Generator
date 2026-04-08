import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ReactLenis } from 'lenis/react';
import { DesignSystem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DesignSystemDisplay } from './components/DesignSystemDisplay';
import { ToastProvider } from './components/Toast';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FORCE_BYOK } from './services/geminiService';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function App() {
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const [isDarkMode, setIsDarkMode] = useState(false); // App chrome theme
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toggle app chrome theme based on system preference or manual toggle
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleAppTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleGenerate = async (system: DesignSystem) => {
    const newSystem = {
      ...system,
      id: system.id || `ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: system.createdAt || Date.now()
    };
    
    setDesignSystem(newSystem);
    setActiveTheme('light');
    
    // Smooth scroll to results after a short delay
    setTimeout(() => {
      const displayElement = document.getElementById('design-system-display');
      if (displayElement) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: displayElement, offsetY: 80 },
          ease: 'power3.inOut'
        });
      }
    }, 500);
  };

  // Save to localStorage whenever designSystem changes
  useEffect(() => {
    if (designSystem && designSystem.id) {
      try {
        const saved = localStorage.getItem('SAVED_DESIGN_SYSTEMS');
        const parsed: DesignSystem[] = saved ? JSON.parse(saved) : [];
        
        const existingIndex = parsed.findIndex(s => s.id === designSystem.id);
        if (existingIndex >= 0) {
          parsed[existingIndex] = designSystem;
        } else {
          parsed.unshift(designSystem); // Add to beginning
        }
        
        localStorage.setItem('SAVED_DESIGN_SYSTEMS', JSON.stringify(parsed));
      } catch (err) {
        console.error('Failed to save design system to localStorage', err);
      }
    }
  }, [designSystem]);

  const handleReset = () => {
    setDesignSystem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <ToastProvider>
        <div className="min-h-screen flex flex-col font-sans text-[var(--color-app-text-primary-light)] dark:text-[var(--color-app-text-primary-dark)]">
          <Header 
            brandName={designSystem?.brandName} 
            onReset={handleReset} 
            isDarkMode={isDarkMode}
            toggleAppTheme={toggleAppTheme}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          
          <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
            {!designSystem && (
              <Hero 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating} 
                setIsGenerating={setIsGenerating}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            )}

            {designSystem && (
              <DesignSystemDisplay 
                system={designSystem} 
                activeTheme={activeTheme}
                setActiveTheme={setActiveTheme}
                setDesignSystem={setDesignSystem}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            )}
          </main>

          <footer className="w-full py-8 text-center text-sm text-[var(--color-app-text-secondary-light)] dark:text-[var(--color-app-text-secondary-dark)]">
            <p>Built with love ✦ By Soni labs</p>
            <p className="text-xs mt-1 opacity-70">Design System AI — Generate, Preview, Export</p>
          </footer>
          <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </ToastProvider>
    </ReactLenis>
  );
}
