import React, { useState } from 'react';
import { Home, Search, Bell, User, Heart, Settings, Star, Play, Pause, SkipForward, SkipBack, MessageCircle, Phone, Video, Camera, MoreHorizontal, ShoppingCart, CreditCard, Activity, Calendar, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export const MobilePreviews = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const variations = 5;

  const next = () => setActiveIndex((prev) => (prev + 1) % variations);
  const prev = () => setActiveIndex((prev) => (prev - 1 + variations) % variations);

  const renderVariation = () => {
    switch (activeIndex) {
      case 0: return <FinanceApp {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 1: return <FitnessApp {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 2: return <SocialApp {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 3: return <EcommerceApp {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 4: return <MusicApp {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      default: return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-sm mb-6">
        <h4 className="text-lg font-medium" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>
          Layout {activeIndex + 1} of {variations}
        </h4>
        <div className="flex gap-3">
          <button 
            onClick={prev} 
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" 
            style={{ background: theme.surface, color: theme.textPrimary, border: `1px solid ${theme.borderSubtle}` }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button 
            onClick={next} 
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" 
            style={{ background: theme.surface, color: theme.textPrimary, border: `1px solid ${theme.borderSubtle}` }}
          >
            Next Layout
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      {renderVariation()}
    </div>
  );
};

// Variation 1: Finance App (Original)
const FinanceApp = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-[320px] h-[650px] rounded-[40px] overflow-hidden flex flex-col relative border-[8px] transition-colors duration-500" style={{ background: theme.background, borderColor: '#111', boxShadow: getShadow('2xl') }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-20" />
    <div className="pt-12 pb-4 px-6 flex justify-between items-center z-10">
      <div className="flex flex-col">
        <span className="text-xs opacity-70" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>Good morning,</span>
        <span className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Alex</span>
      </div>
      <div className="w-10 h-10 rounded-full bg-cover bg-center cursor-pointer hover:scale-105 transition-transform" style={{ backgroundImage: 'url(https://picsum.photos/seed/avatar/100/100)' }} />
    </div>
    <div className="flex-grow px-6 overflow-y-auto pb-24 no-scrollbar">
      <div className="w-full p-6 mb-6 relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" style={{ background: primary, borderRadius: getRadius('xl'), color: theme.primaryForeground, boxShadow: getShadow('md') }}>
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white opacity-10" />
        <p className="text-sm opacity-80 mb-1" style={{ fontFamily: getFont('body') }}>Total Balance</p>
        <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: getFont('display') }}>$12,450.00</h2>
        <div className="flex gap-3">
          <button className="flex-1 py-2 text-sm font-medium bg-white text-black rounded-lg hover:opacity-90 transition-opacity" style={{ borderRadius: getRadius('sm') }}>Send</button>
          <button className="flex-1 py-2 text-sm font-medium bg-black/20 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ borderRadius: getRadius('sm') }}>Receive</button>
        </div>
      </div>
      <div className="flex justify-between mb-8">
        <MobileAction icon={<Search size={20} />} label="Search" theme={theme} getRadius={getRadius} getFont={getFont} />
        <MobileAction icon={<CreditCard size={20} />} label="Cards" theme={theme} getRadius={getRadius} getFont={getFont} />
        <MobileAction icon={<Activity size={20} />} label="Stats" theme={theme} getRadius={getRadius} getFont={getFont} />
        <MobileAction icon={<Settings size={20} />} label="More" theme={theme} getRadius={getRadius} getFont={getFont} />
      </div>
      <h3 className="text-lg font-bold mb-4" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Recent</h3>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center p-4 transition-colors duration-500 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" style={{ background: theme.surface, borderRadius: getRadius('lg'), border: `1px solid ${theme.borderSubtle}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ background: theme.surfaceSecondary }}><Star size={16} style={{ color: theme.textSecondary }} /></div>
            <div className="flex-grow">
              <p className="text-sm font-medium" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Item {i}</p>
              <p className="text-xs" style={{ color: theme.textTertiary, fontFamily: getFont('body') }}>Description here</p>
            </div>
            <span className="text-sm font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('mono') }}>${i * 15}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-20 px-6 flex justify-between items-center border-t transition-colors duration-500 z-10" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <Home size={24} style={{ color: primary }} className="cursor-pointer hover:scale-110 transition-transform" />
      <Search size={24} style={{ color: theme.textSecondary }} className="cursor-pointer hover:scale-110 transition-transform" />
      <Bell size={24} style={{ color: theme.textSecondary }} className="cursor-pointer hover:scale-110 transition-transform" />
      <User size={24} style={{ color: theme.textSecondary }} className="cursor-pointer hover:scale-110 transition-transform" />
    </div>
  </div>
)};

// Variation 2: Fitness App
const FitnessApp = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-[320px] h-[650px] rounded-[40px] overflow-hidden flex flex-col relative border-[8px] transition-colors duration-500" style={{ background: theme.surfaceSecondary, borderColor: '#111', boxShadow: getShadow('2xl') }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-20" />
    <div className="pt-12 pb-4 px-6 flex justify-between items-center z-10">
      <h1 className="text-2xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Activity</h1>
      <Calendar size={24} style={{ color: theme.textPrimary }} className="cursor-pointer" />
    </div>
    <div className="flex-grow px-6 overflow-y-auto pb-24 no-scrollbar">
      <div className="w-full flex justify-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="80" fill="none" stroke={theme.surface} strokeWidth="16" />
            <circle cx="96" cy="96" r="80" fill="none" stroke={primary} strokeWidth="16" strokeDasharray="502" strokeDashoffset="120" strokeLinecap="round" />
            <circle cx="96" cy="96" r="60" fill="none" stroke={theme.surface} strokeWidth="16" />
            <circle cx="96" cy="96" r="60" fill="none" stroke={secondary} strokeWidth="16" strokeDasharray="377" strokeDashoffset="150" strokeLinecap="round" />
            <circle cx="96" cy="96" r="40" fill="none" stroke={theme.surface} strokeWidth="16" />
            <circle cx="96" cy="96" r="40" fill="none" stroke={accent} strokeWidth="16" strokeDasharray="251" strokeDashoffset="50" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
          <Activity size={24} style={{ color: primary }} className="mb-2" />
          <span className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>450</span>
          <span className="text-xs opacity-70" style={{ color: theme.textSecondary }}>Calories</span>
        </div>
        <div className="p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
          <Clock size={24} style={{ color: secondary }} className="mb-2" />
          <span className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>45m</span>
          <span className="text-xs opacity-70" style={{ color: theme.textSecondary }}>Time</span>
        </div>
      </div>
      <h3 className="text-lg font-bold mb-4" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Workouts</h3>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center p-4 rounded-2xl cursor-pointer hover:-translate-y-1 transition-transform" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/workout${i}/100/100)` }} />
            <div className="flex-grow">
              <p className="text-sm font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>Morning Run</p>
              <p className="text-xs" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>5.2 km • 32 min</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-20 px-8 flex justify-between items-center border-t transition-colors duration-500 z-10" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <Home size={24} style={{ color: theme.textSecondary }} className="cursor-pointer" />
      <Activity size={24} style={{ color: primary }} className="cursor-pointer" />
      <User size={24} style={{ color: theme.textSecondary }} className="cursor-pointer" />
    </div>
  </div>
)};

// Variation 3: Social App
const SocialApp = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-[320px] h-[650px] rounded-[40px] overflow-hidden flex flex-col relative border-[8px] transition-colors duration-500" style={{ background: theme.background, borderColor: '#111', boxShadow: getShadow('2xl') }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-20" />
    <div className="pt-12 pb-2 px-4 flex justify-between items-center z-10 border-b" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
      <Camera size={24} style={{ color: theme.textPrimary }} className="cursor-pointer" />
      <span className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>{system.brandName || 'Social'}</span>
      <MessageCircle size={24} style={{ color: theme.textPrimary }} className="cursor-pointer" />
    </div>
    <div className="flex-grow overflow-y-auto no-scrollbar">
      <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar border-b" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 p-0.5" style={{ borderColor: theme.borderSubtle }}>
            <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/me/100/100)' }} />
          </div>
          <span className="text-[10px]" style={{ color: theme.textSecondary }}>Your Story</span>
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-16 h-16 rounded-full border-2 p-0.5" style={{ borderColor: primary }}>
              <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/user${i}/100/100)` }} />
            </div>
            <span className="text-[10px] font-medium" style={{ color: theme.textPrimary }}>User {i}</span>
          </div>
        ))}
      </div>
      {[1,2].map(i => (
        <div key={i} className="mb-4" style={{ background: theme.surface }}>
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/user${i}/100/100)` }} />
              <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>User {i}</span>
            </div>
            <MoreHorizontal size={20} style={{ color: theme.textSecondary }} className="cursor-pointer" />
          </div>
          <div className="w-full aspect-square bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/post${i}/400/400)` }} />
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-4">
                <Heart size={24} style={{ color: theme.textPrimary }} className="cursor-pointer hover:text-red-500 transition-colors" />
                <MessageCircle size={24} style={{ color: theme.textPrimary }} className="cursor-pointer" />
              </div>
              <Bookmark size={24} style={{ color: theme.textPrimary }} className="cursor-pointer" />
            </div>
            <p className="text-sm font-bold mb-1" style={{ color: theme.textPrimary }}>1,234 likes</p>
            <p className="text-sm" style={{ color: theme.textPrimary }}><span className="font-bold mr-2">User {i}</span>Beautiful day! ☀️</p>
          </div>
        </div>
      ))}
    </div>
    <div className="h-16 px-6 flex justify-between items-center border-t transition-colors duration-500 z-10" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <Home size={24} style={{ color: primary }} className="cursor-pointer" />
      <Search size={24} style={{ color: theme.textSecondary }} className="cursor-pointer" />
      <div className="w-8 h-8 rounded-full bg-cover bg-center cursor-pointer" style={{ backgroundImage: 'url(https://picsum.photos/seed/me/100/100)' }} />
    </div>
  </div>
)};

