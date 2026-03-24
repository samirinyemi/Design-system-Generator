import React from 'react';

export const ValueUnitInput = ({ 
  value, 
  onChange, 
  units, 
  theme, 
  step = 1,
  allowNegative = false
}: { 
  value: string, 
  onChange: (val: string) => void, 
  units: string[], 
  theme: any,
  step?: number,
  allowNegative?: boolean
}) => {
  const isNormal = value === 'normal';
  
  const parse = (v: string) => {
    if (v === 'normal') return { num: 0, unit: units[0] };
    const match = v.match(/^(-?[\d.]+)([a-zA-Z%]*)$/);
    if (match) return { num: parseFloat(match[1]), unit: match[2] || units[0] };
    return { num: parseFloat(v) || 0, unit: units[0] };
  };

  const { num, unit } = parse(value);

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(`0${unit === 'none' ? '' : unit}`);
      return;
    }
    const newNum = parseFloat(val);
    if (isNaN(newNum)) return;
    onChange(`${newNum}${unit === 'none' ? '' : unit}`);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (newUnit === 'none') {
      onChange(`${num}`);
      return;
    }
    
    let newNum = num;
    if (unit === 'rem' && newUnit === 'px') newNum = Math.round(num * 16);
    else if (unit === 'px' && newUnit === 'rem') newNum = Number((num / 16).toFixed(3));
    else if (unit === 'em' && newUnit === 'px') newNum = Math.round(num * 16);
    else if (unit === 'px' && newUnit === 'em') newNum = Number((num / 16).toFixed(3));
    else if (unit === 'none' && newUnit === 'px') newNum = Math.round(num * 16);
    else if (unit === 'none' && newUnit === 'rem') newNum = Number((num).toFixed(3));
    
    onChange(newUnit === 'none' ? `${newNum}` : `${newNum}${newUnit}`);
  };

  return (
    <div className="flex border rounded overflow-hidden focus-within:ring-1" style={{ borderColor: theme.borderSubtle, background: theme.surfaceSecondary }}>
      <input 
        type="number" 
        value={isNormal ? 0 : num}
        onChange={handleNumChange}
        step={step}
        min={allowNegative ? undefined : 0}
        className="w-full p-1.5 text-xs outline-none bg-transparent"
        style={{ color: theme.textPrimary }}
      />
      <select 
        value={isNormal ? units[0] : (unit || 'none')}
        onChange={handleUnitChange}
        className="p-1.5 text-xs outline-none border-l bg-transparent cursor-pointer"
        style={{ color: theme.textSecondary, borderColor: theme.borderSubtle }}
      >
        {units.map(u => <option key={u} value={u}>{u === 'none' ? '-' : u}</option>)}
      </select>
    </div>
  );
};
