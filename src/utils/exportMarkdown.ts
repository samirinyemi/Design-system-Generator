import { DesignSystem } from '../types';

export const generateMarkdown = (system: DesignSystem, activeTheme: string): string => {
  const themes = system.themes || {};
  const themeKeys = Object.keys(themes);
  
  // Fallback if no themes exist
  if (themeKeys.length === 0) {
    return `# ${system.brandName || 'Brand'} - Design System\n> No themes selected.`;
  }

  // Use the first theme for general component examples
  const baseTheme = themes[themeKeys[0]];

  let markdown = `# ${system.brandName || 'Brand'} - Design System
> ${system.brandTagline || 'A custom design system'}

**Brand Personality**: ${system.personality?.join(', ') || 'Modern, Clean'}

## AI Coding Instructions
When generating UI code for this project, you MUST strictly adhere to the following design system tokens. Do not hallucinate colors, typography, or spacing values. Use these exact values to ensure brand consistency.

---

## 1. Colors

`;

  themeKeys.forEach(themeName => {
    const theme = themes[themeName];
    markdown += `### ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme Colors

#### Core Theme Colors
- **Background**: \`${theme.background}\`
- **Surface**: \`${theme.surface}\`
- **Surface Secondary**: \`${theme.surfaceSecondary}\`
- **Text Primary**: \`${theme.textPrimary}\`
- **Text Secondary**: \`${theme.textSecondary}\`
- **Text Tertiary**: \`${theme.textTertiary}\`
- **Border**: \`${theme.border}\`
- **Border Subtle**: \`${theme.borderSubtle}\`

#### Brand & Semantic Colors
- **Primary**: \`${theme.primary}\` (Foreground: \`${theme.primaryForeground}\`)
- **Secondary**: \`${theme.secondary}\` (Foreground: \`${theme.secondaryForeground}\`)
- **Accent**: \`${theme.accent}\` (Foreground: \`${theme.accentForeground}\`)
- **Muted**: \`${theme.muted}\` (Foreground: \`${theme.mutedForeground}\`)

`;
  });

  markdown += `### Status Colors
- **Success**: \`${system.colors?.success?.hex || '#28A745'}\`
- **Warning**: \`${system.colors?.warning?.hex || '#FFC107'}\`
- **Error**: \`${system.colors?.error?.hex || '#DC3545'}\`
- **Info**: \`${system.colors?.info?.hex || '#17A2B8'}\`

### Neutral Scale
${system.colors?.neutrals?.map(n => `- **${n.shade}**: \`${n.hex}\``).join('\n') || '- N/A'}

### Primary Color Scale
${system.colors?.primaryScale?.map(p => `- **${p.shade}**: \`${p.hex}\``).join('\n') || '- N/A'}

---

## 2. Typography

### Font Families
- **Display/Headings**: \`${system.typography?.displayFont?.name || 'Playfair Display'}\` (Weights: ${system.typography?.displayFont?.weights?.join(', ') || '400, 700'})
- **Body/UI**: \`${system.typography?.bodyFont?.name || 'Inter'}\` (Weights: ${system.typography?.bodyFont?.weights?.join(', ') || '400, 500, 600'})
- **Monospace**: \`${system.typography?.monoFont?.name || 'JetBrains Mono'}\` (Weights: ${system.typography?.monoFont?.weights?.join(', ') || '400, 500'})

### Type Scale
${system.typography?.scale?.map(t => `- **${t.name}**: Size \`${t.size}\`, Line Height \`${t.lineHeight}\` - *${t.usage}*`).join('\n')}

---

## 3. Spacing

**Base Unit**: \`${system.spacing?.unit || '4px'}\`

### Spacing Scale
${system.spacing?.scale?.map(s => `- **${s.name}**: \`${s.value}\``).join('\n')}

---

## 4. Border Radius

${system.borderRadius?.scale?.map(r => `- **${r.name}**: \`${r.value}\` ${r.usage ? `- *${r.usage}*` : ''}`).join('\n')}

---

## 5. Shadows / Elevation