// Variation 4: E-commerce App
const EcommerceApp = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-[320px] h-[650px] rounded-[40px] overflow-hidden flex flex-col relative border-[8px] transition-colors duration-500" style={{ background: theme.surfaceSecondary, borderColor: '#111', boxShadow: getShadow('2xl') }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-20" />
    <div className="pt-12 pb-4 px-6 flex justify-between items-center z-10">
      <Menu size={24} style={{ color: theme.textPrimary }} className="cursor-pointer" />
      <span className="text-xl font-bold uppercase tracking-widest" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>{system.brandName || 'SHOP'}</span>
      <ShoppingCart size={24} style={{ color: theme.textPrimary }} className="cursor-pointer" />
    </div>
    <div className="flex-grow px-6 overflow-y-auto pb-24 no-scrollbar">
      <div className="w-full h-48 rounded-2xl mb-6 bg-cover bg-center flex items-end p-4 relative overflow-hidden" style={{ backgroundImage: 'url(https://picsum.photos/seed/sale/400/300)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: getFont('display') }}>Summer Sale</h2>
          <p className="text-xs text-white/80 mb-3">Up to 50% off</p>
          <button className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full">Shop Now</button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6">
        {['All', 'Shoes', 'Clothing', 'Accessories'].map((cat, i) => (
          <div key={cat} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer" style={{ background: i === 0 ? primary : theme.surface, color: i === 0 ? theme.primaryForeground : theme.textPrimary, border: i === 0 ? 'none' : `1px solid ${theme.borderSubtle}` }}>
            {cat}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow" style={{ background: theme.surface }}>
            <div className="w-full aspect-square bg-cover bg-center relative" style={{ backgroundImage: `url(https://picsum.photos/seed/prod${i}/200/200)` }}>
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center"><Heart size={14} color="#000" /></div>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium mb-1 truncate" style={{ color: theme.textPrimary }}>Product Name {i}</p>
              <p className="text-sm font-bold" style={{ color: theme.textPrimary }}>${i * 45}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-20 px-8 flex justify-between items-center border-t transition-colors duration-500 z-10" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <Home size={24} style={{ color: primary }} className="cursor-pointer" />
      <Search size={24} style={{ color: theme.textSecondary }} className="cursor-pointer" />
      <Heart size={24} style={{ color: theme.textSecondary }} className="cursor-pointer" />
      <User size={24} style={{ color: theme.textSecondary }} className="cursor-pointer" />
    </div>
  </div>
)};

// Variation 5: Music App
const MusicApp = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-[320px] h-[650px] rounded-[40px] overflow-hidden flex flex-col relative border-[8px] transition-colors duration-500" style={{ background: theme.surface, borderColor: '#111', boxShadow: getShadow('2xl') }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-20" />
    <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl" style={{ backgroundImage: 'url(https://picsum.photos/seed/album/400/400)' }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
    
    <div className="pt-12 pb-4 px-6 flex justify-between items-center z-10 relative">
      <ChevronLeft size={24} color="#fff" className="cursor-pointer" />
      <span className="text-xs font-bold uppercase tracking-widest text-white" style={{ fontFamily: getFont('body') }}>Now Playing</span>
      <MoreHorizontal size={24} color="#fff" className="cursor-pointer" />
    </div>
    
    <div className="flex-grow flex flex-col items-center justify-center px-8 z-10 relative">
      <div className="w-full aspect-square rounded-3xl mb-8 bg-cover bg-center shadow-2xl" style={{ backgroundImage: 'url(https://picsum.photos/seed/album/400/400)' }} />
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: getFont('display') }}>Song Title</h2>
          <p className="text-sm text-white/70" style={{ fontFamily: getFont('body') }}>Artist Name</p>
        </div>
        <Heart size={24} color="#fff" className="cursor-pointer" />
      </div>
      
      <div className="w-full mb-8">
        <div className="w-full h-1.5 rounded-full bg-white/20 relative mb-2 cursor-pointer">
          <div className="absolute left-0 top-0 h-full rounded-full" style={{ background: primary, width: '40%' }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" style={{ left: '40%', marginLeft: '-6px' }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/50 font-mono">
          <span>1:24</span>
          <span>3:45</span>
        </div>
      </div>
      
      <div className="w-full flex justify-between items-center px-4">
        <SkipBack size={32} color="#fff" className="cursor-pointer hover:scale-110 transition-transform" />
        <div className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg" style={{ background: primary }}>
          <Pause size={24} color={theme.primaryForeground} fill={theme.primaryForeground} />
        </div>
        <SkipForward size={32} color="#fff" className="cursor-pointer hover:scale-110 transition-transform" />
      </div>
    </div>
  </div>
)};

const MobileAction = ({ icon, label, theme, getRadius, getFont }: any) => (
  <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform">
    <div className="w-14 h-14 flex items-center justify-center transition-colors duration-500 shadow-sm" style={{ background: theme.surface, borderRadius: getRadius('full'), border: `1px solid ${theme.borderSubtle}` }}>
      <div style={{ color: theme.textPrimary }}>{icon}</div>
    </div>
    <span className="text-xs font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>{label}</span>
  </div>
);
const Clock = ({size, style, className}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Bookmark = ({size, style, className}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>;
