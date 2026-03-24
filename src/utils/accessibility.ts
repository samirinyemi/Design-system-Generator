export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 0;
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function getContrastFeedback(ratio: number, isLargeText: boolean = false) {
  if (ratio >= 7) return { level: 'AAA', pass: true };
  if (ratio >= 4.5) return { level: 'AA', pass: true };
  if (isLargeText && ratio >= 3) return { level: 'AA Large', pass: true };
  return { level: 'Fail', pass: false };
}

export function getAccessibleColor(preferredColor: string, backgroundColor: string, fallbackLight = '#FFFFFF', fallbackDark = '#111827'): string {
  if (!preferredColor || !backgroundColor) return fallbackDark;
  
  const ratio = getContrastRatio(preferredColor, backgroundColor);
  if (ratio >= 4.5) return preferredColor; // AA standard for normal text
  
  const bgRgb = hexToRgb(backgroundColor);
  if (!bgRgb) return fallbackDark;
  
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  // W3C recommendation for contrast: if background luminance is > 0.179, use dark text
  return bgLum > 0.179 ? fallbackDark : fallbackLight;
}
