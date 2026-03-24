import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Menu, Search, User } from 'lucide-react';

export const WebsitePreviews = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const variations = 5;

  const next = () => setActiveIndex((prev) => (prev + 1) % variations);
  const prev = () => setActiveIndex((prev) => (prev - 1 + variations) % variations);

  const renderVariation = () => {
    switch (activeIndex) {
      case 0: return <SaaSHero {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 1: return <EcommerceStore {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 2: return <BlogMagazine {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 3: return <PortfolioSite {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 4: return <AppLandingPage {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      default: return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
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

// Variation 1: SaaS Hero (Original)
const SaaSHero = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <nav className="h-20 px-8 flex items-center justify-between border-b transition-colors duration-500" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg" style={{ background: primary, borderRadius: getRadius('sm') }} />
        <span className="font-bold text-xl" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>{system.brandName || 'Brand'}</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>
        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Features</span>
        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Pricing</span>
        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">About</span>
      </div>
      <button className="px-5 py-2.5 text-sm font-medium transition-transform hover:scale-105 shadow-md" style={{ background: primary, color: theme.primaryForeground, borderRadius: getRadius('full'), fontFamily: getFont('body') }}>
        Get Started
      </button>
    </nav>
    <div className="flex-grow flex items-center justify-center px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${primary} 0%, transparent 70%)` }} />
      <div className="max-w-3xl text-center z-10">
        <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider mb-6 cursor-default" style={{ background: theme.surfaceSecondary, color: theme.textSecondary, border: `1px solid ${theme.borderSubtle}`, borderRadius: getRadius('full') }}>
          New Feature Release
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>
          {system.brandTagline || 'A beautiful design system generated by AI.'}
        </h1>
        <p className="text-lg md:text-xl mb-10 mx-auto max-w-2xl opacity-80 leading-relaxed" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>
          Experience the next generation of {(system.brandName || 'Brand').toLowerCase()}. Designed for modern teams who demand excellence and precision in every detail.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-4 text-base font-medium transition-transform hover:scale-105 flex items-center gap-2 shadow-lg" style={{ background: primary, color: theme.primaryForeground, borderRadius: getRadius('md'), fontFamily: getFont('body') }}>
            Start for free <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 text-base font-medium transition-transform hover:scale-105 hover:bg-black/5 dark:hover:bg-white/5" style={{ background: 'transparent', color: theme.textPrimary, border: `1px solid ${theme.border}`, borderRadius: getRadius('md'), fontFamily: getFont('body') }}>
            View Demo
          </button>
        </div>
      </div>
    </div>
  </div>
)};

// Variation 2: E-commerce Store
const EcommerceStore = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <nav className="h-16 px-8 flex items-center justify-between border-b transition-colors duration-500" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
      <div className="flex items-center gap-4">
        <Menu size={20} style={{ color: theme.textPrimary }} className="cursor-pointer" />
        <span className="font-bold text-xl tracking-widest uppercase" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>{system.brandName || 'STORE'}</span>
      </div>
      <div className="flex items-center gap-6">
        <Search size={20} style={{ color: theme.textPrimary }} className="cursor-pointer hover:opacity-70 transition-opacity" />
        <User size={20} style={{ color: theme.textPrimary }} className="cursor-pointer hover:opacity-70 transition-opacity" />
        <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
          <ShoppingBag size={20} style={{ color: theme.textPrimary }} />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: primary, color: theme.primaryForeground }}>2</span>
        </div>
      </div>
    </nav>
    <div className="flex-grow overflow-y-auto p-8">
      <div className="w-full h-64 rounded-2xl mb-12 bg-cover bg-center flex items-center px-12 relative overflow-hidden group cursor-pointer" style={{ backgroundImage: 'url(https://picsum.photos/seed/fashion/1000/400)' }}>
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: getFont('display') }}>Summer Collection</h2>
          <button className="px-6 py-3 bg-white text-black font-medium text-sm hover:scale-105 transition-transform" style={{ borderRadius: getRadius('sm') }}>Shop Now</button>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-6" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>New Arrivals</h3>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="group cursor-pointer">
            <div className="w-full aspect-[3/4] rounded-xl mb-3 bg-cover bg-center overflow-hidden relative" style={{ backgroundImage: `url(https://picsum.photos/seed/product${i}/300/400)` }}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-lg" style={{ background: theme.surface, color: theme.textPrimary, borderRadius: getRadius('full') }}>Quick Add</button>
            </div>
            <p className="font-medium text-sm mb-1" style={{ color: theme.textPrimary }}>Product Name {i}</p>
            <p className="text-sm font-bold" style={{ color: theme.textSecondary }}>${i * 29.99}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)};

