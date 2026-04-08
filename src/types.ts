export interface ColorShade {
  shade: string;
  hex: string;
}

export interface SemanticColor {
  name: string;
  hex: string;
  usage: string;
}

export interface TypographyScale {
  name: string;
  size: string;
  lineHeight: string;
  letterSpacing?: string;
  textTransform?: string;
  textDecoration?: string;
  usage: string;
  mobileSize?: string;
  tabletSize?: string;
  desktopSize?: string;
  mobileLineHeight?: string;
  tabletLineHeight?: string;
  desktopLineHeight?: string;
}

export interface SpacingScale {
  name: string;
  value: string;
}

export interface BorderRadiusScale {
  name: string;
  value: string;
  usage?: string;
}

export interface ShadowScale {
  name: string;
  value: string;
  usage: string;
}

export interface IconStyle {
  recommended: string;
  style: string;
  strokeWidth: string;
  sizes: string[];
  reason: string;
}

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderSubtle: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
}

export interface DesignSystem {
  id?: string;
  createdAt?: number;
  brandName: string;
  brandTagline: string;
  personality: string[];
  designStyle?: 'flat' | 'glassmorphism' | 'brutalism' | 'claymorphism';
  colors: {
    primary: SemanticColor;
    secondary: SemanticColor;
    accent: SemanticColor;
    success: SemanticColor;
    warning: SemanticColor;
    error: SemanticColor;
    info: SemanticColor;
    neutrals: ColorShade[];
    primaryScale: ColorShade[];
  };
  typography: {
    displayFont: { name: string; category: string; weights: number[]; reason: string; selectedWeight?: number };
    bodyFont: { name: string; category: string; weights: number[]; reason: string; selectedWeight?: number };
    monoFont: { name: string; category: string; weights: number[] };
    scale: TypographyScale[];
  };
  spacing: {
    unit: string;
    scale: SpacingScale[];
  };
  borderRadius: {
    scale: BorderRadiusScale[];
  };
  shadows: {
    scale: ShadowScale[];
  };
  iconStyle: {
    recommended: string;
    style: string;
    strokeWidth: string;
    sizes: string[];
    reason: string;
  };
  themes: {
    light: ThemeColors;
    dark: ThemeColors;
    [key: string]: ThemeColors; // For custom themes
  };
}
