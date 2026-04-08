import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Type, Palette, Key } from 'lucide-react';
import { generateDesignSystem } from '../services/geminiService';
import { DesignSystem } from '../types';
import { PresetGrid } from './PresetGrid';
import { CreateFromScratch } from './CreateFromScratch';

interface HeroProps {
  onGenerate: (system: DesignSystem) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  onOpenSettings: () => void;
}

const placeholders = [
  "Luxury fintech for millennials",
  "Playful children's education app",
  "Minimalist Japanese wellness brand",
  "Bold streetwear e-commerce",
  "Calm meditation and sleep app",
  "Professional B2B SaaS platform",
  "Vibrant African fashion marketplace",
  "Clean sustainable food delivery"
];

const suggestions = [
  "Cyberpunk crypto wallet",
  "Organic skincare line",
  "High-end real estate",
  "Retro arcade game",
  "Modern art gallery",
  "Eco-friendly travel"
];

export const Hero: React.FC<HeroProps> = ({ onGenerate, isGenerating, setIsGenerating, onOpenSettings }) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'describe' | 'scratch'>('describe');
  const [displayMode, setDisplayMode] = useState<'describe' | 'scratch'>('describe');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }

    // Placeholder rotation
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: -10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [displayMode]);

  const handleModeSwitch = (newMode: 'describe' | 'scratch') => {
    if (newMode === mode || isGenerating) return;
    setMode(newMode);
    
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 10,
        scale: 0.98,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayMode(newMode);
        }
      });
    } else {
      setDisplayMode(newMode);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!prompt.trim()) return;
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const system = await generateDesignSystem(prompt);
      if (system) {
        onGenerate(system);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'API_KEY_MISSING') {
        onOpenSettings();
        setError('Please enter your Gemini API key to continue.');
      } else {
        setError('Failed to generate design system. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center mt-20 md:mt-32">
      <div ref={heroRef} className="w-full max-w-3xl mx-auto flex flex-col items-center relative z-20">
        <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
          Design Systems, instantly.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 font-light">
          Describe your brand or build a custom system, and we'll generate a complete design system in seconds.
        </p>

        <div className="flex bg-gray-100 dark:bg-[#2A2A2A] p-1 rounded-full mb-8">
          <button
            onClick={() => handleModeSwitch('describe')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === 'describe' 
                ? 'bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Type size={16} />
            Describe
          </button>
          <button
            onClick={() => handleModeSwitch('scratch')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === 'scratch' 
                ? 'bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Palette size={16} />
            Custom
          </button>
        </div>

        <div ref={contentRef} className="w-full relative z-20">
          {displayMode === 'describe' ? (
            <>
              <form onSubmit={handleGenerate} className="w-full relative group mt-4">
                <div className="relative bg-white dark:bg-[#1A1A1A] rounded-[2rem] shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 focus-within:border-gray-400 dark:focus-within:border-white/30 focus-within:shadow-md">
                  
                  <textarea
                    ref={inputRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholders[placeholderIndex]}
                    className="w-full h-32 p-6 md:p-8 text-lg md:text-xl bg-transparent border-none focus:ring-0 resize-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 transition-all duration-500"
                    disabled={isGenerating}
                  />
                  
                  <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                    {error && <span className="text-red-500 text-sm">{error}</span>}
                    <button
                      type="button"
                      onClick={onOpenSettings}
                      className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400"
                      title="API Settings"
                    >
                      <Key className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!prompt.trim() || isGenerating}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                        !prompt.trim() || isGenerating
                          ? 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 cursor-not-allowed'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:shadow-md hover:scale-105'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-8 w-full">
                <div className="flex flex-wrap items-center justify-center gap-3 pb-4">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="whitespace-nowrap px-4 py-2 rounded-full text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white transition-colors duration-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <CreateFromScratch onGenerate={onGenerate} isGenerating={isGenerating} setIsGenerating={setIsGenerating} onOpenSettings={onOpenSettings} />
          )}
        </div>
      </div>

      <PresetGrid onSelect={onGenerate} />
    </div>
  );
};
