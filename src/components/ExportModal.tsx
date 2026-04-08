import React, { useState, useEffect } from 'react';
import { X, Download, Code, FileJson, Image as ImageIcon, LayoutTemplate, FileText, Copy } from 'lucide-react';
import { DesignSystem } from '../types';
import * as htmlToImage from 'html-to-image';
import { generateMarkdown } from '../utils/exportMarkdown';

interface ExportModalProps {
  system: DesignSystem;
  activeTheme: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ system, activeTheme, onClose }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(Object.keys(system.themes || {}));

  useEffect(() => {
    // Lock body scroll when modal is mounted
    document.body.style.overflow = 'hidden';
    return () => {
      // Restore body scroll when modal is unmounted
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleExport = async (type: string, action: 'download' | 'copy' = 'download') => {
    setExporting(type);
    setSuccess(null);

    const filteredSystem = {
      ...system,
      themes: Object.fromEntries(
        Object.entries(system.themes || {}).filter(([key]) => selectedThemes.includes(key))
      )
    };

    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (type) {
        case 'markdown':
          content = generateMarkdown(filteredSystem, activeTheme);
          filename = `${(system.brandName || 'brand').toLowerCase().replace(/\s+/g, '-')}-ai-prompt.md`;
          mimeType = 'text/markdown';
          break;
        case 'figma':
          content = JSON.stringify(generateFigmaTokens(filteredSystem), null, 2);
          filename = `${(system.brandName || 'brand').toLowerCase().replace(/\s+/g, '-')}-tokens.json`;
          mimeType = 'application/json';
          break;
        case 'figma-direct':
          const svg = generateFigmaSVG(filteredSystem);
          await navigator.clipboard.writeText(svg);
          setExporting(null);
          setSuccess(type + '-copy');
          setTimeout(() => setSuccess(null), 2000);
          return;
        case 'css':
          content = generateCSSVariables(filteredSystem);
          filename = `${(system.brandName || 'brand').toLowerCase().replace(/\s+/g, '-')}-theme.css`;
          mimeType = 'text/css';
          break;
        case 'tailwind':
          content = generateTailwindConfig(filteredSystem);
          filename = 'tailwind.config.js';
          mimeType = 'application/javascript';
          break;
        case 'json':
          content = JSON.stringify(filteredSystem, null, 2);
          filename = `${(system.brandName || 'brand').toLowerCase().replace(/\s+/g, '-')}-design-system.json`;
          mimeType = 'application/json';
          break;
        case 'png':
          await captureScreenshot();
          setExporting(null);
          setSuccess(type);
          setTimeout(() => setSuccess(null), 2000);
          return;
      }

      if (action === 'copy') {
        await navigator.clipboard.writeText(content);
        setSuccess(type + '-copy');
      } else if (content) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSuccess(type);
      }

      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const captureScreenshot = async () => {
    const element = document.getElementById('design-system-display');
    if (!element) return;

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        cacheBust: true,
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${(system.brandName || 'brand').toLowerCase().replace(/\s+/g, '-')}-design-system.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="glass-panel w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl border border-black/10 dark:border-white/10"
        style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 sm:p-6 pb-4 border-b border-black/5 dark:border-white/5 shrink-0">
          <div>
            <h3 className="text-xl font-semibold mb-1">Export Your Design System</h3>
            <p className="text-sm opacity-70">Choose your preferred format to download.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 ml-4"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar" data-lenis-prevent>
          <div className="mb-6">
            <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider opacity-70">Select Themes to Export</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(system.themes || {}).map(theme => (
                <label key={theme} className="flex items-center gap-2 cursor-pointer bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedThemes.includes(theme)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedThemes([...selectedThemes, theme]);
                      } else {
                        setSelectedThemes(selectedThemes.filter(t => t !== theme));
                      }
                    }}
                    className="rounded border-gray-300 text-[var(--color-app-accent)] focus:ring-[var(--color-app-accent)]"
                  />
                  <span className="capitalize text-xs font-medium">{theme}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ExportCard 
              icon={<Copy size={18} />}
              title="Copy to Figma"
              description="Copies an SVG of your design system. Just paste directly into Figma!"
              onClick={() => handleExport('figma-direct')}
              isExporting={exporting === 'figma-direct'}
              isSuccess={success === 'figma-direct'}
              actionText="Copy to Clipboard"
            />
            <ExportCard 
              icon={<LayoutTemplate size={18} />}
              title="Figma Tokens"
              description="JSON file compatible with Tokens Studio for Figma plugin."
              onClick={() => handleExport('figma')}
              onCopy={() => handleExport('figma', 'copy')}
              isExporting={exporting === 'figma'}
              isSuccess={success === 'figma'}
              isCopied={success === 'figma-copy'}
            />
            <ExportCard 
              icon={<FileText size={18} />}
              title="AI Prompt (.md)"
              description="Markdown file optimized for AI coding assistants (Cursor, v0, ChatGPT)."
              onClick={() => handleExport('markdown')}
              onCopy={() => handleExport('markdown', 'copy')}
              isExporting={exporting === 'markdown'}
              isSuccess={success === 'markdown'}
              isCopied={success === 'markdown-copy'}
            />
            <ExportCard 
              icon={<Code size={18} />}
              title="CSS Variables"
              description="Complete CSS custom properties file. Drop into any project."
              onClick={() => handleExport('css')}
              onCopy={() => handleExport('css', 'copy')}
              isExporting={exporting === 'css'}
              isSuccess={success === 'css'}
              isCopied={success === 'css-copy'}
            />
            <ExportCard 
              icon={<FileJson size={18} />}
              title="Tailwind Config"
              description="Ready-to-use tailwind.config.js with your entire system."
              onClick={() => handleExport('tailwind')}
              onCopy={() => handleExport('tailwind', 'copy')}
              isExporting={exporting === 'tailwind'}
              isSuccess={success === 'tailwind'}
              isCopied={success === 'tailwind-copy'}
            />
            <ExportCard 
              icon={<FileJson size={18} />}
              title="Raw JSON"
              description="Complete design system data. Use in any framework or tool."
              onClick={() => handleExport('json')}
              onCopy={() => handleExport('json', 'copy')}
              isExporting={exporting === 'json'}
              isSuccess={success === 'json'}
              isCopied={success === 'json-copy'}
            />
            <ExportCard 
              icon={<ImageIcon size={18} />}
              title="Screenshot"
              description="High-res PNG image of your entire design system."
              onClick={() => handleExport('png')}
              isExporting={exporting === 'png'}
              isSuccess={success === 'png'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportCard = ({ icon, title, description, onClick, onCopy, isExporting, isSuccess, isCopied, actionText }: any) => (
  <div 
    onClick={isExporting ? undefined : onClick}
    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col h-full bg-white dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-[var(--color-app-accent)] hover:shadow-md ${isExporting ? 'opacity-50 pointer-events-none' : ''}`}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--color-app-accent)] shrink-0">
        {icon}
      </div>
      <h4 className="text-sm font-semibold leading-tight">{title}</h4>
    </div>
    <p className="text-[11px] opacity-70 flex-grow mb-3 leading-relaxed">{description}</p>
    
    <div className="mt-auto flex items-center text-[11px] font-medium text-[var(--color-app-accent)]">
      {isExporting ? (
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-[var(--color-app-accent)]/30 border-t-[var(--color-app-accent)] rounded-full animate-spin mr-2"></div>
          Exporting...
        </div>
      ) : isSuccess || isCopied ? (
        <span className="text-green-500 flex items-center">
          <Check size={14} className="mr-1" /> {isCopied || actionText === 'Copy to Clipboard' ? 'Copied!' : 'Exported!'}
        </span>
      ) : (
        <div className="flex items-center justify-between w-full">
          <span className="flex items-center group-hover:translate-x-1 transition-transform">
            {actionText || 'Download'} {actionText === 'Copy to Clipboard' ? <Copy size={12} className="ml-1" /> : <Download size={12} className="ml-1" />}
          </span>
          {onCopy && (
            <button 
              onClick={(e) => { e.stopPropagation(); onCopy(); }}
              className="flex items-center hover:opacity-70 transition-opacity px-2.5 py-1.5 rounded-md bg-[var(--color-app-accent)]/10"
            >
              Copy <Copy size={12} className="ml-1" />
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

const Check = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// --- Export Generators ---

function parseDimension(val: string, base: number = 16): number {
  if (!val) return 0;
  if (val.includes('calc')) {
    const match = val.match(/calc\(([\d.]+)rem\s*\*\s*([\d.]+)\)/);
    if (match) return parseFloat(match[1]) * base * parseFloat(match[2]);
    return base;
  }
  if (val.endsWith('rem')) return parseFloat(val) * base;
  if (val.endsWith('em')) return parseFloat(val) * base;
  if (val.endsWith('px')) return parseFloat(val);
  if (val.endsWith('%')) return 100; // arbitrary for border-radius 50%
  return parseFloat(val) || 0;
}

function getSolidColorFallback(colorString: string): string {
  if (!colorString) return '#000000';
  if (!colorString.includes('gradient')) return colorString;
  const match = colorString.match(/#([0-9a-fA-F]{3,8})|rgba?\([^)]+\)/);
  return match ? match[0] : '#E5E7EB';
}

function generateFigmaSVG(system: DesignSystem): string {
  const width = 1200;
  let yOffset = 100;
  let svg = `<svg width="${width}" height="5000" viewBox="0 0 ${width} 5000" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background
  svg += `<rect width="${width}" height="5000" fill="#F9FAFB"/>`;
  
  // Title
  svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="64" font-weight="bold" fill="#111827">${system.brandName || 'Design System'}</text>`;
  yOffset += 100;
  
  // Colors Section
  svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="32" font-weight="bold" fill="#111827">Colors</text>`;
  yOffset += 60;
  
  const drawColorRow = (title: string, colors: any[]) => {
    if (!colors || colors.length === 0) return;
    svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.bodyFont?.name || 'sans-serif'}" font-size="18" font-weight="600" fill="#4B5563">${title}</text>`;
    yOffset += 30;
    
    let xOffset = 100;
    colors.forEach(c => {
      const fillAttr = `fill="${getSolidColorFallback(c.hex)}"`;
      svg += `<rect x="${xOffset}" y="${yOffset}" width="80" height="80" rx="12" ${fillAttr}/>`;
      svg += `<text x="${xOffset}" y="${yOffset + 100}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="12" fill="#6B7280">${c.shade || c.name}</text>`;
      svg += `<text x="${xOffset}" y="${yOffset + 116}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="12" fill="#9CA3AF">${c.hex.substring(0, 15)}${c.hex.length > 15 ? '...' : ''}</text>`;
      xOffset += 100;
      if (xOffset > width - 100) {
        xOffset = 100;
        yOffset += 140;
      }
    });
    yOffset += 160;
  };
  
  const brandColors = [
    system.colors?.primary,
    system.colors?.secondary,
    system.colors?.accent
  ].filter(Boolean);
  drawColorRow('Brand Colors', brandColors);

  const semanticColors = [
    system.colors?.success,
    system.colors?.warning,
    system.colors?.error,
    system.colors?.info
  ].filter(Boolean);
  drawColorRow('Semantic Colors', semanticColors);
  
  if (system.colors?.primaryScale && system.colors.primaryScale.length > 0) {
    drawColorRow('Primary Scale', system.colors.primaryScale);
  }
  if (system.colors?.neutrals && system.colors.neutrals.length > 0) {
    drawColorRow('Neutrals', system.colors.neutrals);
  }
  
  // Typography Section
  svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="32" font-weight="bold" fill="#111827">Typography</text>`;
  yOffset += 60;
  
  (system.typography?.scale || []).forEach(t => {
    const isHeading = t.name.startsWith('h');
    const fontFamily = isHeading ? system.typography?.displayFont?.name : system.typography?.bodyFont?.name;
    const fontWeight = isHeading ? 'bold' : 'normal';
    const pxSize = parseDimension(t.size);
    
    svg += `<text x="100" y="${yOffset}" font-family="${fontFamily || 'sans-serif'}" font-size="${pxSize}" font-weight="${fontWeight}" fill="#111827">The quick brown fox jumps over the lazy dog</text>`;
    svg += `<text x="100" y="${yOffset + 24}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="14" fill="#6B7280">${t.name} - ${t.size} / ${t.lineHeight}</text>`;
    yOffset += pxSize + 60;
  });
  
  // Spacing Section
  svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="32" font-weight="bold" fill="#111827">Spacing</text>`;
  yOffset += 60;
  
  let spacingX = 100;
  let maxSpacingY = yOffset;
  (system.spacing?.scale || []).forEach(s => {
    const size = parseDimension(s.value);
    if (spacingX + size + 40 > width - 100) {
      spacingX = 100;
      yOffset = maxSpacingY + 80;
    }
    svg += `<rect x="${spacingX}" y="${yOffset}" width="${size}" height="${size}" fill="#E5E7EB"/>`;
    svg += `<text x="${spacingX}" y="${yOffset + size + 20}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="12" fill="#6B7280">${s.name}</text>`;
    svg += `<text x="${spacingX}" y="${yOffset + size + 36}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="12" fill="#9CA3AF">${s.value}</text>`;
    spacingX += size + 60;
    maxSpacingY = Math.max(maxSpacingY, yOffset + size);
  });
  yOffset = maxSpacingY + 100;
  
  // Radii Section
  svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="32" font-weight="bold" fill="#111827">Border Radius</text>`;
  yOffset += 60;
  
  let radiusX = 100;
  let maxRadiusY = yOffset;
  (system.borderRadius?.scale || []).forEach(r => {
    const size = 80;
    const radius = parseDimension(r.value);
    if (radiusX + size + 40 > width - 100) {
      radiusX = 100;
      yOffset = maxRadiusY + 80;
    }
    svg += `<rect x="${radiusX}" y="${yOffset}" width="${size}" height="${size}" rx="${radius}" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="2"/>`;
    svg += `<text x="${radiusX}" y="${yOffset + size + 20}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="12" fill="#6B7280">${r.name}</text>`;
    svg += `<text x="${radiusX}" y="${yOffset + size + 36}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="12" fill="#9CA3AF">${r.value}</text>`;
    radiusX += size + 60;
    maxRadiusY = Math.max(maxRadiusY, yOffset + size);
  });
  yOffset = maxRadiusY + 100;
  
  // Shadows Section
  let defs = '<defs>';
  if (system.shadows?.scale && system.shadows.scale.length > 0) {
    svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="32" font-weight="bold" fill="#111827">Shadows</text>`;
    yOffset += 60;
    
    let shadowX = 100;
    let maxShadowY = yOffset;
    
    system.shadows.scale.forEach((s, i) => {
      const size = 120;
      if (shadowX + size + 40 > width - 100) {
        shadowX = 100;
        yOffset = maxShadowY + 120;
      }
      
      // Parse shadow value
      let dx = 0, dy = 4, blur = 6, color = 'rgba(0,0,0,0.1)';
      const match = s.value.match(/(-?\d+px|-?\d+)\s+(-?\d+px|-?\d+)\s+(-?\d+px|-?\d+)(?:\s+(-?\d+px|-?\d+))?\s*(rgba?\(.*?\)|#\w+)/);
      if (match) {
        dx = parseFloat(match[1]) || 0;
        dy = parseFloat(match[2]) || 0;
        blur = parseFloat(match[3]) || 0;
        color = match[5] || 'rgba(0,0,0,0.1)';
      } else {
        if (s.name === 'sm') { dy = 1; blur = 2; }
        if (s.name === 'lg') { dy = 10; blur = 15; }
      }
      
      const filterId = `shadow-${i}`;
      let floodOpacity = 0.1;
      let floodColor = '#000000';
      if (color.includes('rgba')) {
        const rgbaMatch = color.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
        if (rgbaMatch) floodOpacity = parseFloat(rgbaMatch[1]);
      } else if (color.startsWith('#')) {
        floodColor = color;
      }
      
      defs += `
        <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${blur / 2}" flood-color="${floodColor}" flood-opacity="${floodOpacity}"/>
        </filter>
      `;
      
      svg += `<rect x="${shadowX}" y="${yOffset}" width="${size}" height="${size}" rx="12" fill="#FFFFFF" filter="url(#${filterId})"/>`;
      svg += `<text x="${shadowX}" y="${yOffset + size + 30}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="14" font-weight="bold" fill="#111827">${s.name}</text>`;
      svg += `<text x="${shadowX}" y="${yOffset + size + 50}" font-family="${system.typography?.monoFont?.name || 'monospace'}" font-size="12" fill="#6B7280">${s.value}</text>`;
      
      shadowX += size + 60;
      maxShadowY = Math.max(maxShadowY, yOffset + size);
    });
    
    yOffset = maxShadowY + 120;
  }
  defs += '</defs>';
  
  // Components Section
  svg += `<text x="100" y="${yOffset}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="32" font-weight="bold" fill="#111827">Components</text>`;
  yOffset += 60;

  const primaryColor = getSolidColorFallback(system.colors?.primary?.hex || '#000000');
  const secondaryColor = getSolidColorFallback(system.colors?.secondary?.hex || '#666666');
  const fontName = system.typography?.bodyFont?.name || 'sans-serif';
  const borderRadiusObj = system.borderRadius?.scale?.find(r => r.name === 'md') || system.borderRadius?.scale?.[0];
  const borderRadius = borderRadiusObj ? parseDimension(borderRadiusObj.value) : 8;
  
  // Primary Button
  svg += `<rect x="100" y="${yOffset}" width="160" height="48" rx="${borderRadius}" fill="${primaryColor}"/>`;
  svg += `<text x="180" y="${yOffset + 29}" font-family="${fontName}" font-size="16" font-weight="600" fill="#FFFFFF" text-anchor="middle">Primary Button</text>`;
  
  // Secondary Button
  svg += `<rect x="280" y="${yOffset}" width="180" height="48" rx="${borderRadius}" fill="transparent" stroke="${secondaryColor}" stroke-width="2"/>`;
  svg += `<text x="370" y="${yOffset + 29}" font-family="${fontName}" font-size="16" font-weight="600" fill="${secondaryColor}" text-anchor="middle">Secondary Button</text>`;

  yOffset += 80;

  // Input Field
  svg += `<rect x="100" y="${yOffset}" width="360" height="48" rx="${borderRadius}" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="1"/>`;
  svg += `<text x="116" y="${yOffset + 29}" font-family="${fontName}" font-size="16" fill="#9CA3AF">Enter text here...</text>`;

  yOffset += 80;

  // Card
  const shadowFilter = system.shadows?.scale?.length ? 'filter="url(#shadow-0)"' : '';
  svg += `<rect x="100" y="${yOffset}" width="360" height="200" rx="${borderRadius * 1.5}" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1" ${shadowFilter}/>`;
  svg += `<text x="124" y="${yOffset + 40}" font-family="${system.typography?.displayFont?.name || 'sans-serif'}" font-size="24" font-weight="bold" fill="#111827">Card Title</text>`;
  
  // Multiline text for card body
  svg += `<text x="124" y="${yOffset + 70}" font-family="${fontName}" font-size="16" fill="#4B5563">This is a sample card component using</text>`;
  svg += `<text x="124" y="${yOffset + 94}" font-family="${fontName}" font-size="16" fill="#4B5563">your design system tokens. It includes</text>`;
  svg += `<text x="124" y="${yOffset + 118}" font-family="${fontName}" font-size="16" fill="#4B5563">typography, colors, and spacing.</text>`;
  
  svg += `<rect x="124" y="${yOffset + 140}" width="120" height="40" rx="${borderRadius}" fill="${primaryColor}"/>`;
  svg += `<text x="184" y="${yOffset + 165}" font-family="${fontName}" font-size="14" font-weight="600" fill="#FFFFFF" text-anchor="middle">Action</text>`;

  yOffset += 260;

  // Update viewBox height
  svg = svg.replace('height="5000" viewBox="0 0 1200 5000"', `height="${yOffset + 100}" viewBox="0 0 1200 ${yOffset + 100}"`);
  svg = svg.replace('<rect width="1200" height="5000" fill="#F9FAFB"/>', `<rect width="1200" height="${yOffset + 100}" fill="#F9FAFB"/>`);
  
  svg = svg.replace('xmlns="http://www.w3.org/2000/svg">', `xmlns="http://www.w3.org/2000/svg">${defs}`);
  
  svg += `</svg>`;
  return svg;
}

