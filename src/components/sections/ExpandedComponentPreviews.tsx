import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { DesignSystem } from '../../types';
import { 
  Search, Bell, User, Heart, Star, Check, X, ArrowRight, ChevronDown, 
  Calendar, Clock, Settings, Mail, Phone, MapPin, Link, Image as ImageIcon,
  FileText, Folder, Download, Upload, Trash2, Edit2, Plus, Minus, Info,
  AlertTriangle, Shield, Lock, Unlock, Eye, EyeOff, Menu, MoreVertical,
  MoreHorizontal, Filter, Sliders, Activity, PieChart, BarChart2, TrendingUp,
  CreditCard, DollarSign, ShoppingCart, Tag, Bookmark, Share2, MessageSquare,
  Send, Paperclip, Mic, Video, Camera, Music, Play, Pause, SkipForward, SkipBack
} from 'lucide-react';

interface ComponentPreviewsProps {
  system: DesignSystem;
  activeTheme: string;
}

export const ComponentPreviews: React.FC<ComponentPreviewsProps> = ({ system, activeTheme }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [checkedState, setCheckedState] = useState(true);
  const [radioState, setRadioState] = useState('option1');
  const [toggleState, setToggleState] = useState(true);
  const [sliderValue, setSliderValue] = useState(75);
  const [selectedDate, setSelectedDate] = useState(8);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const theme = system.themes[activeTheme];

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

  // Helper to generate a consistent hover animation style
  const getHoverStyle = (id: string, baseStyle: React.CSSProperties) => {
    const isHovered = hoveredId === id;
    return {
      ...baseStyle,
      transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
      boxShadow: isHovered ? getShadow('lg') : baseStyle.boxShadow || getShadow('sm'),
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      cursor: 'pointer'
    };
  };

  // Generate 100+ components grouped by category
  return (
    <section ref={sectionRef} className="w-full">
      <div className="mb-12">
        <h3 
          className="text-4xl font-bold tracking-tight mb-4"
          style={{ fontFamily: getFont('display'), color: theme.textPrimary }}
        >
          100+ Design Components
        </h3>
        <p style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>
          A comprehensive library of UI elements generated from your design system. Hover to interact.
        </p>
      </div>

      <div className="space-y-16">
        
        {/* 1. Buttons (20 variations) */}
        <div className="glass-panel rounded-3xl p-8 shadow-sm border" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
          <h4 className="text-lg font-medium mb-8" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>1-20: Buttons & Actions</h4>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Primary Variations */}
            {['sm', 'md', 'lg'].map((size, i) => (
              <button key={`btn-pri-${size}`}
                onMouseEnter={() => setHoveredId(`btn-pri-${size}`)}
                onMouseLeave={() => setHoveredId(null)}
                className={`font-medium flex items-center gap-2 ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-5 py-2.5' : 'px-8 py-4 text-lg'}`}
                style={getHoverStyle(`btn-pri-${size}`, { background: theme.primary, color: theme.primaryForeground, borderRadius: getRadius('md'), fontFamily: getFont('body') })}
              >
                Primary {size.toUpperCase()}
              </button>
            ))}
            {/* Secondary Variations */}
            {['sm', 'md', 'lg'].map((size, i) => (
              <button key={`btn-sec-${size}`}
                onMouseEnter={() => setHoveredId(`btn-sec-${size}`)}
                onMouseLeave={() => setHoveredId(null)}
                className={`font-medium flex items-center gap-2 ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-5 py-2.5' : 'px-8 py-4 text-lg'}`}
                style={getHoverStyle(`btn-sec-${size}`, { background: theme.secondary, color: theme.secondaryForeground, borderRadius: getRadius('md'), fontFamily: getFont('body') })}
              >
                Secondary {size.toUpperCase()}
              </button>
            ))}
            {/* Outline Variations */}
            {['sm', 'md', 'lg'].map((size, i) => (
              <button key={`btn-out-${size}`}
                onMouseEnter={() => setHoveredId(`btn-out-${size}`)}
                onMouseLeave={() => setHoveredId(null)}
                className={`font-medium flex items-center gap-2 ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-5 py-2.5' : 'px-8 py-4 text-lg'}`}
                style={getHoverStyle(`btn-out-${size}`, { background: 'transparent', color: theme.primary, border: `1px solid ${theme.primary}`, borderRadius: getRadius('md'), fontFamily: getFont('body') })}
              >
                Outline {size.toUpperCase()}
              </button>
            ))}
            {/* Ghost Variations */}
            {['sm', 'md', 'lg'].map((size, i) => (
              <button key={`btn-gho-${size}`}
                onMouseEnter={() => setHoveredId(`btn-gho-${size}`)}
                onMouseLeave={() => setHoveredId(null)}
                className={`font-medium flex items-center gap-2 ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-5 py-2.5' : 'px-8 py-4 text-lg'}`}
                style={getHoverStyle(`btn-gho-${size}`, { background: hoveredId === `btn-gho-${size}` ? theme.surfaceSecondary : 'transparent', color: theme.textPrimary, borderRadius: getRadius('md'), fontFamily: getFont('body'), boxShadow: 'none' })}
              >
                Ghost {size.toUpperCase()}
              </button>
            ))}
            {/* Icon Buttons */}
            {[Search, Bell, Settings, Mail].map((Icon, i) => (
              <button key={`btn-icon-${i}`}
                onMouseEnter={() => setHoveredId(`btn-icon-${i}`)}
                onMouseLeave={() => setHoveredId(null)}
                className="p-3 font-medium flex items-center justify-center"
                style={getHoverStyle(`btn-icon-${i}`, { background: theme.surfaceSecondary, color: theme.textPrimary, borderRadius: getRadius('full') })}
              >
                <Icon size={20} />
              </button>
            ))}
            {/* Buttons with Icons */}
            <button onMouseEnter={() => setHoveredId('btn-icon-left')} onMouseLeave={() => setHoveredId(null)} className="px-5 py-2.5 font-medium flex items-center gap-2" style={getHoverStyle('btn-icon-left', { background: theme.primary, color: theme.primaryForeground, borderRadius: getRadius('md'), fontFamily: getFont('body') })}>
              <Download size={18} /> Download
            </button>
            <button onMouseEnter={() => setHoveredId('btn-icon-right')} onMouseLeave={() => setHoveredId(null)} className="px-5 py-2.5 font-medium flex items-center gap-2" style={getHoverStyle('btn-icon-right', { background: theme.primary, color: theme.primaryForeground, borderRadius: getRadius('md'), fontFamily: getFont('body') })}>
              Continue <ArrowRight size={18} />
            </button>
            {/* Danger/Success */}
            <button onMouseEnter={() => setHoveredId('btn-danger')} onMouseLeave={() => setHoveredId(null)} className="px-5 py-2.5 font-medium flex items-center gap-2" style={getHoverStyle('btn-danger', { background: system.colors?.error?.hex || '#DC3545', color: '#fff', borderRadius: getRadius('md'), fontFamily: getFont('body') })}>
              <Trash2 size={18} /> Delete
            </button>
            <button onMouseEnter={() => setHoveredId('btn-success')} onMouseLeave={() => setHoveredId(null)} className="px-5 py-2.5 font-medium flex items-center gap-2" style={getHoverStyle('btn-success', { background: system.colors?.success?.hex || '#28A745', color: '#fff', borderRadius: getRadius('md'), fontFamily: getFont('body') })}>
              <Check size={18} /> Save
            </button>
          </div>
        </div>

        {/* 2. Inputs & Forms (20 variations) */}
        <div className="glass-panel rounded-3xl p-8 shadow-sm border" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
          <h4 className="text-lg font-medium mb-8" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>21-40: Inputs & Form Controls</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Text Inputs */}
            {['Default', 'Filled', 'Outlined'].map((variant, i) => (
              <div key={`input-${variant}`} className="flex flex-col gap-2" onMouseEnter={() => setHoveredId(`input-${variant}`)} onMouseLeave={() => setHoveredId(null)}>
                <label className="text-sm font-medium" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>{variant} Input</label>
                <input type="text" placeholder="Type here..." className="px-4 py-3 outline-none"
                  style={getHoverStyle(`input-${variant}`, { 
                    background: variant === 'Filled' ? theme.surfaceSecondary : 'transparent', 
                    color: theme.textPrimary, 
                    border: `1px solid ${variant === 'Outlined' ? theme.border : theme.borderSubtle}`,
                    borderRadius: getRadius('md'), fontFamily: getFont('body'), boxShadow: 'none'
                  })}
                />
              </div>
            ))}
            {/* Inputs with Icons */}
            <div className="flex flex-col gap-2" onMouseEnter={() => setHoveredId('input-icon-left')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Search Input</label>
              <div className="relative" style={getHoverStyle('input-icon-left', { borderRadius: getRadius('md'), boxShadow: 'none' })}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" size={18} style={{ color: theme.textPrimary }} />
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-3 outline-none" style={{ background: theme.surfaceSecondary, color: theme.textPrimary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('md'), fontFamily: getFont('body') }} />
              </div>
            </div>
            {/* Select/Dropdown */}
            <div className="flex flex-col gap-2" onMouseEnter={() => setHoveredId('select-default')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Select Dropdown</label>
              <div className="relative" style={getHoverStyle('select-default', { borderRadius: getRadius('md'), boxShadow: 'none' })}>
                <select className="w-full appearance-none px-4 py-3 outline-none" style={{ background: theme.surfaceSecondary, color: theme.textPrimary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('md'), fontFamily: getFont('body') }}>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 pointer-events-none" size={18} style={{ color: theme.textPrimary }} />
              </div>
            </div>
            {/* Textarea */}
            <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1" onMouseEnter={() => setHoveredId('textarea')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Textarea</label>
              <textarea placeholder="Write a message..." rows={3} className="px-4 py-3 outline-none resize-none" style={getHoverStyle('textarea', { background: theme.surfaceSecondary, color: theme.textPrimary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('md'), fontFamily: getFont('body'), boxShadow: 'none' })} />
            </div>
            
            {/* Checkboxes & Radios */}
            <div className="flex flex-col gap-4 justify-center" onMouseEnter={() => setHoveredId('checkboxes')} onMouseLeave={() => setHoveredId(null)}>
              <label 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setCheckedState(prev => !prev)}
              >
                <div 
                  className="w-5 h-5 flex items-center justify-center transition-colors" 
                  style={{ 
                    background: checkedState ? theme.primary : 'transparent', 
                    borderColor: checkedState ? theme.primary : theme.border,
                    borderWidth: checkedState ? '0' : '1px',
                    borderRadius: '4px' 
                  }}
                >
                  {checkedState && <Check size={14} color={theme.primaryForeground} />}
                </div>
                <span style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Interactive Checkbox</span>
              </label>
            </div>
            <div className="flex flex-col gap-4 justify-center" onMouseEnter={() => setHoveredId('radios')} onMouseLeave={() => setHoveredId(null)}>
              <label 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setRadioState('option1')}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors" style={{ borderColor: radioState === 'option1' ? theme.primary : theme.border }}>
                  {radioState === 'option1' && <div className="w-2.5 h-2.5 rounded-full" style={{ background: theme.primary }}></div>}
                </div>
                <span style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Radio Option 1</span>
              </label>
              <label 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setRadioState('option2')}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors" style={{ borderColor: radioState === 'option2' ? theme.primary : theme.border }}>
                  {radioState === 'option2' && <div className="w-2.5 h-2.5 rounded-full" style={{ background: theme.primary }}></div>}
                </div>
                <span style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Radio Option 2</span>
              </label>
            </div>
            {/* Toggles */}
            <div className="flex flex-col gap-4 justify-center" onMouseEnter={() => setHoveredId('toggles')} onMouseLeave={() => setHoveredId(null)}>
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setToggleState(prev => !prev)}
              >
                <div className="w-12 h-6 rounded-full relative transition-colors duration-300" style={{ background: toggleState ? theme.primary : theme.borderSubtle }}>
                  <div 
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300" 
                    style={{ left: toggleState ? 'calc(100% - 20px)' : '4px' }}
                  />
                </div>
                <span style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Interactive Toggle</span>
              </div>
            </div>
            {/* Slider */}
            <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-3" onMouseEnter={() => setHoveredId('slider')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium flex justify-between" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>
                <span>Volume</span><span>{sliderValue}%</span>
              </label>
              <div 
                className="w-full h-2 rounded-full relative mt-2 cursor-pointer" 
                style={{ background: theme.surfaceSecondary }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = Math.round((x / rect.width) * 100);
                  setSliderValue(Math.max(0, Math.min(100, percentage)));
                }}
              >
                <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-150" style={{ background: theme.primary, width: `${sliderValue}%` }}></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full shadow-md cursor-grab active:cursor-grabbing transition-all duration-150" style={{ background: '#fff', border: `2px solid ${theme.primary}`, left: `${sliderValue}%`, marginLeft: '-10px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Cards & Containers (20 variations) */}
        <div className="glass-panel rounded-3xl p-8 shadow-sm border" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
          <h4 className="text-lg font-medium mb-8" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>41-60: Cards & Containers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div onMouseEnter={() => setHoveredId('card-basic')} onMouseLeave={() => setHoveredId(null)} className="p-6 flex flex-col" style={getHoverStyle('card-basic', { background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('lg') })}>
              <h5 className="text-lg font-bold mb-2" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Article Title</h5>
              <p className="text-sm mb-4 flex-grow" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>A brief description of the article content goes here to show text wrapping.</p>
              <button className="text-sm font-medium self-start" style={{ color: theme.primary, fontFamily: getFont('body') }}>Read more</button>
            </div>
            {/* Image Card */}
            <div onMouseEnter={() => setHoveredId('card-image')} onMouseLeave={() => setHoveredId(null)} className="flex flex-col overflow-hidden" style={getHoverStyle('card-image', { background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('lg') })}>
              <div className="h-32 bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/card1/400/200)' }} />
              <div className="p-4">
                <h5 className="font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Mountain View</h5>
                <p className="text-xs" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Nature photography</p>
              </div>
            </div>
            {/* Profile Card */}
            <div onMouseEnter={() => setHoveredId('card-profile')} onMouseLeave={() => setHoveredId(null)} className="p-6 flex items-center gap-4" style={getHoverStyle('card-profile', { background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('lg') })}>
              <div className="w-16 h-16 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/avatar2/100/100)' }} />
              <div>
                <h5 className="font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Alex Johnson</h5>
                <p className="text-sm mb-2" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Software Engineer</p>
                <div className="flex gap-2"><button className="p-1.5 rounded-full" style={{ background: String(theme.primary).includes('gradient')  ? theme.primary  : (String(theme.primary).includes('gradient') ? theme.primary : theme.primary + '20'), color: theme.primary }}><Mail size={14}/></button><button className="p-1.5 rounded-full" style={{ background: String(theme.primary).includes('gradient')  ? theme.primary  : (String(theme.primary).includes('gradient') ? theme.primary : theme.primary + '20'), color: theme.primary }}><Phone size={14}/></button></div>
              </div>
            </div>
            {/* Stat Card 1 */}
            <div onMouseEnter={() => setHoveredId('card-stat1')} onMouseLeave={() => setHoveredId(null)} className="p-6 flex flex-col justify-between" style={getHoverStyle('card-stat1', { background: theme.primary, color: theme.primaryForeground, borderRadius: getRadius('lg') })}>
              <div className="flex justify-between items-start mb-4"><Activity size={24} /><span className="px-2 py-1 text-xs font-medium bg-white/20 rounded-md">+5.2%</span></div>
              <div><p className="text-sm mb-1 opacity-80" style={{ fontFamily: getFont('body') }}>Active Users</p><h5 className="text-3xl font-bold" style={{ fontFamily: getFont('display') }}>12,450</h5></div>
            </div>
            {/* Stat Card 2 */}
            <div onMouseEnter={() => setHoveredId('card-stat2')} onMouseLeave={() => setHoveredId(null)} className="p-6 flex flex-col justify-between" style={getHoverStyle('card-stat2', { background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('lg') })}>
              <div className="flex justify-between items-start mb-4"><div className="p-2 rounded-lg" style={{ background: String(system.colors?.warning?.hex || '').includes('gradient') ? system.colors?.warning?.hex : (system.colors?.warning?.hex + '20'), color: system.colors?.warning?.hex }}><DollarSign size={20} /></div></div>
              <div><p className="text-sm mb-1" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Monthly MRR</p><h5 className="text-3xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>$84,200</h5></div>
            </div>
            {/* Calendar Widget */}
            <div onMouseEnter={() => setHoveredId('card-calendar')} onMouseLeave={() => setHoveredId(null)} className="p-6" style={getHoverStyle('card-calendar', { background: theme.surfaceSecondary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('lg') })}>
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>October 2026</h5>
                <div className="flex gap-1"><ChevronDown className="rotate-90 cursor-pointer" size={16} color={theme.textSecondary}/><ChevronDown className="-rotate-90 cursor-pointer" size={16} color={theme.textSecondary}/></div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>
                {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>
                {[...Array(14)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`p-1 rounded-full cursor-pointer transition-colors ${selectedDate === i ? 'font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5'}`} 
                    style={selectedDate === i ? { background: theme.primary, color: theme.primaryForeground } : {}}
                    onClick={() => setSelectedDate(i)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Navigation & Lists (20 variations) */}
        <div className="glass-panel rounded-3xl p-8 shadow-sm border" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
          <h4 className="text-lg font-medium mb-8" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>61-80: Navigation & Lists</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tabs */}
            <div className="flex flex-col gap-4" onMouseEnter={() => setHoveredId('tabs')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Tabs</label>
              <div className="flex border-b" style={{ borderColor: theme.borderSubtle, fontFamily: getFont('body') }}>
                <button className="px-4 py-2 font-medium border-b-2" style={{ borderColor: theme.primary, color: theme.primary }}>Overview</button>
                <button className="px-4 py-2 font-medium border-b-2 border-transparent" style={{ color: theme.textSecondary }}>Settings</button>
                <button className="px-4 py-2 font-medium border-b-2 border-transparent" style={{ color: theme.textSecondary }}>Billing</button>
              </div>
            </div>
            {/* Breadcrumbs */}
            <div className="flex flex-col gap-4" onMouseEnter={() => setHoveredId('breadcrumbs')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Breadcrumbs</label>
              <div className="flex items-center gap-2 text-sm" style={{ fontFamily: getFont('body') }}>
                <span style={{ color: theme.textSecondary }}>Home</span>
                <ChevronDown className="-rotate-90" size={14} color={theme.textSecondary} />
                <span style={{ color: theme.textSecondary }}>Products</span>
                <ChevronDown className="-rotate-90" size={14} color={theme.textSecondary} />
                <span className="font-medium" style={{ color: theme.textPrimary }}>Shoes</span>
              </div>
            </div>
            {/* Pagination */}
            <div className="flex flex-col gap-4" onMouseEnter={() => setHoveredId('pagination')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Pagination</label>
              <div className="flex items-center gap-2" style={{ fontFamily: getFont('body') }}>
                <button className="p-2 rounded-md border" style={{ borderColor: theme.borderSubtle, color: theme.textSecondary }}><ChevronDown className="rotate-90" size={16} /></button>
                <button className="w-8 h-8 rounded-md flex items-center justify-center font-medium" style={{ background: theme.primary, color: theme.primaryForeground }}>1</button>
                <button className="w-8 h-8 rounded-md flex items-center justify-center font-medium hover:bg-black/5 dark:hover:bg-white/5" style={{ color: theme.textPrimary }}>2</button>
                <button className="w-8 h-8 rounded-md flex items-center justify-center font-medium hover:bg-black/5 dark:hover:bg-white/5" style={{ color: theme.textPrimary }}>3</button>
                <span style={{ color: theme.textSecondary }}>...</span>
                <button className="p-2 rounded-md border" style={{ borderColor: theme.borderSubtle, color: theme.textSecondary }}><ChevronDown className="-rotate-90" size={16} /></button>
              </div>
            </div>
            {/* Steps */}
            <div className="flex flex-col gap-4" onMouseEnter={() => setHoveredId('steps')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Steps</label>
              <div className="flex items-center gap-4" style={{ fontFamily: getFont('body') }}>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: theme.primary, color: theme.primaryForeground }}><Check size={12}/></div><span className="text-sm font-medium" style={{ color: theme.textPrimary }}>Cart</span></div>
                <div className="h-px w-8" style={{ background: theme.primary }}></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: theme.primary, color: theme.primaryForeground }}>2</div><span className="text-sm font-medium" style={{ color: theme.textPrimary }}>Payment</span></div>
                <div className="h-px w-8" style={{ background: theme.borderSubtle }}></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-xs border" style={{ borderColor: theme.borderSubtle, color: theme.textSecondary }}>3</div><span className="text-sm" style={{ color: theme.textSecondary }}>Done</span></div>
              </div>
            </div>
            {/* List Group */}
            <div className="flex flex-col md:col-span-2" onMouseEnter={() => setHoveredId('list-group')} onMouseLeave={() => setHoveredId(null)}>
              <label className="text-sm font-medium mb-4" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>List Group</label>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: theme.borderSubtle, fontFamily: getFont('body') }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors" style={{ borderColor: theme.borderSubtle, background: theme.surfaceSecondary }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/list${i}/100/100)` }} />
                      <div><p className="font-medium text-sm" style={{ color: theme.textPrimary }}>List Item {i}</p><p className="text-xs" style={{ color: theme.textSecondary }}>Description text</p></div>
                    </div>
                    <button style={{ color: theme.textSecondary }}><MoreVertical size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Feedback & Overlays (20 variations) */}
        <div className="glass-panel rounded-3xl p-8 shadow-sm border" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
          <h4 className="text-lg font-medium mb-8" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>81-100+: Feedback & Overlays</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Alerts */}
            <div className="flex flex-col gap-4">
              {['info', 'success', 'warning', 'error'].map((type, i) => {
                const colors = {
                  info: system.colors?.info?.hex || '#17A2B8',
                  success: system.colors?.success?.hex || '#28A745',
                  warning: system.colors?.warning?.hex || '#FFC107',
                  error: system.colors?.error?.hex || '#DC3545'
                };
                const color = colors[type as keyof typeof colors];
                const Icon = type === 'success' ? Check : type === 'warning' ? AlertTriangle : type === 'error' ? X : Info;
                return (
                  <div key={type} onMouseEnter={() => setHoveredId(`alert-${type}`)} onMouseLeave={() => setHoveredId(null)} className="p-4 flex items-start gap-3" style={getHoverStyle(`alert-${type}`, { background: String(color).includes('gradient')  ? color  : (String(color).includes('gradient') ? color : color + '15'), borderLeft: `4px solid ${color}`, borderRadius: getRadius('md'), fontFamily: getFont('body') })}>
                    <Icon size={20} color={color} className="mt-0.5" />
                    <div>
                      <h6 className="font-medium text-sm" style={{ color: theme.textPrimary }}>{type.charAt(0).toUpperCase() + type.slice(1)} Message</h6>
                      <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>This is a descriptive message for the alert.</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col gap-8">
              {/* Tooltip */}
              <div className="flex flex-col gap-4 items-start" onMouseEnter={() => setHoveredId('tooltip')} onMouseLeave={() => setHoveredId(null)}>
                <label className="text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Tooltip</label>
                <div className="relative inline-block">
                  <button className="px-4 py-2 rounded-md font-medium" style={{ background: theme.surfaceSecondary, color: theme.textPrimary, border: `1px solid ${theme.borderSubtle}`, fontFamily: getFont('body') }}>Hover me</button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs rounded-md whitespace-nowrap opacity-100 transition-opacity" style={{ background: theme.textPrimary, color: theme.surface, fontFamily: getFont('body'), zIndex: 10 }}>
                    Tooltip text here
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: theme.textPrimary }}></div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-2" onMouseEnter={() => setHoveredId('progress')} onMouseLeave={() => setHoveredId(null)}>
                <label className="text-sm font-medium flex justify-between" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>
                  <span>Uploading...</span><span>45%</span>
                </label>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: theme.surfaceSecondary }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ background: theme.primary, width: '45%' }}></div>
                </div>
              </div>

              {/* Skeleton Loader */}
              <div className="flex flex-col gap-4" onMouseEnter={() => setHoveredId('skeleton')} onMouseLeave={() => setHoveredId(null)}>
                <label className="text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Skeleton Loader</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full animate-pulse" style={{ background: theme.surfaceSecondary }}></div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: theme.surfaceSecondary }}></div>
                    <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: theme.surfaceSecondary }}></div>
                  </div>
                </div>
              </div>
              
              {/* Badges */}
              <div className="flex flex-col gap-4" onMouseEnter={() => setHoveredId('badges-more')} onMouseLeave={() => setHoveredId(null)}>
                <label className="text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>More Badges</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full border" style={{ borderColor: theme.primary, color: theme.primary, fontFamily: getFont('body') }}>Outline</span>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center gap-1" style={{ background: theme.surfaceSecondary, color: theme.textPrimary, fontFamily: getFont('body') }}><Star size={10}/> With Icon</span>
                  <div className="relative inline-block">
                    <button className="p-2 rounded-md" style={{ background: theme.surfaceSecondary, color: theme.textPrimary }}><Bell size={18}/></button>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: system.colors?.error?.hex || '#DC3545' }}>3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
