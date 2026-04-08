import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { DesignSystem, ThemeColors } from '../types';

// Set this to true if you want to force ALL users (including yourself) to enter an API key.
// If false, it will fall back to the AI Studio provided key when a custom key isn't set.
export const FORCE_BYOK = true;

export const getApiKey = () => {
  const customKey = localStorage.getItem('CUSTOM_GEMINI_API_KEY');
  if (customKey) return customKey;
  if (!FORCE_BYOK) return process.env.GEMINI_API_KEY;
  return null;
};

const getAiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }
  return new GoogleGenAI({ apiKey });
};

const themeColorsSchema = {
  type: Type.OBJECT,
  properties: {
    background: { type: Type.STRING },
    surface: { type: Type.STRING },
    surfaceSecondary: { type: Type.STRING },
    textPrimary: { type: Type.STRING },
    textSecondary: { type: Type.STRING },
    textTertiary: { type: Type.STRING },
    border: { type: Type.STRING },
    borderSubtle: { type: Type.STRING },
    primary: { type: Type.STRING },
    primaryForeground: { type: Type.STRING },
    secondary: { type: Type.STRING },
    secondaryForeground: { type: Type.STRING },
    accent: { type: Type.STRING },
    accentForeground: { type: Type.STRING },
    muted: { type: Type.STRING },
    mutedForeground: { type: Type.STRING },
  },
  required: [
    'background', 'surface', 'surfaceSecondary', 'textPrimary', 'textSecondary',
    'textTertiary', 'border', 'borderSubtle', 'primary', 'primaryForeground',
    'secondary', 'secondaryForeground', 'accent', 'accentForeground', 'muted', 'mutedForeground'
  ]
};

const designSystemSchema = {
  type: Type.OBJECT,
  properties: {
    brandName: { type: Type.STRING },
    brandTagline: { type: Type.STRING },
    personality: { type: Type.ARRAY, items: { type: Type.STRING } },
    designStyle: { type: Type.STRING, description: "The visual style of the design system. Must be one of: 'flat', 'glassmorphism', 'brutalism', 'claymorphism'." },
    colors: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, hex: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'hex', 'usage'] },
        secondary: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, hex: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'hex', 'usage'] },
        accent: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, hex: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'hex', 'usage'] },
        success: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, hex: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'hex', 'usage'] },
        warning: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, hex: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'hex', 'usage'] },
        error: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, hex: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'hex', 'usage'] },
        info: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, hex: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'hex', 'usage'] },
        neutrals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { shade: { type: Type.STRING }, hex: { type: Type.STRING } }, required: ['shade', 'hex'] } },
        primaryScale: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { shade: { type: Type.STRING }, hex: { type: Type.STRING } }, required: ['shade', 'hex'] } },
      },
      required: ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'neutrals', 'primaryScale']
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        displayFont: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, category: { type: Type.STRING }, weights: { type: Type.ARRAY, items: { type: Type.NUMBER } }, reason: { type: Type.STRING } }, required: ['name', 'category', 'weights', 'reason'] },
        bodyFont: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, category: { type: Type.STRING }, weights: { type: Type.ARRAY, items: { type: Type.NUMBER } }, reason: { type: Type.STRING } }, required: ['name', 'category', 'weights', 'reason'] },
        monoFont: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, category: { type: Type.STRING }, weights: { type: Type.ARRAY, items: { type: Type.NUMBER } } }, required: ['name', 'category', 'weights'] },
        scale: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, size: { type: Type.STRING }, lineHeight: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'size', 'lineHeight', 'usage'] } },
      },
      required: ['displayFont', 'bodyFont', 'monoFont', 'scale']
    },
    spacing: {
      type: Type.OBJECT,
      properties: {
        unit: { type: Type.STRING },
        scale: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING } }, required: ['name', 'value'] } },
      },
      required: ['unit', 'scale']
    },
    borderRadius: {
      type: Type.OBJECT,
      properties: {
        scale: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'value'] } },
      },
      required: ['scale']
    },
    shadows: {
      type: Type.OBJECT,
      properties: {
        scale: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING }, usage: { type: Type.STRING } }, required: ['name', 'value', 'usage'] } },
      },
      required: ['scale']
    },
    iconStyle: {
      type: Type.OBJECT,
      properties: {
        recommended: { type: Type.STRING },
        style: { type: Type.STRING },
        strokeWidth: { type: Type.STRING },
        sizes: { type: Type.ARRAY, items: { type: Type.STRING } },
        reason: { type: Type.STRING },
      },
      required: ['recommended', 'style', 'strokeWidth', 'sizes', 'reason']
    },
    themes: {
      type: Type.OBJECT,
      properties: {
        light: themeColorsSchema,
        dark: themeColorsSchema,
      },
      required: ['light', 'dark']
    },
  },
  required: ['brandName', 'brandTagline', 'personality', 'designStyle', 'colors', 'typography', 'spacing', 'borderRadius', 'shadows', 'iconStyle', 'themes']
};

