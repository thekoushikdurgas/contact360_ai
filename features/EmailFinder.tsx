import React, { useState } from 'react';
import { Card3D, Input3D, Button3D, Badge3D } from '../components/UI';
import { Search, Clock, Copy, Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, Sparkles, ArrowRight, X, Mail, ShieldCheck } from 'lucide-react';
import { findEmail } from '../services/geminiService';

interface HistoryItem {
  id: string;
  firstName: string;
  lastName: string;
  domain: string;
  email: string | null;
  status: 'Valid' | 'Not Found';
  confidence: number;
  timestamp: string;
}

const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: '1',
    firstName: 'Ayan',
    lastName: 'Saha',
    domain: 'piamamedia.com',
    email: 'ayan.saha@piamamedia.com',
    status: 'Valid',
    confidence: 95,
    timestamp: 'a few seconds ago'
  },
  {
    id: '2',
    firstName: 'Nicholas',
    lastName: 'Ferreira',
    domain: 'kneesupcakery.com',
    email: null,
    status: 'Not Found',
    confidence: 0,
    timestamp: '18 days ago'
  }
];

export const EmailFinder: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', domain: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.domain) return;
    
    setIsSearching(true);
    
    // Simulate API/AI call
    const result = await findEmail(formData.firstName, formData.lastName, formData.domain);
    
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      domain: formData.domain,
      email: result.email,
      status: result.email ? 'Valid' : 'Not Found',
      confidence: result.confidence,
      timestamp: 'Just now'
    };
    
    setHistory(prev => [newItem, ...prev]);
    setIsSearching(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, we would trigger a toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 animate-enter">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
            Email Finder
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-500 rounded-full opacity-30" />
          </h1>
        </div>
        <div>
          {mode === 'single' ? (
             <Button3D variant="secondary" iconName="upload" onClick={() => setMode('bulk')}>Upload a list</Button3D>
          ) : (
             <Button3D variant="secondary" iconName="search" onClick={() => setMode('single')}>Back to Single Search</Button3D>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Search / Upload Panel */}
        <div>
          {mode === 'single' ? (
            <div className="perspective-container">
              <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden shadow-3d-light dark:shadow-3d">
                {/* Gradient Top Border */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <div className="p-6 md:p-8">
                  {/* Card Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 shadow-inner-3d-light dark:shadow-inner-3d border border-red-100 dark:border-red-500/20">
                      <Search size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Email Finder</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Enter a name and domain to find the email.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input3D 
                        label="First Name" 
                        placeholder="John" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-slate-50 dark:bg-slate-900/50"
                      />
                      <Input3D 
                        label="Last Name" 
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-slate-50 dark:bg-slate-900/50"
                      />
                    </div>
                    <div className="relative">
                       <Input3D 
                         label="Company Domain" 
                         placeholder="company.com" 
                         value={formData.domain}
                         onChange={(e) => setFormData({...formData, domain: e.target.value})}
                         className="pl-10 bg-slate-50 dark:bg-slate-900/50"
                       />
                       <div className="absolute left-3 top-[38px] text-slate-400 pointer-events-none font-bold">@</div>
                    </div>

                    <div className="pt-2">
                      <Button3D 
                        variant="danger" 
                        className="w-full h-12 text-lg font-medium shadow-red-200 dark:shadow-none !bg-[#ff3b30] hover:!bg-[#ff2d22] border-none text-white"
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <span className="flex items-center gap-2">
                             <Sparkles className="animate-spin" size={20} /> Searching...
                          </span>
                        ) : (
                          "Find email address"
                        )}
                      </Button3D>
                      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                        Using the domain name instead of the company name allows for better results. For example, Prospeo.io
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="perspective-container animate-enter">
              <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl p-8 shadow-3d-light dark:shadow-3d">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shadow-inner-3d-light dark:shadow-inner-3d">
                      <Upload size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Bulk Email Finder</h2>
                 </div>

                 <div className="flex flex-col items-center justify-center text-center space-y-6 py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer group">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <FileSpreadsheet size={32} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Drop your CSV file here</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                        Find emails in bulk by uploading a list of names and domains.
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                       <Badge3D variant="neutral">CSV</Badge3D>
                       <Badge3D variant="neutral">XLS</Badge3D>
                    </div>

                    <div className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer">
                       <Download size={14} /> Download sample template
                    </div>
                 </div>

                 <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-5">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                       <AlertCircle size={18} /> Required Columns
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                       <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-100 dark:border-blue-500/20 text-center shadow-sm">First Name</div>
                       <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-100 dark:border-blue-500/20 text-center shadow-sm">Last Name</div>
                       <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-100 dark:border-blue-500/20 text-center shadow-sm">Domain</div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 py-2 border-b border-slate-200 dark:border-slate-700/50">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">History</h3>
          </div>
          
          <div className="space-y-4">
              {history.map((item, idx) => (
                <div 
                  key={item.id}
                  className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-enter"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     {/* Left: Info */}
                     <div className="flex items-start gap-4">
                        <div className={`
                          mt-1 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner-3d-light dark:shadow-inner-3d shrink-0
                          ${item.status === 'Valid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}
                        `}>
                           {item.status === 'Valid' ? <ShieldCheck size={18} /> : <X size={18} />}
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={10} /> {item.timestamp}
                              </span>
                           </div>
                           <div className="text-base font-semibold text-slate-700 dark:text-slate-200">
                             {item.firstName} {item.lastName} <span className="text-slate-400 mx-1">•</span> <span className="text-indigo-600 dark:text-indigo-400">{item.domain}</span>
                           </div>
                        </div>
                     </div>

                     {/* Right: Result */}
                     <div className="w-full sm:w-auto">
                        {item.email ? (
                          <div className="flex flex-col gap-2 min-w-[240px]">
                             <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg p-2 pl-3">
                                <span className="font-bold text-slate-800 dark:text-white flex-1 truncate">{item.email}</span>
                                <button 
                                   onClick={() => copyToClipboard(item.email!)}
                                   className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-md transition-colors"
                                   title="Copy email"
                                >
                                   <Copy size={16} />
                                </button>
                             </div>
                             
                             <div className="flex items-center justify-between text-xs px-1">
                                <Badge3D variant="success">
                                   <span className="flex items-center gap-1"><CheckCircle size={10} strokeWidth={3} /> VALID</span>
                                </Badge3D>
                                <span className="text-slate-400 font-medium">{item.confidence}% Confidence</span>
                             </div>
                             {/* Mini Progress Bar for visual flair */}
                             <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${item.confidence}%` }} />
                             </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-100 dark:border-slate-700/50 min-w-[240px] justify-center">
                             <AlertCircle size={16} />
                             <span className="font-medium text-sm">No email found</span>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
