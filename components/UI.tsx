
import React, { ReactNode, useState, useRef } from 'react';
import { ICON_MAP } from '../constants';
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  iconName?: string;
  action?: ReactNode;
}

export const Card3D: React.FC<CardProps> = ({ children, className = '', title, iconName, action }) => {
  const Icon = iconName ? ICON_MAP[iconName] : null;

  return (
    <div className={`perspective-container group ${className.includes('h-') ? '' : 'h-full'} ${className}`}>
      <div className={`card-3d relative w-full ${className.includes('h-') ? '' : 'h-full'} bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4 md:p-6 shadow-3d-light dark:shadow-3d hover:shadow-3d-hover-light dark:hover:shadow-3d-hover transition-all duration-300 flex flex-col`}>
        {/* Glossy Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none dark:from-white/5" />
        
        {(title || Icon || action) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 relative z-10 gap-3 sm:gap-0 shrink-0">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-slate-700/50 shadow-inner-3d-light dark:shadow-inner-3d text-indigo-600 dark:text-indigo-400">
                  <Icon size={20} />
                </div>
              )}
              {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
            </div>
            {action && <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">{action}</div>}
          </div>
        )}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal3D: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className={`relative z-10 w-[95%] sm:w-full max-w-lg my-auto animate-enter ${className}`}>
        <Card3D title={title} className="bg-white dark:bg-slate-900 shadow-2xl !h-auto max-h-[90dvh] flex flex-col" action={
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={18} />
          </button>
        }>
          <div className="overflow-y-auto pr-2 custom-scrollbar max-h-[calc(90dvh-100px)]">
             {children}
          </div>
        </Card3D>
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'outline';
  iconName?: string;
  children: ReactNode;
}

export const Button3D: React.FC<ButtonProps> = ({ variant = 'primary', iconName, children, className = '', ...props }) => {
  const Icon = iconName ? ICON_MAP[iconName] : null;
  
  const baseStyles = "relative overflow-hidden font-medium rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 select-none touch-manipulation";
  
  const variants = {
    primary: "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-[0_5px_15px_-5px_rgba(99,102,241,0.5),inset_0_-2px_0_0_rgba(0,0,0,0.2)] border-t border-indigo-400 hover:brightness-110",
    success: "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_5px_15px_-5px_rgba(16,185,129,0.5),inset_0_-2px_0_0_rgba(0,0,0,0.2)] border-t border-emerald-400 hover:brightness-110",
    secondary: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1),inset_0_-2px_0_0_rgba(255,255,255,0.5)] dark:shadow-[0_5px_15px_-5px_rgba(0,0,0,0.3),inset_0_-2px_0_0_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600",
    danger: "bg-rose-600 text-white shadow-[0_5px_15px_-5px_rgba(225,29,72,0.5)] border-t border-rose-400 hover:brightness-110",
    ghost: "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
    outline: "bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} py-2.5 px-4`}
      {...props}
    >
      {Icon && <Icon size={18} className="shrink-0" />}
      <span className="relative z-10 whitespace-nowrap">{children}</span>
    </button>
  );
};

interface Input3DProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const Input3D: React.FC<Input3DProps> = ({ label, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{label}</label>}
      <div className="relative group">
        <input
          className={`w-full bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none border border-slate-200 dark:border-slate-700 shadow-inner-3d-light dark:shadow-inner-3d focus:border-indigo-500/50 focus:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)] transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-base md:text-sm ${className}`}
          {...props}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
      </div>
    </div>
  );
};

interface Select3DProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select3D: React.FC<Select3DProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{label}</label>}
      <div className="relative group">
        <select
          className="w-full appearance-none bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 outline-none border border-slate-200 dark:border-slate-700 shadow-inner-3d-light dark:shadow-inner-3d focus:border-indigo-500/50 focus:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)] transition-all duration-300 cursor-pointer text-base md:text-sm"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const Checkbox3D: React.FC<{ checked?: boolean; onChange?: () => void; label?: string }> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer group touch-manipulation" onClick={onChange}>
      <div 
        className={`
          w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 shadow-inner-3d-light dark:shadow-inner-3d border shrink-0
          ${checked 
            ? 'bg-indigo-500 border-indigo-400 text-white' 
            : 'bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
          }
        `}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </div>
      {label && <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors select-none">{label}</span>}
    </div>
  );
};

export const Badge3D: React.FC<{ children: ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'indigo' | 'blue' | 'purple' | 'rose' | 'emerald' | 'slate', className?: string }> = ({ children, variant = 'neutral', className = '' }) => {
  const styles: any = {
    success: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    warning: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    danger: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
    rose: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
    neutral: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600',
    slate: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600',
    indigo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
    blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    purple: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
  };

  return (
    <span className={`
      px-2.5 py-0.5 rounded-lg text-xs font-semibold border shadow-sm whitespace-nowrap
      ${styles[variant] || styles.neutral} ${className}
    `}>
      {children}
    </span>
  );
};

export const TabGroup: React.FC<{
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700/50 relative shadow-inner-3d-light dark:shadow-inner-3d w-full sm:max-w-fit overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`
              relative px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-10 whitespace-nowrap flex-1 sm:flex-none
              ${isActive ? 'text-white shadow-lg' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
            `}
          >
            {isActive && (
              <div className="absolute inset-0 bg-indigo-600 rounded-lg shadow-lg -z-10 animate-in fade-in zoom-in-95 duration-200" />
            )}
            {tab}
          </button>
        );
      })}
    </div>
  );
};

interface Accordion3DProps {
  title: string;
  children: ReactNode;
  icon?: React.ElementType;
  defaultOpen?: boolean;
  rightElement?: ReactNode;
}

export const Accordion3D: React.FC<Accordion3DProps> = ({ title, children, icon: Icon, defaultOpen = false, rightElement }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-800/40 shadow-sm transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 text-left transition-colors ${isOpen ? 'bg-slate-50/50 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-slate-500 dark:text-slate-400" />}
          <span className="font-medium text-sm text-slate-700 dark:text-slate-300">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-3 pt-0 border-t border-slate-200/50 dark:border-slate-700/30">
          <div className="pt-3">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiSelect3D: React.FC<{
  placeholder?: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  color?: string;
  suggestions?: string[];
}> = ({ placeholder, items, onAdd, onRemove, color = 'indigo', suggestions = [] }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-3">
       {items.length > 0 && (
         <div className="flex flex-wrap gap-2">
           {items.map((item) => (
             <Badge3D key={item} variant={color as any}>
               <span className="flex items-center gap-1">
                 {item}
                 <button onClick={() => onRemove(item)} className="hover:bg-black/10 rounded-full p-0.5"><X size={10} /></button>
               </span>
             </Badge3D>
           ))}
         </div>
       )}
       <div className="relative">
         <Input3D 
           placeholder={placeholder || "Type and press Enter..."}
           value={inputValue}
           onChange={(e) => setInputValue(e.target.value)}
           onKeyDown={handleKeyDown}
           className="text-xs py-2 h-9"
         />
       </div>
       
       {/* Suggestions / Demo Select */}
       {suggestions.length > 0 && (
         <div className="mt-2">
             <div className="flex flex-wrap gap-1.5 mb-2">
               {suggestions.filter(s => !items.includes(s)).slice(0, 3).map(s => (
                 <button 
                   key={s} 
                   onClick={() => onAdd(s)}
                   className="text-[10px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors"
                 >
                   + {s}
                 </button>
               ))}
             </div>
             
             <div className="relative group">
                <select 
                   className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors"
                   onChange={(e) => {
                      if(e.target.value) {
                          onAdd(e.target.value);
                          e.target.value = '';
                      }
                   }}
                   defaultValue=""
                >
                   <option value="" disabled>Select from list...</option>
                   {suggestions.filter(s => !items.includes(s)).map(s => (
                      <option key={s} value={s}>{s}</option>
                   ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={12} />
                </div>
             </div>
         </div>
       )}
    </div>
  );
};

export const RangeSlider3D: React.FC<{
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (val: number) => string;
}> = ({ min, max, step = 1, value, onChange, formatLabel = (v) => v.toString() }) => {
  const range = max - min;
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => ((val - min) / range) * 100;

  const handleMouseDown = (index: 0 | 1) => (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startVal = value[index];
    
    const onMove = (moveEvent: MouseEvent) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const deltaPixels = moveEvent.clientX - startX;
      const deltaValue = (deltaPixels / rect.width) * range;
      
      let newValue = startVal + deltaValue;
      newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));

      const nextValues = [...value] as [number, number];
      nextValues[index] = newValue;

      if (index === 0) nextValues[0] = Math.min(nextValues[0], nextValues[1]);
      else nextValues[1] = Math.max(nextValues[0], nextValues[1]);

      onChange(nextValues);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div className="py-4 px-1">
      <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
        <span>{formatLabel(value[0])}</span>
        <span>{formatLabel(value[1])}</span>
      </div>
      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full shadow-inner cursor-pointer group touch-action-none" ref={sliderRef}>
        <div 
          className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full opacity-90 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
          style={{ 
            left: `${getPercentage(value[0])}%`, 
            right: `${100 - getPercentage(value[1])}%` 
          }}
        />
        
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white dark:bg-slate-800 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.3)] border-2 border-indigo-50 dark:border-slate-600 cursor-grab active:cursor-grabbing flex items-center justify-center z-10 hover:scale-110 transition-transform group-hover:border-indigo-400"
          style={{ left: `${getPercentage(value[0])}%` }}
          onMouseDown={handleMouseDown(0)}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </div>

        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white dark:bg-slate-800 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.3)] border-2 border-indigo-50 dark:border-slate-600 cursor-grab active:cursor-grabbing flex items-center justify-center z-10 hover:scale-110 transition-transform group-hover:border-indigo-400"
          style={{ left: `${getPercentage(value[1])}%` }}
          onMouseDown={handleMouseDown(1)}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export const TiltRow: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void; 
  isSelected?: boolean 
}> = ({ children, className = '', onClick, isSelected }) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // Disable on mobile/small screens for performance
    if (window.innerWidth < 768) return;
    
    if (!rowRef.current) return;
    
    // Throttle via RequestAnimationFrame
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      if (!rowRef.current) return;
      const { left, top, width, height } = rowRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      const tiltX = (0.5 - y) * 2; 
      const tiltY = (x - 0.5) * 2; 

      rowRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.005)`;
      rowRef.current.style.zIndex = '10';
      
      rowRef.current.style.boxShadow = `
        ${-(x - 0.5) * 10}px ${-(y - 0.5) * 10}px 20px rgba(0,0,0,0.1),
        0 0 0 1px rgba(99,102,241,${isSelected ? '0.4' : '0.1'})
      `;
      
      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
    }
    
    if (!rowRef.current) return;
    rowRef.current.style.transform = isSelected ? 'scale(1)' : 'none';
    rowRef.current.style.zIndex = isSelected ? '5' : '1';
    rowRef.current.style.boxShadow = isSelected ? '0 0 0 1px rgba(99,102,241,0.4), 0 4px 12px rgba(99,102,241,0.1)' : 'none';
  };

  return (
    <tr 
      ref={rowRef}
      className={`transition-transform duration-300 ease-out will-change-transform relative ${className} ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-900/10 z-[5]' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};
