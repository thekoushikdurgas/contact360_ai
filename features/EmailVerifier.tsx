
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card3D, Button3D, Badge3D, Input3D, TabGroup, Checkbox3D } from '../components/UI';
import { 
  ShieldCheck, Upload, FileText, Sparkles, CheckCircle, 
  AlertTriangle, XCircle, Search, AlertCircle, FileSpreadsheet,
  Download, ArrowRight, RefreshCw, HelpCircle, History, List, Settings,
  Copy, Mail, Trash2, Database, User, Globe, Loader2, Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeEmailRisk, verifyBulkEmails, verifyGeneratedEmails } from '../services/geminiService';

// --- Types ---
type MainTab = 'Bulk' | 'Email' | 'Management' | 'History';
type SubTab = 'Paste' | 'Upload' | 'History' | 'Single' | 'Generate' | 'Credits' | 'Lists';

interface VerificationResult {
  email?: string;
  riskScore: number;
  analysis: string;
  isRoleBased: boolean;
  isDisposable: boolean;
  status: 'valid' | 'invalid' | 'catch-all' | 'unknown';
  timestamp?: Date;
}

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

interface EmailList {
  id: string;
  name: string;
  total: number;
  valid: number;
  invalid: number;
  updatedAt: string;
}

// --- Helpers ---
const getStatusColor = (status: string) => {
  switch(status) {
    case 'valid': return 'emerald';
    case 'invalid': return 'rose';
    case 'catch-all': return 'amber';
    default: return 'slate';
  }
};

const getStatusIcon = (status: string) => {
   switch(status) {
    case 'valid': return CheckCircle;
    case 'invalid': return XCircle;
    case 'catch-all': return AlertTriangle;
    default: return HelpCircle;
  }
};

// Validation Helpers
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDomain = (domain: string) => {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain);
};

// --- Mock Data ---
const MOCK_LISTS: EmailList[] = [
  { id: '1', name: 'Q3_Marketing_Leads', total: 1250, valid: 980, invalid: 120, updatedAt: '2 hours ago' },
  { id: '2', name: 'Tech_Conference_Attendees', total: 450, valid: 410, invalid: 15, updatedAt: '1 day ago' },
];

const INITIAL_HISTORY: ActivityItem[] = [
  { id: '1', action: 'Bulk Verification', details: 'Verified 150 emails from CSV', timestamp: '10 mins ago', status: 'success' },
  { id: '2', action: 'Single Verification', details: 'john.doe@example.com', timestamp: '1 hour ago', status: 'success' },
  { id: '3', action: 'Generate & Verify', details: 'Acme Corp - 5 emails found', timestamp: '3 hours ago', status: 'warning' },
];

// --- Sub Components ---

