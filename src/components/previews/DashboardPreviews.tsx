import React, { useState } from 'react';
import { BarChart3, Home, User, Settings, Search, Bell, Globe, ShoppingCart, DollarSign, Activity, ChevronLeft, ChevronRight, Package, Users, MessageSquare } from 'lucide-react';

export const DashboardPreviews = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const variations = 5;

  const next = () => setActiveIndex((prev) => (prev + 1) % variations);
  const prev = () => setActiveIndex((prev) => (prev - 1 + variations) % variations);

  const renderVariation = () => {
    switch (activeIndex) {
      case 0: return <AnalyticsDashboard {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 1: return <EcommerceDashboard {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 2: return <ProjectDashboard {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 3: return <CrmDashboard {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
      case 4: return <SocialDashboard {...{system, theme, getFont, getRadius, getShadow, shuffledColors}} />;
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

// Variation 1: Analytics (Original)
const AnalyticsDashboard = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <div className="w-20 flex-shrink-0 flex flex-col items-center py-6 border-r transition-colors duration-500" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <div className="w-10 h-10 rounded-xl mb-8 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" style={{ background: primary, color: theme.primaryForeground }}>
        <span className="font-bold text-lg" style={{ fontFamily: getFont('display') }}>{(system.brandName || 'B').charAt(0)}</span>
      </div>
      <div className="flex flex-col gap-6 w-full items-center">
        <SidebarIcon icon={<Home size={20} />} active theme={theme} getRadius={getRadius} primary={primary} />
        <SidebarIcon icon={<BarChart3 size={20} />} theme={theme} getRadius={getRadius} primary={primary} />
        <SidebarIcon icon={<User size={20} />} theme={theme} getRadius={getRadius} primary={primary} />
        <SidebarIcon icon={<Settings size={20} />} theme={theme} getRadius={getRadius} primary={primary} />
      </div>
    </div>
    <div className="flex-grow flex flex-col overflow-hidden">
      <div className="h-16 flex items-center justify-between px-8 border-b transition-colors duration-500" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
        <div className="flex items-center text-sm cursor-text" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>
          <Search size={16} className="mr-2" /><span>Search...</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer hover:scale-110 transition-transform">
            <Bell size={20} style={{ color: theme.textSecondary }} />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: system.colors?.error?.hex || '#DC3545' }} />
          </div>
          <div className="w-8 h-8 rounded-full bg-cover bg-center cursor-pointer hover:ring-2 ring-offset-2 transition-all" style={{ backgroundImage: 'url(https://picsum.photos/seed/avatar/100/100)', ringColor: primary }} />
        </div>
      </div>
      <div className="p-8 overflow-y-auto h-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Welcome back, Alex</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value="24,592" trend="+12%" icon={<User size={20} />} color={primary} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} />
          <StatCard title="Revenue" value="$84,230" trend="+8%" icon={<BarChart3 size={20} />} color={secondary} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} />
          <StatCard title="Active Sessions" value="1,204" trend="-2%" icon={<Globe size={20} />} color={accent} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} isNegative />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 p-6 transition-colors duration-500 cursor-pointer hover:shadow-md" style={{ background: theme.surface, borderRadius: getRadius('lg'), border: `1px solid ${theme.borderSubtle}`, boxShadow: getShadow('sm') }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Revenue Overview</h3>
            <div className="h-48 flex items-end gap-2">
              {[40, 60, 45, 80, 55, 90, 75, 100, 85, 65, 50, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all duration-1000 hover:opacity-80" style={{ height: `${h}%`, background: i === 7  ? primary  : (String(primary).includes('gradient') ? primary : primary + '40') }} />
              ))}
            </div>
          </div>
          <div className="col-span-1 p-6 transition-colors duration-500 cursor-pointer hover:shadow-md" style={{ background: theme.surface, borderRadius: getRadius('lg'), border: `1px solid ${theme.borderSubtle}`, boxShadow: getShadow('sm') }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: theme.surfaceSecondary }}><User size={14} style={{ color: theme.textSecondary }} /></div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: theme.textPrimary, fontFamily: getFont('body') }}>New user registered</p>
                    <p className="text-xs" style={{ color: theme.textTertiary, fontFamily: getFont('body') }}>{i * 2} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)};

