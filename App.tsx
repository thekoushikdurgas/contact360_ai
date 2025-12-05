
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, ADMIN_NAV_ITEMS, ICON_MAP } from './constants';
import { LogOut, Settings, Menu, X, Sun, Moon, Zap, MoreHorizontal, Command, Keyboard, Search, Loader2 } from 'lucide-react';
import { Button3D, Badge3D } from './components/UI';
import { NavItem } from './types';
import { useTheme } from './contexts/ThemeContext';
import { RoleProvider, useRole } from './hooks/useRole';
import { useBilling } from './hooks/useBilling';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ShortcutsModal } from './components/ShortcutsModal';

// --- Lazy Load Features ---
const Dashboard = lazy(() => import('./features/Dashboard').then(module => ({ default: module.Dashboard })));
const AIChat = lazy(() => import('./features/AIChat').then(module => ({ default: module.AIChat })));
const Contacts = lazy(() => import('./features/Contacts').then(module => ({ default: module.Contacts })));
const Companies = lazy(() => import('./features/Companies').then(module => ({ default: module.Companies })));
const CompanyDetail = lazy(() => import('./features/CompanyDetail').then(module => ({ default: module.CompanyDetail })));
const EmailFinder = lazy(() => import('./features/EmailFinder').then(module => ({ default: module.EmailFinder })));
const EmailVerifier = lazy(() => import('./features/EmailVerifier').then(module => ({ default: module.EmailVerifier })));
const Billing = lazy(() => import('./features/Billing').then(module => ({ default: module.Billing })));
const Exports = lazy(() => import('./features/Exports').then(module => ({ default: module.Exports })));
const LinkedIn = lazy(() => import('./features/LinkedIn').then(module => ({ default: module.LinkedIn })));
const Profile = lazy(() => import('./features/Profile').then(module => ({ default: module.Profile })));
const AdminUserHistory = lazy(() => import('./features/AdminUserHistory').then(module => ({ default: module.AdminUserHistory })));
const AdminUsers = lazy(() => import('./features/AdminUsers').then(module => ({ default: module.AdminUsers })));

