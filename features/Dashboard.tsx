
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card3D, Button3D, TabGroup } from '../components/UI';
import { SkeletonCard3D, SkeletonChart3D, SkeletonRow3D } from '../components/Skeleton';
import { MOCK_STATS, MOCK_ACTIVITIES, ICON_MAP } from '../constants';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const CHART_DATA = [
  { name: 'Mon', leads: 4000, verified: 2400 },
  { name: 'Tue', leads: 3000, verified: 1398 },
  { name: 'Wed', leads: 2000, verified: 9800 },
  { name: 'Thu', leads: 2780, verified: 3908 },
  { name: 'Fri', leads: 1890, verified: 4800 },
  { name: 'Sat', leads: 2390, verified: 3800 },
  { name: 'Sun', leads: 3490, verified: 4300 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState('Weekly');
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-enter">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-white dark:to-slate-400">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">Welcome back to HyperDash 3D</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button3D variant="secondary" iconName="download" className="w-full sm:w-auto">Export Report</Button3D>
          <Button3D variant="primary" iconName="check-circle" onClick={() => navigate('/contacts')} className="w-full sm:w-auto">
            New Campaign
          </Button3D>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard3D key={i} />)
        ) : (
          MOCK_STATS.map((stat, idx) => {
            const Icon = ICON_MAP[stat.iconName];
            const isPositive = stat.change >= 0;
            const colorClass = 
              stat.colorVariant === 'indigo' ? 'text-indigo-500 dark:text-indigo-400' :
              stat.colorVariant === 'blue' ? 'text-blue-500 dark:text-blue-400' :
              stat.colorVariant === 'emerald' ? 'text-emerald-500 dark:text-emerald-400' :
              'text-orange-500 dark:text-orange-400';
              
            return (
              <div 
                key={idx} 
                className="perspective-container animate-enter" 
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="card-3d relative bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 p-5 md:p-6 rounded-2xl shadow-3d-light dark:shadow-3d hover:bg-white/80 dark:hover:bg-slate-800/60 group">
                   <div className="flex justify-between items-start relative z-10">
                     <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 shadow-inner-3d-light dark:shadow-inner-3d ${colorClass} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                       <Icon size={24} />
                     </div>
                     <div className={`flex items-center gap-1 text-xs md:text-sm font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                       {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                       {Math.abs(stat.change)}%
                     </div>
                   </div>
                   <div className="mt-4 relative z-10">
                     <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">{stat.title}</h4>
                     <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 tracking-tight">{stat.value}</p>
                   </div>
                   {/* Decorative background glow */}
                   <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-${stat.colorVariant}-500/10 blur-[40px] rounded-full group-hover:bg-${stat.colorVariant}-500/20 transition-all duration-500`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 h-full">
          {isLoading ? (
             <SkeletonChart3D />
          ) : (
            <div className="h-full animate-enter" style={{ animationDelay: '400ms' }}>
              <Card3D title="Performance" iconName="trending-up" 
                action={<TabGroup tabs={['Weekly', 'Monthly', 'Yearly']} activeTab={chartPeriod} onChange={setChartPeriod} />}
              >
                <div className="h-[250px] md:h-[300px] w-full mt-4 relative z-10 -ml-2 md:ml-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#cbd5e1'} opacity={0.3} vertical={false} />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} tick={{fontSize: 10}} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} tick={{fontSize: 10}} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)', 
                          backdropFilter: 'blur(10px)',
                          border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                          color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
                        }} 
                        itemStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#334155' }}
                        cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                      />
                      <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" animationDuration={1500} />
                      <Area type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVerified)" animationDuration={1500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card3D>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1 h-full">
           {isLoading ? (
             <div className="perspective-container h-full">
               <div className="card-3d w-full h-full bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-700/50" />
                   <div className="h-6 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                 </div>
                 {Array.from({ length: 4 }).map((_, i) => <SkeletonRow3D key={i} className="border-none p-2" />)}
               </div>
             </div>
           ) : (
             <div className="h-full animate-enter" style={{ animationDelay: '500ms' }}>
              <Card3D title="Activity" iconName="check-circle" className="h-full">
                <div className="space-y-4 mt-2">
                  {MOCK_ACTIVITIES.map((activity, idx) => (
                    <div 
                      key={activity.id} 
                      className="flex gap-3 md:gap-4 group cursor-pointer animate-enter p-3 -mx-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-white/5 transition-all duration-200"
                      style={{ animationDelay: `${600 + idx * 100}ms` }}
                    >
                      <div className="relative shrink-0">
                        <img 
                          src={activity.user.avatar} 
                          alt={activity.user.name}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-md group-hover:border-indigo-500/50 transition-colors" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-500 dark:text-slate-300 truncate">
                          <span className="font-semibold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{activity.user.name}</span>
                          {' '}{activity.action}{' '}
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{activity.target}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400 dark:text-slate-500">{activity.timestamp}</span>
                          {activity.count && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-all">
                              {activity.count} records
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 animate-enter" style={{ animationDelay: '900ms' }}>
                    <Button3D variant="secondary" className="w-full text-sm">View All Activity</Button3D>
                  </div>
                </div>
              </Card3D>
             </div>
           )}
        </div>
      </div>

      {/* Quick Actions Grid (Bottom) */}
      <div className="animate-enter" style={{ animationDelay: '800ms' }}>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-4 px-1 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {[
            { label: 'Find Leads', path: '/contacts', color: 'indigo' },
            { label: 'Track Company', path: '/companies', color: 'blue' },
            { label: 'Exports', path: '/export', color: 'emerald' },
            { label: 'Email Finder', path: '/finder', color: 'amber' },
            { label: 'LinkedIn', path: '/linkedin', color: 'sky' },
            { label: 'AI Chat', path: '/ai-chat', color: 'rose' },
          ].map((action, idx) => (
            <button 
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group relative overflow-hidden rounded-xl p-4 md:p-6 bg-white/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-3d-light dark:shadow-3d hover:shadow-3d-hover-light dark:hover:shadow-3d-hover transition-all duration-300 hover:-translate-y-2 text-left animate-enter"
              style={{ animationDelay: `${900 + idx * 50}ms` }}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-${action.color}-500/10 dark:bg-${action.color}-500/20 text-${action.color}-600 dark:text-${action.color}-400 flex items-center justify-center mb-3 shadow-inner-3d-light dark:shadow-inner-3d group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <ArrowRight size={18} className="md:w-5 md:h-5" />
              </div>
              <span className="font-medium text-sm md:text-base text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{action.label}</span>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
