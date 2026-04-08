import React, { useState } from 'react';
import { DesignSystem } from '../../types';
import { Settings2, Code2, BookOpen, Accessibility } from 'lucide-react';
import { getAccessibleColor } from '../../utils/accessibility';
import { getStyleModifiers } from '../../utils/designStyleUtils';

interface ComponentPlaygroundProps {
  system: DesignSystem;
  activeTheme: string;
}

type ComponentType = 'button' | 'input' | 'card' | 'badge' | 'avatar' | 'alert' | 'toggle' | 'progress';

export const ComponentPlayground: React.FC<ComponentPlaygroundProps> = ({ system, activeTheme }) => {
  const theme = system.themes[activeTheme];
  const designStyle = system.designStyle || 'flat';
  const [activeComponent, setActiveComponent] = useState<ComponentType>('button');
  
  // Interactive states
  const [buttonText, setButtonText] = useState('Click Me');
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'outline'>('primary');
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [buttonRadius, setButtonRadius] = useState('md');

  const [inputPlaceholder, setInputPlaceholder] = useState('Enter your email...');
  const [inputState, setInputState] = useState<'default' | 'focus' | 'error'>('default');

  const [cardTitle, setCardTitle] = useState('Interactive Card');
  const [cardContent, setCardContent] = useState('This is a card component generated from your design system. You can adjust its properties to see how it reacts.');
  const [cardElevation, setCardElevation] = useState('md');

  const [badgeText, setBadgeText] = useState('New Feature');
  const [badgeVariant, setBadgeVariant] = useState<'primary' | 'secondary' | 'success' | 'warning' | 'error'>('primary');
  const [badgeStyle, setBadgeStyle] = useState<'solid' | 'outline' | 'soft'>('soft');

  const [avatarInitials, setAvatarInitials] = useState('JD');
  const [avatarSize, setAvatarSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [avatarShape, setAvatarShape] = useState<'circle' | 'square' | 'rounded'>('circle');

  const [alertTitle, setAlertTitle] = useState('Update Available');
  const [alertMessage, setAlertMessage] = useState('A new version of the design system is ready to be installed.');
  const [alertVariant, setAlertVariant] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  const [toggleState, setToggleState] = useState(true);
  const [toggleSize, setToggleSize] = useState<'sm' | 'md' | 'lg'>('md');

  const [progressValue, setProgressValue] = useState(65);
  const [progressVariant, setProgressVariant] = useState<'primary' | 'secondary' | 'success'>('primary');

  const getRadius = (name: string) => {
    const scale = system.borderRadius?.scale?.find(s => s.name === name);
    return scale ? scale.value : '8px';
  };

  const getShadow = (name: string) => {
    const scale = system.shadows?.scale?.find(s => s.name === name);
    return scale ? scale.value : 'none';
  };

  const getFont = (type: 'display' | 'body' | 'mono') => {
    if (type === 'display') return `"${system.typography?.displayFont?.name || 'Playfair Display'}", serif`;
    if (type === 'body') return `"${system.typography?.bodyFont?.name || 'Inter'}", sans-serif`;
    return `"${system.typography?.monoFont?.name || 'JetBrains Mono'}", monospace`;
  };

  const renderButtonPreview = () => {
    let bg = theme.primary;
    let color = theme.primaryForeground;
    let border = 'transparent';

    if (buttonVariant === 'secondary') {
      bg = theme.secondary;
      color = theme.secondaryForeground;
    } else if (buttonVariant === 'outline') {
      bg = 'transparent';
      color = theme.primary;
      border = theme.primary;
    }

    const padding = buttonSize === 'sm' ? '0.5rem 1rem' : buttonSize === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem';
    const fontSize = buttonSize === 'sm' ? '0.875rem' : buttonSize === 'lg' ? '1.125rem' : '1rem';
    const styleModifiers = getStyleModifiers(designStyle, theme, 'button', false);

    return (
      <button
        style={{
          background: bg,
          color: color,
          border: `1px solid ${border}`,
          borderRadius: getRadius(buttonRadius),
          padding,
          fontSize,
          fontFamily: getFont('body'),
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: getShadow('sm'),
          ...styleModifiers
        }}
        className="hover:opacity-90 active:scale-95"
      >
        {buttonText}
      </button>
    );
  };

  const renderInputPreview = () => {
    let borderColor = theme.border;
    let ringColor = 'transparent';

    if (inputState === 'focus') {
      borderColor = theme.primary;
      ringColor = `${theme.primary}40`; // 25% opacity
    } else if (inputState === 'error') {
      borderColor = system.colors?.error?.hex || '#EF4444';
      ringColor = `${system.colors?.error?.hex || '#EF4444'}40`;
    }

    const labelColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');
    const inputTextColor = getAccessibleColor(theme.textPrimary, theme.surface);
    const styleModifiers = getStyleModifiers(designStyle, theme, 'input', false);

    return (
      <div className="w-full max-w-sm flex flex-col gap-1.5">
        <label style={{ color: labelColor, fontFamily: getFont('body'), fontSize: '0.875rem' }}>Email Address</label>
        <input
          type="text"
          placeholder={inputPlaceholder}
          style={{
            background: theme.surface,
            color: inputTextColor,
            border: `1px solid ${borderColor}`,
            borderRadius: getRadius('md'),
            padding: '0.75rem 1rem',
            fontFamily: getFont('body'),
            fontSize: '1rem',
            outline: 'none',
            boxShadow: inputState !== 'default' ? `0 0 0 3px ${ringColor}` : 'none',
            transition: 'all 0.2s ease',
            ...styleModifiers
          }}
        />
        {inputState === 'error' && (
          <span style={{ color: system.colors?.error?.hex || '#EF4444', fontSize: '0.75rem', fontFamily: getFont('body') }}>
            Please enter a valid email address.
          </span>
        )}
      </div>
    );
  };

  const renderCardPreview = () => {
    const cardTextColor = getAccessibleColor(theme.textSecondary, theme.surface, '#E5E7EB', '#4B5563');
    const cardHeaderColor = getAccessibleColor(theme.textPrimary, theme.surface);
    const styleModifiers = getStyleModifiers(designStyle, theme, 'card', false);
    const buttonStyleModifiers = getStyleModifiers(designStyle, theme, 'button', false);

    return (
      <div
        style={{
          background: theme.surface,
          borderRadius: getRadius('lg'),
          padding: '1.5rem',
          boxShadow: getShadow(cardElevation),
          border: `1px solid ${theme.borderSubtle}`,
          maxWidth: '400px',
          width: '100%',
          transition: 'all 0.3s ease',
          ...styleModifiers
        }}
      >
        <h3 style={{ color: cardHeaderColor, fontFamily: getFont('display'), fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {cardTitle}
        </h3>
        <p style={{ color: cardTextColor, fontFamily: getFont('body'), fontSize: '0.875rem', lineHeight: 1.5 }}>
          {cardContent}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            style={{
              background: theme.primary,
              color: theme.primaryForeground,
              borderRadius: getRadius('md'),
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontFamily: getFont('body'),
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              ...buttonStyleModifiers
            }}
          >
            Action
          </button>
          <button
            style={{
              background: 'transparent',
              color: cardTextColor,
              borderRadius: getRadius('md'),
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontFamily: getFont('body'),
              fontWeight: 500,
              border: `1px solid ${theme.border}`,
              cursor: 'pointer',
              ...buttonStyleModifiers
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderBadgePreview = () => {
    let bg = theme.primary;
    let color = theme.primaryForeground;
    let border = 'transparent';

    const variantColors: Record<string, string> = {
      primary: theme.primary,
      secondary: theme.secondary,
      success: system.colors?.success?.hex || '#10B981',
      warning: system.colors?.warning?.hex || '#F59E0B',
      error: system.colors?.error?.hex || '#EF4444',
    };

    const baseColor = variantColors[badgeVariant] || theme.primary;

    if (badgeStyle === 'solid') {
      bg = baseColor;
      color = '#FFFFFF'; // Assuming white text for solid badges
    } else if (badgeStyle === 'soft') {
      bg = `${baseColor}20`; // 12% opacity
      color = baseColor;
    } else if (badgeStyle === 'outline') {
      bg = 'transparent';
      color = baseColor;
      border = baseColor;
    }

    return (
      <span
        style={{
          background: bg,
          color: color,
          border: `1px solid ${border}`,
          borderRadius: getRadius('full'),
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontFamily: getFont('body'),
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {badgeText}
      </span>
    );
  };

  const renderAvatarPreview = () => {
    const sizeMap = {
      sm: '32px',
      md: '48px',
      lg: '64px'
    };
    
    const radiusMap = {
      circle: '50%',
      square: '0px',
      rounded: getRadius('md')
    };

    const size = sizeMap[avatarSize];
    const radius = radiusMap[avatarShape];

    return (
      <div
        style={{
          width: size,
          height: size,
          background: theme.surfaceSecondary,
          color: theme.textPrimary,
          borderRadius: radius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: getFont('body'),
          fontWeight: 600,
          fontSize: avatarSize === 'sm' ? '0.875rem' : avatarSize === 'lg' ? '1.5rem' : '1.125rem',
          border: `1px solid ${theme.borderSubtle}`,
          boxShadow: getShadow('sm')
        }}
      >
        {avatarInitials.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  const renderAlertPreview = () => {
    const variantColors: Record<string, string> = {
      info: system.colors?.info?.hex || '#3B82F6',
      success: system.colors?.success?.hex || '#10B981',
      warning: system.colors?.warning?.hex || '#F59E0B',
      error: system.colors?.error?.hex || '#EF4444',
    };

    const baseColor = variantColors[alertVariant] || theme.primary;
    const bgColor = `${baseColor}15`; // 8% opacity
    const borderColor = `${baseColor}40`; // 25% opacity

    return (
      <div
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: getRadius('md'),
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          width: '100%',
          maxWidth: '400px',
          fontFamily: getFont('body')
        }}
      >
        <div style={{ color: baseColor, fontWeight: 600, fontSize: '0.875rem' }}>
          {alertTitle}
        </div>
        <div style={{ color: theme.textSecondary, fontSize: '0.875rem', lineHeight: 1.5 }}>
          {alertMessage}
        </div>
      </div>
    );
  };

  const renderTogglePreview = () => {
    const sizeMap = {
      sm: { width: '32px', height: '16px', thumb: '12px', translate: '16px' },
      md: { width: '44px', height: '24px', thumb: '20px', translate: '20px' },
      lg: { width: '56px', height: '32px', thumb: '28px', translate: '24px' }
    };

    const { width, height, thumb, translate } = sizeMap[toggleSize];
    const bgColor = toggleState ? theme.primary : theme.surfaceSecondary;
    const thumbColor = toggleState ? theme.primaryForeground : theme.textSecondary;

    return (
      <div 
        onClick={() => setToggleState(!toggleState)}
        style={{
          width,
          height,
          background: bgColor,
          borderRadius: getRadius('full'),
          padding: '2px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 0.2s ease',
          border: toggleState ? 'none' : `1px solid ${theme.borderSubtle}`
        }}
      >
        <div 
          style={{
            width: thumb,
            height: thumb,
            background: thumbColor,
            borderRadius: '50%',
            transform: toggleState ? `translateX(${translate})` : 'translateX(0)',
            transition: 'transform 0.2s ease',
            boxShadow: getShadow('sm')
          }}
        />
      </div>
    );
  };

  const renderProgressPreview = () => {
    const variantColors: Record<string, string> = {
      primary: theme.primary,
      secondary: theme.secondary,
      success: system.colors?.success?.hex || '#10B981',
    };

    const baseColor = variantColors[progressVariant] || theme.primary;

    return (
      <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'col', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: getFont('body'), fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '0.5rem' }}>
          <span>Downloading...</span>
          <span>{progressValue}%</span>
        </div>
        <div 
          style={{
            width: '100%',
            height: '8px',
            background: theme.surfaceSecondary,
            borderRadius: getRadius('full'),
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              width: `${progressValue}%`,
              height: '100%',
              background: baseColor,
              borderRadius: getRadius('full'),
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    );
  };

  const renderDocs = () => {
    if (activeComponent === 'button') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Buttons allow users to take actions, and make choices, with a single tap. Use primary buttons for the main action, and secondary or outline buttons for alternative actions.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">variant</td>
                    <td className="py-2 font-mono text-xs">'primary' | 'secondary' | 'outline'</td>
                    <td className="py-2 font-mono text-xs">'primary'</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">size</td>
                    <td className="py-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                    <td className="py-2 font-mono text-xs">'md'</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">radius</td>
                    <td className="py-2 font-mono text-xs">string (theme key)</td>
                    <td className="py-2 font-mono text-xs">'md'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>Ensure contrast ratio between button background and text is at least 4.5:1.</li>
              <li>Provide an <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>aria-label</code> if the button only contains an icon.</li>
              <li>Ensure the button has a visible focus state for keyboard navigation.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeComponent === 'input') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Text inputs allow users to enter free-form text. Always pair inputs with a clear label.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">state</td>
                    <td className="py-2 font-mono text-xs">'default' | 'focus' | 'error'</td>
                    <td className="py-2 font-mono text-xs">'default'</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">placeholder</td>
                    <td className="py-2 font-mono text-xs">string</td>
                    <td className="py-2 font-mono text-xs">''</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>Always include a visible <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>&lt;label&gt;</code> element associated via <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>htmlFor</code>.</li>
              <li>Do not use placeholders as a replacement for labels.</li>
              <li>Error messages should be linked to the input via <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>aria-describedby</code>.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeComponent === 'card') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Cards contain content and actions about a single subject. They should be easy to scan for relevant and actionable information.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">elevation</td>
                    <td className="py-2 font-mono text-xs">string (shadow key)</td>
                    <td className="py-2 font-mono text-xs">'md'</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">title</td>
                    <td className="py-2 font-mono text-xs">ReactNode</td>
                    <td className="py-2 font-mono text-xs">undefined</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>Ensure the card's heading hierarchy makes sense within the broader page context.</li>
              <li>If the entire card is clickable, ensure the focus state covers the whole card.</li>
            </ul>
          </div>
        </div>
      );
    }
    if (activeComponent === 'badge') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Badges are used to highlight an item's status, or to draw attention to a specific attribute.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">variant</td>
                    <td className="py-2 font-mono text-xs">'primary' | 'secondary' | 'success' | 'warning' | 'error'</td>
                    <td className="py-2 font-mono text-xs">'primary'</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">style</td>
                    <td className="py-2 font-mono text-xs">'solid' | 'outline' | 'soft'</td>
                    <td className="py-2 font-mono text-xs">'soft'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>Ensure the badge color has sufficient contrast against its background.</li>
              <li>Do not rely solely on color to convey meaning; ensure the text is descriptive.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeComponent === 'avatar') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Avatars are used to represent a user or entity. They can display an image, initials, or an icon.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">size</td>
                    <td className="py-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                    <td className="py-2 font-mono text-xs">'md'</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">shape</td>
                    <td className="py-2 font-mono text-xs">'circle' | 'square' | 'rounded'</td>
                    <td className="py-2 font-mono text-xs">'circle'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>If the avatar conveys important information (like online status), provide an alternative text description.</li>
              <li>Ensure initials are readable with sufficient contrast.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeComponent === 'alert') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Alerts display important messages that require user attention. Use different variants to convey the severity of the message.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">variant</td>
                    <td className="py-2 font-mono text-xs">'info' | 'success' | 'warning' | 'error'</td>
                    <td className="py-2 font-mono text-xs">'info'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>Use <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>role="alert"</code> for important messages.</li>
              <li>Do not rely solely on color to convey meaning; include icons or text.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeComponent === 'toggle') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Toggles are used to switch between two states, typically on and off. They are best used for settings that take immediate effect.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">size</td>
                    <td className="py-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                    <td className="py-2 font-mono text-xs">'md'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>Use <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>role="switch"</code> and <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>aria-checked</code>.</li>
              <li>Ensure the toggle can be operated using the Space key.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeComponent === 'progress') {
      return (
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><BookOpen size={16} /> Usage</h4>
            <p style={{ color: theme.textSecondary }}>Progress bars indicate the completion status of a task or process.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Code2 size={16} /> Props</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Prop</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Type</th>
                    <th className="py-2 font-medium" style={{ color: theme.textPrimary }}>Default</th>
                  </tr>
                </thead>
                <tbody style={{ color: theme.textSecondary }}>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">variant</td>
                    <td className="py-2 font-mono text-xs">'primary' | 'secondary' | 'success'</td>
                    <td className="py-2 font-mono text-xs">'primary'</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: theme.borderSubtle }}>
                    <td className="py-2 font-mono text-xs">value</td>
                    <td className="py-2 font-mono text-xs">number (0-100)</td>
                    <td className="py-2 font-mono text-xs">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}><Accessibility size={16} /> Accessibility</h4>
            <ul className="list-disc pl-5 space-y-1" style={{ color: theme.textSecondary }}>
              <li>Use <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>role="progressbar"</code>.</li>
              <li>Provide <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>aria-valuenow</code>, <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>aria-valuemin</code>, and <code className="px-1 rounded" style={{ background: theme.surfaceSecondary }}>aria-valuemax</code>.</li>
            </ul>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-medium tracking-tight mb-4" style={{ color: theme.textPrimary }}>
          Interactive Component Playground & Documentation
        </h2>
        <p className="max-w-2xl" style={{ color: theme.textSecondary }}>
          Test out your generated design system components in real-time. Adjust properties and view detailed documentation and accessibility guidelines.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          <button
            onClick={() => setActiveComponent('button')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'button' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'button' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Button
          </button>
          <button
            onClick={() => setActiveComponent('input')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'input' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'input' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Text Input
          </button>
          <button
            onClick={() => setActiveComponent('card')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'card' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'card' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Card
          </button>
          <button
            onClick={() => setActiveComponent('badge')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'badge' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'badge' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Badge
          </button>
          <button
            onClick={() => setActiveComponent('avatar')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'avatar' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'avatar' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Avatar
          </button>
          <button
            onClick={() => setActiveComponent('alert')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'alert' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'alert' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Alert
          </button>
          <button
            onClick={() => setActiveComponent('toggle')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'toggle' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'toggle' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Toggle
          </button>
          <button
            onClick={() => setActiveComponent('progress')}
            className="text-left px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: activeComponent === 'progress' ? theme.surfaceSecondary : 'transparent',
              color: activeComponent === 'progress' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Progress
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Preview & Controls */}
          <div className="flex flex-col gap-6">
            {/* Preview Area */}
            <div 
              className="h-80 rounded-2xl border flex items-center justify-center p-8 relative overflow-hidden"
              style={{ background: theme.background, borderColor: theme.borderSubtle }}
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: theme.textPrimary }}></div>
              <div className="z-10 w-full flex justify-center">
                {activeComponent === 'button' && renderButtonPreview()}
                {activeComponent === 'input' && renderInputPreview()}
                {activeComponent === 'card' && renderCardPreview()}
                {activeComponent === 'badge' && renderBadgePreview()}
                {activeComponent === 'avatar' && renderAvatarPreview()}
                {activeComponent === 'alert' && renderAlertPreview()}
                {activeComponent === 'toggle' && renderTogglePreview()}
                {activeComponent === 'progress' && renderProgressPreview()}
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-2xl border p-6" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
              <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.textPrimary }}>
                <Settings2 size={16} /> Properties
              </h4>
              
              {activeComponent === 'button' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Text</label>
                    <input 
                      type="text" 
                      value={buttonText} 
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Variant</label>
                    <select 
                      value={buttonVariant} 
                      onChange={(e) => setButtonVariant(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Size</label>
                    <select 
                      value={buttonSize} 
                      onChange={(e) => setButtonSize(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>
                </div>
              )}

              {activeComponent === 'input' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Placeholder</label>
                    <input 
                      type="text" 
                      value={inputPlaceholder} 
                      onChange={(e) => setInputPlaceholder(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>State</label>
                    <select 
                      value={inputState} 
                      onChange={(e) => setInputState(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="default">Default</option>
                      <option value="focus">Focus</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              )}

              {activeComponent === 'card' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Title</label>
                    <input 
                      type="text" 
                      value={cardTitle} 
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Elevation</label>
                    <select 
                      value={cardElevation} 
                      onChange={(e) => setCardElevation(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      {system.shadows.scale.map(s => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {activeComponent === 'badge' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Text</label>
                    <input 
                      type="text" 
                      value={badgeText} 
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Variant</label>
                    <select 
                      value={badgeVariant} 
                      onChange={(e) => setBadgeVariant(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Style</label>
                    <select 
                      value={badgeStyle} 
                      onChange={(e) => setBadgeStyle(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="solid">Solid</option>
                      <option value="outline">Outline</option>
                      <option value="soft">Soft</option>
                    </select>
                  </div>
                </div>
              )}

              {activeComponent === 'avatar' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Initials</label>
                    <input 
                      type="text" 
                      value={avatarInitials} 
                      onChange={(e) => setAvatarInitials(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                      maxLength={2}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Size</label>
                    <select 
                      value={avatarSize} 
                      onChange={(e) => setAvatarSize(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Shape</label>
                    <select 
                      value={avatarShape} 
                      onChange={(e) => setAvatarShape(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                      <option value="rounded">Rounded</option>
                    </select>
                  </div>
                </div>
              )}

              {activeComponent === 'alert' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Title</label>
                    <input 
                      type="text" 
                      value={alertTitle} 
                      onChange={(e) => setAlertTitle(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Message</label>
                    <input 
                      type="text" 
                      value={alertMessage} 
                      onChange={(e) => setAlertMessage(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Variant</label>
                    <select 
                      value={alertVariant} 
                      onChange={(e) => setAlertVariant(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              )}

              {activeComponent === 'toggle' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>State</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={toggleState} 
                        onChange={(e) => setToggleState(e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: theme.primary }}
                      />
                      <span style={{ color: theme.textPrimary }}>{toggleState ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Size</label>
                    <select 
                      value={toggleSize} 
                      onChange={(e) => setToggleSize(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>
                </div>
              )}

              {activeComponent === 'progress' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Value</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={progressValue} 
                      onChange={(e) => setProgressValue(parseInt(e.target.value))}
                      className="w-full"
                      style={{ accentColor: theme.primary }}
                    />
                    <div className="text-right text-xs" style={{ color: theme.textSecondary }}>{progressValue}%</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: theme.textSecondary }}>Variant</label>
                    <select 
                      value={progressVariant} 
                      onChange={(e) => setProgressVariant(e.target.value as any)}
                      className="w-full p-2 text-sm border rounded-lg outline-none"
                      style={{ background: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.borderSubtle }}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="success">Success</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documentation */}
          <div className="rounded-2xl border p-6 h-fit" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
            {renderDocs()}
          </div>
        </div>
      </div>
    </div>
  );
};
