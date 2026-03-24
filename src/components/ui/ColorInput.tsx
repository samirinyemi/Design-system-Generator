import React, { useState, useEffect } from 'react';

// Helper to convert hex to rgba
const hexToRgba = (hex: string) => {
  if (!hex.startsWith('#')) return hex;
  let r = 0, g = 0, b = 0, a = 1;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } else if (hex.length === 9) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
    a = parseInt(hex.substring(7, 9), 16) / 255;
  } else {
    return hex;
  }
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
};

// Helper to convert rgba to hex
const rgbaToHex = (rgba: string) => {
  if (!rgba.startsWith('rgb')) return rgba;
  const match = rgba.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (!match) return rgba;
  
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  const a = match[4] ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : '';
  
  return `#${r}${g}${b}${a}`;
};

export const ColorInput = ({ 
  value, 
  onChange, 
  theme,
  className = "",
  style = {}
}: { 
  value: string, 
  onChange: (val: string) => void, 
  theme: any,
  className?: string,
  style?: React.CSSProperties
}) => {
  const safeValue = value || '';
  const isGradient = safeValue.includes('gradient');
  const initialFormat = isGradient ? 'GRAD' : (safeValue.startsWith('rgb') ? 'RGBA' : 'HEX');
  const [format, setFormat] = useState<'HEX' | 'RGBA' | 'GRAD'>(initialFormat);
  
  // Keep format in sync if value changes externally to/from gradient
  useEffect(() => {
    if (safeValue.includes('gradient')) {
      setFormat('GRAD');
    } else if (format === 'GRAD') {
      setFormat(safeValue.startsWith('rgb') ? 'RGBA' : 'HEX');
    }
  }, [safeValue]);

  const displayValue = format === 'HEX' 
    ? (safeValue.startsWith('rgb') ? rgbaToHex(safeValue) : safeValue)
    : format === 'RGBA' 
      ? (safeValue.startsWith('#') ? hexToRgba(safeValue) : safeValue)
      : safeValue; // GRAD format

  const handleFormatToggle = () => {
    if (format === 'GRAD') return; // Don't toggle gradients
    const newFormat = format === 'HEX' ? 'RGBA' : 'HEX';
    setFormat(newFormat);
    onChange(newFormat === 'HEX' ? rgbaToHex(value) : hexToRgba(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div 
      className={`flex border rounded overflow-hidden focus-within:ring-1 ${className}`} 
      style={{ borderColor: theme.borderSubtle, background: theme.surfaceSecondary, ...style }}
    >
      <input 
        type="text" 
        value={displayValue}
        onChange={handleChange}
        className="w-full p-1.5 text-xs outline-none bg-transparent font-mono"
        style={{ color: style.color || theme.textPrimary }}
      />
      <button 
        onClick={(e) => { e.stopPropagation(); handleFormatToggle(); }}
        disabled={format === 'GRAD'}
        className={`px-2 py-1.5 text-[10px] font-bold outline-none border-l bg-transparent transition-opacity ${format === 'GRAD' ? 'cursor-default opacity-50' : 'hover:opacity-80 cursor-pointer'}`}
        style={{ color: style.color || theme.textSecondary, borderColor: style.borderColor || theme.borderSubtle }}
      >
        {format}
      </button>
    </div>
  );
};
