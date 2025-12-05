
import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

// Base shimmer block with depth hints
export const SkeletonBlock: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div 
    className={`relative overflow-hidden bg-slate-200/60 dark:bg-slate-700/60 rounded-lg shadow-inner-3d-light dark:shadow-inner-3d ${className}`}
    style={style}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />
  </div>
);

// Circular skeleton for avatars
export const SkeletonCircle: React.FC<SkeletonProps & { size?: number }> = ({ className = '', size = 40, style }) => (
  <div 
    className={`relative overflow-hidden bg-slate-200/60 dark:bg-slate-700/60 rounded-full shadow-inner-3d-light dark:shadow-inner-3d shrink-0 ${className}`}
    style={{ width: size, height: size, ...style }}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />
  </div>
);

// 3D Card Skeleton representing a metric or simple card
export const SkeletonCard3D: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`perspective-container w-full h-full ${className}`} style={style}>
    <div className="card-3d w-full h-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
       <div className="flex items-center justify-between mb-4">
         <SkeletonCircle size={40} className="rounded-xl" />
         <SkeletonBlock className="h-6 w-16 rounded-full" />
       </div>
       <div>
         <SkeletonBlock className="h-4 w-24 mb-2" />
         <SkeletonBlock className="h-8 w-32" />
       </div>
    </div>
  </div>
);

// 3D List Item / Row Skeleton
export const SkeletonRow3D: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 ${className}`} style={style}>
    <SkeletonBlock className="w-5 h-5 rounded-md shrink-0" /> {/* Checkbox */}
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <SkeletonCircle size={36} className="rounded-lg" />
      <div className="space-y-1.5 flex-1 max-w-[150px]">
         <SkeletonBlock className="h-3.5 w-full" />
         <SkeletonBlock className="h-2.5 w-2/3" />
      </div>
    </div>
    <SkeletonBlock className="h-3 w-24 hidden sm:block shrink-0" />
    <SkeletonBlock className="h-3 w-32 hidden md:block shrink-0" />
    <SkeletonBlock className="h-3 w-16 hidden lg:block shrink-0" />
    <div className="w-20 flex justify-end shrink-0">
      <SkeletonBlock className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);

// Full Table Skeleton
export const SkeletonTable3D: React.FC<{ rows?: number } & SkeletonProps> = ({ rows = 5, className = '', style }) => (
  <div className={`relative w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/40 shadow-inner-3d-light dark:shadow-inner-3d overflow-hidden flex flex-col ${className}`} style={style}>
    {/* Header */}
    <div className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4">
      <SkeletonBlock className="w-5 h-5 rounded-md shrink-0" />
      <SkeletonBlock className="h-3 w-24 shrink-0" />
      <SkeletonBlock className="h-3 w-20 hidden sm:block shrink-0" />
      <SkeletonBlock className="h-3 w-32 hidden md:block shrink-0" />
      <SkeletonBlock className="h-3 w-24 ml-auto shrink-0" />
    </div>
    <div className="flex-1">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow3D key={i} />
      ))}
    </div>
  </div>
);

// Dashboard Chart Skeleton
export const SkeletonChart3D: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`perspective-container h-full ${className}`} style={style}>
    <div className="card-3d w-full h-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <SkeletonBlock className="h-6 w-32" />
        <SkeletonBlock className="h-8 w-48 rounded-lg" />
      </div>
      <div className="flex-1 flex items-end gap-2 md:gap-4 px-2 pb-2">
        {Array.from({ length: 12 }).map((_, i) => (
           <SkeletonBlock 
             key={i} 
             className="w-full rounded-t-lg opacity-60" 
             style={{ height: `${Math.random() * 60 + 20}%` }} 
           />
        ))}
      </div>
    </div>
  </div>
);

// Grid Card Skeleton (for Companies/Projects)
export const SkeletonGridCard: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`perspective-container ${className}`} style={style}>
     <div className="card-3d h-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm flex flex-col">
        <div className="flex justify-between items-start mb-4">
           <div className="flex gap-3">
              <SkeletonBlock className="w-12 h-12 rounded-xl" />
              <div className="space-y-2 pt-1">
                 <SkeletonBlock className="h-4 w-32" />
                 <SkeletonBlock className="h-3 w-20" />
              </div>
           </div>
           <SkeletonBlock className="w-5 h-5 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
           <SkeletonBlock className="h-12 rounded-lg" />
           <SkeletonBlock className="h-12 rounded-lg" />
        </div>
        <div className="flex gap-2 mt-auto pt-2">
           <SkeletonBlock className="h-5 w-16 rounded-md" />
           <SkeletonBlock className="h-5 w-16 rounded-md" />
        </div>
     </div>
  </div>
);
