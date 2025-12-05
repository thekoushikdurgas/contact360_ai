
import React, { useState, useEffect } from 'react';
import { Card3D, Button3D, Input3D, Modal3D, Checkbox3D, Badge3D, TiltRow, Select3D, TabGroup } from '../components/UI';
import { SkeletonBlock } from '../components/Skeleton';
import { 
  User, Mail, Camera, Lock, CheckCircle, X, AlertCircle, 
  Palette, Bell, Shield, Key, CreditCard, Monitor, Moon, Sun,
  Smartphone, Globe, Laptop, Trash2, Plus, Copy, Eye, EyeOff,
  LogOut, Zap, Star, Users, UserPlus, MoreHorizontal
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRole } from '../hooks/useRole';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const MOCK_API_KEYS = [
  { id: 'key_1', name: 'Production Key', prefix: 'pk_live_', created: '2023-08-15', lastUsed: '2 hours ago' },
  { id: 'key_2', name: 'Development Key', prefix: 'pk_test_', created: '2023-09-20', lastUsed: '5 mins ago' },
];

const MOCK_SESSIONS = [
  { id: '1', device: 'MacBook Pro', location: 'London, UK', ip: '192.168.1.1', current: true, icon: Laptop },
  { id: '2', device: 'iPhone 13', location: 'London, UK', ip: '192.168.1.25', current: false, icon: Smartphone },
  { id: '3', device: 'Windows PC', location: 'Berlin, DE', ip: '142.25.12.1', current: false, icon: Monitor },
];

