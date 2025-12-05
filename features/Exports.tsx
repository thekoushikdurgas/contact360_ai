
import React, { useState, useEffect } from 'react';
import { Card3D, Button3D, TiltRow, TabGroup } from '../components/UI';
import { SkeletonTable3D } from '../components/Skeleton';
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
  const [lists, setLists] = useState<ExportList[]>([]);
  const [activeTab, setActiveTab] = useState('All Lists');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
       setLists(INITIAL_EXPORTS);
       setIsLoading(false);
    }, 1000);
  }, []);

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
         <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-3d-light dark:shadow-3d overflow-hidden min-h-[500px] flex flex-col p-6">
            
            <div className="flex justify-between items-center mb-6">
               <TabGroup tabs={['All Lists', 'Ready', 'Processing']} activeTab={activeTab} onChange={setActiveTab} />
               <div className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                  <Coins size={14} className="text-amber-500" />
                  Total Exported: <span className="text-slate-800 dark:text-white font-bold">{lists.reduce((acc, l) => acc + l.creditsDeducted, 0).toLocaleString()}</span>
               </div>
            </div>

            {isLoading ? (
               <SkeletonTable3D rows={6} />
            ) : (
               <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <table className="w-full text-left text-sm min-w-[800px]">
                     <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700/50">
                        <tr>
                           <th className="px-6 py-4">List Name</th>
                           <th className="px-6 py-4">Records</th>
                           <th className="px-6 py-4">Created Date</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Credits</th>
                           <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {filteredLists.length === 0 ? (
                           <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                 No exports found in this category.
                              </td>
                           </tr>
                        ) : (
                           filteredLists.map((list) => (
                              <TiltRow key={list.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                          <FileSpreadsheet size={18} />
                                       </div>
                                       <span className="font-semibold text-slate-700 dark:text-slate-200">{list.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">
                                    {list.count > 0 ? list.count.toLocaleString() : '-'}
                                 </td>
                                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                    {list.createdAt}
                                 </td>
                                 <td className="px-6 py-4">
                                    {list.status === 'Processing' ? (
                                       <div className="w-full max-w-[120px]">
                                          <div className="flex justify-between text-[10px] font-bold text-indigo-500 mb-1">
                                             <span>PROCESSING</span>
                                             <span>{list.progress}%</span>
                                          </div>
                                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                             <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${list.progress}%` }} />
                                          </div>
                                       </div>
                                    ) : (
                                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                          READY
                                       </span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="font-mono text-slate-600 dark:text-slate-300">-{list.creditsDeducted}</span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    {list.status === 'Ready' && (
                                       <button 
                                          onClick={(e) => handleDownload(list.id, e)}
                                          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1 ml-auto hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-all"
                                       >
                                          <Download size={14} /> Download
                                       </button>
                                    )}
                                 </td>
                              </TiltRow>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