export async function generateDesignSystem(prompt: string): Promise<DesignSystem> {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a complete, professional design system based on this brand description: "${prompt}".
    
    Make sure the AI generates sophisticated, harmonious colors — no generic primaries. 
    Font choices should come from Google Fonts and be distinctive, not generic (never suggest Inter, Roboto, or Arial). 
    Determine an appropriate designStyle ('flat', 'glassmorphism', 'brutalism', or 'claymorphism') that fits the brand description.
    Everything should feel cohesive as a system.
    
    Return ONLY valid JSON matching the schema.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: designSystemSchema,
      temperature: 0.7,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    },
  });

  if (!response.text) {
    throw new Error('Failed to generate design system');
  }

  return JSON.parse(response.text) as DesignSystem;
}

export interface ColorSet {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface ScratchConfig {
  brandName: string;
  themeMode: 'light' | 'dark' | 'both';
  lightColors: ColorSet;
  darkColors: ColorSet;
}

export async function generateDesignSystemFromScratch(config: ScratchConfig): Promise<DesignSystem> {
  const ai = getAiClient();
  let colorPrompt = '';
  
  if (config.themeMode === 'light' || config.themeMode === 'both') {
    colorPrompt += `
    LIGHT THEME COLORS:
    Primary: ${config.lightColors.primaryColor}
    Secondary: ${config.lightColors.secondaryColor}
    Accent: ${config.lightColors.accentColor}
    Success: ${config.lightColors.successColor}
    Warning: ${config.lightColors.warningColor}
    Error: ${config.lightColors.errorColor}
    Info: ${config.lightColors.infoColor}
    Background: ${config.lightColors.backgroundColor}
    Text: ${config.lightColors.textColor}
    `;
  }
  
  if (config.themeMode === 'dark' || config.themeMode === 'both') {
    colorPrompt += `
    DARK THEME COLORS:
    Primary: ${config.darkColors.primaryColor}
    Secondary: ${config.darkColors.secondaryColor}
    Accent: ${config.darkColors.accentColor}
    Success: ${config.darkColors.successColor}
    Warning: ${config.darkColors.warningColor}
    Error: ${config.darkColors.errorColor}
    Info: ${config.darkColors.infoColor}
    Background: ${config.darkColors.backgroundColor}
    Text: ${config.darkColors.textColor}
    `;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a complete, professional design system based on these specific colors provided by the user:
    
    Brand Name: ${config.brandName}
    Theme Generation Focus: ${config.themeMode} (Options: 'light', 'dark', 'both')
    
    ${colorPrompt}
    
    Instructions:
    1. You MUST use these exact color values (which could be hex, rgb, rgba, or linear-gradient) for the base colors in the requested themes.
    2. If Theme Generation Focus is 'light', use the provided LIGHT THEME COLORS for the light theme, and generate a complementary dark theme.
    3. If Theme Generation Focus is 'dark', use the provided DARK THEME COLORS for the dark theme, and generate a complementary light theme.
    4. If Theme Generation Focus is 'both', use the provided LIGHT THEME COLORS for the light theme, and the provided DARK THEME COLORS for the dark theme.
    5. Generate appropriate shades for the primaryScale and neutrals based on these colors. If a color is a gradient, try to extract its main hue to generate shades, or use a neutral scale.
    6. Select appropriate Google Fonts that match the vibe of these colors.
    7. Generate spacing, border radius, and shadow scales.
    8. Determine an appropriate designStyle ('flat', 'glassmorphism', 'brutalism', or 'claymorphism').
    
    Return ONLY valid JSON matching the schema.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: designSystemSchema,
      temperature: 0.2,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    },
  });

  if (!response.text) {
    throw new Error('Failed to generate design system from scratch');
  }

  return JSON.parse(response.text) as DesignSystem;
}

export async function generateCustomTheme(brandDescription: string, themeDescription: string, currentSystem: DesignSystem): Promise<ThemeColors> {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a custom theme for a design system based on this description: "${themeDescription}".
    The brand is: "${brandDescription}".
    
    The theme should be cohesive with the brand but fit the new theme description.
    Return ONLY valid JSON matching the schema.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: themeColorsSchema,
      temperature: 0.7,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    },
  });

  if (!response.text) {
    throw new Error('Failed to generate custom theme');
  }

  return JSON.parse(response.text) as ThemeColors;
}
