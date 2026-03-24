import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { POPULAR_GOOGLE_FONTS } from '../../utils/googleFonts';

interface FontDropdownProps {
  value: string;
  onChange: (fontName: string) => void;
  theme: any;
}

export const FontDropdown: React.FC<FontDropdownProps> = ({ value, onChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredFonts = POPULAR_GOOGLE_FONTS.filter(font => 
    font.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors text-sm"
        style={{ 
          background: theme.surfaceSecondary, 
          borderColor: theme.borderSubtle,
          color: theme.textPrimary
        }}
      >
        <span className="truncate" style={{ fontFamily: `"${value}", sans-serif` }}>{value}</span>
        <ChevronDown size={14} className="opacity-50 ml-2 flex-shrink-0" />
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 rounded-lg border shadow-xl max-h-60 flex flex-col overflow-hidden"
          style={{ 
            background: theme.surface, 
            borderColor: theme.border,
          }}
        >
          <div className="p-2 border-b" style={{ borderColor: theme.borderSubtle }}>
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50" style={{ color: theme.textSecondary }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fonts..."
                className="w-full pl-8 pr-2 py-1.5 text-sm rounded bg-transparent outline-none"
                style={{ color: theme.textPrimary }}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredFonts.length > 0 ? (
              filteredFonts.map(font => (
                <button
                  key={font}
                  onClick={() => {
                    onChange(font);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ 
                    color: font === value ? theme.primary : theme.textPrimary,
                    fontFamily: `"${font}", sans-serif`,
                    fontWeight: font === value ? 600 : 400
                  }}
                >
                  {font}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm opacity-50" style={{ color: theme.textSecondary }}>
                No fonts found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
