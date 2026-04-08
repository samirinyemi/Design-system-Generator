import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Palette, Key } from 'lucide-react';
import { generateDesignSystemFromScratch, ScratchConfig } from '../services/geminiService';
import { DesignSystem } from '../types';
import ColorPicker from 'react-best-gradient-color-picker';

interface CreateFromScratchProps {
  onGenerate: (system: DesignSystem) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  onOpenSettings: () => void;
}

const ColorInput = ({ label, theme, name, value, activePicker, setActivePicker, handleColorChange, isGenerating, alignClass = "left-0" }: any) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const pickerId = `${theme}-${name}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActivePicker(null);
      }
    };

    if (activePicker === pickerId) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePicker, pickerId, setActivePicker]);

  return (
    <div className={`flex flex-col gap-1.5 relative ${activePicker === pickerId ? 'z-50' : 'z-10'}`}>
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3">
        <div 
          className="w-14 h-12 shrink-0 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm cursor-pointer transition-transform hover:scale-105"
          style={{ background: value }}
          onClick={() => !isGenerating && setActivePicker(activePicker === pickerId ? null : pickerId)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(theme, name, e.target.value)}
          disabled={isGenerating}
          className="flex-1 w-full min-w-0 px-3 py-2 h-12 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      
      {activePicker === pickerId && (
        <div ref={popoverRef} className={`absolute z-50 top-full ${alignClass} mt-2 p-3 bg-white dark:bg-[#2A2A2A] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 w-[320px] max-w-[90vw]`}>
          <ColorPicker value={value} onChange={(color) => handleColorChange(theme, name, color)} />
        </div>
      )}
    </div>
  );
};

export const CreateFromScratch: React.FC<CreateFromScratchProps> = ({ onGenerate, isGenerating, setIsGenerating, onOpenSettings }) => {
  const [config, setConfig] = useState<ScratchConfig>({
    brandName: 'My Brand',
    themeMode: 'both',
    lightColors: {
      primaryColor: '#000000',
      secondaryColor: '#666666',
      accentColor: '#0071E3',
      successColor: '#28A745',
      warningColor: '#FFC107',
      errorColor: '#DC3545',
      infoColor: '#17A2B8',
      background: '#FFFFFF',
      textColor: '#111111',
    },
    darkColors: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#A3A3A3',
      accentColor: '#3B82F6',
      successColor: '#4ADE80',
      warningColor: '#FBBF24',
      errorColor: '#F87171',
      infoColor: '#38BDF8',
      background: '#111111',
      textColor: '#F9FAFB',
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (theme: 'lightColors' | 'darkColors', name: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [theme]: {
        ...prev[theme],
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const system = await generateDesignSystemFromScratch(config);
      if (system) {
        onGenerate(system);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'API_KEY_MISSING') {
        onOpenSettings();
        setError('Please enter your Gemini API key to continue.');
      } else {
        setError('Failed to generate design system from scratch. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };



  const renderColorGrid = (theme: 'lightColors' | 'darkColors', title: string) => {
    const colorFields = [
      { label: 'Primary', name: 'primaryColor' },
      { label: 'Secondary', name: 'secondaryColor' },
      { label: 'Accent', name: 'accentColor' },
      { label: 'Background', name: 'backgroundColor' },
      { label: 'Text', name: 'textColor' },
      { label: 'Success', name: 'successColor' },
      { label: 'Warning', name: 'warningColor' },
      { label: 'Error', name: 'errorColor' }
    ];

    return (
      <div className="flex flex-col gap-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colorFields.map((field, idx) => {
            let alignClass = "left-0";
            if (idx % 4 === 1) alignClass = "right-0 md:right-auto md:left-0";
            else if (idx % 4 === 2) alignClass = "left-0 md:left-auto md:right-0";
            else if (idx % 4 === 3) alignClass = "right-0";

            return (
              <ColorInput 
                key={field.name}
                theme={theme} 
                label={field.label} 
                name={field.name} 
                value={(config[theme] as any)[field.name]} 
                activePicker={activePicker} 
                setActivePicker={setActivePicker} 
                handleColorChange={handleColorChange} 
                isGenerating={isGenerating} 
                alignClass={alignClass}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative z-20 bg-white dark:bg-[#1A1A1A] rounded-[2rem] shadow-sm border border-gray-200 dark:border-white/10 transition-all duration-300 p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-2 text-left flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={config.brandName}
              onChange={handleChange}
              className="w-full text-lg p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
              placeholder="Enter brand name"
              disabled={isGenerating}
              required
            />
          </div>
          <div className="flex flex-col gap-2 text-left flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme Generation</label>
            <div className="flex bg-gray-100 dark:bg-[#2A2A2A] p-1 rounded-xl h-[52px]">
              {(['both', 'light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, themeMode: t }))}
                  className={`flex-1 text-sm font-medium rounded-lg capitalize transition-all ${config.themeMode === t ? 'bg-white dark:bg-[#1A1A1A] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                  {t === 'both' ? 'Light & Dark' : `${t} Only`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {config.themeMode === 'both' && (
          <>
            {renderColorGrid('lightColors', 'Light Theme Colors')}
            {renderColorGrid('darkColors', 'Dark Theme Colors')}
          </>
        )}
        {config.themeMode === 'light' && renderColorGrid('lightColors', 'Light Theme Colors')}
        {config.themeMode === 'dark' && renderColorGrid('darkColors', 'Dark Theme Colors')}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {error ? <span className="text-red-500 text-sm">{error}</span> : <div></div>}
        <div className="flex items-center space-x-4">
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
          disabled={isGenerating}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            isGenerating
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
              <span>Generate System</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        </div>
      </div>
    </form>
  );
};