function generateFigmaTokens(system: DesignSystem) {
  const tokens: any = {
    global: {
      colors: {
        primary: { value: system.colors?.primary?.hex || '#000000', type: 'color' },
        secondary: { value: system.colors?.secondary?.hex || '#666666', type: 'color' },
        accent: { value: system.colors?.accent?.hex || '#0071E3', type: 'color' },
        success: { value: system.colors?.success?.hex || '#28A745', type: 'color' },
        warning: { value: system.colors?.warning?.hex || '#FFC107', type: 'color' },
        error: { value: system.colors?.error?.hex || '#DC3545', type: 'color' },
        info: { value: system.colors?.info?.hex || '#17A2B8', type: 'color' },
      },
      fontFamilies: {
        display: { value: system.typography?.displayFont?.name || 'Playfair Display', type: 'fontFamilies' },
        body: { value: system.typography?.bodyFont?.name || 'Inter', type: 'fontFamilies' },
        mono: { value: system.typography?.monoFont?.name || 'JetBrains Mono', type: 'fontFamilies' },
      },
      spacing: {},
      borderRadius: {},
      boxShadow: {},
      typography: {}
    }
  };

  // Add scales
  (system.colors?.primaryScale || []).forEach(s => {
    tokens.global.colors[`primary-${s.shade}`] = { value: s.hex, type: 'color' };
  });
  (system.colors?.neutrals || []).forEach(s => {
    tokens.global.colors[`neutral-${s.shade}`] = { value: s.hex, type: 'color' };
  });
  (system.spacing?.scale || []).forEach(s => {
    const value = s.value.endsWith('px') || s.value.endsWith('rem') ? s.value : `${s.value}px`;
    tokens.global.spacing[s.name] = { value: value, type: 'spacing' };
  });
  (system.borderRadius?.scale || []).forEach(s => {
    const value = s.value.endsWith('px') || s.value.endsWith('rem') || s.value.endsWith('%') ? s.value : `${s.value}px`;
    tokens.global.borderRadius[s.name] = { value: value, type: 'borderRadius' };
  });
  (system.shadows?.scale || []).forEach(s => {
    const match = s.value.match(/(-?\d+px|\d+)\s+(-?\d+px|\d+)\s+(-?\d+px|\d+)\s*(-?\d+px|\d+)?\s*(rgba?\(.*?\)|#\w+)/);
    if (match) {
      tokens.global.boxShadow[s.name] = { 
        value: {
          x: match[1],
          y: match[2],
          blur: match[3],
          spread: match[4] || "0",
          color: match[5],
          type: "dropShadow"
        }, 
        type: 'boxShadow' 
      };
    } else {
      let y = "4px"; let blur = "6px";
      if (s.name === 'sm') { y = "1px"; blur = "2px"; }
      if (s.name === 'lg') { y = "10px"; blur = "15px"; }
      tokens.global.boxShadow[s.name] = { 
        value: {
          x: "0",
          y: y,
          blur: blur,
          spread: "0",
          color: "rgba(0,0,0,0.1)",
          type: "dropShadow"
        }, 
        type: 'boxShadow' 
      };
    }
  });

  (system.typography?.scale || []).forEach(s => {
    tokens.global.typography[s.name] = {
      value: {
        fontFamily: s.name.startsWith('h') ? "{fontFamilies.display}" : "{fontFamilies.body}",
        fontWeight: s.name.startsWith('h') ? "Bold" : "Regular",
        lineHeight: s.lineHeight.toString(),
        fontSize: s.size,
      },
      type: 'typography'
    };
  });

  // Add themes
  Object.entries(system.themes || {}).forEach(([themeName, themeColors]) => {
    tokens[themeName] = {
      colors: {}
    };
    Object.entries(themeColors || {}).forEach(([key, value]) => {
      tokens[themeName].colors[key] = { value: value as string, type: 'color' };
    });
  });

  return tokens;
}

function generateCSSVariables(system: DesignSystem) {
  let css = `/* Design System for ${system.brandName || 'Brand'} */\n\n`;
  
  // Global variables (scales, typography, spacing)
  css += `:root {\n`;
  css += `  /* Typography */\n`;
  css += `  --font-display: "${system.typography?.displayFont?.name || 'Playfair Display'}", serif;\n`;
  css += `  --font-body: "${system.typography?.bodyFont?.name || 'Inter'}", sans-serif;\n`;
  css += `  --font-mono: "${system.typography?.monoFont?.name || 'JetBrains Mono'}", monospace;\n\n`;
  
  css += `  /* Spacing */\n`;
  (system.spacing?.scale || []).forEach(s => {
    css += `  --spacing-${s.name.replace('.', '-')}: ${s.value};\n`;
  });
  css += `\n`;

  css += `  /* Border Radius */\n`;
  (system.borderRadius?.scale || []).forEach(s => {
    css += `  --radius-${s.name}: ${s.value};\n`;
  });
  css += `\n`;

  css += `  /* Shadows */\n`;
  (system.shadows?.scale || []).forEach(s => {
    css += `  --shadow-${s.name}: ${s.value};\n`;
  });
  css += `\n`;

  // Base Colors
  css += `  /* Base Colors */\n`;
  css += `  --color-primary-base: ${system.colors?.primary?.hex || '#000000'};\n`;
  css += `  --color-secondary-base: ${system.colors?.secondary?.hex || '#666666'};\n`;
  css += `  --color-accent-base: ${system.colors?.accent?.hex || '#0071E3'};\n`;
  
  (system.colors?.primaryScale || []).forEach(s => {
    css += `  --color-primary-${s.shade}: ${s.hex};\n`;
  });
  (system.colors?.neutrals || []).forEach(s => {
    css += `  --color-neutral-${s.shade}: ${s.hex};\n`;
  });
  
  css += `}\n\n`;

  // Themes
  Object.entries(system.themes || {}).forEach(([themeName, themeColors]) => {
    const selector = themeName === 'light' ? ':root, [data-theme="light"]' : `[data-theme="${themeName}"]`;
    css += `${selector} {\n`;
    Object.entries(themeColors || {}).forEach(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      css += `  --theme-${kebabKey}: ${value};\n`;
    });
    css += `}\n\n`;
  });

  return css;
}

function generateTailwindConfig(system: DesignSystem) {
  const colors: any = {
    primary: { DEFAULT: system.colors?.primary?.hex || '#000000' },
    secondary: { DEFAULT: system.colors?.secondary?.hex || '#666666' },
    accent: { DEFAULT: system.colors?.accent?.hex || '#0071E3' },
    success: system.colors?.success?.hex || '#28A745',
    warning: system.colors?.warning?.hex || '#FFC107',
    error: system.colors?.error?.hex || '#DC3545',
    info: system.colors?.info?.hex || '#17A2B8',
    neutral: {}
  };

  (system.colors?.primaryScale || []).forEach(s => {
    colors.primary[s.shade] = s.hex;
  });
  (system.colors?.neutrals || []).forEach(s => {
    colors.neutral[s.shade] = s.hex;
  });

  // Add theme semantic colors
  colors.theme = {
    background: 'var(--theme-background)',
    surface: 'var(--theme-surface)',
    'surface-secondary': 'var(--theme-surface-secondary)',
    'text-primary': 'var(--theme-text-primary)',
    'text-secondary': 'var(--theme-text-secondary)',
    'text-tertiary': 'var(--theme-text-tertiary)',
    border: 'var(--theme-border)',
    'border-subtle': 'var(--theme-border-subtle)',
    muted: 'var(--theme-muted)',
  };

  const spacing: any = {};
  (system.spacing?.scale || []).forEach(s => {
    spacing[s.name] = s.value;
  });

  const borderRadius: any = {};
  (system.borderRadius?.scale || []).forEach(s => {
    borderRadius[s.name] = s.value;
  });

  const boxShadow: any = {};
  (system.shadows?.scale || []).forEach(s => {
    boxShadow[s.name] = s.value;
  });

  const fontFamily = {
    display: [`"${system.typography?.displayFont?.name || 'Playfair Display'}"`, 'serif'],
    body: [`"${system.typography?.bodyFont?.name || 'Inter'}"`, 'sans-serif'],
    mono: [`"${system.typography?.monoFont?.name || 'JetBrains Mono'}"`, 'monospace'],
  };

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/}$/, '      }')},
      spacing: ${JSON.stringify(spacing, null, 8).replace(/}$/, '      }')},
      borderRadius: ${JSON.stringify(borderRadius, null, 8).replace(/}$/, '      }')},
      boxShadow: ${JSON.stringify(boxShadow, null, 8).replace(/}$/, '      }')},
      fontFamily: ${JSON.stringify(fontFamily, null, 8).replace(/}$/, '      }')},
    },
  },
  plugins: [],
}
`;
}
