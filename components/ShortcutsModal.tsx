import React from 'react';
import { Modal3D } from './UI';
import { Command, Search, ArrowRight, CornerDownLeft, Delete } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Kbd = ({ children }: { children?: React.ReactNode }) => (
  <kbd className="inline-flex items-center justify-center min-w-[24px] px-1.5 py-0.5 h-6 text-xs font-sans font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-[0_2px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_0_0_rgba(255,255,255,0.1)] mx-0.5">
    {children}
  </kbd>
);

const ShortcutRow = ({ label, keys }: { label: string, keys: React.ReactNode[] }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{label}</span>
    <div className="flex items-center">
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          {k}
          {i < keys.length - 1 && <span className="mx-1 text-slate-300 text-xs">+</span>}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal3D isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" className="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
        
        {/* Navigation Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            Navigation (Go to...)
          </h4>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
             <ShortcutRow label="Dashboard" keys={[<Kbd>g</Kbd>, <Kbd>d</Kbd>]} />
             <ShortcutRow label="Contacts" keys={[<Kbd>g</Kbd>, <Kbd>c</Kbd>]} />
             <ShortcutRow label="Companies" keys={[<Kbd>g</Kbd>, <Kbd>o</Kbd>]} />
             <ShortcutRow label="Email Finder" keys={[<Kbd>g</Kbd>, <Kbd>f</Kbd>]} />
             <ShortcutRow label="Email Verifier" keys={[<Kbd>g</Kbd>, <Kbd>v</Kbd>]} />
             <ShortcutRow label="AI Chat" keys={[<Kbd>g</Kbd>, <Kbd>a</Kbd>]} />
             <ShortcutRow label="Billing" keys={[<Kbd>g</Kbd>, <Kbd>b</Kbd>]} />
             <ShortcutRow label="Settings" keys={[<Kbd>g</Kbd>, <Kbd>s</Kbd>]} />
          </div>
        </div>

        {/* Global & Actions Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            Global
          </h4>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 mb-6">
             <ShortcutRow 
               label="Global Search" 
               keys={[<Kbd><Command size={10} /></Kbd>, <Kbd>K</Kbd>]} 
             />
             <ShortcutRow 
               label="Show Shortcuts" 
               keys={[<Kbd>Shift</Kbd>, <Kbd>?</Kbd>]} 
             />
             <ShortcutRow 
               label="Close Modal / Blur" 
               keys={[<Kbd>Esc</Kbd>]} 
             />
          </div>

          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            General Controls
          </h4>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
             <ShortcutRow label="Confirm / Send" keys={[<Kbd>Enter</Kbd>]} />
             <ShortcutRow label="Navigate lists" keys={[<Kbd>Tab</Kbd>]} />
          </div>
        </div>

      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
         <p className="text-xs text-slate-400">
            Press <Kbd>g</Kbd> then the highlighted letter to navigate quickly.
         </p>
      </div>
    </Modal3D>
  );
};