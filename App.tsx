
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Dashboard } from './features/Dashboard';
import { AIChat } from './features/AIChat';
import { Contacts } from './features/Contacts';
import { Companies } from './features/Companies';
import { EmailFinder } from './features/EmailFinder';
import { EmailVerifier } from './features/EmailVerifier';
import { Billing } from './features/Billing';
import { Exports } from './features/Exports';
import { LinkedIn } from './features/LinkedIn';
import { Profile } from './features/Profile';
import { NAV_ITEMS, ICON_MAP } from './constants';
import { LogOut, Settings, Menu, X, Sun, Moon, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button3D } from './components/UI';
import { NavItem } from './types';
import { useTheme } from './contexts/ThemeContext';

const SidebarItem: React.FC<{ item: NavItem; isActive: boolean; collapsed: boolean; onClick?: () => void }> = ({ item, isActive, collapsed, onClick }) => {
  const Icon = ICON_MAP[item.iconName];
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(item.path);
    if (onClick) onClick();
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative flex items-center my-1 rounded-xl cursor-pointer transition-all duration-200 group overflow-hidden
        ${isActive 
          ? 'bg-indigo-50/50 dark:bg-white/5' 
          : 'hover:bg-slate-100 dark:hover:bg-white/5'
        }
        ${collapsed 
          ? 'justify-center py-3 mx-2' 
          : 'justify-start px-4 py-3 mx-3 gap-4'
        }
      `}
    >
      <div className={`
        relative z-10 p-2.5 rounded-xl transition-all duration-300 shadow-sm shrink-0
        ${isActive 
          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 group-hover:scale-110'
        }
      `}>
        <Icon size={20} />
      </div>
      
      <span className={`
        font-medium relative z-10 whitespace-nowrap transition-all duration-300
        ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto block'}
        ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}
      `}>
        {item.label}
      </span>

      {/* Active Indicator Strip (Only when expanded) */}
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      )}
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // The sidebar is expanded visually if it's NOT pinned collapsed, OR if it IS pinned but the user is hovering.
  const isSidebarExpanded = !collapsed || isHovered;

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] overflow-hidden selection:bg-indigo-500/30 transition-colors duration-300">
      
      {/* Background Ambient Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-300/20 dark:bg-indigo-600/20 rounded-full blur-[80px] md:blur-[120px] opacity-40 animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-rose-300/20 dark:bg-rose-600/10 rounded-full blur-[80px] md:blur-[120px] opacity-30" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Position for Hover Expand */}
      <aside 
        onMouseEnter={() => collapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed z-50 h-full bg-white/90 dark:bg-slate-900/90 md:bg-white/80 md:dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex flex-col shadow-2xl transition-all duration-300 ease-in-out
          ${isSidebarExpanded ? 'w-72 md:w-64' : 'w-[72px]'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${(collapsed && isHovered) ? 'shadow-3d-hover dark:shadow-3d-hover delay-100' : ''}
        `}
      >
        {/* Logo Area */}
        <div className={`
          h-20 flex items-center border-b border-slate-200 dark:border-white/5 transition-all duration-300 overflow-hidden
          ${isSidebarExpanded ? 'px-6 justify-between' : 'px-0 justify-center'}
        `}>
          <div className="flex items-center shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white font-bold text-xl shrink-0">
              H
            </div>
            <span className={`ml-3 font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-slate-500 dark:from-white dark:to-slate-400 transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
              HyperDash
            </span>
          </div>
          {/* Mobile Close */}
          <button 
            className="md:hidden text-slate-500 dark:text-slate-400 p-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-1 scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <SidebarItem 
              key={item.path} 
              item={item} 
              isActive={location.pathname === item.path} 
              collapsed={!isSidebarExpanded}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-white/5 space-y-2 overflow-hidden whitespace-nowrap">
          {/* Theme Toggle */}
          <div 
             onClick={toggleTheme}
             className={`flex items-center ${isSidebarExpanded ? 'justify-start px-3' : 'justify-center'} text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5`}
          >
             <div className="shrink-0"><div className={`${!isSidebarExpanded && 'p-0.5'}`}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</div></div>
             <span className={`ml-3 font-medium text-sm transition-all duration-300 ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
               {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
             </span>
          </div>

          <div 
             onClick={() => navigate('/profile')}
             className={`flex items-center ${isSidebarExpanded ? 'justify-start px-3' : 'justify-center'} text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 ${location.pathname === '/profile' ? 'bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-400' : ''}`}
          >
             <div className="shrink-0"><div className={`${!isSidebarExpanded && 'p-0.5'}`}><User size={20} /></div></div>
             <span className={`ml-3 font-medium text-sm transition-all duration-300 ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>Profile</span>
          </div>
          <div className={`flex items-center ${isSidebarExpanded ? 'justify-start px-3' : 'justify-center'} text-rose-500/80 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10`}>
             <div className="shrink-0"><div className={`${!isSidebarExpanded && 'p-0.5'}`}><LogOut size={20} /></div></div>
             <span className={`ml-3 font-medium text-sm transition-all duration-300 ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>Logout</span>
          </div>
          
          {/* Collapse Toggle (Desktop) */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden md:flex w-full mt-2 justify-center py-2 text-slate-400 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors ${!isSidebarExpanded && 'rotate-180'}`}
          >
             <ChevronLeft size={20} />
          </button>
        </div>
      </aside>

      {/* Spacer Element - Preserves layout space for the main content based on 'pinned' state only */}
      <div className={`
         hidden md:block relative h-full shrink-0 transition-all duration-300 ease-in-out
         ${collapsed ? 'w-[72px]' : 'w-64'}
      `} />

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">H</div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-white">HyperDash</span>
           </div>
           <button 
             onClick={() => setMobileMenuOpen(true)} 
             className="text-slate-500 dark:text-slate-300 p-2 -mr-2 active:scale-95 transition-transform"
           >
             <Menu size={24} />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-10 w-full">
          <div className="max-w-7xl mx-auto w-full">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// Placeholder components for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 animate-fade-in p-4">
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-slate-100 dark:bg-slate-800/50 shadow-inner-3d-light dark:shadow-inner-3d flex items-center justify-center text-indigo-400 dark:text-indigo-500/50 mb-4">
      <Settings size={40} className="md:w-12 md:h-12" />
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">{title}</h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm md:text-base">
      This 3D module is currently under construction. Please check the Dashboard or AI Assistant for active features.
    </p>
    <Button3D onClick={() => window.history.back()}>Go Back</Button3D>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/finder" element={<EmailFinder />} />
          <Route path="/verifier" element={<EmailVerifier />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/export" element={<Exports />} />
          <Route path="/linkedin" element={<LinkedIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="*" element={<PlaceholderPage title="404 Not Found" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
