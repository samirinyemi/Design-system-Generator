import { DesignSystem } from '../types';

export const generateMarkdown = (system: DesignSystem, activeTheme: string): string => {
  const theme = system.themes[activeTheme] || system.themes.light;
  
  return `# ${system.brandName || 'Brand'} - Design System
> ${system.brandTagline || 'A custom design system'}

**Brand Personality**: ${system.personality?.join(', ') || 'Modern, Clean'}

## AI Coding Instructions
When generating UI code for this project, you MUST strictly adhere to the following design system tokens. Do not hallucinate colors, typography, or spacing values. Use these exact values to ensure brand consistency.

---

## 1. Colors (${activeTheme} theme)

### Core Theme Colors
- **Background**: \`${theme.background}\`
- **Surface**: \`${theme.surface}\`
- **Surface Secondary**: \`${theme.surfaceSecondary}\`
- **Text Primary**: \`${theme.textPrimary}\`
- **Text Secondary**: \`${theme.textSecondary}\`
- **Text Tertiary**: \`${theme.textTertiary}\`
- **Border**: \`${theme.border}\`
- **Border Subtle**: \`${theme.borderSubtle}\`

### Brand & Semantic Colors
- **Primary**: \`${theme.primary}\` (Foreground: \`${theme.primaryForeground}\`)
- **Secondary**: \`${theme.secondary}\` (Foreground: \`${theme.secondaryForeground}\`)
- **Accent**: \`${theme.accent}\` (Foreground: \`${theme.accentForeground}\`)
- **Muted**: \`${theme.muted}\` (Foreground: \`${theme.mutedForeground}\`)

### Status Colors
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

## 7. Component Construction Guidelines

When building UI components, use the following token combinations to ensure consistency:

### Buttons
- **Primary Button**: 
  - Background: \`${theme.primary}\`
  - Text Color: \`${theme.primaryForeground}\`
  - Border Radius: \`${system.borderRadius?.scale?.find(r => r.name === 'md')?.value || '8px'}\`
  - Font: Body Font (\`${system.typography?.bodyFont?.name || 'Inter'}\`), Weight: 500
- **Secondary Button**:
  - Background: \`${theme.secondary}\`
  - Text Color: \`${theme.secondaryForeground}\`
- **Outline Button**:
  - Background: Transparent
  - Border: 1px solid \`${theme.primary}\`
  - Text Color: \`${theme.primary}\`

### Text Inputs
- **Default State**:
  - Background: \`${theme.surface}\`
  - Border: 1px solid \`${theme.border}\`
  - Text Color: \`${theme.textPrimary}\`
  - Placeholder Color: \`${theme.textTertiary}\`
  - Border Radius: \`${system.borderRadius?.scale?.find(r => r.name === 'md')?.value || '8px'}\`
- **Focus State**:
  - Border: 1px solid \`${theme.primary}\`
  - Ring/Glow: \`${theme.primary}\` with 25% opacity
- **Error State**:
  - Border: 1px solid \`${system.colors?.error?.hex || '#DC3545'}\`

### Cards & Surfaces
- **Base Card**:
  - Background: \`${theme.surface}\`
  - Border: 1px solid \`${theme.borderSubtle}\`
  - Border Radius: \`${system.borderRadius?.scale?.find(r => r.name === 'lg')?.value || '16px'}\`
  - Shadow: \`${system.shadows?.scale?.find(s => s.name === 'md')?.value || 'none'}\`
- **Elevated Card (Hover/Active)**:
  - Shadow: \`${system.shadows?.scale?.find(s => s.name === 'lg')?.value || 'none'}\`
`;
};
