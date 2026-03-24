import { DesignSystem } from '../types';

// Helper to shift hue for a distinct accent color if needed
const shiftHue = (hex: string, degree: number) => {
  if (!hex.startsWith('#')) return '#8B5CF6'; // Fallback for gradients
  
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  // Convert to HSL
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Shift hue
  h = (h + degree / 360) % 1;

  // Convert back to RGB
  let r2, g2, b2;
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1/3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
};

const generateSystem = (
  brandName: string,
  description: string,
  primary: string,
  secondary: string,
  background: string,
  surface: string,
  textPrimary: string,
  fontFamily: string,
  borderRadius: string,
  accentOverride?: string,
  isDarkOverride?: boolean
): DesignSystem => {
  const isDark = isDarkOverride !== undefined ? isDarkOverride : (background.startsWith('#0') || background.startsWith('#1') || background.startsWith('#2') || background.toLowerCase() === '#000000');
  
  // Ensure primary, secondary, and accent are distinct
  let accent = accentOverride || shiftHue(primary, 60); // 60 degrees hue shift for a distinct accent
  if (primary === secondary && !accentOverride) {
    secondary = shiftHue(primary, -30);
  }

  // Generate distinct Light and Dark themes
  const lightBg = isDark ? '#FFFFFF' : background;
  const lightSurface = isDark ? '#F8FAFC' : surface;
  const lightText = isDark ? '#0F172A' : textPrimary;
  
  const darkBg = isDark ? background : '#0F172A';
  const darkSurface = isDark ? surface : '#1E293B';
  const darkText = isDark ? textPrimary : '#F8FAFC';

  const lightThemeColors = {
    primary,
    primaryForeground: '#FFFFFF',
    secondary,
    secondaryForeground: '#FFFFFF',
    accent,
    accentForeground: '#FFFFFF',
    background: lightBg,
    surface: lightSurface,
    surfaceSecondary: 'rgba(0,0,0,0.05)',
    textPrimary: lightText,
    textSecondary: 'rgba(0,0,0,0.6)',
    textTertiary: 'rgba(0,0,0,0.4)',
    border: 'rgba(0,0,0,0.2)',
    borderSubtle: 'rgba(0,0,0,0.1)',
    muted: 'rgba(0,0,0,0.1)',
    mutedForeground: 'rgba(0,0,0,0.6)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const darkThemeColors = {
    primary,
    primaryForeground: '#FFFFFF',
    secondary,
    secondaryForeground: '#FFFFFF',
    accent,
    accentForeground: '#FFFFFF',
    background: darkBg,
    surface: darkSurface,
    surfaceSecondary: 'rgba(255,255,255,0.05)',
    textPrimary: darkText,
    textSecondary: 'rgba(255,255,255,0.6)',
    textTertiary: 'rgba(255,255,255,0.4)',
    border: 'rgba(255,255,255,0.2)',
    borderSubtle: 'rgba(255,255,255,0.1)',
    muted: 'rgba(255,255,255,0.1)',
    mutedForeground: 'rgba(255,255,255,0.6)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  return {
    brandName,
    brandTagline: description,
    personality: ['Modern', 'Clean'],
    colors: {
      primary: { name: 'Primary', hex: primary, usage: 'Main actions' },
      secondary: { name: 'Secondary', hex: secondary, usage: 'Secondary actions' },
      accent: { name: 'Accent', hex: accent, usage: 'Highlights' },
      success: { name: 'Success', hex: '#10B981', usage: 'Success states' },
      warning: { name: 'Warning', hex: '#F59E0B', usage: 'Warning states' },
      error: { name: 'Error', hex: '#EF4444', usage: 'Error states' },
      info: { name: 'Info', hex: '#3B82F6', usage: 'Info states' },
      neutrals: [],
      primaryScale: []
    },
    themes: {
      light: lightThemeColors,
      dark: darkThemeColors,
    },
    typography: {
      displayFont: { name: fontFamily.split(',')[0].replace(/['"]/g, ''), category: 'sans-serif', weights: [400, 700], reason: 'Clean and modern' },
      bodyFont: { name: fontFamily.split(',')[0].replace(/['"]/g, ''), category: 'sans-serif', weights: [400, 500, 600], reason: 'Highly readable' },
      monoFont: { name: 'JetBrains Mono', category: 'monospace', weights: [400, 500] },
      scale: [
        { name: 'h1', size: '3.5rem', lineHeight: '1.2', usage: 'Main headings' },
        { name: 'h2', size: '2.25rem', lineHeight: '1.3', usage: 'Section headings' },
        { name: 'h3', size: '1.5rem', lineHeight: '1.4', usage: 'Sub-headings' },
        { name: 'body', size: '1rem', lineHeight: '1.5', usage: 'Body text' },
        { name: 'small', size: '0.875rem', lineHeight: '1.5', usage: 'Small text' },
      ],
    },
    spacing: {
      unit: '4px',
      scale: [
        { name: 'xs', value: '0.25rem' },
        { name: 'sm', value: '0.5rem' },
        { name: 'md', value: '1rem' },
        { name: 'lg', value: '2rem' },
        { name: 'xl', value: '4rem' },
        { name: 'xxl', value: '8rem' },
      ],
    },
    borderRadius: {
      scale: [
        { name: 'sm', value: borderRadius === '0px' ? '0px' : '0.25rem', usage: 'Small elements' },
        { name: 'md', value: borderRadius, usage: 'Medium elements' },
        { name: 'lg', value: borderRadius === '0px' ? '0px' : `calc(${borderRadius} * 2)`, usage: 'Large elements' },
        { name: 'full', value: '9999px', usage: 'Circular elements' },
      ],
    },
    shadows: {
      scale: [
        { name: 'sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', usage: 'Subtle depth' },
        { name: 'md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', usage: 'Cards and panels' },
        { name: 'lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', usage: 'Modals and popovers' },
      ],
    },
    iconStyle: {
      recommended: 'Lucide',
      style: 'Outline',
      strokeWidth: '2px',
      sizes: ['16px', '20px', '24px'],
      reason: 'Clean and modern'
    }
  };
};

export const presets: DesignSystem[] = [
  generateSystem("Acme Corp", "Classic corporate SaaS", "#2563EB", "#3B82F6", "#FFFFFF", "#F8FAFC", "#0F172A", "Inter, sans-serif", "0.5rem"),
  generateSystem("Cosmic", "Deep space gradients", "linear-gradient(135deg, #4338CA 0%, #7E22CE 100%)", "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", "#0F172A", "#1E293B", "#F8FAFC", "Inter, sans-serif", "1rem", "#EC4899", true),
  generateSystem("Neo Tokyo", "Cyberpunk aesthetic", "#00FF41", "#FF003C", "#0D0208", "#1A1A1A", "#FFFFFF", "'Space Grotesk', sans-serif", "0px"),
  generateSystem("Dawn", "Morning sky gradients", "linear-gradient(135deg, #F97316 0%, #EAB308 100%)", "linear-gradient(135deg, #F43F5E 0%, #F97316 100%)", "#FFF7ED", "#FFEDD5", "#7C2D12", "Inter, sans-serif", "1rem", "#8B5CF6", false),
  generateSystem("Lumina", "Minimalist wellness", "#D4A373", "#FAEDCD", "#FEFAE0", "#FFFFFF", "#4A5759", "'Playfair Display', serif", "1rem"),
  generateSystem("Northern Lights", "Aurora gradients", "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)", "linear-gradient(135deg, #059669 0%, #2563EB 100%)", "#022C22", "#064E3B", "#ECFDF5", "Inter, sans-serif", "0.5rem", "#A78BFA", true),
  generateSystem("Stark", "Brutalist design", "#000000", "#000000", "#FFFFFF", "#F3F4F6", "#000000", "'Helvetica Neue', sans-serif", "0px"),
  generateSystem("Cotton Candy", "Sweet pastel gradients", "linear-gradient(135deg, #F472B6 0%, #C084FC 100%)", "linear-gradient(135deg, #FB7185 0%, #E879F9 100%)", "#FDF2F8", "#FCE7F3", "#831843", "'Outfit', sans-serif", "1.5rem", "#38BDF8", false),
  generateSystem("Oceanic", "Deep sea vibes", "#0284C7", "#38BDF8", "#082F49", "#0C4A6E", "#F0F9FF", "Inter, sans-serif", "0.75rem"),
  generateSystem("Ocean Breeze", "Tropical water gradients", "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", "linear-gradient(135deg, #0891B2 0%, #2563EB 100%)", "#F0F9FF", "#E0F2FE", "#0C4A6E", "Inter, sans-serif", "0.75rem", "#10B981", false),
  generateSystem("Forest", "Nature inspired", "#166534", "#22C55E", "#F0FDF4", "#DCFCE7", "#14532D", "Georgia, serif", "0.375rem"),
  generateSystem("Lava", "Molten rock gradients", "linear-gradient(135deg, #EF4444 0%, #F97316 100%)", "linear-gradient(135deg, #DC2626 0%, #EA580C 100%)", "#2A0A0A", "#450A0A", "#FEF2F2", "'Space Grotesk', sans-serif", "0px", "#FBBF24", true),
  generateSystem("Sunset", "Warm evening gradients", "#EA580C", "#F97316", "#FFF7ED", "#FFEDD5", "#7C2D12", "Inter, sans-serif", "1.5rem"),
  generateSystem("Glacier", "Icy cool gradients", "linear-gradient(135deg, #93C5FD 0%, #E0F2FE 100%)", "linear-gradient(135deg, #60A5FA 0%, #BAE6FD 100%)", "#FFFFFF", "#F8FAFC", "#0F172A", "Inter, sans-serif", "0.5rem", "#3B82F6", false),
  generateSystem("Midnight", "Dark mode default", "#8B5CF6", "#A78BFA", "#0F172A", "#1E293B", "#F8FAFC", "Inter, sans-serif", "0.5rem"),
  generateSystem("Sunset Blvd", "Vaporwave gradients", "linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)", "linear-gradient(135deg, #E11D48 0%, #7E22CE 100%)", "#171717", "#262626", "#F3F4F6", "'Space Grotesk', sans-serif", "0px", "#10B981", true),
  generateSystem("Cherry", "Vibrant and sweet", "#E11D48", "#FB7185", "#FFF1F2", "#FFE4E6", "#881337", "'Outfit', sans-serif", "1rem"),
  generateSystem("Neon Nights", "Cyberpunk gradients", "linear-gradient(135deg, #06B6D4 0%, #F43F5E 100%)", "linear-gradient(135deg, #0891B2 0%, #E11D48 100%)", "#000000", "#111111", "#FFFFFF", "'Outfit', sans-serif", "0.5rem", "#EAB308", true),
  generateSystem("Lemon", "Bright and energetic", "#EAB308", "#FDE047", "#FEFCE8", "#FEF08A", "#713F12", "Inter, sans-serif", "0.5rem"),
  generateSystem("Forest Canopy", "Lush green gradients", "linear-gradient(135deg, #166534 0%, #84CC16 100%)", "linear-gradient(135deg, #14532D 0%, #65A30D 100%)", "#F0FDF4", "#DCFCE7", "#14532D", "Georgia, serif", "0.25rem", "#EAB308", false),
  generateSystem("Grape", "Rich and luxurious", "#7E22CE", "#A855F7", "#FAF5FF", "#F3E8FF", "#581C87", "'Playfair Display', serif", "0.25rem"),
  generateSystem("Desert Sand", "Warm earthy tones", "#D97706", "#B45309", "#FFFBEB", "#FEF3C7", "#78350F", "Inter, sans-serif", "0.5rem"),
  generateSystem("Mint", "Fresh and clean", "#0D9488", "#2DD4BF", "#F0FDFA", "#CCFBF1", "#134E4A", "Inter, sans-serif", "0.75rem"),
  generateSystem("Midnight Blue", "Deep professional", "#1E3A8A", "#1E40AF", "#EFF6FF", "#DBEAFE", "#172554", "Inter, sans-serif", "0.25rem"),
  generateSystem("Slate", "Professional neutral", "#475569", "#64748B", "#F8FAFC", "#F1F5F9", "#0F172A", "Inter, sans-serif", "0.25rem"),
  generateSystem("Cherry Blossom", "Soft floral pinks", "#F472B6", "#F9A8D4", "#FDF2F8", "#FCE7F3", "#831843", "'Playfair Display', serif", "1rem"),
  generateSystem("Rose", "Soft and elegant", "#BE123C", "#FB7185", "#FFF1F2", "#FFE4E6", "#881337", "Georgia, serif", "0px"),
  generateSystem("Electric Purple", "High energy violet", "#9333EA", "#A855F7", "#FAF5FF", "#F3E8FF", "#581C87", "'Space Grotesk', sans-serif", "0px"),
  generateSystem("Amber", "Warm and inviting", "#D97706", "#FBBF24", "#FFFBEB", "#FEF3C7", "#78350F", "Inter, sans-serif", "0.5rem"),
  generateSystem("Mint Chocolate", "Fresh and dark", "#10B981", "#059669", "#111827", "#1F2937", "#F9FAFB", "Inter, sans-serif", "0.5rem", "#34D399", true),
  generateSystem("Indigo", "Deep and focused", "#4338CA", "#6366F1", "#EEF2FF", "#E0E7FF", "#312E81", "Inter, sans-serif", "0.375rem"),
  generateSystem("Golden Hour", "Warm sunset gradients", "linear-gradient(135deg, #F59E0B 0%, #F43F5E 100%)", "linear-gradient(135deg, #D97706 0%, #E11D48 100%)", "#FFFBEB", "#FEF3C7", "#78350F", "Inter, sans-serif", "0.5rem", "#8B5CF6", false),
  generateSystem("Emerald", "Wealth and growth", "#059669", "#34D399", "#ECFDF5", "#D1FAE5", "#064E3B", "Inter, sans-serif", "0.5rem"),
  generateSystem("Twilight", "Evening sky gradients", "linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)", "linear-gradient(135deg, #4338CA 0%, #DB2777 100%)", "#0F172A", "#1E293B", "#F8FAFC", "Inter, sans-serif", "0.75rem", "#10B981", true),
  generateSystem("Sky", "Airy and light", "#0284C7", "#38BDF8", "#F0F9FF", "#E0F2FE", "#0C4A6E", "Inter, sans-serif", "1rem"),
  generateSystem("Berry Smoothie", "Fruity gradients", "linear-gradient(135deg, #E11D48 0%, #9333EA 100%)", "linear-gradient(135deg, #BE123C 0%, #7E22CE 100%)", "#FFF1F2", "#FFE4E6", "#881337", "'Outfit', sans-serif", "1rem", "#F59E0B", false),
  generateSystem("Fuchsia", "Bold and playful", "#C026D3", "#E879F9", "#FDF4FF", "#FAE8FF", "#701A75", "'Outfit', sans-serif", "2rem"),
  generateSystem("Cyber Pink", "Neon pink solid", "#EC4899", "#DB2777", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#06B6D4", true),
  generateSystem("Stone", "Earthy and grounded", "#57534E", "#78716C", "#FAFAF9", "#F5F5F4", "#1C1917", "Georgia, serif", "0px"),
  generateSystem("Toxic Green", "Neon green solid", "#84CC16", "#65A30D", "#000000", "#111111", "#FFFFFF", "'JetBrains Mono', monospace", "0px", "#F43F5E", true),
  generateSystem("Crimson", "Strong and passionate", "#991B1B", "#EF4444", "#FEF2F2", "#FEE2E2", "#7F1D1D", "Inter, sans-serif", "0.25rem"),
  generateSystem("Deep Ocean", "Abyssal gradients", "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)", "linear-gradient(135deg, #020617 0%, #1E40AF 100%)", "#F8FAFC", "#F1F5F9", "#0F172A", "Inter, sans-serif", "0.25rem", "#38BDF8", false),
  generateSystem("Teal", "Modern and balanced", "#0F766E", "#2DD4BF", "#F0FDFA", "#CCFBF1", "#134E4A", "Inter, sans-serif", "0.5rem"),
  generateSystem("Mango Tango", "Tropical gradients", "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)", "linear-gradient(135deg, #D97706 0%, #C2410C 100%)", "#FFF7ED", "#FFEDD5", "#7C2D12", "Inter, sans-serif", "1rem", "#10B981", false),
  generateSystem("Cyan", "Tech and futuristic", "#0891B2", "#22D3EE", "#ECFEFF", "#CFFAFE", "#164E63", "'Space Grotesk', sans-serif", "0px"),
  generateSystem("Arctic Ice", "Crisp white and blue", "#38BDF8", "#0EA5E9", "#FFFFFF", "#F0F9FF", "#0C4A6E", "Inter, sans-serif", "0.5rem"),
  generateSystem("Violet", "Creative and unique", "#6D28D9", "#8B5CF6", "#F5F3FF", "#EDE9FE", "#4C1D95", "Inter, sans-serif", "0.75rem"),
  generateSystem("Volcanic Ash", "Dark gray and orange", "#EA580C", "#C2410C", "#18181B", "#27272A", "#FAFAFA", "Inter, sans-serif", "0px", "#F59E0B", true),
  generateSystem("Orange", "Friendly and accessible", "#C2410C", "#F97316", "#FFF7ED", "#FFEDD5", "#7C2D12", "Inter, sans-serif", "1rem"),
  generateSystem("Royal Gold", "Luxury gradients", "linear-gradient(135deg, #D4AF37 0%, #AA8000 100%)", "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)", "#000000", "#111111", "#FFFFFF", "'Playfair Display', serif", "0px", "#FFFFFF", true),
  generateSystem("Zinc", "Industrial and sleek", "#3F3F46", "#71717A", "#FAFAFA", "#F4F4F5", "#18181B", "Inter, sans-serif", "0px"),
  generateSystem("Peacock", "Vibrant bird gradients", "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)", "linear-gradient(135deg, #0284C7 0%, #059669 100%)", "#F0FDF4", "#DCFCE7", "#064E3B", "Inter, sans-serif", "0.5rem", "#8B5CF6", false),
  generateSystem("Neutral", "Unopinionated base", "#404040", "#737373", "#FFFFFF", "#F5F5F5", "#171717", "Inter, sans-serif", "0.25rem"),
  generateSystem("Rose Gold", "Elegant metallic gradients", "linear-gradient(135deg, #FDA4AF 0%, #F43F5E 100%)", "linear-gradient(135deg, #FECDD3 0%, #E11D48 100%)", "#FFF1F2", "#FFE4E6", "#881337", "Georgia, serif", "0.25rem", "#0EA5E9", false),
  generateSystem("Coral", "Vibrant and warm", "#F43F5E", "#FB7185", "#FFF1F2", "#FFE4E6", "#881337", "Inter, sans-serif", "1rem"),
  generateSystem("Matcha", "Earthy green solid", "#65A30D", "#4D7C0F", "#F7FEE7", "#ECFCCB", "#3F6212", "Inter, sans-serif", "0.5rem"),
  generateSystem("Gold", "Premium and luxury", "#B45309", "#F59E0B", "#FFFBEB", "#FEF3C7", "#78350F", "'Playfair Display', serif", "0px"),
  generateSystem("Lavender Dream", "Soft purple gradients", "linear-gradient(135deg, #C084FC 0%, #A78BFA 100%)", "linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)", "#FAF5FF", "#F3E8FF", "#581C87", "'Outfit', sans-serif", "1rem", "#F472B6", false),
  generateSystem("Silver", "Sleek and modern", "#71717A", "#A1A1AA", "#FAFAFA", "#F4F4F5", "#18181B", "Inter, sans-serif", "0.5rem"),
  generateSystem("Steel City", "Industrial gray solid", "#64748B", "#475569", "#F8FAFC", "#F1F5F9", "#0F172A", "Inter, sans-serif", "0px"),
  generateSystem("Bronze", "Rustic and warm", "#92400E", "#D97706", "#FFFBEB", "#FEF3C7", "#78350F", "Georgia, serif", "0.25rem"),
  generateSystem("Coral Reef", "Underwater gradients", "linear-gradient(135deg, #F43F5E 0%, #F97316 100%)", "linear-gradient(135deg, #E11D48 0%, #EA580C 100%)", "#FFF1F2", "#FFE4E6", "#881337", "Inter, sans-serif", "0.75rem", "#0EA5E9", false),
  generateSystem("Plum", "Deep and rich", "#701A75", "#C026D3", "#FDF4FF", "#FAE8FF", "#4A044E", "Inter, sans-serif", "0.5rem"),
  generateSystem("Mystic Forest", "Magical green gradients", "linear-gradient(135deg, #059669 0%, #0F766E 100%)", "linear-gradient(135deg, #047857 0%, #115E59 100%)", "#022C22", "#064E3B", "#ECFDF5", "Georgia, serif", "0.5rem", "#D97706", true),
  generateSystem("Olive", "Natural and muted", "#4D7C0F", "#84CC16", "#F7FEE7", "#ECFCCB", "#3F6212", "Inter, sans-serif", "0.25rem"),
  generateSystem("Bubblegum", "Bright pink solid", "#EC4899", "#DB2777", "#FDF2F8", "#FCE7F3", "#831843", "'Outfit', sans-serif", "1.5rem"),
  generateSystem("Navy", "Classic and trustworthy", "#1D4ED8", "#3B82F6", "#EFF6FF", "#DBEAFE", "#1E3A8A", "Inter, sans-serif", "0.5rem"),
  generateSystem("Tangerine", "Bright orange solid", "#F97316", "#EA580C", "#FFF7ED", "#FFEDD5", "#7C2D12", "Inter, sans-serif", "0.5rem"),
  generateSystem("Maroon", "Traditional and strong", "#831843", "#BE185D", "#FDF2F8", "#FCE7F3", "#500724", "Georgia, serif", "0px"),
  generateSystem("Galaxy", "Deep space gradients", "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#A855F7", true),
  generateSystem("Mustard", "Retro and bold", "#A16207", "#EAB308", "#FEFCE8", "#FEF08A", "#713F12", "'Outfit', sans-serif", "0.75rem"),
  generateSystem("Autumn Leaves", "Fall gradients", "linear-gradient(135deg, #B45309 0%, #991B1B 100%)", "linear-gradient(135deg, #92400E 0%, #7F1D1D 100%)", "#FFFBEB", "#FEF3C7", "#78350F", "Georgia, serif", "0.25rem", "#15803D", false),
  generateSystem("Peach", "Soft and approachable", "#EA580C", "#FB923C", "#FFF7ED", "#FFEDD5", "#7C2D12", "Inter, sans-serif", "1rem"),
  generateSystem("Frostbite", "Cold blue gradients", "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)", "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)", "#F0F9FF", "#E0F2FE", "#0C4A6E", "Inter, sans-serif", "0.5rem", "#C084FC", false),
  generateSystem("Lilac", "Gentle and calming", "#7E22CE", "#C084FC", "#FAF5FF", "#F3E8FF", "#581C87", "Inter, sans-serif", "1.5rem"),
  generateSystem("Emerald City", "Bright green solid", "#10B981", "#059669", "#ECFDF5", "#D1FAE5", "#064E3B", "Inter, sans-serif", "0.5rem"),
  generateSystem("Aqua", "Refreshing and clear", "#0E7490", "#22D3EE", "#ECFEFF", "#CFFAFE", "#164E63", "Inter, sans-serif", "0.5rem"),
  generateSystem("Ruby Red", "Deep red solid", "#E11D48", "#BE123C", "#FFF1F2", "#FFE4E6", "#881337", "'Playfair Display', serif", "0px"),
  generateSystem("Ruby", "Precious and bright", "#BE123C", "#F43F5E", "#FFF1F2", "#FFE4E6", "#881337", "'Playfair Display', serif", "0px"),
  generateSystem("Sapphire Sea", "Deep blue gradients", "linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)", "linear-gradient(135deg, #1E40AF 0%, #0284C7 100%)", "#EFF6FF", "#DBEAFE", "#1E3A8A", "Inter, sans-serif", "0.5rem", "#10B981", false),
  generateSystem("Sapphire", "Deep and brilliant", "#1D4ED8", "#60A5FA", "#EFF6FF", "#DBEAFE", "#1E3A8A", "Inter, sans-serif", "0.25rem"),
  generateSystem("Amethyst", "Purple gradients", "linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)", "linear-gradient(135deg, #7E22CE 0%, #A855F7 100%)", "#FAF5FF", "#F3E8FF", "#581C87", "Inter, sans-serif", "0.75rem", "#F472B6", false),
  generateSystem("Emerald Dark", "Dark mode nature", "#10B981", "#34D399", "#064E3B", "#065F46", "#ECFDF5", "Inter, sans-serif", "0.5rem"),
  generateSystem("Topaz", "Yellow-orange solid", "#F59E0B", "#D97706", "#FFFBEB", "#FEF3C7", "#78350F", "Inter, sans-serif", "0.5rem"),
  generateSystem("Ruby Dark", "Dark mode passion", "#F43F5E", "#FB7185", "#4C0519", "#881337", "#FFF1F2", "Inter, sans-serif", "0.5rem"),
  generateSystem("Onyx", "Dark gray solid", "#18181B", "#27272A", "#FAFAFA", "#F4F4F5", "#09090B", "Inter, sans-serif", "0px"),
  generateSystem("Sapphire Dark", "Dark mode tech", "#3B82F6", "#60A5FA", "#1E3A8A", "#1E40AF", "#EFF6FF", "'Space Grotesk', sans-serif", "0px"),
  generateSystem("Pearl", "Off-white solid", "#FAFAFA", "#F4F4F5", "#18181B", "#27272A", "#FAFAFA", "Inter, sans-serif", "0.5rem", "#A1A1AA", true),
  generateSystem("Gold Dark", "Dark mode luxury", "#F59E0B", "#FBBF24", "#451A03", "#78350F", "#FFFBEB", "'Playfair Display', serif", "0px"),
  generateSystem("Quartz", "Pinkish gradients", "linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)", "linear-gradient(135deg, #F9A8D4 0%, #F472B6 100%)", "#FDF2F8", "#FCE7F3", "#831843", "Inter, sans-serif", "1rem", "#818CF8", false),
  generateSystem("Amethyst Dark", "Dark mode creative", "#8B5CF6", "#A78BFA", "#2E1065", "#4C1D95", "#F5F3FF", "Inter, sans-serif", "0.75rem"),
  generateSystem("Jade", "Muted green solid", "#34D399", "#10B981", "#ECFDF5", "#D1FAE5", "#064E3B", "Georgia, serif", "0.25rem"),
  generateSystem("Graphite", "Dark mode minimal", "#A1A1AA", "#D4D4D8", "#09090B", "#18181B", "#FAFAFA", "Inter, sans-serif", "0px"),
  generateSystem("Amber Glow", "Warm yellow gradients", "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)", "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", "#FFFBEB", "#FEF3C7", "#78350F", "Inter, sans-serif", "0.5rem", "#EF4444", false),
  generateSystem("Obsidian", "Pure black minimal", "#FFFFFF", "#E5E5E5", "#000000", "#111111", "#FFFFFF", "Inter, sans-serif", "0px"),
  generateSystem("Cobalt", "Bright blue solid", "#2563EB", "#1D4ED8", "#EFF6FF", "#DBEAFE", "#1E3A8A", "Inter, sans-serif", "0.5rem"),
  generateSystem("Paper", "Pure white minimal", "#000000", "#171717", "#FFFFFF", "#F5F5F5", "#000000", "Inter, sans-serif", "0px"),
  generateSystem("Crimson Tide", "Red and black gradients", "linear-gradient(135deg, #991B1B 0%, #000000 100%)", "linear-gradient(135deg, #7F1D1D 0%, #000000 100%)", "#FEF2F2", "#FEE2E2", "#7F1D1D", "'Space Grotesk', sans-serif", "0px", "#F59E0B", false),
  generateSystem("Hacker", "Terminal aesthetic", "#22C55E", "#4ADE80", "#000000", "#052E16", "#22C55E", "'JetBrains Mono', monospace", "0px"),
  generateSystem("Neon Green", "Bright green gradients", "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)", "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", "#000000", "#052E16", "#4ADE80", "'JetBrains Mono', monospace", "0px", "#A855F7", true),
  generateSystem("Velvet", "Rich and elegant", "#9D174D", "#BE185D", "#FDF2F8", "#FCE7F3", "#831843", "'Playfair Display', serif", "0.5rem"),
  generateSystem("Cyber Blue", "Neon blue gradients", "linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)", "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)", "#000000", "#0F172A", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#F43F5E", true),
  generateSystem("Matcha Latte", "Soft green and cream", "#84CC16", "#A3E635", "#FEFAE0", "#FAEDCD", "#3F6212", "Inter, sans-serif", "1rem"),
  generateSystem("Deep Purple", "Dark and mysterious", "linear-gradient(135deg, #581C87 0%, #3B0764 100%)", "linear-gradient(135deg, #4C1D95 0%, #2E1065 100%)", "#000000", "#111111", "#FFFFFF", "Inter, sans-serif", "0.5rem", "#F59E0B", true),
  generateSystem("Tangerine Dream", "Vibrant orange gradients", "linear-gradient(135deg, #F97316 0%, #F59E0B 100%)", "linear-gradient(135deg, #EA580C 0%, #D97706 100%)", "#FFF7ED", "#FFEDD5", "#7C2D12", "'Outfit', sans-serif", "1rem", "#8B5CF6", false),
  generateSystem("Slate Blue", "Professional and calm", "#475569", "#64748B", "#F8FAFC", "#F1F5F9", "#0F172A", "Inter, sans-serif", "0.25rem"),
  generateSystem("Crimson Night", "Dark red gradients", "linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)", "linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#EAB308", true),
  generateSystem("Minty Fresh", "Cool and clean", "#34D399", "#6EE7B7", "#ECFDF5", "#D1FAE5", "#064E3B", "Inter, sans-serif", "0.75rem"),
  generateSystem("Golden Sands", "Warm desert gradients", "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)", "linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)", "#FFFBEB", "#FEF3C7", "#78350F", "Georgia, serif", "0.5rem", "#EF4444", false),
  generateSystem("Midnight Purple", "Deep night sky", "#4C1D95", "#581C87", "#F5F3FF", "#EDE9FE", "#2E1065", "Inter, sans-serif", "0.5rem"),
  generateSystem("Neon Cyan", "Bright tech gradients", "linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)", "linear-gradient(135deg, #67E8F9 0%, #22D3EE 100%)", "#000000", "#111111", "#FFFFFF", "'JetBrains Mono', monospace", "0px", "#F472B6", true),
  generateSystem("Rosewater", "Soft pink and white", "#FDA4AF", "#FECDD3", "#FFF1F2", "#FFE4E6", "#881337", "'Playfair Display', serif", "1rem"),
  generateSystem("Forest Fire", "Green and orange gradients", "linear-gradient(135deg, #166534 0%, #EA580C 100%)", "linear-gradient(135deg, #14532D 0%, #C2410C 100%)", "#000000", "#111111", "#FFFFFF", "Inter, sans-serif", "0.25rem", "#EAB308", true),
  generateSystem("Cobalt Blue", "Strong and reliable", "#1D4ED8", "#2563EB", "#EFF6FF", "#DBEAFE", "#1E3A8A", "Inter, sans-serif", "0.5rem"),
  generateSystem("Sunset Glow", "Warm evening gradients", "linear-gradient(135deg, #F43F5E 0%, #F97316 100%)", "linear-gradient(135deg, #E11D48 0%, #EA580C 100%)", "#FFF1F2", "#FFE4E6", "#881337", "'Outfit', sans-serif", "1rem", "#8B5CF6", false),
  generateSystem("Olive Grove", "Earthy and natural", "#4D7C0F", "#65A30D", "#F7FEE7", "#ECFCCB", "#3F6212", "Georgia, serif", "0.25rem"),
  generateSystem("Abyssal Blue", "Deep ocean gradients", "linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)", "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)", "#000000", "#111111", "#FFFFFF", "Inter, sans-serif", "0px", "#38BDF8", true),
  generateSystem("Peach Fuzz", "Soft and warm", "#FB923C", "#FDBA74", "#FFF7ED", "#FFEDD5", "#7C2D12", "Inter, sans-serif", "1rem"),
  generateSystem("Electric Lime", "High energy gradients", "linear-gradient(135deg, #84CC16 0%, #EAB308 100%)", "linear-gradient(135deg, #65A30D 0%, #CA8A04 100%)", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#EC4899", true),
  generateSystem("Steel Blue", "Cool and professional", "#3B82F6", "#60A5FA", "#F8FAFC", "#F1F5F9", "#0F172A", "Inter, sans-serif", "0.25rem"),
  generateSystem("Berry Blast", "Fruity purple gradients", "linear-gradient(135deg, #9333EA 0%, #E11D48 100%)", "linear-gradient(135deg, #7E22CE 0%, #BE123C 100%)", "#FAF5FF", "#F3E8FF", "#581C87", "'Outfit', sans-serif", "1.5rem", "#F59E0B", false),
  generateSystem("Charcoal", "Dark and minimal", "#3F3F46", "#52525B", "#FAFAFA", "#F4F4F5", "#18181B", "Inter, sans-serif", "0px"),
  generateSystem("Neon Pink", "Bright pink gradients", "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)", "linear-gradient(135deg, #DB2777 0%, #E11D48 100%)", "#000000", "#111111", "#FFFFFF", "'JetBrains Mono', monospace", "0px", "#06B6D4", true),
  generateSystem("Sandstone", "Warm and earthy", "#D97706", "#F59E0B", "#FAFAF9", "#F5F5F4", "#1C1917", "Georgia, serif", "0.5rem"),
  generateSystem("Glacier Blue", "Icy gradients", "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)", "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)", "#F0F9FF", "#E0F2FE", "#0C4A6E", "Inter, sans-serif", "0.5rem", "#C084FC", false),
  generateSystem("Plum Wine", "Deep and rich", "#701A75", "#86198F", "#FDF4FF", "#FAE8FF", "#4A044E", "'Playfair Display', serif", "0.25rem"),
  generateSystem("Cyber Yellow", "Neon yellow gradients", "linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)", "linear-gradient(135deg, #CA8A04 0%, #D97706 100%)", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#8B5CF6", true),
  generateSystem("Seafoam", "Light and breezy", "#2DD4BF", "#5EEAD4", "#F0FDFA", "#CCFBF1", "#134E4A", "Inter, sans-serif", "1rem"),
  generateSystem("Volcanic", "Dark and fiery gradients", "linear-gradient(135deg, #B91C1C 0%, #EA580C 100%)", "linear-gradient(135deg, #991B1B 0%, #C2410C 100%)", "#000000", "#111111", "#FFFFFF", "Inter, sans-serif", "0px", "#EAB308", true),
  generateSystem("Lavender", "Soft and calming", "#A78BFA", "#C4B5FD", "#FAF5FF", "#F3E8FF", "#581C87", "Inter, sans-serif", "1rem"),
  generateSystem("Aurora", "Northern lights gradients", "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)", "linear-gradient(135deg, #059669 0%, #2563EB 100%)", "#000000", "#111111", "#FFFFFF", "'Outfit', sans-serif", "0.5rem", "#A855F7", true),
  generateSystem("Mocha", "Warm brown and cream", "#92400E", "#B45309", "#FEFCE8", "#FEF08A", "#713F12", "Georgia, serif", "0.25rem"),
  generateSystem("Electric Blue", "High energy blue gradients", "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)", "linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#EC4899", true),
  generateSystem("Coral Pink", "Vibrant and warm", "#FB7185", "#FDA4AF", "#FFF1F2", "#FFE4E6", "#881337", "Inter, sans-serif", "1rem"),
  generateSystem("Toxic Waste", "Neon green and purple", "linear-gradient(135deg, #84CC16 0%, #9333EA 100%)", "linear-gradient(135deg, #65A30D 0%, #7E22CE 100%)", "#000000", "#111111", "#FFFFFF", "'JetBrains Mono', monospace", "0px", "#F43F5E", true),
  generateSystem("Sky Blue", "Clear and open", "#38BDF8", "#7DD3FC", "#F0F9FF", "#E0F2FE", "#0C4A6E", "Inter, sans-serif", "0.5rem"),
  generateSystem("Sunset Boulevard", "Retro gradients", "linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)", "linear-gradient(135deg, #E11D48 0%, #7E22CE 100%)", "#000000", "#111111", "#FFFFFF", "'Outfit', sans-serif", "0.5rem", "#10B981", true),
  generateSystem("Sage", "Muted green and gray", "#9CA3AF", "#D1D5DB", "#F9FAFB", "#F3F4F6", "#1F2937", "Georgia, serif", "0.25rem"),
  generateSystem("Neon Orange", "Bright orange gradients", "linear-gradient(135deg, #F97316 0%, #F59E0B 100%)", "linear-gradient(135deg, #EA580C 0%, #D97706 100%)", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#3B82F6", true),
  generateSystem("Blush", "Soft pink and peach", "#F472B6", "#FB923C", "#FFF1F2", "#FFE4E6", "#881337", "Inter, sans-serif", "1rem"),
  generateSystem("Deep Space", "Dark blue gradients", "linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)", "linear-gradient(135deg, #1E40AF 0%, #1E1B4B 100%)", "#000000", "#111111", "#FFFFFF", "Inter, sans-serif", "0px", "#A855F7", true),
  generateSystem("Turquoise", "Bright and refreshing", "#2DD4BF", "#5EEAD4", "#F0FDFA", "#CCFBF1", "#134E4A", "Inter, sans-serif", "0.5rem"),
  generateSystem("Crimson Gold", "Red and gold gradients", "linear-gradient(135deg, #991B1B 0%, #D4AF37 100%)", "linear-gradient(135deg, #7F1D1D 0%, #AA8000 100%)", "#000000", "#111111", "#FFFFFF", "'Playfair Display', serif", "0px", "#FFFFFF", true),
  generateSystem("Ice Blue", "Cool and crisp", "#BAE6FD", "#E0F2FE", "#F0F9FF", "#E0F2FE", "#0C4A6E", "Inter, sans-serif", "0.5rem"),
  generateSystem("Neon Purple", "Bright purple gradients", "linear-gradient(135deg, #A855F7 0%, #D946EF 100%)", "linear-gradient(135deg, #9333EA 0%, #C026D3 100%)", "#000000", "#111111", "#FFFFFF", "'JetBrains Mono', monospace", "0px", "#22D3EE", true),
  generateSystem("Sand", "Warm and neutral", "#D4D4D8", "#E4E4E7", "#FAFAF9", "#F5F5F4", "#1C1917", "Inter, sans-serif", "0.25rem"),
  generateSystem("Emerald Isle", "Green and gold gradients", "linear-gradient(135deg, #059669 0%, #D4AF37 100%)", "linear-gradient(135deg, #047857 0%, #AA8000 100%)", "#000000", "#111111", "#FFFFFF", "'Playfair Display', serif", "0px", "#FFFFFF", true),
  generateSystem("Lilac Breeze", "Soft purple and blue", "#C4B5FD", "#A78BFA", "#FAF5FF", "#F3E8FF", "#581C87", "Inter, sans-serif", "1rem"),
  generateSystem("Cyber Red", "Neon red gradients", "linear-gradient(135deg, #EF4444 0%, #F97316 100%)", "linear-gradient(135deg, #DC2626 0%, #EA580C 100%)", "#000000", "#111111", "#FFFFFF", "'Space Grotesk', sans-serif", "0px", "#3B82F6", true)
];
