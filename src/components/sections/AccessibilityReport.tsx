import React from 'react';
import { DesignSystem } from '../../types';
import { getContrastRatio, getContrastFeedback, getAccessibleColor } from '../../utils/accessibility';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface AccessibilityReportProps {
  system: DesignSystem;
  activeTheme: string;
}

export const AccessibilityReport: React.FC<AccessibilityReportProps> = ({ system, activeTheme }) => {
  const theme = system.themes[activeTheme];
  const headerColor = getAccessibleColor(theme.textPrimary, theme.background);
  const subHeaderColor = getAccessibleColor(theme.textSecondary, theme.background, '#D1D5DB', '#4B5563');

  const combinations = [
    { bg: theme.primary, text: theme.primaryForeground, name: 'Primary Button' },
    { bg: theme.secondary, text: theme.secondaryForeground, name: 'Secondary Button' },
    { bg: theme.accent, text: theme.accentForeground, name: 'Accent Element' },
    { bg: theme.background, text: theme.textPrimary, name: 'Main Background / Text' },
    { bg: theme.surface, text: theme.textPrimary, name: 'Surface / Text' },
    { bg: theme.surfaceSecondary, text: theme.textSecondary, name: 'Secondary Surface / Text' },
    { bg: theme.muted, text: theme.mutedForeground, name: 'Muted Element' },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-medium tracking-tight mb-4" style={{ color: headerColor }}>
          Accessibility Report
        </h2>
        <p className="max-w-2xl" style={{ color: subHeaderColor }}>
          Automated color contrast checks based on WCAG 2.1 guidelines. Ensuring sufficient contrast makes your application accessible to users with visual impairments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinations.map((combo, idx) => {
          const ratio = getContrastRatio(combo.bg, combo.text);
          const feedback = getContrastFeedback(ratio);
          const largeFeedback = getContrastFeedback(ratio, true);

          return (
            <div key={idx} className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
              <div 
                className="h-32 p-6 flex items-center justify-center flex-col gap-2"
                style={{ background: combo.bg, color: combo.text }}
              >
                <span className="text-xl font-medium">Aa</span>
                <span className="text-sm opacity-80">{combo.name}</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm" style={{ color: theme.textSecondary }}>Contrast Ratio</span>
                  <span className="text-xl font-mono font-medium" style={{ color: theme.textPrimary }}>
                    {ratio.toFixed(2)}:1
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>Normal Text (AA)</span>
                    <div className="flex items-center gap-1.5">
                      {feedback.pass ? (
                        <><CheckCircle2 size={16} className="text-green-500" /><span className="text-green-600 dark:text-green-400 font-medium">Pass</span></>
                      ) : (
                        <><XCircle size={16} className="text-red-500" /><span className="text-red-600 dark:text-red-400 font-medium">Fail</span></>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>Large Text (AA)</span>
                    <div className="flex items-center gap-1.5">
                      {largeFeedback.pass ? (
                        <><CheckCircle2 size={16} className="text-green-500" /><span className="text-green-600 dark:text-green-400 font-medium">Pass</span></>
                      ) : (
                        <><XCircle size={16} className="text-red-500" /><span className="text-red-600 dark:text-red-400 font-medium">Fail</span></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
