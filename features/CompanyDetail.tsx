
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Globe, Phone, Linkedin, MapPin, Users, DollarSign, 
  ArrowLeft, Trash2, Sparkles, Plus, ExternalLink, Calendar, 
  Target, Mail, Briefcase, ChevronRight, CheckCircle, Search
} from 'lucide-react';
import { Card3D, Button3D, Badge3D, TiltRow, Modal3D, TabGroup } from '../components/UI';
import { SkeletonBlock, SkeletonCircle, SkeletonCard3D, SkeletonTable3D } from '../components/Skeleton';
import { MOCK_COMPANIES, MOCK_CONTACTS } from '../constants';
import { generateCompanySummary } from '../services/geminiService';
import { Company, Contact } from '../types';
import { useRole } from '../hooks/useRole';

// --- Mock Hook to simulate data fetching for single company ---
const useCompany = (uuid: string) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API Fetch
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      const found = MOCK_COMPANIES.find(c => c.uuid === uuid);
      if (found) {
        setCompany(found);
      } else {
        setError("Company not found");
      }
      setIsLoading(false);
    };
    fetchData();
  }, [uuid]);

  return { company, isLoading, error };
};

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { company, isLoading, error } = useCompany(id || '');
  const { role } = useRole();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  // Derived Contacts
  const companyContacts = useMemo(() => {
    if (!company) return [];
    return MOCK_CONTACTS.filter(c => c.company === company.name);
  }, [company]);

  const handleGenerateInsight = async () => {
    if (!company) return;
    setIsGeneratingInsight(true);
    try {
      const summary = await generateCompanySummary(company.name, company.industry || 'Business');
      setAiInsight(summary);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(0)}M`;
    return `$${val.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto pb-12 space-y-8 animate-enter">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 pt-6">
           <div className="flex items-center gap-6">
              <SkeletonBlock className="w-24 h-24 rounded-2xl" />
              <div className="space-y-3">
                 <SkeletonBlock className="h-8 w-64 rounded-lg" />
                 <div className="flex gap-4">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-24" />
                 </div>
              </div>
           </div>
           <div className="flex gap-3">
              <SkeletonBlock className="h-10 w-24 rounded-xl" />
              <SkeletonBlock className="h-10 w-32 rounded-xl" />
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
                 <SkeletonBlock className="w-10 h-10 rounded-lg" />
                 <div className="space-y-2">
                    <SkeletonBlock className="h-3 w-16" />
                    <SkeletonBlock className="h-5 w-24" />
                 </div>
              </div>
           ))}
        </div>

        <div className="perspective-container">
           <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-3d-light dark:shadow-3d overflow-hidden min-h-[500px] flex flex-col p-6">
              <div className="flex gap-4 mb-8">
                 <SkeletonBlock className="h-10 w-24 rounded-lg" />
                 <SkeletonBlock className="h-10 w-24 rounded-lg" />
                 <SkeletonBlock className="h-10 w-24 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-6">
                    <SkeletonBlock className="h-6 w-48 mb-4" />
                    <div className="space-y-2">
                       <SkeletonBlock className="h-4 w-full" />
                       <SkeletonBlock className="h-4 w-full" />
                       <SkeletonBlock className="h-4 w-2/3" />
                    </div>
                    <SkeletonBlock className="h-6 w-48 mt-8 mb-4" />
                    <div className="flex gap-2">
                       <SkeletonBlock className="h-8 w-24 rounded-lg" />
                       <SkeletonBlock className="h-8 w-24 rounded-lg" />
                       <SkeletonBlock className="h-8 w-24 rounded-lg" />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <SkeletonBlock className="h-48 w-full rounded-xl" />
                    <SkeletonBlock className="h-32 w-full rounded-xl" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-enter">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
           <Building2 size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Company Not Found</h2>
        <p className="text-slate-500 mb-6">The company you are looking for does not exist or has been removed.</p>
        <Button3D variant="secondary" onClick={() => navigate('/companies')}>Return to List</Button3D>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8 animate-enter">
      
      {/* --- Header Section --- */}
      <div className="relative">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/companies')}
          className="absolute -top-10 left-0 flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
           <ArrowLeft size={16} /> Back to Companies
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
           <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-xl bg-${company.logoColor || 'indigo'}-500 shadow-${company.logoColor || 'indigo'}-500/30 border-4 border-white dark:border-slate-900`}>
                 {company.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{company.name}</h1>
                    {company.industry && <Badge3D variant="neutral" className="text-sm py-1">{company.industry}</Badge3D>}
                 </div>
                 <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5"><MapPin size={16} /> {company.city}, {company.country}</div>
                    <a href={company.website || '#'} target="_blank" className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors"><Globe size={16} /> Website</a>
                    <div className="flex items-center gap-1.5"><Phone size={16} /> {company.phone_number || 'N/A'}</div>
                 </div>
              </div>
           </div>
           
           <div className="flex gap-3">
              {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                <Button3D variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => setShowDeleteModal(true)}>
                   <Trash2 size={16} className="mr-2" /> Delete
                </Button3D>
              )}
              <Button3D variant="primary" iconName="plus">Add Contact</Button3D>
           </div>
        </div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400"><Users size={20} /></div>
              <div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Employees</div>
                 <div className="text-xl font-bold text-slate-800 dark:text-white">{company.employees_count?.toLocaleString()}</div>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400"><DollarSign size={20} /></div>
              <div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Revenue</div>
                 <div className="text-xl font-bold text-slate-800 dark:text-white">{formatCurrency(company.annual_revenue)}</div>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400"><Target size={20} /></div>
              <div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Funding</div>
                 <div className="text-xl font-bold text-slate-800 dark:text-white">{formatCurrency(company.total_funding)}</div>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"><Linkedin size={20} /></div>
              <div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Social</div>
                 <a href={company.linkedin_url || '#'} target="_blank" className="text-sm font-bold text-indigo-600 hover:underline">View Profile</a>
              </div>
           </div>
        </div>
      </div>

      {/* --- Main Content Tabs --- */}
      <div className="perspective-container">
         <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-3d-light dark:shadow-3d overflow-hidden min-h-[500px] flex flex-col">
            
            <div className="p-2 border-b border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2">
               {['Overview', 'Contacts', 'Intelligence'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                       px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative
                       ${activeTab === tab 
                          ? 'text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-900/30 font-bold shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'}
                    `}
                  >
                     {tab} {tab === 'Contacts' && <span className="ml-1 text-xs opacity-70 bg-indigo-200 dark:bg-indigo-800 px-1.5 py-0.5 rounded-full">{companyContacts.length}</span>}
                  </button>
               ))}
            </div>

            <div className="p-6 md:p-8 flex-1">
               
               {/* --- OVERVIEW TAB --- */}
               {activeTab === 'Overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="lg:col-span-2 space-y-8">
                        <div>
                           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                              <Building2 size={18} className="text-indigo-500" /> About {company.name}
                           </h3>
                           <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                              {company.name} is a leading player in the {company.industry} industry, headquartered in {company.city}, {company.state}. 
                              With over {company.employees_count?.toLocaleString()} employees, they have established a strong market presence.
                              Their annual revenue is estimated at {formatCurrency(company.annual_revenue)}. 
                              They specialize in leveraging technology to drive growth and innovation.
                           </p>
                        </div>

                        <div>
                           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                              <Sparkles size={18} className="text-purple-500" /> Technology Stack
                           </h3>
                           <div className="flex flex-wrap gap-2">
                              {company.technologies.map(tech => (
                                 <span key={tech} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                                    <CheckCircle size={14} className="text-emerald-500" /> {tech}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50">
                           <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Details</h4>
                           <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">Founded</span>
                                 <span className="font-medium text-slate-800 dark:text-white">2005</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">Type</span>
                                 <span className="font-medium text-slate-800 dark:text-white">Private</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">Global Rank</span>
                                 <span className="font-medium text-slate-800 dark:text-white">#4,231</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">Last Updated</span>
                                 <span className="font-medium text-slate-800 dark:text-white">2 days ago</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50">
                           <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Keywords</h4>
                           <div className="flex flex-wrap gap-2">
                              {company.keywords?.slice(0, 8).map((k, i) => (
                                 <span key={i} className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                                    {k}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* --- CONTACTS TAB --- */}
               {activeTab === 'Contacts' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Decision Makers</h3>
                        <div className="relative w-64">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                           <input 
                             type="text" 
                             placeholder="Search contacts..." 
                             className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg outline-none text-sm border border-slate-200 dark:border-slate-700 focus:border-indigo-500"
                           />
                        </div>
                     </div>

                     {companyContacts.length > 0 ? (
                        <div className="bg-white dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                           <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                                 <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4 text-right">Action</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                 {companyContacts.map(contact => (
                                    <TiltRow key={contact.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                       <td className="p-4">
                                          <div className="flex items-center gap-3">
                                             <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full" />
                                             <div className="font-bold text-slate-800 dark:text-slate-200">{contact.name}</div>
                                          </div>
                                       </td>
                                       <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{contact.role}</td>
                                       <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{contact.email || '—'}</td>
                                       <td className="p-4 text-slate-600 dark:text-slate-400">{contact.location}</td>
                                       <td className="p-4 text-right">
                                          <Button3D variant="ghost" className="h-8 text-xs px-3">View</Button3D>
                                       </td>
                                    </TiltRow>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     ) : (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                           <Users size={48} className="mx-auto mb-4 opacity-50" />
                           <p>No contacts found for {company.name}.</p>
                           <Button3D variant="secondary" className="mt-4" iconName="search">Find Contacts</Button3D>
                        </div>
                     )}
                  </div>
               )}

               {/* --- INTELLIGENCE TAB --- */}
               {activeTab === 'Intelligence' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto text-center py-8">
                     <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                        <Sparkles size={40} className="text-white" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">AI Company Intelligence</h3>
                     <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                        Generate a comprehensive analysis of {company.name} including market position, competitors, and potential sales triggers.
                     </p>
                     
                     {aiInsight ? (
                        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 text-left shadow-inner">
                           <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                              <Sparkles size={16} /> Generated Insight
                           </h4>
                           <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
                        </div>
                     ) : (
                        <Button3D 
                           variant="primary" 
                           className="px-8 py-3 h-12 text-base shadow-indigo-500/30"
                           onClick={handleGenerateInsight}
                           disabled={isGeneratingInsight}
                        >
                           {isGeneratingInsight ? 'Analyzing...' : 'Generate Report'}
                        </Button3D>
                     )}
                  </div>
               )}

            </div>
         </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal3D isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Company">
         <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto">
               <Trash2 size={32} className="text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Are you sure?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
               This action will permanently delete <strong>{company.name}</strong> and remove all associated data. This cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-4">
               <Button3D variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button3D>
               <Button3D variant="danger" onClick={() => { setShowDeleteModal(false); navigate('/companies'); }}>Delete Company</Button3D>
            </div>
         </div>
      </Modal3D>

    </div>
  );
};
