import React from 'react';
import { ThemeColors } from '../types';

export type DesignStyle = 'flat' | 'glassmorphism' | 'brutalism' | 'claymorphism';

export const getStyleModifiers = (
  style: DesignStyle = 'flat',
  theme: ThemeColors,
  type: 'panel' | 'button' | 'input' | 'card' = 'panel',
  isActive: boolean = false
): React.CSSProperties => {
  const base: React.CSSProperties = {};

  switch (style) {
    case 'glassmorphism':
      if (type === 'panel' || type === 'card') {
        base.background = `${theme.surface}80`; // 50% opacity
        base.backdropFilter = 'blur(16px)';
        base.WebkitBackdropFilter = 'blur(16px)';
        base.border = `1px solid ${theme.borderSubtle}40`;
        base.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.05)';
      } else if (type === 'button') {
        if (!isActive) {
          base.background = `${theme.surfaceSecondary}60`;
          base.backdropFilter = 'blur(8px)';
          base.WebkitBackdropFilter = 'blur(8px)';
          base.border = `1px solid ${theme.borderSubtle}40`;
        }
      } else if (type === 'input') {
        base.background = `${theme.surfaceSecondary}40`;
        base.backdropFilter = 'blur(4px)';
        base.WebkitBackdropFilter = 'blur(4px)';
        base.border = `1px solid ${theme.borderSubtle}60`;
      }
      break;

    case 'brutalism':
      base.borderRadius = '0px'; // Override border radius
      base.border = `2px solid ${theme.textPrimary}`;
      if (type === 'panel' || type === 'card') {
        base.boxShadow = `6px 6px 0px ${theme.textPrimary}`;
      } else if (type === 'button') {
        base.boxShadow = `4px 4px 0px ${theme.textPrimary}`;
        base.transition = 'transform 0.1s, box-shadow 0.1s';
      } else if (type === 'input') {
        base.boxShadow = `4px 4px 0px ${theme.textPrimary}`;
      }
      break;

    case 'claymorphism':
      if (type === 'panel' || type === 'card') {
        base.background = theme.surface;
        base.borderRadius = '24px'; // Softer corners
        base.boxShadow = `
          inset 4px 4px 8px rgba(255, 255, 255, 0.3),
          inset -4px -4px 8px rgba(0, 0, 0, 0.05),
          8px 8px 16px rgba(0, 0, 0, 0.05)
        `;
      } else if (type === 'button') {
        base.borderRadius = '16px';
        if (isActive) {
          base.boxShadow = `
            inset 2px 2px 4px rgba(255, 255, 255, 0.4),
            inset -2px -2px 4px rgba(0, 0, 0, 0.1),
            4px 4px 8px rgba(0, 0, 0, 0.1)
          `;
        } else {
          base.boxShadow = `
            inset 2px 2px 4px rgba(255, 255, 255, 0.3),
            inset -2px -2px 4px rgba(0, 0, 0, 0.05),
            4px 4px 8px rgba(0, 0, 0, 0.05)
          `;
        }
      } else if (type === 'input') {
        base.borderRadius = '12px';
        base.boxShadow = `
          inset 2px 2px 4px rgba(0, 0, 0, 0.05),
          inset -2px -2px 4px rgba(255, 255, 255, 0.5)
        `;
        base.border = 'none';
        base.background = theme.surfaceSecondary;
      }
      break;

    case 'flat':
    default:
      // Default styles are already handled by the components, 
      // but we can ensure no extra shadows if not specified
      if (type === 'panel' || type === 'card') {
        // base.boxShadow = 'none'; // Let the component's getShadow handle it
      }
      break;
  }

  return base;
};