// Variation 2: E-commerce
const EcommerceDashboard = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <div className="h-16 flex items-center justify-between px-8 border-b transition-colors duration-500" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <div className="flex items-center gap-8">
        <span className="font-bold text-xl" style={{ color: primary, fontFamily: getFont('display') }}>ShopAdmin</span>
        <div className="hidden md:flex gap-6 text-sm font-medium" style={{ color: theme.textSecondary }}>
          <span className="cursor-pointer hover:text-black dark:hover:text-white" style={{ color: theme.textPrimary }}>Overview</span>
          <span className="cursor-pointer hover:text-black dark:hover:text-white">Orders</span>
          <span className="cursor-pointer hover:text-black dark:hover:text-white">Products</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-cover bg-center cursor-pointer" style={{ backgroundImage: 'url(https://picsum.photos/seed/avatar2/100/100)' }} />
      </div>
    </div>
    <div className="p-8 overflow-y-auto h-full flex-grow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Store Overview</h2>
        <button className="px-4 py-2 text-sm font-medium rounded-md hover:opacity-90 transition-opacity" style={{ background: primary, color: theme.primaryForeground, borderRadius: getRadius('md') }}>Add Product</button>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Sales" value="$12,450" trend="+15%" icon={<DollarSign size={20} />} color={primary} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} />
        <StatCard title="Orders" value="342" trend="+5%" icon={<ShoppingCart size={20} />} color={secondary} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} />
        <StatCard title="Products" value="1,204" trend="0%" icon={<Package size={20} />} color={accent} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} />
        <StatCard title="Customers" value="8,430" trend="+12%" icon={<Users size={20} />} color={success} theme={theme} getFont={getFont} getRadius={getRadius} getShadow={getShadow} />
      </div>
      <div className="p-6 transition-colors duration-500" style={{ background: theme.surface, borderRadius: getRadius('lg'), border: `1px solid ${theme.borderSubtle}`, boxShadow: getShadow('sm') }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Recent Orders</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ color: theme.textSecondary, borderBottom: `1px solid ${theme.borderSubtle}` }}>
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map(i => (
              <tr key={i} className="border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors" style={{ borderColor: theme.borderSubtle, color: theme.textPrimary }}>
                <td className="py-4 font-mono">#ORD-{1000+i}</td>
                <td className="py-4">Customer {i}</td>
                <td className="py-4 opacity-70">Oct {i+10}, 2026</td>
                <td className="py-4"><span className="px-2 py-1 text-xs rounded-full" style={{ background: String(primary).includes('gradient')  ? primary  : (String(primary).includes('gradient') ? primary : primary + '20'), color: primary }}>Completed</span></td>
                <td className="py-4 font-medium">${(i * 45.5).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)};

// Variation 3: Project Management
const ProjectDashboard = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <div className="w-64 flex-shrink-0 flex flex-col py-6 border-r transition-colors duration-500 px-4" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: primary, color: theme.primaryForeground }}><Activity size={16} /></div>
        <span className="font-bold text-lg" style={{ fontFamily: getFont('display'), color: theme.textPrimary }}>TaskFlow</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="px-4 py-2 rounded-md cursor-pointer font-medium text-sm" style={{ background: String(primary).includes('gradient')  ? primary  : (String(primary).includes('gradient') ? primary : primary + '15'), color: primary }}>Dashboard</div>
        <div className="px-4 py-2 rounded-md cursor-pointer font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: theme.textSecondary }}>My Tasks</div>
        <div className="px-4 py-2 rounded-md cursor-pointer font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: theme.textSecondary }}>Projects</div>
        <div className="px-4 py-2 rounded-md cursor-pointer font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: theme.textSecondary }}>Team</div>
      </div>
    </div>
    <div className="flex-grow flex flex-col overflow-hidden p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Website Redesign</h2>
        <div className="flex -space-x-2">
          {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 bg-cover bg-center" style={{ borderColor: theme.surface, backgroundImage: `url(https://picsum.photos/seed/user${i}/100/100)` }} />)}
        </div>
      </div>
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {['To Do', 'In Progress', 'Done'].map((col, idx) => (
          <div key={col} className="w-72 flex-shrink-0 flex flex-col gap-4 rounded-xl p-4" style={{ background: theme.surfaceSecondary }}>
            <h4 className="font-bold text-sm" style={{ color: theme.textPrimary }}>{col} <span className="opacity-50 ml-2">3</span></h4>
            {[1,2,3].map(task => (
              <div key={task} className="p-4 rounded-lg cursor-pointer hover:-translate-y-1 transition-transform shadow-sm" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2 py-1 rounded-sm font-medium" style={{ background: idx === 2   ? (String(success).includes('gradient') ? success  : (String(success).includes('gradient') ? success : success + '20')) : accent + '20', color: idx === 2 ? success : accent }}>{idx === 2 ? 'Design' : 'Dev'}</span>
                </div>
                <p className="text-sm font-medium mb-4" style={{ color: theme.textPrimary }}>Task description goes here {task}</p>
                <div className="flex justify-between items-center">
                  <MessageSquare size={14} style={{ color: theme.textSecondary }} />
                  <div className="w-6 h-6 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/user${task}/100/100)` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)};

// Variation 4: CRM
const CrmDashboard = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <div className="h-16 flex items-center px-8 border-b transition-colors duration-500 gap-8" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <span className="font-bold text-xl" style={{ color: primary, fontFamily: getFont('display') }}>CRM Pro</span>
      <div className="flex-grow flex items-center bg-black/5 dark:bg-white/5 px-4 py-2 rounded-full max-w-md">
        <Search size={16} style={{ color: theme.textSecondary }} className="mr-2" />
        <input type="text" placeholder="Search contacts, deals..." className="bg-transparent outline-none text-sm w-full" style={{ color: theme.textPrimary }} />
      </div>
    </div>
    <div className="flex flex-grow overflow-hidden">
      <div className="w-1/3 border-r overflow-y-auto" style={{ borderColor: theme.borderSubtle, background: theme.surface }}>
        <div className="p-4 border-b" style={{ borderColor: theme.borderSubtle }}>
          <h3 className="font-bold" style={{ color: theme.textPrimary }}>Recent Contacts</h3>
        </div>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="p-4 border-b flex items-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: theme.borderSubtle }}>
            <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/contact${i}/100/100)` }} />
            <div>
              <p className="font-medium text-sm" style={{ color: theme.textPrimary }}>Contact Name {i}</p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>Company {i} LLC</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-2/3 p-8 overflow-y-auto" style={{ background: theme.surfaceSecondary }}>
        <div className="p-8 rounded-xl mb-6 flex items-center gap-6 shadow-sm" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
          <div className="w-24 h-24 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/contact1/200/200)` }} />
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>Contact Name 1</h2>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>CEO at Company 1 LLC</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium rounded-md" style={{ background: primary, color: theme.primaryForeground }}>Email</button>
              <button className="px-4 py-2 text-sm font-medium rounded-md border" style={{ borderColor: theme.borderSubtle, color: theme.textPrimary }}>Call</button>
            </div>
          </div>
        </div>
        <h3 className="font-bold mb-4" style={{ color: theme.textPrimary }}>Recent Activity</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
            <p className="text-sm font-medium mb-1" style={{ color: theme.textPrimary }}>Sent proposal email</p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Yesterday at 2:30 PM</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
            <p className="text-sm font-medium mb-1" style={{ color: theme.textPrimary }}>Meeting: Q3 Planning</p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Oct 12, 2026</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)};

// Variation 5: Social Media
const SocialDashboard = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [primary, secondary, accent, success, warning, info] = shuffledColors;
  return (
  <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex transition-colors duration-500" style={{ background: theme.background, border: `1px solid ${theme.border}`, boxShadow: getShadow('xl'), height: '600px' }}>
    <div className="w-64 flex-shrink-0 flex flex-col py-6 border-r transition-colors duration-500 px-4" style={{ background: theme.surface, borderColor: theme.borderSubtle }}>
      <div className="flex items-center gap-3 mb-8 px-2">
        <span className="font-bold text-xl" style={{ fontFamily: getFont('display'), color: primary }}>SocialSync</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="px-4 py-2 rounded-full cursor-pointer font-medium text-sm flex items-center gap-3" style={{ background: String(primary).includes('gradient')  ? primary  : (String(primary).includes('gradient') ? primary : primary + '15'), color: primary }}><Home size={18}/> Feed</div>
        <div className="px-4 py-2 rounded-full cursor-pointer font-medium text-sm flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: theme.textPrimary }}><Search size={18}/> Explore</div>
        <div className="px-4 py-2 rounded-full cursor-pointer font-medium text-sm flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: theme.textPrimary }}><Bell size={18}/> Notifications</div>
        <div className="px-4 py-2 rounded-full cursor-pointer font-medium text-sm flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: theme.textPrimary }}><MessageSquare size={18}/> Messages</div>
      </div>
      <button className="mt-8 py-3 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-opacity" style={{ background: primary, color: theme.primaryForeground }}>Post</button>
    </div>
    <div className="flex-grow flex flex-col overflow-y-auto p-8 items-center" style={{ background: theme.surfaceSecondary }}>
      <div className="w-full max-w-xl space-y-6">
        {/* Create Post */}
        <div className="p-4 rounded-2xl shadow-sm" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/me/100/100)' }} />
            <input type="text" placeholder="What's happening?" className="bg-transparent outline-none w-full text-lg" style={{ color: theme.textPrimary }} />
          </div>
          <div className="flex justify-end border-t pt-3" style={{ borderColor: theme.borderSubtle }}>
            <button className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: primary, color: theme.primaryForeground }}>Reply</button>
          </div>
        </div>
        {/* Posts */}
        {[1,2,3].map(i => (
          <div key={i} className="p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow" style={{ background: theme.surface, border: `1px solid ${theme.borderSubtle}` }}>
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/user${i+10}/100/100)` }} />
              <div>
                <p className="font-bold text-sm" style={{ color: theme.textPrimary }}>User Name {i}</p>
                <p className="text-xs opacity-60" style={{ color: theme.textSecondary }}>@username{i} · 2h</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: theme.textPrimary }}>This is a sample post content showing how typography and colors look in a social media feed context. #design</p>
            {i === 1 && <div className="w-full h-48 rounded-xl mb-4 bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/postimg/400/200)' }} />}
            <div className="flex gap-6 opacity-70" style={{ color: theme.textSecondary }}>
              <div className="flex items-center gap-2 text-xs hover:text-[var(--theme-primary)] transition-colors"><MessageSquare size={16}/> 12</div>
              <div className="flex items-center gap-2 text-xs hover:text-[var(--theme-accent)] transition-colors"><Activity size={16}/> 45</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)};

const SidebarIcon = ({ icon, active, theme, getRadius, primary }: any) => (
  <div className="w-10 h-10 flex items-center justify-center cursor-pointer transition-all hover:scale-110" style={{ background: active   ? (String(primary).includes('gradient') ? primary  : (String(primary).includes('gradient') ? primary : primary + '15')) : 'transparent', color: active ? primary : theme.textSecondary, borderRadius: getRadius('md') }}>
    {icon}
  </div>
);

const StatCard = ({ title, value, trend, icon, color, theme, getFont, getRadius, getShadow, isNegative }: any) => (
  <div className="p-6 transition-colors duration-500 cursor-pointer hover:-translate-y-1" style={{ background: theme.surface, borderRadius: getRadius('lg'), border: `1px solid ${theme.borderSubtle}`, boxShadow: getShadow('sm') }}>
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: String(color).includes('gradient')  ? color  : (String(color).includes('gradient') ? color : color + '20'), color: color, borderRadius: getRadius('md') }}>{icon}</div>
      <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: isNegative ? '#DC354520' : '#28A74520', color: isNegative ? '#DC3545' : '#28A745' }}>{trend}</span>
    </div>
    <p className="text-sm mb-1" style={{ color: theme.textSecondary, fontFamily: getFont('body') }}>{title}</p>
    <h4 className="text-2xl font-bold" style={{ color: theme.textPrimary, fontFamily: getFont('display') }}>{value}</h4>
  </div>
);
