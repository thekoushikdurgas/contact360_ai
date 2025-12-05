
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Edit, Trash2, Shield, CheckCircle, XCircle, 
  User as UserIcon, ShieldAlert, CreditCard, Calendar, Lock,
  MoreHorizontal, ChevronLeft, ChevronRight, Filter, AlertTriangle, 
  Loader2, Save, X
} from 'lucide-react';
import { Card3D, Button3D, Input3D, Select3D, TiltRow, Badge3D, Modal3D } from '../components/UI';
import { SkeletonTable3D } from '../components/Skeleton';
import { useRole } from '../hooks/useRole';
import { UserRole } from '../types';

// --- Types & Mock Data ---

interface UserListItem {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  credits: number;
  subscription_plan: string;
  subscription_period: string;
  status: 'active' | 'inactive';
  joined_at: string;
  last_login: string;
}

const MOCK_NAMES = [
  'Alex Johnson', 'Sarah Miller', 'Mike Chen', 'Emily Davis', 'James Wilson', 
  'Lisa Anderson', 'David Kim', 'Jessica Taylor', 'Robert Martinez', 'Jennifer White',
  'William Brown', 'Elizabeth Jones', 'Joseph Garcia', 'Margaret Rodriguez', 'Charles Lee'
];

const generateMockUsers = (count: number): UserListItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const name = MOCK_NAMES[i % MOCK_NAMES.length] + (i > MOCK_NAMES.length ? ` ${i}` : '');
    const roles = Object.values(UserRole);
    // Weighted random role
    const rand = Math.random();
    let role = UserRole.FREE_USER;
    if (rand > 0.95) role = UserRole.SUPER_ADMIN;
    else if (rand > 0.85) role = UserRole.ADMIN;
    else if (rand > 0.6) role = UserRole.PRO_USER;

    const plans = ['Free', 'Starter', 'Pro', 'Business', 'Enterprise'];
    const periods = ['Monthly', 'Quarterly', 'Yearly'];
    
    return {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email: `${name.toLowerCase().replace(/ /g, '.')}@example.com`,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=random&color=fff`,
      role,
      credits: Math.floor(Math.random() * 50000),
      subscription_plan: plans[Math.floor(Math.random() * plans.length)],
      subscription_period: periods[Math.floor(Math.random() * periods.length)],
      status: (Math.random() > 0.1 ? 'active' : 'inactive') as 'active' | 'inactive',
      joined_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      last_login: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
    };
  }).sort((a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime());
};

const INITIAL_USERS = generateMockUsers(45);

// --- Component ---

export const AdminUsers: React.FC = () => {
  const { isSuperAdmin } = useRole();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals State
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [userToPromote, setUserToPromote] = useState<UserListItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({ role: '', credits: 0 });

  // Initial Load
  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch
    const timer = setTimeout(() => {
      setUsers(INITIAL_USERS);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleEditClick = (user: UserListItem) => {
    setEditingUser(user);
    setEditForm({ role: user.role, credits: user.credits });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, role: editForm.role as UserRole, credits: editForm.credits } 
          : u
      ));
      setIsProcessing(false);
      setEditingUser(null);
    }, 1000);
  };

  const handlePromote = () => {
    if (!userToPromote) return;
    setIsProcessing(true);

    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === userToPromote.id ? { ...u, role: UserRole.SUPER_ADMIN } : u
      ));
      setIsProcessing(false);
      setUserToPromote(null);
    }, 1500);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    setIsProcessing(true);

    setTimeout(() => {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setIsProcessing(false);
      setUserToDelete(null);
    }, 1000);
  };

  // Helper for role badge colors
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'purple';
      case UserRole.ADMIN: return 'indigo';
      case UserRole.PRO_USER: return 'emerald';
      default: return 'slate';
    }
  };

  // Access Control
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-enter">
        <div className="perspective-container">
           <div className="card-3d bg-white dark:bg-slate-800 border-2 border-rose-100 dark:border-rose-900/30 p-12 rounded-2xl shadow-3d-light dark:shadow-3d text-center">
              <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-3d-light dark:shadow-inner-3d">
                 <Lock size={40} className="text-rose-500" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg">
                You need Super Admin privileges to manage users.
              </p>
              <div className="mt-8">
                 <Button3D variant="secondary" onClick={() => window.history.back()}>
                    Return to Dashboard
                 </Button3D>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-enter">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
               User Management
             </h1>
             <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide border border-purple-200 dark:border-purple-800">
               Super Admin Zone
             </span>
           </div>
           <p className="text-slate-500 dark:text-slate-400">
             Manage users, roles, credits, and permissions across the platform.
           </p>
        </div>
        <div className="flex gap-3">
           <Button3D variant="primary" iconName="plus" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none">
              Create User
           </Button3D>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800/60 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/60 backdrop-blur-sm">
         <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
               <input 
                  type="text"
                  placeholder="Search users by name, email, or role..." 
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 font-medium border border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <Button3D variant="secondary" className="h-[42px] px-4 text-sm whitespace-nowrap">
                  <Filter size={14} className="mr-2" /> All Roles
               </Button3D>
               <Button3D variant="secondary" className="h-[42px] px-4 text-sm whitespace-nowrap">
                  <Filter size={14} className="mr-2" /> All Status
               </Button3D>
            </div>
         </div>
      </div>

      {/* Users Table */}
      <div className="perspective-container">
        <div className="card-3d bg-white dark:bg-slate-800/80 rounded-xl shadow-3d-light dark:shadow-3d border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col min-h-[600px]">
          
           {/* Table Header Info */}
           <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                 Found <span className="font-bold text-slate-800 dark:text-white">{filteredUsers.length}</span> users
              </div>
              <div className="text-xs text-slate-400 font-medium">
                 Page {currentPage} of {totalPages}
              </div>
           </div>

           {/* Table Content */}
           {isLoading ? (
             <div className="p-4">
                <SkeletonTable3D rows={10} />
             </div>
           ) : (
             <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[1000px]">
                   <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                         <th className="px-6 py-4">User</th>
                         <th className="px-6 py-4">Role</th>
                         <th className="px-6 py-4">Credits</th>
                         <th className="px-6 py-4">Plan</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Joined</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {filteredUsers.length === 0 ? (
                         <tr>
                            <td colSpan={7} className="p-12 text-center text-slate-500 dark:text-slate-400">
                               No users found matching "{searchTerm}".
                            </td>
                         </tr>
                      ) : (
                         paginatedUsers.map((user) => (
                            <TiltRow key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                               {/* User */}
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <div className="relative">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                     </div>
                                     <div>
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{user.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                                     </div>
                                  </div>
                               </td>

                               {/* Role */}
                               <td className="px-6 py-4">
                                  <Badge3D variant={getRoleBadgeVariant(user.role)}>
                                     {user.role.replace('_', ' ')}
                                  </Badge3D>
                               </td>

                               {/* Credits */}
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300">
                                     <CreditCard size={14} className="text-slate-400" />
                                     {user.credits.toLocaleString()}
                                  </div>
                               </td>

                               {/* Plan */}
                               <td className="px-6 py-4">
                                  <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                                     {user.subscription_plan}
                                  </div>
                                  <div className="text-xs text-slate-400 capitalize">{user.subscription_period}</div>
                               </td>

                               {/* Status */}
                               <td className="px-6 py-4">
                                  {user.status === 'active' ? (
                                     <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle size={14} /> Active
                                     </span>
                                  ) : (
                                     <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                        <XCircle size={14} /> Inactive
                                     </span>
                                  )}
                               </td>

                               {/* Joined */}
                               <td className="px-6 py-4">
                                  <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                     <Calendar size={14} className="text-slate-400" />
                                     {new Date(user.joined_at).toLocaleDateString()}
                                  </div>
                               </td>

                               {/* Actions */}
                               <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                     <button 
                                        onClick={() => handleEditClick(user)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                                        title="Edit User"
                                     >
                                        <Edit size={16} />
                                     </button>
                                     
                                     {user.role !== UserRole.SUPER_ADMIN && (
                                        <button 
                                           onClick={() => setUserToPromote(user)}
                                           className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors"
                                           title="Promote to Super Admin"
                                        >
                                           <Shield size={16} />
                                        </button>
                                     )}
                                     
                                     <button 
                                        onClick={() => setUserToDelete(user)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
                                        title="Delete User"
                                     >
                                        <Trash2 size={16} />
                                     </button>
                                  </div>
                               </td>
                            </TiltRow>
                         ))
                      )}
                   </tbody>
                </table>
             </div>
           )}

           {/* Pagination */}
           <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 flex items-center justify-end gap-3">
              <button 
                 disabled={currentPage === 1 || isLoading}
                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                 className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                 <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                 {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                       pageNum = currentPage - 2 + i;
                       if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                    
                    return (
                       <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`
                             w-8 h-8 rounded-lg text-sm font-medium transition-all
                             ${currentPage === pageNum 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                          `}
                       >
                          {pageNum}
                       </button>
                    );
                 })}
              </div>

              <button 
                 disabled={currentPage === totalPages || isLoading}
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                 className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                 <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* --- Modals --- */}
      {/* ... (Modals remain unchanged) ... */}
    </div>
  );
};