${system.shadows?.scale?.map(s => `- **${s.name}**: \`${s.value}\` - *${s.usage}*`).join('\n')}

---

## 6. Iconography

- **Style**: ${system.iconStyle?.style || 'Outline'}
- **Stroke Width**: \`${system.iconStyle?.strokeWidth || '2px'}\`
- **Recommended Library**: ${system.iconStyle?.recommended || 'Lucide React'}
- **Sizes**: ${system.iconStyle?.sizes?.join(', ') || '16px, 20px, 24px, 32px'}
- **Reasoning**: *${system.iconStyle?.reason || 'Standard icon guidelines.'}*

---

## 7. Accessibility & Contrast Guidelines

When generating UI, you must adhere to WCAG 2.1 AA accessibility standards:
- **Text Contrast**: Ensure all text has a minimum contrast ratio of 4.5:1 against its background.
- **Large Text**: Text larger than 18pt (or 14pt bold) must have a minimum contrast ratio of 3.0:1.
- **UI Components**: Interactive elements (buttons, inputs) must have a 3.0:1 contrast ratio against adjacent colors.
- Always use \`${baseTheme.primaryForeground}\` when placing text on top of the \`${baseTheme.primary}\` background.
- Focus rings must be visible and use the \`${baseTheme.primary}\` color.

---

## 8. Component Construction Guidelines (The "See in Action" Specs)

When building UI components, use the following token combinations to ensure consistency. Do not invent new padding or border-radius values; use the scales provided above.

### Buttons
- **Primary Button**: 
  - Background: \`${baseTheme.primary}\`
  - Text Color: \`${baseTheme.primaryForeground}\`
  - Border Radius: \`${system.borderRadius?.scale?.find(r => r.name === 'md')?.value || '8px'}\`
  - Padding: \`${system.spacing?.scale?.find(s => s.name === 'md')?.value || '16px'}\` horizontal, \`${system.spacing?.scale?.find(s => s.name === 'sm')?.value || '8px'}\` vertical.
  - Font: Body Font (\`${system.typography?.bodyFont?.name || 'Inter'}\`), Weight: 500
  - Hover State: Darken background by 10% or reduce opacity to 90%.
- **Secondary Button**:
  - Background: \`${baseTheme.secondary}\`
  - Text Color: \`${baseTheme.secondaryForeground}\`
- **Outline Button**:
  - Background: Transparent
  - Border: 1px solid \`${baseTheme.primary}\`
  - Text Color: \`${baseTheme.primary}\`

### Text Inputs
- **Default State**:
  - Background: \`${baseTheme.surface}\`
  - Border: 1px solid \`${baseTheme.border}\`
  - Text Color: \`${baseTheme.textPrimary}\`
  - Placeholder Color: \`${baseTheme.textTertiary}\`
  - Border Radius: \`${system.borderRadius?.scale?.find(r => r.name === 'md')?.value || '8px'}\`
  - Padding: \`${system.spacing?.scale?.find(s => s.name === 'md')?.value || '16px'}\` horizontal.
- **Focus State**:
  - Border: 1px solid \`${baseTheme.primary}\`
  - Ring/Glow: \`${baseTheme.primary}\` with 25% opacity
- **Error State**:
  - Border: 1px solid \`${system.colors?.error?.hex || '#DC3545'}\`

### Cards & Surfaces (UI Cards)
- **Base Card**:
  - Background: \`${baseTheme.surface}\`
  - Border: 1px solid \`${baseTheme.borderSubtle}\`
  - Border Radius: \`${system.borderRadius?.scale?.find(r => r.name === 'lg')?.value || '16px'}\`
  - Padding: \`${system.spacing?.scale?.find(s => s.name === 'xl')?.value || '24px'}\`
  - Shadow: \`${system.shadows?.scale?.find(s => s.name === 'md')?.value || 'none'}\`
- **Elevated Card (Hover/Active)**:
  - Shadow: \`${system.shadows?.scale?.find(s => s.name === 'lg')?.value || 'none'}\`
  - Transform: Translate Y by -2px.
`;

  return markdown;
};