const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Alex Johnson', email: 'alex@leadgen.pro', role: 'Owner', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@leadgen.pro', role: 'Admin', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=6366f1&color=fff' },
  { id: '3', name: 'Mike Chen', email: 'mike@leadgen.pro', role: 'Member', status: 'pending', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff' },
  { id: '4', name: 'Emily Davis', email: 'emily@leadgen.pro', role: 'Viewer', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f43f5e&color=fff' },
];

type SettingsTab = 'My Profile' | 'Team' | 'Appearance' | 'Notifications' | 'Security' | 'API Keys' | 'Billing';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { role, isAdmin } = useRole();
  
  // State
  const [activeTab, setActiveTab] = useState<string>('My Profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const [userForm, setUserForm] = useState({
    name: "Alex Johnson",
    email: "alex@leadgen.pro",
    title: "Head of Growth",
    bio: "Passionate about data-driven marketing and AI automation."
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    newLeads: true,
    marketing: false,
    securityAlerts: true
  });

  const [appearance, setAppearance] = useState({
    density: 'comfortable',
    reducedMotion: false,
    colorMode: theme
  });

  // Modal States
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Load Simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Update local appearance state when global theme changes
  useEffect(() => {
    setAppearance(prev => ({ ...prev, colorMode: theme }));
  }, [theme]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const tabs: SettingsTab[] = [
    'My Profile',
    ...(isAdmin ? ['Team'] as SettingsTab[] : []),
    'Appearance',
    'Notifications',
    'Security',
    'API Keys',
    'Billing'
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-8 p-2">
           <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <SkeletonBlock className="w-20 h-20 rounded-full" />
              <div className="space-y-3">
                 <SkeletonBlock className="w-48 h-6" />
                 <SkeletonBlock className="w-64 h-4" />
              </div>
           </div>
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <SkeletonBlock className="h-12 w-full" />
                 <SkeletonBlock className="h-12 w-full" />
              </div>
              <SkeletonBlock className="h-12 w-full" />
              <SkeletonBlock className="h-32 w-full" />
           </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'My Profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 pb-2">
               <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-500">
                  <User size={24} />
               </div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Profile</h2>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-700/50">
               <div className="relative group perspective-[1000px]">
                  <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-slate-800 shadow-xl ring-4 ring-slate-50 dark:ring-slate-700/50 overflow-hidden transform-style-3d transition-transform duration-500 group-hover:rotate-y-12">
                     <img src="https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff&size=200" alt="Avatar" className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-800 hover:bg-indigo-700 hover:scale-110 transition-all z-10">
                     <Camera size={14} />
                  </button>
               </div>
               <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Profile Picture</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                     Upload a professional photo. Max size 5MB.
                  </p>
               </div>
               <div className="sm:ml-auto flex gap-3">
                  <Button3D variant="secondary" className="text-sm h-10 px-4">Remove</Button3D>
                  <Button3D variant="primary" className="text-sm h-10 px-4 shadow-indigo-500/20">Upload New</Button3D>
               </div>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input3D 
                  label="Display Name" 
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="bg-slate-50 dark:bg-slate-900/50"
               />
               <Input3D 
                  label="Job Title" 
                  value={userForm.title}
                  onChange={(e) => setUserForm({...userForm, title: e.target.value})}
                  className="bg-slate-50 dark:bg-slate-900/50"
               />
               <div className="md:col-span-2">
                  <Input3D 
                     label="Email Address" 
                     value={userForm.email}
                     onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                     disabled
                     className="opacity-70 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400 mt-2 ml-1 flex items-center gap-1.5">
                     <Lock size={12} /> Email changes require verification.
                  </p>
               </div>
               <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1 mb-2 block">Bio</label>
                  <textarea 
                     className="w-full bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 outline-none border border-slate-200 dark:border-slate-700 shadow-inner-3d-light dark:shadow-inner-3d focus:border-indigo-500 transition-all min-h-[140px] resize-none"
                     value={userForm.bio}
                     onChange={(e) => setUserForm({...userForm, bio: e.target.value})}
                  />
               </div>
            </div>
          </div>
        );

      case 'Team':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col sm:flex-row justify-between items-end gap-4 p-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/10">
                <div>
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Team Management</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Manage your team members and their permissions.</p>
                </div>
                <Button3D variant="primary" iconName="plus" onClick={() => setInviteModalOpen(true)} className="shadow-indigo-500/20">
                   Invite Member
                </Button3D>
             </div>

             <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-inner-3d-light dark:shadow-inner-3d">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                      <tr>
                         <th className="p-4">Member</th>
                         <th className="p-4">Role</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {MOCK_TEAM_MEMBERS.map((member) => (
                         <TiltRow key={member.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full shadow-sm" />
                                  <div>
                                     <div className="font-bold text-slate-800 dark:text-white">{member.name}</div>
                                     <div className="text-xs text-slate-500">{member.email}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="p-4">
                               <Select3D 
                                  options={[
                                     { value: 'Admin', label: 'Admin' },
                                     { value: 'Member', label: 'Member' },
                                     { value: 'Viewer', label: 'Viewer' }
                                  ]}
                                  defaultValue={member.role === 'Owner' ? 'Admin' : member.role}
                                  disabled={member.role === 'Owner'}
                                  className="w-32 !py-1.5 !text-xs"
                               />
                            </td>
                            <td className="p-4">
                               <Badge3D variant={member.status === 'active' ? 'success' : 'warning'}>
                                  {member.status}
                               </Badge3D>
                            </td>
                            <td className="p-4 text-right">
                               {member.role !== 'Owner' && (
                                  <button className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                     <Trash2 size={16} />
                                  </button>
                               )}
                            </td>
                         </TiltRow>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'Appearance':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Theme Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {['light', 'dark', 'system'].map((mode) => {
                  const isActive = mode === 'system' ? false : mode === appearance.colorMode;
                  return (
                     <div 
                        key={mode}
                        onClick={() => { if(mode !== 'system') toggleTheme(); }}
                        className={`
                           cursor-pointer relative p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 group perspective-[500px]
                           ${isActive 
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' 
                              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800/50'}
                        `}
                     >
                        <div className={`
                           w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 transform-style-3d group-hover:rotate-y-180
                           ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
                        `}>
                           {mode === 'light' ? <Sun size={28} /> : mode === 'dark' ? <Moon size={28} /> : <Monitor size={28} />}
                        </div>
                        <span className={`font-bold capitalize ${isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                           {mode} Mode
                        </span>
                        {isActive && (
                           <div className="absolute top-3 right-3 text-indigo-500 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
                              <CheckCircle size={20} className="fill-current" />
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700/50" />

            {/* Density & Motion */}
            <div className="space-y-6">
               <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <div>
                     <h4 className="font-bold text-slate-800 dark:text-white">Interface Density</h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Adjust the spacing of UI elements.</p>
                  </div>
                  <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                     {['Comfortable', 'Compact'].map((d) => (
                        <button
                           key={d}
                           onClick={() => setAppearance({...appearance, density: d.toLowerCase()})}
                           className={`
                              px-5 py-2 rounded-lg text-sm font-bold transition-all
                              ${appearance.density === d.toLowerCase() 
                                 ? 'bg-indigo-500 text-white shadow-md' 
                                 : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                           `}
                        >
                           {d}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                        <Zap size={22} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Reduced Motion</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Minimize 3D animations and transitions.</p>
                     </div>
                  </div>
                  <div 
                     onClick={() => setAppearance({...appearance, reducedMotion: !appearance.reducedMotion})}
                     className={`
                        w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 border
                        ${appearance.reducedMotion ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}
                     `}
                  >
                     <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transition-transform duration-300 ${appearance.reducedMotion ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
               </div>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {[
               { id: 'emailDigest', label: 'Weekly Email Digest', desc: 'Summary of your account activity and performance stats.', icon: Mail },
               { id: 'newLeads', label: 'New Lead Alerts', desc: 'Get notified when new leads match your saved filters.', icon: Bell },
               { id: 'securityAlerts', label: 'Security Alerts', desc: 'Important notifications about your account security.', icon: Shield },
               { id: 'marketing', label: 'Product Updates', desc: 'News about new features and improvements.', icon: Star },
             ].map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm group">
                   <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(item.icon as any, { size: 20 })}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white cursor-pointer" onClick={() => setNotifications({...notifications, [item.id]: !(notifications as any)[item.id]})}>
                         {item.label}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                         {item.desc}
                      </p>
                   </div>
                   <div className="pt-1">
                      <Checkbox3D 
                        checked={(notifications as any)[item.id]} 
                        onChange={() => setNotifications({...notifications, [item.id]: !(notifications as any)[item.id]})}
                      />
                   </div>
                </div>
             ))}
          </div>
        );

      case 'Security':
        return (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                       <Key size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 dark:text-white">Password</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last changed 3 months ago</p>
                    </div>
                 </div>
                 <Button3D variant="secondary" onClick={() => setPasswordModalOpen(true)}>Change Password</Button3D>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                       <Shield size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 dark:text-white">Two-Factor Authentication</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                 </div>
                 <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer border border-slate-300 dark:border-slate-600">
                    <label htmlFor="2fa-toggle" className="absolute left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out cursor-pointer translate-x-0.5 top-0.5"></label>
                 </div>
              </div>

              <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 ml-1">Active Sessions</h3>
                 <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-sm">
                    {MOCK_SESSIONS.map((session, idx) => (
                       <div key={session.id} className={`p-4 flex items-center justify-between ${idx !== MOCK_SESSIONS.length -1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                          <div className="flex items-center gap-4">
                             <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                                <session.icon size={20} />
                             </div>
                             <div>
                                <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
                                   {session.device} 
                                   {session.current && <Badge3D variant="success" className="text-[10px] py-0 px-1.5 h-5 flex items-center">Current</Badge3D>}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                                   <Globe size={10} /> {session.location} • {session.ip}
                                </div>
                             </div>
                          </div>
                          {!session.current && (
                             <button className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-lg transition-colors" title="Revoke Session">
                                <LogOut size={18} />
                             </button>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        );

      case 'API Keys':
         return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center mb-2">
                  <div>
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white">API Keys</h3>
                     <p className="text-sm text-slate-500">Manage keys to access the API.</p>
                  </div>
                  <Button3D variant="primary" iconName="plus" onClick={() => setApiKeyModalOpen(true)} className="text-sm shadow-indigo-500/20">Create New Key</Button3D>
               </div>
               
               <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-inner-3d-light dark:shadow-inner-3d">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                           <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Name</th>
                           <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Key Prefix</th>
                           <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Created</th>
                           <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Last Used</th>
                           <th className="p-4 text-right font-bold text-slate-600 dark:text-slate-300">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {MOCK_API_KEYS.map((key) => (
                           <TiltRow key={key.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="p-4 font-semibold text-slate-800 dark:text-white">{key.name}</td>
                              <td className="p-4 font-mono text-slate-500 text-xs bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded w-fit">{key.prefix}•••••••••</td>
                              <td className="p-4 text-slate-500">{key.created}</td>
                              <td className="p-4 text-slate-500">{key.lastUsed}</td>
                              <td className="p-4 text-right">
                                 <button className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                 </button>
                              </td>
                           </TiltRow>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         );
      
      case 'Billing':
         return (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30">
                  <CreditCard size={48} className="text-white" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Manage Subscription</h3>
               <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 text-lg leading-relaxed">
                  View your current plan, download invoices, or upgrade your subscription to unlock more features.
               </p>
               <Button3D variant="primary" onClick={() => navigate('/billing')} className="px-8 py-3 text-base shadow-indigo-500/20">
                  Go to Billing Dashboard <CreditCard size={18} className="ml-2" />
               </Button3D>
            </div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-enter">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
            Settings
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-500 rounded-full opacity-30" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your account preferences and configurations.</p>
        </div>
        {activeTab === 'My Profile' && (
           <Button3D variant="primary" onClick={handleSave} disabled={isSaving || isLoading} className="shadow-indigo-500/20 min-w-[140px]">
              {isSaving ? 'Saving...' : 'Save Changes'}
           </Button3D>
        )}
      </div>

      {showSuccess && (
        <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm mb-4">
          <CheckCircle size={20} />
          <span className="font-semibold">Settings updated successfully!</span>
        </div>
      )}

      {/* 3D Tabs Navigation */}
      <div className="perspective-container sticky top-4 z-30">
         <div className="card-3d bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl p-2 shadow-3d-light dark:shadow-3d flex overflow-x-auto no-scrollbar gap-1">
            {tabs.map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                     flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex-1 justify-center
                     ${activeTab === tab 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}
                  `}
               >
                  {tab === 'My Profile' && <User size={16} />}
                  {tab === 'Team' && <Users size={16} />}
                  {tab === 'Appearance' && <Palette size={16} />}
                  {tab === 'Notifications' && <Bell size={16} />}
                  {tab === 'Security' && <Shield size={16} />}
                  {tab === 'API Keys' && <Key size={16} />}
                  {tab === 'Billing' && <CreditCard size={16} />}
                  {tab}
               </button>
            ))}
         </div>
      </div>

      {/* Content Area */}
      <div className="perspective-container">
         <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-3d-light dark:shadow-3d p-6 md:p-10 min-h-[500px]">
            {renderContent()}
         </div>
      </div>

      {/* --- Modals --- */}
      <Modal3D isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} title="Change Password">
         <div className="space-y-4">
            <Input3D label="Current Password" type="password" placeholder="••••••••" />
            <Input3D label="New Password" type="password" placeholder="••••••••" />
            <Input3D label="Confirm New Password" type="password" placeholder="••••••••" />
            <div className="flex justify-end gap-3 pt-4">
               <Button3D variant="ghost" onClick={() => setPasswordModalOpen(false)}>Cancel</Button3D>
               <Button3D variant="primary" onClick={() => { setPasswordModalOpen(false); handleSave(); }}>Update Password</Button3D>
            </div>
         </div>
      </Modal3D>

      <Modal3D isOpen={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} title="Create API Key">
         <div className="space-y-4">
            <Input3D label="Key Name" placeholder="e.g. Production Server" />
            <div>
               <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1 mb-2 block">Permissions</label>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/20">
                     <Checkbox3D checked={true} />
                     <span className="text-sm font-medium">Read Access</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/20">
                     <Checkbox3D checked={false} />
                     <span className="text-sm font-medium">Write Access</span>
                  </div>
               </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
               <Button3D variant="ghost" onClick={() => setApiKeyModalOpen(false)}>Cancel</Button3D>
               <Button3D variant="primary" onClick={() => { setApiKeyModalOpen(false); handleSave(); }}>Generate Key</Button3D>
            </div>
         </div>
      </Modal3D>

      <Modal3D isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Team Member">
         <div className="space-y-4">
            <Input3D label="Email Address" placeholder="colleague@company.com" />
            <div className="space-y-1">
               <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Role</label>
               <Select3D 
                  options={[
                     { value: 'Admin', label: 'Admin (Full Access)' },
                     { value: 'Member', label: 'Member (Read/Write)' },
                     { value: 'Viewer', label: 'Viewer (Read Only)' }
                  ]}
                  defaultValue="Member"
               />
            </div>
            <div className="flex justify-end gap-3 pt-4">
               <Button3D variant="ghost" onClick={() => setInviteModalOpen(false)}>Cancel</Button3D>
               <Button3D variant="primary" onClick={() => { setInviteModalOpen(false); handleSave(); }}>Send Invitation</Button3D>
            </div>
         </div>
      </Modal3D>

    </div>
  );
};