const ActivityHistory: React.FC<{ items: ActivityItem[] }> = ({ items }) => (
  <div className="space-y-4">
    {items.map((item, idx) => (
      <div key={item.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between animate-enter gap-2" style={{ animationDelay: `${idx * 50}ms` }}>
         <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : item.status === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'}`}>
               {item.status === 'success' ? <CheckCircle size={18} /> : item.status === 'warning' ? <AlertTriangle size={18} /> : <XCircle size={18} />}
            </div>
            <div>
               <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{item.action}</h4>
               <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{item.details}</p>
            </div>
         </div>
         <span className="text-xs text-slate-400 font-medium self-end sm:self-auto">{item.timestamp}</span>
      </div>
    ))}
  </div>
);

export const EmailVerifier: React.FC = () => {
  const navigate = useNavigate();
  
  // Navigation State
  const [mainTab, setMainTab] = useState<MainTab>('Bulk');
  const [subTab, setSubTab] = useState<SubTab>('Paste');
  
  // Data State
  const [bulkInput, setBulkInput] = useState('');
  const [singleInput, setSingleInput] = useState('');
  const [genForm, setGenForm] = useState({ first: '', last: '', domain: '' });
  
  // Validation State
  const [singleError, setSingleError] = useState<string | null>(null);
  const [genErrors, setGenErrors] = useState<{first?: string, last?: string, domain?: string}>({});

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkResults, setBulkResults] = useState<VerificationResult[] | null>(null);
  const [singleResult, setSingleResult] = useState<VerificationResult | null>(null);
  const [genResults, setGenResults] = useState<any | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(INITIAL_HISTORY);

  // Stats for Bulk Input
  const bulkStats = useMemo(() => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l);
    const validCount = lines.filter(isValidEmail).length;
    return {
      total: lines.length,
      valid: validCount,
      invalid: lines.length - validCount
    };
  }, [bulkInput]);

  // Validation Logic
  const validateSingleEmail = (val: string) => {
    if (!val) {
      setSingleError(null);
      return false;
    }
    if (!isValidEmail(val)) {
      setSingleError("Please enter a valid email address");
      return false;
    }
    setSingleError(null);
    return true;
  };

  const validateGenForm = () => {
    const errors: any = {};
    if (!genForm.first.trim()) errors.first = "First name is required";
    if (!genForm.last.trim()) errors.last = "Last name is required";
    if (!genForm.domain.trim()) {
      errors.domain = "Domain is required";
    } else if (!isValidDomain(genForm.domain)) {
      errors.domain = "Invalid domain format (e.g. acme.com)";
    }
    setGenErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleBulkVerify = async () => {
    if (!bulkInput.trim()) return;
    setIsProcessing(true);
    const emails = bulkInput.split('\n').map(e => e.trim()).filter(e => e);
    
    try {
      const results = await verifyBulkEmails(emails);
      setBulkResults(results);
      setActivityLog(prev => [{
        id: Date.now().toString(),
        action: 'Bulk Verification',
        details: `Verified ${emails.length} emails`,
        timestamp: 'Just now',
        status: 'success'
      }, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock parsing for demo
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        // Simple CSV parse: assume email is first column or just grab emails by regex
        const foundEmails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
        // Dedup
        const unique = Array.from(new Set(foundEmails)).slice(0, 100); // Limit to 100 for demo
        setBulkInput(unique.join('\n'));
        setSubTab('Paste'); // Switch to paste view to verify
      };
      reader.readAsText(file);
    }
  };

  const handleSingleVerify = async () => {
    if (!validateSingleEmail(singleInput)) return;
    setIsProcessing(true);
    try {
       const res = await analyzeEmailRisk(singleInput);
       let status: any = 'valid';
       if (res.riskScore > 70) status = 'invalid';
       else if (res.riskScore > 30) status = 'catch-all';

       setSingleResult({ ...res, email: singleInput, status });
       setActivityLog(prev => [{
        id: Date.now().toString(),
        action: 'Single Verification',
        details: singleInput,
        timestamp: 'Just now',
        status: status === 'valid' ? 'success' : 'warning'
      }, ...prev]);
    } catch (e) {
       console.error(e);
    } finally {
       setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    if (!validateGenForm()) return;
    setIsProcessing(true);
    try {
      const res = await verifyGeneratedEmails(genForm.first, genForm.last, genForm.domain);
      setGenResults(res);
       setActivityLog(prev => [{
        id: Date.now().toString(),
        action: 'Generate & Verify',
        details: `${genForm.first} ${genForm.last} @ ${genForm.domain}`,
        timestamp: 'Just now',
        status: 'success'
      }, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Render Logic
  const renderBulkTab = () => (
    <div className="space-y-6 animate-enter">
       <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700/50 pb-2 overflow-x-auto no-scrollbar">
         {['Paste', 'Upload', 'History'].map(tab => (
           <button 
             key={tab}
             onClick={() => { setSubTab(tab as SubTab); setBulkResults(null); }}
             className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${subTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
           >
             {tab} Emails
           </button>
         ))}
       </div>

       {subTab === 'Paste' && (
         <div className="space-y-4">
           {!bulkResults ? (
             <>
               <div className="relative">
                 <textarea 
                    className="w-full h-64 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:border-indigo-500 font-mono text-sm resize-none shadow-inner-3d-light dark:shadow-inner-3d focus:bg-white dark:focus:bg-slate-900 transition-all"
                    placeholder="Paste email addresses here (one per line)..."
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                 />
                 <div className="absolute right-4 bottom-4 text-xs bg-white/50 dark:bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm flex gap-2">
                    <span className="text-slate-500 dark:text-slate-400">{bulkStats.total} lines</span>
                    {bulkStats.valid > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-medium">{bulkStats.valid} valid</span>}
                    {bulkStats.invalid > 0 && <span className="text-rose-600 dark:text-rose-400 font-bold">{bulkStats.invalid} invalid</span>}
                 </div>
               </div>
               <div className="flex justify-end">
                  <Button3D 
                    variant="primary" 
                    onClick={handleBulkVerify} 
                    disabled={isProcessing || !bulkInput.trim() || bulkStats.valid === 0}
                  >
                    {isProcessing ? <><Loader2 className="animate-spin mr-2" size={16} /> Verifying...</> : <><Sparkles size={16} className="mr-2" /> Verify Emails</>}
                  </Button3D>
               </div>
             </>
           ) : (
             <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{bulkResults.length}</div>
                   </div>
                   <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/30">
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Valid</div>
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {bulkResults.filter(r => r.status === 'valid').length}
                      </div>
                   </div>
                   <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-500/30">
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Catch-All</div>
                      <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        {bulkResults.filter(r => r.status === 'catch-all').length}
                      </div>
                   </div>
                   <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-500/30">
                      <div className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">Invalid</div>
                      <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                        {bulkResults.filter(r => r.status === 'invalid').length}
                      </div>
                   </div>
                </div>

                {/* Results Table */}
                <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm min-w-[600px]">
                       <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                         <tr>
                           <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                           <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                           <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Risk Score</th>
                           <th className="p-3 text-right">Action</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {bulkResults.map((res, i) => {
                           const Icon = getStatusIcon(res.status);
                           const color = getStatusColor(res.status);
                           return (
                             <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                               <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{res.email}</td>
                               <td className="p-3">
                                 <Badge3D variant={color as any}>
                                   <div className="flex items-center gap-1">
                                      <Icon size={12} /> {res.status.toUpperCase()}
                                   </div>
                                 </Badge3D>
                               </td>
                               <td className="p-3">
                                 <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${res.riskScore > 70 ? 'bg-rose-500' : res.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                      style={{ width: `${res.riskScore}%` }}
                                    />
                                 </div>
                               </td>
                               <td className="p-3 text-right">
                                  <button onClick={() => copyToClipboard(res.email!)} className="text-slate-400 hover:text-indigo-500 transition-colors p-1">
                                     <Copy size={14} />
                                  </button>
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   </div>
                </div>
                
                <div className="flex justify-end gap-3">
                   <Button3D variant="ghost" onClick={() => setBulkResults(null)}>Verify New Batch</Button3D>
                   <Button3D variant="secondary" iconName="download">Download CSV</Button3D>
                </div>
             </div>
           )}
         </div>
       )}

       {subTab === 'Upload' && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer group relative">
             <input type="file" accept=".csv,.xls,.xlsx" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
             <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <FileSpreadsheet size={32} className="text-indigo-600 dark:text-indigo-400" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Drop your file here or click to browse</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Max file size: 50MB. Max rows: 2,500.</p>
             </div>
             <div className="flex gap-2">
                <Badge3D variant="neutral">CSV</Badge3D>
                <Badge3D variant="neutral">XLS</Badge3D>
             </div>
             <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1 z-20 relative" onClick={(e) => { e.stopPropagation(); console.log("Download template"); }}>
                <Download size={14} /> Download sample template
             </button>
          </div>
       )}

       {subTab === 'History' && <ActivityHistory items={activityLog.filter(i => i.action.includes('Bulk'))} />}
    </div>
  );

  const renderEmailTab = () => (
     <div className="space-y-6 animate-enter">
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700/50 pb-2 overflow-x-auto no-scrollbar">
         {['Single', 'Generate', 'History'].map(tab => (
           <button 
             key={tab}
             onClick={() => { setSubTab(tab as SubTab); setSingleResult(null); setGenResults(null); }}
             className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${subTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
           >
             {tab === 'Generate' ? 'Generate & Verify' : tab}
           </button>
         ))}
       </div>

       {subTab === 'Single' && (
          <div className="max-w-xl mx-auto space-y-8 py-4">
             {!singleResult ? (
                <>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enter Email Address</label>
                     <Input3D 
                        placeholder="john.doe@company.com" 
                        value={singleInput}
                        onChange={(e) => {
                          setSingleInput(e.target.value);
                          if (singleError) validateSingleEmail(e.target.value);
                        }}
                        onBlur={() => validateSingleEmail(singleInput)}
                        className={`h-12 text-lg ${singleError ? '!border-rose-500 focus:!border-rose-500' : ''}`}
                     />
                     {singleError && (
                        <p className="text-sm text-rose-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                           <AlertCircle size={14} /> {singleError}
                        </p>
                     )}
                  </div>
                  <Button3D 
                    variant="primary" 
                    className="w-full h-12" 
                    onClick={handleSingleVerify} 
                    disabled={isProcessing || !singleInput.trim() || !!singleError}
                  >
                     {isProcessing ? <><Loader2 className="animate-spin mr-2" /> Verifying...</> : 'Verify Email'}
                  </Button3D>
                </>
             ) : (
                <div className={`
                   rounded-2xl p-6 border-2 shadow-lg animate-enter
                   ${singleResult.status === 'valid' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-500/30' : 
                     singleResult.status === 'catch-all' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-500/30' : 
                     'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-500/30'}
                `}>
                   <div className="flex items-start gap-4 mb-6">
                      <div className={`p-3 rounded-full shadow-sm ${
                         singleResult.status === 'valid' ? 'bg-emerald-100 text-emerald-600' :
                         singleResult.status === 'catch-all' ? 'bg-amber-100 text-amber-600' :
                         'bg-rose-100 text-rose-600'
                      }`}>
                         {singleResult.status === 'valid' ? <CheckCircle size={32} /> : singleResult.status === 'catch-all' ? <AlertTriangle size={32} /> : <XCircle size={32} />}
                      </div>
                      <div className="flex-1">
                         <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 capitalize">{singleResult.status.replace('-', ' ')}</h3>
                         <div className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">{singleResult.email}</div>
                         <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{singleResult.analysis}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50">
                         <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1">SCORE</div>
                         <div className="font-bold text-lg">{singleResult.riskScore}/100</div>
                      </div>
                      <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50">
                         <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1">DISPOSABLE</div>
                         <div className={`font-bold text-lg ${singleResult.isDisposable ? 'text-rose-600' : 'text-emerald-600'}`}>
                           {singleResult.isDisposable ? 'Yes' : 'No'}
                         </div>
                      </div>
                   </div>

                   <Button3D variant="ghost" onClick={() => setSingleResult(null)} className="w-full">
                     Verify another email
                   </Button3D>
                </div>
             )}
          </div>
       )}

       {subTab === 'Generate' && (
          <div className="max-w-2xl mx-auto space-y-8 py-4">
             {!genResults ? (
               <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input3D 
                        label="First Name" 
                        placeholder="Jane" 
                        value={genForm.first} 
                        onChange={e => {
                          setGenForm({...genForm, first: e.target.value});
                          if (genErrors.first) setGenErrors({...genErrors, first: undefined});
                        }}
                        className={genErrors.first ? '!border-rose-500' : ''}
                      />
                      {genErrors.first && <p className="text-xs text-rose-500 mt-1">{genErrors.first}</p>}
                    </div>
                    <div>
                      <Input3D 
                        label="Last Name" 
                        placeholder="Doe" 
                        value={genForm.last} 
                        onChange={e => {
                          setGenForm({...genForm, last: e.target.value});
                          if (genErrors.last) setGenErrors({...genErrors, last: undefined});
                        }}
                        className={genErrors.last ? '!border-rose-500' : ''}
                      />
                      {genErrors.last && <p className="text-xs text-rose-500 mt-1">{genErrors.last}</p>}
                    </div>
                 </div>
                 <div className="relative">
                    <Input3D 
                      label="Company Domain" 
                      placeholder="acme.com" 
                      value={genForm.domain} 
                      onChange={e => {
                        setGenForm({...genForm, domain: e.target.value});
                        if (genErrors.domain) setGenErrors({...genErrors, domain: undefined});
                      }}
                      className={`pl-8 ${genErrors.domain ? '!border-rose-500' : ''}`}
                    />
                    <span className="absolute left-3 top-[38px] text-slate-400 font-bold">@</span>
                    {genErrors.domain && <p className="text-xs text-rose-500 mt-1">{genErrors.domain}</p>}
                 </div>
                 
                 <Button3D variant="primary" className="w-full h-12 mt-6" onClick={handleGenerate} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="animate-spin mr-2" /> Generating...</> : 'Generate & Verify Emails'}
                 </Button3D>
               </>
             ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm animate-enter">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Verification Results</h3>
                      <Badge3D variant="success">{genResults.total_valid} Valid Found</Badge3D>
                   </div>
                   
                   <div className="space-y-3 mb-6">
                      {genResults.valid_emails.length > 0 ? (
                        genResults.valid_emails.map((res: any, idx: number) => (
                           <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                              <span className="font-mono text-emerald-800 dark:text-emerald-200 font-medium break-all">{res.email}</span>
                              <button onClick={() => copyToClipboard(res.email)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 p-1 shrink-0">
                                 <Copy size={16} />
                              </button>
                           </div>
                        ))
                      ) : (
                         <div className="text-center p-4 text-slate-500">No valid emails found for this combination.</div>
                      )}
                   </div>
                   
                   <Button3D variant="secondary" onClick={() => setGenResults(null)} className="w-full">Generate more emails</Button3D>
                </div>
             )}
          </div>
       )}

       {subTab === 'History' && <ActivityHistory items={activityLog.filter(i => !i.action.includes('Bulk'))} />}
     </div>
  );

  const renderManagementTab = () => (
     <div className="space-y-6 animate-enter">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Credits Card */}
           <div className="perspective-container">
              <div className="card-3d bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                 <div className="flex items-start justify-between mb-8">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                       <Coins size={28} className="text-white" />
                    </div>
                    <Badge3D variant="neutral" className="bg-white/20 border-none text-white">Active Plan</Badge3D>
                 </div>
                 <div>
                    <div className="text-4xl font-bold mb-1">2,450</div>
                    <div className="text-indigo-100 font-medium">Credits Remaining</div>
                 </div>
                 <div className="mt-6 pt-4 border-t border-white/20 flex gap-4">
                    <Button3D variant="ghost" className="bg-white/10 hover:bg-white/20 text-white border-none text-sm h-9 flex-1">Buy Credits</Button3D>
                    <Button3D variant="ghost" className="bg-white/10 hover:bg-white/20 text-white border-none text-sm h-9 flex-1">Auto-recharge</Button3D>
                 </div>
              </div>
           </div>

           {/* Stats Card */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Usage This Month</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Bulk Verifications</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">1,240</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%]" />
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Single Verifications</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">85</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[15%]" />
                 </div>
              </div>
           </div>
        </div>

        {/* Email Lists Table */}
        <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
           <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white">Processed Lists</h3>
              <Button3D variant="ghost" className="h-8 text-xs"><RefreshCw size={14} className="mr-2" /> Refresh</Button3D>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                   <tr>
                      <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">List Name</th>
                      <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Emails</th>
                      <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Updated</th>
                      <th className="p-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Downloads</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {MOCK_LISTS.map(list => (
                      <tr key={list.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                         <td className="p-3 font-medium text-indigo-600 dark:text-indigo-400">{list.name}</td>
                         <td className="p-3 text-slate-600 dark:text-slate-300">
                            <span className="font-bold">{list.total}</span> <span className="text-xs opacity-70">({list.valid} valid)</span>
                         </td>
                         <td className="p-3 text-slate-500 dark:text-slate-400">{list.updatedAt}</td>
                         <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                               <button className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-medium border border-emerald-100 hover:bg-emerald-100">Valid</button>
                               <button className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-xs font-medium border border-rose-100 hover:bg-rose-100">Invalid</button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
     </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8 animate-enter">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
             Email Verifier
             <div className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-500 rounded-full opacity-30" />
           </h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2">Verify email lists, single addresses, or generate verified leads.</p>
        </div>
        <Button3D variant="secondary" iconName="search" onClick={() => navigate('/finder')}>Bulk Email Finder</Button3D>
      </div>

      {/* Main Content Card */}
      <div className="perspective-container">
         <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden shadow-3d-light dark:shadow-3d min-h-[600px] flex flex-col">
            
            {/* Main Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
               {['Bulk', 'Email', 'Management', 'History'].map(tab => (
                  <button
                     key={tab}
                     onClick={() => { setMainTab(tab as MainTab); setSubTab(tab === 'Bulk' ? 'Paste' : tab === 'Email' ? 'Single' : 'Credits'); }}
                     className={`
                        flex-1 py-4 px-4 text-sm font-semibold transition-all relative whitespace-nowrap min-w-[100px]
                        ${mainTab === tab 
                           ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' 
                           : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'}
                     `}
                  >
                     {tab}
                     {mainTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400" />}
                  </button>
               ))}
            </div>

            <div className="p-4 md:p-6 flex-1">
               {mainTab === 'Bulk' && renderBulkTab()}
               {mainTab === 'Email' && renderEmailTab()}
               {mainTab === 'Management' && renderManagementTab()}
               {mainTab === 'History' && <ActivityHistory items={activityLog} />}
            </div>

         </div>
      </div>

    </div>
  );
};