// Variation 3: Blog/Magazine
const BlogMagazine = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <nav className="h-24 px-8 flex flex-col justify-center items-center border-b transition-colors duration-500 relative" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
      <span className="font-bold text-3xl tracking-tighter" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>The {system.brandName || 'Journal'}</span>
      <div className="flex gap-6 mt-2 text-xs font-medium uppercase tracking-widest" style={{ color: theme.textSecondary }}>
        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Design</span>
        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Culture</span>
        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Tech</span>
      </div>
    </nav>
    <div className="flex-grow overflow-y-auto p-8 flex gap-8">
      <div className="w-2/3 flex flex-col gap-8">
        <div className="group cursor-pointer">
          <div className="w-full h-80 rounded-xl mb-4 bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(https://picsum.photos/seed/article1/800/400)' }}>
            <div className="w-full h-full hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url(https://picsum.photos/seed/article1/800/400)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: primary }}>Design</span>
          <h2 className="text-3xl font-bold mb-2 group-hover:underline" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>The Future of Interface Design in 2027</h2>
          <p className="text-sm opacity-80 leading-relaxed" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>An exploration of how artificial intelligence is reshaping the way we interact with digital products and services.</p>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-6 border-l pl-8" style={{ borderColor: theme.borderSubtle }}>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-2" style={{ color: theme.textPrimary }}>Trending</h3>
        {[1,2,3].map(i => (
          <div key={i} className="group cursor-pointer flex gap-4">
            <div className="font-bold text-2xl opacity-20" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>0{i}</div>
            <div>
              <h4 className="font-bold text-sm mb-1 group-hover:underline leading-tight" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Why Minimalism is Making a Comeback</h4>
              <p className="text-xs opacity-60" style={{ color: theme.textSecondary }}>By Author Name</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)};

// Variation 4: Portfolio
const PortfolioSite = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <nav className="h-20 px-12 flex items-center justify-between transition-colors duration-500" style={{ background: theme.background }}>
      <span className="font-bold text-lg" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>{system.brandName || 'Portfolio'}</span>
      <div className="flex gap-8 text-sm font-medium" style={{ color: theme.textPrimary }}>
        <span className="cursor-pointer hover:opacity-50 transition-opacity">Work</span>
        <span className="cursor-pointer hover:opacity-50 transition-opacity">About</span>
        <span className="cursor-pointer hover:opacity-50 transition-opacity">Contact</span>
      </div>
    </nav>
    <div className="flex-grow overflow-y-auto px-12 pb-12">
      <div className="py-20 max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 leading-tight" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>
          Digital designer based in San Francisco.
        </h1>
        <p className="text-xl opacity-70 mb-10" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>
          Specializing in user interface design, design systems, and digital experiences.
        </p>
        <button className="px-8 py-4 text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-y-1 shadow-lg" style={{ background: theme.textPrimary, color: theme.background, borderRadius: getRadius('full') }}>
          View Projects
        </button>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {[1,2].map(i => (
          <div key={i} className="group cursor-pointer">
            <div className="w-full aspect-[4/3] rounded-2xl mb-4 overflow-hidden" style={{ background: theme.surfaceSecondary }}>
              <div className="w-full h-full hover:scale-105 transition-transform duration-700 bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/port${i}/600/400)` }} />
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Project Title {i}</h3>
            <p className="text-sm opacity-70" style={{ color: theme.textSecondary }}>Web Design, Development</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)};

// Variation 5: App Landing Page
const AppLandingPage = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col transition-colors duration-500" style={{ background: theme.surfaceSecondary, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <nav className="h-20 px-8 flex items-center justify-between transition-colors duration-500">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl" style={{ background: primary }} />
        <span className="font-bold text-xl" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>{system.brandName || 'App'}</span>
      </div>
      <button className="px-6 py-2.5 text-sm font-bold transition-transform hover:scale-105 shadow-md" style={{ background: theme.textPrimary, color: theme.surface, borderRadius: getRadius('full') }}>
        Download App
      </button>
    </nav>
    <div className="flex-grow flex items-center px-12 relative overflow-hidden">
      <div className="w-1/2 pr-12 z-10">
        <h1 className="text-5xl font-bold mb-6 leading-tight" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>
          Manage your life with ease.
        </h1>
        <p className="text-lg mb-8 opacity-80" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>
          The only application you need to organize tasks, track habits, and achieve your goals faster than ever.
        </p>
        <div className="flex gap-4">
          <div className="w-40 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity text-white dark:text-black font-bold text-sm">App Store</div>
          <div className="w-40 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity text-white dark:text-black font-bold text-sm">Google Play</div>
        </div>
      </div>
      <div className="w-1/2 h-full relative flex items-center justify-center">
        {/* Abstract Phone Mockup */}
        <div className="w-64 h-[500px] rounded-[40px] border-[8px] shadow-2xl relative overflow-hidden rotate-12 translate-y-12 hover:rotate-0 hover:translate-y-0 transition-all duration-700" style={{ background: theme.surface, borderColor: theme.textPrimary }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-xl z-20" style={{ background: theme.textPrimary }} />
          <div className="p-6 pt-12">
            <div className="w-full h-32 rounded-2xl mb-4" style={{ background: primary }} />
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="w-full h-16 rounded-xl" style={{ background: theme.surfaceSecondary }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)};
