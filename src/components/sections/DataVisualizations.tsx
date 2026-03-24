import React from 'react';
import { DesignSystem } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface DataVisualizationsProps {
  system: DesignSystem;
  activeTheme: string;
}

const parseSize = (size: string) => {
  if (size.endsWith('px')) return parseFloat(size);
  if (size.endsWith('rem')) return parseFloat(size) * 16;
  if (size.endsWith('em')) return parseFloat(size) * 16;
  return parseFloat(size) || 16;
};

const CustomTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 border rounded-lg shadow-lg" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
        <p className="font-medium" style={{ color: theme.textPrimary }}>{label}</p>
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          {payload[0].payload.originalSize || payload[0].payload.originalValue} ({payload[0].value}px)
        </p>
      </div>
    );
  }
  return null;
};

export const DataVisualizations: React.FC<DataVisualizationsProps> = ({ system, activeTheme }) => {
  const theme = system.themes[activeTheme];

  const typographyData = system.typography.scale.map(item => ({
    name: item.name,
    size: parseSize(item.size),
    originalSize: item.size
  }));

  const spacingData = system.spacing.scale.map(item => ({
    name: item.name,
    value: parseSize(item.value),
    originalValue: item.value
  }));

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-xl font-medium mb-6" style={{ color: theme.textPrimary }}>Typography Scale Visualization</h3>
        <div className="h-80 w-full p-6 rounded-2xl border" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typographyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderSubtle} vertical={false} />
              <XAxis dataKey="name" stroke={theme.textSecondary} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={theme.textSecondary} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ fill: theme.surfaceSecondary, opacity: 0.5 }} />
              <Bar dataKey="size" radius={[4, 4, 0, 0]}>
                {typographyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.primary} opacity={0.8 + (index / typographyData.length) * 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-6" style={{ color: theme.textPrimary }}>Spacing Scale Visualization</h3>
        <div className="h-80 w-full p-6 rounded-2xl border" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spacingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderSubtle} vertical={false} />
              <XAxis dataKey="name" stroke={theme.textSecondary} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={theme.textSecondary} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ fill: theme.surfaceSecondary, opacity: 0.5 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {spacingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.secondary} opacity={0.8 + (index / spacingData.length) * 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
