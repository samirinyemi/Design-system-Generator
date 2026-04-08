import React from 'react';
import { Moon, Sun, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  brandName?: string;
  onReset: () => void;
  isDarkMode: boolean;
  toggleAppTheme: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ brandName, onReset, isDarkMode, toggleAppTheme, onOpenSettings }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-black/5 dark:border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Design System AI</span>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          {brandName && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-[var(--color-app-text-secondary-light)] dark:text-[var(--color-app-text-secondary-dark)]">
              <span>Active:</span>
              <span className="font-medium text-[var(--color-app-text-primary-light)] dark:text-[var(--color-app-text-primary-dark)]">{brandName}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleAppTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {brandName && (
            <button 
              onClick={onReset}
              className="text-sm font-medium px-4 py-2 rounded-full border border-[var(--color-app-border-light)] dark:border-[var(--color-app-border-dark)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              New System
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