// --- 3D Components for Sidebar ---

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
        relative group cursor-pointer perspective-[1000px]
        ${collapsed ? 'mb-4 mx-auto' : 'mb-1.5 mx-3'}
      `}
      title={collapsed ? item.label : ''}
    >
      <div className={`
        relative flex items-center transition-all duration-300 ease-out transform-style-3d
        ${isActive 
          ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
          : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
        }
        ${collapsed 
           ? 'w-10 h-10 justify-center rounded-xl mx-auto' 
           : 'w-full px-3 py-2.5 rounded-xl'
        }
      `}>
        <div className={`
          flex items-center justify-center transition-all duration-300
          ${isActive ? 'text-white' : ''}
          ${collapsed ? 'w-full h-full' : 'w-5 h-5 mr-3'}
        `}>
          <Icon size={collapsed ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        
        {!collapsed && (
          <span className={`text-sm font-medium tracking-tight whitespace-nowrap ${isActive ? 'text-white' : ''}`}>
            {item.label}
          </span>
        )}
      </div>
    </div>
  );
};

// Global Search Component for Sidebar
const SidebarSearch: React.FC<{ collapsed: boolean, inputRef: React.RefObject<HTMLInputElement | null> }> = ({ collapsed, inputRef }) => {
    return (
        <div className={`transition-all duration-300 ${collapsed ? 'px-0 mb-6 flex justify-center' : 'px-3 mb-4'}`}>
            <div className={`
                relative group bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 
                shadow-inner-3d-light dark:shadow-inner-3d transition-all duration-300
                hover:border-indigo-400 dark:hover:border-indigo-500/50
                focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20
                ${collapsed 
                   ? 'h-10 w-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-white dark:hover:bg-slate-700' 
                   : 'h-10 rounded-xl w-full'
                }
            `}
            onClick={() => inputRef.current?.focus()}
            title={collapsed ? "Search (Cmd+K)" : ""}
            >
                <div className={`absolute pointer-events-none text-slate-400 ${collapsed ? '' : 'left-3 top-2.5'}`}>
                    <Search size={collapsed ? 18 : 16} />
                </div>
                
                {!collapsed && (
                  <>
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Search..." 
                        className="w-full h-full bg-transparent pl-9 pr-8 text-sm outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 rounded-xl block"
                    />
                    <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 text-[10px] text-slate-400 font-sans flex items-center gap-0.5">
                        <Command size={8} /> K
                    </div>
                  </>
                )}
            </div>
        </div>
    );
};

interface UserMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  theme: string;
  toggleTheme: () => void;
  onOpenShortcuts: () => void;
  style?: React.CSSProperties;
}

// User Menu Popup
const UserMenuPopup: React.FC<UserMenuPopupProps> = ({ isOpen, onClose, collapsed, theme, toggleTheme, onOpenShortcuts, style }) => {
    const { billingInfo } = useBilling({ autoLoad: true });
    
    if (!isOpen) return null;

    const creditsPercent = billingInfo ? (billingInfo.credits_used / billingInfo.credits_limit) * 100 : 0;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
            <div 
              className="fixed bottom-20 z-50 w-80 perspective-[1000px] animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={style}
            >
                <div className="card-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-2xl ring-1 ring-slate-900/5">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-base shadow-inner">
                            AJ
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 dark:text-white truncate">Alex Johnson</h4>
                            <p className="text-xs text-slate-500 truncate">alex@leadgen.pro</p>
                        </div>
                        <Badge3D variant="purple" className="text-[10px] px-2 py-0.5">PRO</Badge3D>
                    </div>

                    <div className="space-y-4 mb-5">
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1"><Zap size={12} className="text-amber-500 fill-amber-500" /> Credits</span>
                                <span>{billingInfo ? billingInfo.credits_used.toLocaleString() : '0'} / {billingInfo ? billingInfo.credits_limit.toLocaleString() : '0'}</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" style={{ width: `${creditsPercent}%` }} />
                           </div>
                        </div>
                        <Button3D variant="outline" className="w-full text-xs h-9 justify-center border-slate-300 dark:border-slate-600">Upgrade Plan</Button3D>
                    </div>

                    {/* Preferences Section */}
                    <div className="space-y-1 mb-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                       <button 
                          onClick={toggleTheme}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                       >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                             {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                          </div>
                          <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                       </button>
                       <button 
                          onClick={onOpenShortcuts}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                       >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                             <Keyboard size={16} />
                          </div>
                          <span className="font-medium">Keyboard Shortcuts</span>
                       </button>
                    </div>

                    <button className="w-full flex items-center gap-2 p-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors border-t border-slate-100 dark:border-slate-700/50 mt-2 font-medium">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

const LoadingSpinner = () => (
  <div className="h-full w-full flex flex-col items-center justify-center min-h-[60vh] animate-enter">
    <div className="perspective-[1000px]">
      <div className="relative w-16 h-16 transform-style-3d animate-[spin_3s_linear_infinite]">
        <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-purple-500/30 rounded-full"></div>
        <div className="absolute inset-4 border-4 border-transparent border-b-purple-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
      </div>
    </div>
    <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">Loading Module...</p>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Sidebar state: initially true (collapsed)
  const [collapsed, setCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { theme, toggleTheme } = useTheme();
  const { role, checkAccess } = useRole();

  // Setup Keyboard Shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      // If we are searching, make sure we expand to see the input
      if (collapsed) setCollapsed(false);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    },
    onOpenHelp: () => setShortcutsOpen(true),
    onClose: () => {
      setShortcutsOpen(false);
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    },
    onNavigate: (path) => navigate(path)
  });

  const visibleAdminItems = ADMIN_NAV_ITEMS.filter(item => checkAccess(item.allowedRoles));
  
  // Responsive logic
  const isSidebarCollapsed = collapsed && !mobileMenuOpen && !userMenuOpen;
  const sidebarWidth = isSidebarCollapsed ? 'w-[80px]' : 'w-[260px]';

  // Calculate popup position based on sidebar state
  const popupLeft = isSidebarCollapsed ? 96 : 280; 

  return (
    <div className="flex h-screen bg-[#f1f5f9] dark:bg-[#020617] overflow-hidden selection:bg-indigo-500/30 transition-colors duration-300 font-sans">
      
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* Background Ambient Mesh 3D */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-400/20 dark:bg-indigo-900/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-[120px] opacity-40" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 3D Floating Sidebar */}
      <aside 
        className={`
          fixed z-50 flex flex-col
          top-0 left-0 h-full
          md:top-3 md:left-3 md:h-[calc(100vh-1.5rem)] md:rounded-3xl
          bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl
          border-r md:border border-white/40 dark:border-white/5
          shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${sidebarWidth}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        {/* Logo Area */}
        <div className={`
          h-20 flex items-center transition-all duration-500 shrink-0 relative z-20
          ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-6 justify-start'}
        `}>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 perspective-[500px] group cursor-pointer shrink-0" onClick={() => navigate('/')}>
              <div className="w-full h-full rounded-xl bg-slate-900 dark:bg-black flex items-center justify-center text-white font-black text-xs shadow-lg transform transition-transform duration-500 group-hover:rotate-y-180 transform-style-3d border border-white/10">
                 <div className="absolute inset-0 backface-hidden flex items-center justify-center">3D</div>
                 <div className="absolute inset-0 backface-hidden flex items-center justify-center rotate-y-180 bg-indigo-600 rounded-xl">HD</div>
              </div>
            </div>
            
            {!isSidebarCollapsed && (
               <div className="flex flex-col justify-center overflow-hidden transition-all duration-500 ease-in-out">
                 <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white leading-none whitespace-nowrap">
                   HyperDash
                 </span>
                 <span className="text-[9px] font-bold text-indigo-500 tracking-widest uppercase mt-0.5 whitespace-nowrap">
                   Enterprise
                 </span>
               </div>
            )}
          </div>
          
          <button 
            className="md:hidden text-slate-500 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full ml-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Search */}
        <SidebarSearch collapsed={isSidebarCollapsed} inputRef={searchInputRef} />

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5 custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <SidebarItem 
              key={item.path} 
              item={item} 
              isActive={location.pathname === item.path} 
              collapsed={isSidebarCollapsed}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}

          {/* Admin Section */}
          {visibleAdminItems.length > 0 && (
            <div className={`mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 ${isSidebarCollapsed ? 'mx-2' : 'mx-3'}`}>
              {!isSidebarCollapsed && (
                 <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   Admin Zone
                 </div>
              )}
              {visibleAdminItems.map((item) => (
                <SidebarItem 
                    key={item.path}
                    item={item}
                    isActive={location.pathname === item.path}
                    collapsed={isSidebarCollapsed}
                    onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 mt-1 space-y-2 shrink-0 relative z-20">
          
          <div className={`
             bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 p-2 transition-all duration-300
             ${isSidebarCollapsed ? 'bg-transparent border-transparent p-0' : ''}
          `}>
             <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors group ${isSidebarCollapsed ? 'justify-center p-0' : ''}`}
             >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-sm">
                   AJ
                </div>
                
                {!isSidebarCollapsed && (
                   <>
                      <div className="flex-1 text-left overflow-hidden">
                         <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">Alex Johnson</div>
                         <div className="text-xs text-slate-500 truncate">{role.replace('_', ' ')}</div>
                      </div>
                      <MoreHorizontal size={16} className="text-slate-400" />
                   </>
                )}
             </button>
          </div>
        </div>
      </aside>

      {/* User Menu Popup (Rendered outside aside to prevent backdrop clipping) */}
      <UserMenuPopup 
        isOpen={userMenuOpen} 
        onClose={() => setUserMenuOpen(false)} 
        collapsed={isSidebarCollapsed}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenShortcuts={() => { setShortcutsOpen(true); setUserMenuOpen(false); }}
        style={{ left: window.innerWidth < 768 ? '16px' : `${popupLeft}px` }}
      />

      {/* Main Content Area */}
      <main 
        className={`
          flex-1 relative flex flex-col min-w-0 h-full transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          md:pl-[calc(80px+1.5rem)]
        `}
      >
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-black border border-white/10 flex items-center justify-center text-white font-bold text-xs">3D</div>
              <span className="font-bold text-lg text-slate-800 dark:text-white">HyperDash</span>
           </div>
           <button 
             onClick={() => setMobileMenuOpen(true)} 
             className="text-slate-500 dark:text-slate-300 p-2 -mr-2 active:scale-95 transition-transform"
           >
             <Menu size={24} />
           </button>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth w-full">
          <div className="max-w-[1600px] mx-auto w-full">
             <Suspense fallback={<LoadingSpinner />}>
                {children}
             </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

// Placeholder components for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-enter p-4">
    <div className="w-32 h-32 relative perspective-[1000px] group">
       <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
       <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-3d-light dark:shadow-3d flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-y-12 group-hover:rotate-x-12 border border-slate-200 dark:border-slate-700">
          <Settings size={48} className="text-indigo-500 dark:text-indigo-400 animate-[spin_10s_linear_infinite]" />
       </div>
    </div>
    <div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg mx-auto leading-relaxed">
        This module is currently under construction.
      </p>
    </div>
    <Button3D onClick={() => window.history.back()} iconName="arrow-left">Return Home</Button3D>
  </div>
);

const App: React.FC = () => {
  return (
    <RoleProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/finder" element={<EmailFinder />} />
            <Route path="/verifier" element={<EmailVerifier />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/export" element={<Exports />} />
            <Route path="/linkedin" element={<LinkedIn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/admin/user-history" element={<AdminUserHistory />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<PlaceholderPage title="Admin Settings" />} />
            <Route path="*" element={<PlaceholderPage title="404 Not Found" />} />
          </Routes>
        </Layout>
      </HashRouter>
    </RoleProvider>
  );
};

export default App;
