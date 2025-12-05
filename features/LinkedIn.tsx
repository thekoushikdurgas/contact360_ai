
import React, { useState } from 'react';
import { Button3D, Badge3D } from '../components/UI';
import { 
  Upload, FileText, Download, AlertCircle, Linkedin, Loader2, CheckCircle, X,
  User, Building2, Globe
} from 'lucide-react';

export const LinkedIn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [processedData, setProcessedData] = useState<{ profiles: number, companies: number, salesNav: number } | null>(null);

  const handleProcess = async () => {
    if (!textInput.trim()) return;

    setIsProcessing(true);
    setResult(null);
    setProcessedData(null);
    setProgress(0);

    const lines = textInput.split('\n').map(l => l.trim()).filter(l => l);
    const totalLines = lines.length;

    // Simulate progressive processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 15);
      });
    }, 300);

    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(interval);
    setProgress(100);

    // Categorize URLs
    let profiles = 0;
    let companies = 0;
    let salesNav = 0;
    let invalid = 0;

    const validUrls = lines.filter(l => {
      const lower = l.toLowerCase();
      if (!lower.includes('linkedin.com')) {
        invalid++;
        return false;
      }
      
      if (lower.includes('/in/')) profiles++;
      else if (lower.includes('/company/')) companies++;
      else if (lower.includes('/sales/')) salesNav++;
      else profiles++; // Assume generic profile link if uncertain but valid domain
      
      return true;
    });

    if (validUrls.length === 0) {
      setResult({
        type: 'error',
        message: 'No valid LinkedIn URLs found. Please check your input format.'
      });
    } else {
      setResult({
        type: 'success',
        message: `Successfully processed ${validUrls.length} URLs.`
      });
      setProcessedData({ profiles, companies, salesNav });
      // In a real app, here we would trigger the batch enrichment API
      console.log('Queuing enrichment for:', validUrls);
    }

    setIsProcessing(false);
  };

  const handleDownloadTemplate = () => {
    // Define headers and a sample row
    const headers = ['LinkedIn URL', 'First Name', 'Last Name', 'Company Name'];
    const sampleRow = ['https://www.linkedin.com/in/example-profile', 'John', 'Doe', 'Acme Corp'];
    
    // Combine into CSV string
    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a link element, set the download attribute, click it, and remove it
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'linkedin_enrichment_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-enter pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
            LinkedIn Enrichment
            <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-indigo-500 rounded-full opacity-60" />
          </h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
             Enrich profiles and companies with Sales Navigator data.
           </p>
        </div>
      </div>

      <div className="perspective-container">
        <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-3d-light dark:shadow-3d overflow-hidden flex flex-col p-6 md:p-8">
            
            {/* Header Section */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#0077b5] flex items-center justify-center text-white shadow-lg shrink-0 shadow-blue-900/20">
                <Linkedin size={32} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">URL Enrichment</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Upload LinkedIn or Sales Navigator profile URLs to enrich them with Sales Navigator data. 
                  It also works with company URLs. 
                  <a href="#" className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline ml-1 transition-colors">How does it work?</a>
                </p>
              </div>
            </div>

            {/* Custom Tab Navigation */}
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 self-start shadow-inner-3d-light dark:shadow-inner-3d">
               <button
                 onClick={() => { setActiveTab('upload'); setResult(null); setProcessedData(null); }}
                 className={`
                   flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300
                   ${activeTab === 'upload' 
                     ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-lg shadow-indigo-900/5 dark:shadow-black/20 transform scale-105' 
                     : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'}
                 `}
               >
                 <Upload size={18} /> Upload File
               </button>
               <button
                 onClick={() => { setActiveTab('paste'); setResult(null); setProcessedData(null); }}
                 className={`
                   flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300
                   ${activeTab === 'paste' 
                     ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-lg shadow-indigo-900/5 dark:shadow-black/20 transform scale-105' 
                     : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'}
                 `}
               >
                 <FileText size={18} /> Paste URLs
               </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
               {activeTab === 'upload' ? (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-forwards">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group bg-slate-50/30 dark:bg-slate-800/20">
                       <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-all duration-300 shadow-inner-3d-light dark:shadow-inner-3d border border-indigo-100 dark:border-indigo-500/20">
                          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">In</span>
                       </div>
                       <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Drop your file here or click to browse</h3>
                       <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm leading-relaxed">
                         Max file size: 50MB. Max rows: 2,500. <br/>
                         Supported formats: CSV, XLS, XLSX.
                       </p>
                       <div className="flex gap-2">
                          <Badge3D variant="neutral" className="px-3 py-1">CSV</Badge3D>
                          <Badge3D variant="neutral" className="px-3 py-1">XLS</Badge3D>
                          <Badge3D variant="neutral" className="px-3 py-1">XLSX</Badge3D>
                       </div>
                    </div>
                    
                    <div className="flex justify-center pt-2">
                       <button 
                          onClick={handleDownloadTemplate}
                          className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline flex items-center gap-2 group transition-all hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-900/30 group-hover:scale-110 transition-transform">
                             <Download size={14} /> 
                          </div>
                          Download sample template
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-forwards">
                    <div className="space-y-3">
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                          LinkedIn URLs (one per line)
                       </label>
                       <div className="relative group">
                          {isProcessing && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] z-10 rounded-xl flex items-center justify-center">
                               <div className="flex flex-col items-center gap-2">
                                  <Loader2 size={32} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
                                  <span className="text-sm font-bold text-slate-700 dark:text-white">Analyzing URLs...</span>
                               </div>
                            </div>
                          )}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-500 blur"></div>
                          <textarea 
                             value={textInput}
                             onChange={(e) => setTextInput(e.target.value)}
                             disabled={isProcessing}
                             className="relative w-full h-72 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 outline-none focus:border-indigo-500 font-mono text-sm resize-none shadow-inner-3d-light dark:shadow-inner-3d focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                             placeholder={`https://www.linkedin.com/in/john-doe\nhttps://www.linkedin.com/company/tesla\nhttps://www.linkedin.com/sales/lead/...`}
                          />
                          <div className="absolute bottom-4 right-4 text-xs bg-white/80 dark:bg-slate-800/80 backdrop-blur px-2 py-1 rounded border border-slate-100 dark:border-slate-700 text-slate-500">
                             {textInput ? textInput.split('\n').filter(x => x.trim()).length : 0} lines
                          </div>
                       </div>
                    </div>

                    {/* Progress Bar during processing */}
                    {isProcessing && (
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {result && (
                       <div className="space-y-4 animate-in fade-in zoom-in-95">
                          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                             result.type === 'success' 
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-200' 
                                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-500/20 text-rose-800 dark:text-rose-200'
                          }`}>
                             <div className={`p-1 rounded-full ${
                                result.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/30 text-emerald-600' : 'bg-rose-100 dark:bg-rose-500/30 text-rose-600'
                             }`}>
                                {result.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                             </div>
                             <div className="flex-1 text-sm font-medium pt-0.5">
                                {result.message}
                             </div>
                             <button onClick={() => { setResult(null); setProcessedData(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={16} />
                             </button>
                          </div>

                          {processedData && (
                            <div className="grid grid-cols-3 gap-4">
                               <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Profiles</div>
                                  <div className="flex items-center gap-2">
                                    <User size={16} className="text-indigo-500" />
                                    <span className="text-lg font-bold text-slate-800 dark:text-white">{processedData.profiles}</span>
                                  </div>
                               </div>
                               <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Companies</div>
                                  <div className="flex items-center gap-2">
                                    <Building2 size={16} className="text-indigo-500" />
                                    <span className="text-lg font-bold text-slate-800 dark:text-white">{processedData.companies}</span>
                                  </div>
                               </div>
                               <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Sales Nav</div>
                                  <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-indigo-500" />
                                    <span className="text-lg font-bold text-slate-800 dark:text-white">{processedData.salesNav}</span>
                                  </div>
                               </div>
                            </div>
                          )}
                       </div>
                    )}
                    
                    <div className="flex justify-end pt-2">
                       <Button3D 
                          variant="primary" 
                          className="px-8 py-3 shadow-indigo-500/25 h-12 text-base min-w-[160px]"
                          onClick={handleProcess}
                          disabled={isProcessing || !textInput.trim()}
                       >
                          {isProcessing ? (
                             'Processing...'
                          ) : (
                             'Process URLs'
                          )}
                       </Button3D>
                    </div>
                 </div>
               )}
            </div>

            {/* Required Column Info */}
            {activeTab === 'upload' && (
              <div className="mt-8 bg-blue-50/80 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-forwards">
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-500" /> Required Column
                 </h4>
                 <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-lg border-2 border-blue-100 dark:border-blue-500/30 text-center shadow-lg shadow-blue-500/5 shrink-0 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                       <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          LinkedIn Sales Navigator URL
                       </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">
                       <p>We automatically detect similar column names (e.g. <b>URL</b>, <b>LinkedIn URL</b>, <b>SN URL</b>). <br className="hidden md:block"/>Ensure your file has a header row for best results.</p>
                    </div>
                 </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
