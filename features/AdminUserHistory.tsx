
import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Globe, Smartphone, Calendar, 
  LogIn, UserPlus, Key, Settings, ShieldAlert, RefreshCw, 
  ChevronLeft, ChevronRight, Lock, Laptop, Monitor
} from 'lucide-react';
import { Card3D, Button3D, Input3D, Select3D, TiltRow, Badge3D } from '../components/UI';
import { SkeletonTable3D } from '../components/Skeleton';
import { useUserHistory } from '../hooks/useUserHistory';
import { useRole } from '../hooks/useRole';
import { UserHistoryEventType } from '../types';

export const AdminUserHistory: React.FC = () => {
  const { isSuperAdmin } = useRole();
  const { 
    history, 
    isLoading, 
    totalItems, 
    currentPage, 
    totalPages,
    setCurrentPage,
    searchQuery, 
    setSearchQuery, 
    eventTypeFilter, 
    setEventTypeFilter,
    refresh
  } = useUserHistory({ autoLoad: isSuperAdmin });

  // Event Type Configuration (Icons & Colors for the block style)
  const getEventConfig = (type: UserHistoryEventType) => {
    switch(type) {
      case 'login': 
        return { label: 'Login', bgClass: 'bg-indigo-100 dark:bg-indigo-900/40', textClass: 'text-indigo-700 dark:text-indigo-300', borderClass: 'border-indigo-200 dark:border-indigo-800' };
      case 'registration': 
        return { label: 'Registration', bgClass: 'bg-emerald-100 dark:bg-emerald-900/40', textClass: 'text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-200 dark:border-emerald-800' };
      case 'password_reset': 
        return { label: 'Password Reset', bgClass: 'bg-amber-100 dark:bg-amber-900/40', textClass: 'text-amber-700 dark:text-amber-300', borderClass: 'border-amber-200 dark:border-amber-800' };
      case 'settings_update': 
        return { label: 'Settings Update', bgClass: 'bg-blue-100 dark:bg-blue-900/40', textClass: 'text-blue-700 dark:text-blue-300', borderClass: 'border-blue-200 dark:border-blue-800' };
      case 'api_key_created': 
        return { label: 'API Key Created', bgClass: 'bg-purple-100 dark:bg-purple-900/40', textClass: 'text-purple-700 dark:text-purple-300', borderClass: 'border-purple-200 dark:border-purple-800' };
      default: 
        return { label: 'Unknown', bgClass: 'bg-slate-100 dark:bg-slate-800', textClass: 'text-slate-700 dark:text-slate-300', borderClass: 'border-slate-200 dark:border-slate-700' };
    }
  };

  const getDeviceIcon = (deviceStr: string) => {
    const d = deviceStr.toLowerCase();
    if (d.includes('mobile') || d.includes('iphone') || d.includes('android')) return <Smartphone size={16} className="text-slate-400" />;
    if (d.includes('mac') || d.includes('windows') || d.includes('linux')) return <Laptop size={16} className="text-slate-400" />;
    return <Monitor size={16} className="text-slate-400" />;
  };

  // If not super admin, show access denied
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
                You do not have the required permissions (Super Admin) to view this audit log.
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
               User Activity History
             </h1>
             <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide border border-purple-200 dark:border-purple-800">
               Super Admin
             </span>
           </div>
           <p className="text-slate-500 dark:text-slate-400">
             Audit log of all user authentication and account events.
           </p>
        </div>
        <div className="flex gap-3">
           <Button3D variant="secondary" onClick={refresh} iconName="refresh-cw" disabled={isLoading} className="bg-white dark:bg-slate-800">
              {isLoading ? 'Refreshing...' : 'Refresh Log'}
           </Button3D>
           <Button3D variant="primary" iconName="download" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none">
              Export Log
           </Button3D>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white dark:bg-slate-800/60 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/60 backdrop-blur-sm">
         <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Search User</label>
               <div className="relative">
                 <input 
                    type="text"
                    placeholder="Search by name, email, or ID..." 
                    className="w-full pl-4 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 font-medium border border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
            </div>
            <div className="w-full md:w-64 space-y-1.5">
               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Event Type</label>
               <div className="relative">
                 <select 
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2.5 outline-none border border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition-all cursor-pointer text-sm font-medium"
                 >
                    <option value="all">All Events</option>
                    <option value="login">Login</option>
                    <option value="registration">Registration</option>
                    <option value="password_reset">Password Reset</option>
                    <option value="settings_update">Settings Update</option>
                    <option value="api_key_created">API Key Created</option>
                 </select>
               </div>
            </div>
            <div className="w-full md:w-auto">
               <button 
                 onClick={() => { setSearchQuery(''); setEventTypeFilter('all'); }}
                 className="h-[42px] px-6 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
               >
                 Reset Filters
               </button>
            </div>
         </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col min-h-[600px]">
            
         {/* Table Info Header */}
         <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-white dark:bg-slate-800">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
               Showing <span className="font-bold text-slate-800 dark:text-white">{totalItems}</span> events
            </div>
            <div className="text-xs text-slate-400 font-medium">
               Page {currentPage} of {totalPages}
            </div>
         </div>

         {/* Table Content */}
         {isLoading ? (
             <div className="p-4">
               <SkeletonTable3D rows={12} />
             </div>
         ) : (
             <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[1000px]">
                   <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                         <th className="px-6 py-4">User</th>
                         <th className="px-6 py-4">Event</th>
                         <th className="px-6 py-4">Location</th>
                         <th className="px-6 py-4">IP Address</th>
                         <th className="px-6 py-4">Device</th>
                         <th className="px-6 py-4 text-right">Date & Time</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {history.length === 0 ? (
                         <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-500 dark:text-slate-400">
                               No events found matching your filters.
                            </td>
                         </tr>
                      ) : (
                         history.map((item) => {
                            const { label, bgClass, textClass, borderClass } = getEventConfig(item.event_type);
                            return (
                               <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                  {/* User Column */}
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 overflow-hidden shrink-0">
                                           <img 
                                              src={item.user_avatar} 
                                              alt={item.user_name} 
                                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                           />
                                        </div>
                                        <div>
                                           <div className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{item.user_name}</div>
                                           <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.user_email}</div>
                                        </div>
                                     </div>
                                  </td>

                                  {/* Event Column - Block Style */}
                                  <td className="px-6 py-4">
                                     <div className={`
                                        w-full max-w-[140px] h-10 rounded-lg flex items-center justify-center text-xs font-bold border
                                        ${bgClass} ${textClass} ${borderClass}
                                     `}>
                                        {label}
                                     </div>
                                  </td>

                                  {/* Location Column */}
                                  <td className="px-6 py-4">
                                     <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                                           <MapPin size={14} className="text-slate-400 shrink-0" />
                                           <span className="truncate max-w-[120px]">{item.city}, {item.country_code}</span>
                                        </div>
                                        <div className="text-xs text-slate-400 ml-5 mt-0.5">{item.timezone}</div>
                                     </div>
                                  </td>

                                  {/* IP Column */}
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-mono">
                                        <Globe size={14} className="text-slate-400 shrink-0" />
                                        {item.ip}
                                     </div>
                                  </td>

                                  {/* Device Column */}
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        {getDeviceIcon(item.device)}
                                        <span className="truncate max-w-[150px] text-sm">{item.device}</span>
                                     </div>
                                  </td>

                                  {/* Date Column */}
                                  <td className="px-6 py-4 text-right">
                                     <div className="flex flex-col items-end">
                                        <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                                           {new Date(item.created_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                           <Calendar size={10} />
                                           {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </div>
                                     </div>
                                  </td>
                               </tr>
                            );
                         })
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
  );
};
