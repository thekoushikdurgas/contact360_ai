import React, { useState, useEffect } from 'react';
import { Card3D, Button3D, TiltRow, TabGroup } from '../components/UI';
import { 
  FileSpreadsheet, Download, Coins, Loader2
} from 'lucide-react';

interface ExportList {
  id: string;
  name: string;
  count: number;
  createdAt: string;
  status: 'Ready' | 'Processing';
  creditsDeducted: number;
  progress: number;
}

const INITIAL_EXPORTS: ExportList[] = [
  { id: '1', name: 'Q1 Tech Leads', count: 1420, createdAt: '2023-10-15', status: 'Ready', creditsDeducted: 1420, progress: 100 },
  { id: '2', name: 'Healthcare CEOs', count: 530, createdAt: '2023-10-12', status: 'Ready', creditsDeducted: 530, progress: 100 },
  { id: '3', name: 'Marketing VPs (NY)', count: 210, createdAt: '2023-10-10', status: 'Processing', creditsDeducted: 210, progress: 45 },
];

export const Exports: React.FC = () => {
  const [lists, setLists] = useState<ExportList[]>(INITIAL_EXPORTS);
  const [activeTab, setActiveTab] = useState('All Lists');

  useEffect(() => {
    const interval = setInterval(() => {
      setLists(currentLists => 
        currentLists.map(list => {
          if (list.status === 'Processing' && list.progress < 100) {
            // Random increment between 1 and 8%
            const increment = Math.floor(Math.random() * 8) + 1;
            const newProgress = Math.min(list.progress + increment, 100);
            const isFinished = newProgress === 100;
            
            return {
              ...list,
              progress: newProgress,
              status: isFinished ? 'Ready' : 'Processing',
            };
          }
          return list;
        })
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCreate = () => {
    const newListId = Date.now().toString();
    const newList: ExportList = {
      id: newListId,
      name: `New Export ${lists.length + 1}`,
      count: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Processing',
      creditsDeducted: 0,
      progress: 0
    };
    
    setLists(prev => [newList, ...prev]);
    
    // Simulate backend calculation delay
    setTimeout(() => {
      const randomCount = Math.floor(Math.random() * 900) + 50;
      setLists(prev => prev.map(l => 
        l.id === newListId 
          ? { ...l, creditsDeducted: randomCount, count: randomCount } 
          : l
      ));
    }, 500);
  };

  const handleDownload = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Downloading export ${id}...`);
  };

  const filteredLists = lists.filter(list => {
    if (activeTab === 'Ready') return list.status === 'Ready';
    if (activeTab === 'Processing') return list.status === 'Processing';
    return true;
  });

  return (
    <div className="space-y-8 animate-enter pb-12 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
            Export Lists
            <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-indigo-500 rounded-full opacity-60" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your exported lists and track credit usage.</p>
        </div>
        <Button3D variant="primary" iconName="plus" onClick={handleCreate} className="shadow-indigo-500/20">
          Create List
        </Button3D>
      </div>

      {/* Main Table Card */}
      <div className="perspective-container">
         <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-3d-light dark:shadow-3d overflow-hidden min-h-[400px] flex flex-col">
            
            {/* Tabs & Stats */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <TabGroup 
                tabs={['All Lists', 'Ready', 'Processing']}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                 {filteredLists.length} Lists Found
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left text-sm min-w-[800px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700/50">
                     <tr>
                        <th className="p-6 w-1/4">List Name</th>
                        <th className="p-6">Records</th>
                        <th className="p-6">Created Date</th>
                        <th className="p-6">Credits Deducted</th>
                        <th className="p-6 w-1/4">Status & Progress</th>
                        <th className="p-6 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {filteredLists.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="p-12 text-center">
                              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner-3d-light dark:shadow-inner-3d">
                                 <FileSpreadsheet size={32} />
                              </div>
                              <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg">No exported lists yet</h3>
                              <p className="text-slate-500 dark:text-slate-400 mt-1">Create one to get started.</p>
                           </td>
                        </tr>
                     ) : (
                        filteredLists.map((item) => {
                           const isProcessing = item.status === 'Processing';
                           return (
                              <TiltRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                 {/* List Name */}
                                 <td className="p-6">
                                    <div className="flex items-center gap-4">
                                       <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-inner-3d-light dark:shadow-inner-3d group-hover:scale-110 transition-transform duration-300">
                                          <FileSpreadsheet size={20} />
                                       </div>
                                       <div className="font-bold text-slate-800 dark:text-slate-100 text-base">
                                          {item.name}
                                       </div>
                                    </div>
                                 </td>

                                 {/* Records */}
                                 <td className="p-6 font-medium text-slate-700 dark:text-slate-300 text-base">
                                    {item.count > 0 ? item.count.toLocaleString() : '-'}
                                 </td>

                                 {/* Created Date */}
                                 <td className="p-6 text-slate-500 dark:text-slate-400 font-medium">
                                    {item.createdAt}
                                 </td>

                                 {/* Credits Deducted */}
                                 <td className="p-6">
                                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/10 px-3 py-1.5 rounded-lg w-fit border border-rose-100 dark:border-rose-900/20 shadow-sm">
                                       <Coins size={16} className="text-amber-500" fill="currentColor" fillOpacity={0.2} />
                                       <span>{item.creditsDeducted > 0 ? `-${item.creditsDeducted.toLocaleString()}` : '0'}</span>
                                    </div>
                                 </td>

                                 {/* Status & Progress */}
                                 <td className="p-6">
                                    <div className="flex flex-col gap-2">
                                       <div className="flex justify-between items-center text-xs">
                                          <div className="flex items-center gap-2">
                                             {isProcessing && <Loader2 size={14} className="animate-spin text-indigo-600 dark:text-indigo-400" />}
                                             <span className={`font-bold tracking-wide uppercase ${
                                                isProcessing 
                                                   ? 'text-indigo-600 dark:text-indigo-400' 
                                                   : 'text-emerald-600 dark:text-emerald-400'
                                             }`}>
                                                {item.status}
                                             </span>
                                          </div>
                                          <span className="text-slate-500 font-mono">{item.progress}%</span>
                                       </div>
                                       
                                       {/* 3D Progress Bar */}
                                       <div className="w-full h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden relative shadow-inner-3d-light dark:shadow-inner-3d">
                                          <div 
                                             className={`h-full transition-all duration-700 ease-out rounded-full relative overflow-hidden ${
                                                isProcessing 
                                                   ? 'bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]' 
                                                   : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                             }`} 
                                             style={{ width: `${item.progress}%` }}
                                          >
                                             {isProcessing && (
                                                <>
                                                   {/* Pulsing Glow Loop */}
                                                   <div className="absolute inset-0 bg-indigo-400/30 animate-pulse" />
                                                   {/* Moving Shimmer */}
                                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_linear_infinite] -skew-x-12" />
                                                </>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                 </td>

                                 {/* Actions */}
                                 <td className="p-6 text-right">
                                    {item.status === 'Ready' && (
                                       <button 
                                          onClick={(e) => handleDownload(item.id, e)}
                                          className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-all text-sm font-bold ml-auto group/btn" 
                                          title="Download CSV"
                                       >
                                          <Download size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" /> 
                                          Download CSV
                                       </button>
                                    )}
                                 </td>
                              </TiltRow>
                           );
                        })
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};