
import React, { useState, useMemo, useEffect } from 'react';
import { Card3D, Button3D, Badge3D, Input3D, Modal3D, RangeSlider3D, MultiSelect3D, Checkbox3D, TabGroup, TiltRow } from '../components/UI';
import { generateCompanySummary } from '../services/geminiService';
import { Company } from '../types';
import { 
  Globe, MapPin, Users, DollarSign, Sparkles, Plus, 
  Search, ExternalLink, Filter, X, RotateCcw,
  FileSpreadsheet, Upload, Download, ChevronLeft, ChevronRight,
  Factory, Linkedin, LayoutGrid, List as ListIcon, ChevronDown,
  Building2, Monitor, ShieldCheck, Trophy
} from 'lucide-react';

// --- Helper Components ---

const FilterSection: React.FC<{
  title: string;
  icon?: React.ElementType;
  count?: number;
  isOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon: Icon, count, isOpen: defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasActive = count !== undefined && count > 0;

  return (
    <div className={`
      group rounded-xl transition-all duration-300 border mb-2
      ${isOpen || hasActive 
        ? 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm' 
        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }
    `}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={16} className={hasActive ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'} />}
          <span className={`font-medium text-sm ${hasActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
            {title}
          </span>
          {hasActive && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              {count}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 pb-3 pt-0">
           {children}
        </div>
      </div>
    </div>
  );
};

// --- Mock Data (Based on provided JSON) ---
// Using a subset of the JSON provided for realistic simulation
const RAW_DATA: Company[] = [
  {
      "uuid": "43c378f4-a4d0-509f-9f2f-51fd8c3355ef",
      "name": "Deloitte",
      "employees_count": 460000,
      "annual_revenue": 67200000000,
      "total_funding": 76149014,
      "industry": "management consulting",
      "city": "Lenexa",
      "state": "Kansas",
      "country": "United States",
      "website": "https://deloitte.com",
      "linkedin_url": "http://www.linkedin.com/company/deloitte",
      "phone_number": "+1 212-492-4000",
      "technologies": ["Akamai", "Microsoft Office 365", "Salesforce", "AWS", "ServiceNow", "Workday", "Tableau", "React"],
      "keywords": ["consulting", "audit", "risk advisory", "financial services", "technology consulting", "digital transformation"],
      "logoColor": "emerald"
  },
  // ... (rest of the mocked data structure as before)
  {
      "uuid": "63f9a2b4-a915-5a1f-8218-aef50a6f81f7",
      "name": "Walmart",
      "employees_count": 2100000,
      "annual_revenue": 685086000000,
      "total_funding": 0,
      "industry": "retail",
      "city": "Bentonville",
      "state": "Arkansas",
      "country": "United States",
      "website": "https://walmart.com",
      "linkedin_url": "http://www.linkedin.com/company/walmart",
      "phone_number": "+1 501-273-4000",
      "technologies": ["Azure", "React", "Node.js", "Kubernetes", "Salesforce", "Adobe Marketing Cloud"],
      "keywords": ["retail", "ecommerce", "logistics", "supply chain", "consumer goods", "technology"],
      "logoColor": "blue"
  },
  {
      "uuid": "b2c9e6c8-76e3-55ce-ac55-32b60cc7bfd9",
      "name": "SightCall",
      "employees_count": 81,
      "annual_revenue": 100000000,
      "total_funding": 54700710,
      "industry": "information technology",
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "website": "https://sightcall.com",
      "linkedin_url": "http://www.linkedin.com/company/sightcall",
      "phone_number": "+1 650-481-8931",
      "technologies": ["WebRTC", "AWS", "Salesforce", "Zendesk", "VueJS", "Python", "Docker"],
      "keywords": ["video cloud", "ar", "visual support", "remote assistance", "ai"],
      "logoColor": "indigo"
  },
  {
      "uuid": "147b13a9-5dd6-5558-91f0-0a784d88e09d",
      "name": "VINCI Autoroutes",
      "employees_count": 2600,
      "annual_revenue": 83500000,
      "total_funding": 0,
      "industry": "transportation",
      "city": "Nanterre",
      "state": "Ile-de-France",
      "country": "France",
      "website": "http://www.vinci-autoroutes.com",
      "linkedin_url": "http://www.linkedin.com/company/vinci-autoroutes",
      "phone_number": "+33 1 55 94 70 00",
      "technologies": ["Drupal", "Microsoft Azure", "VueJS", "Google Analytics", "GitLab"],
      "keywords": ["transportation", "infrastructure", "mobility", "highways", "services"],
      "logoColor": "orange"
  },
  {
      "uuid": "d23491e8-7d50-54d2-9394-e6c889c89f1b",
      "name": "Marposs",
      "employees_count": 1400,
      "annual_revenue": 800000000,
      "total_funding": 0,
      "industry": "industrial automation",
      "city": "Bentivoglio",
      "state": "Emilia-Romagna",
      "country": "Italy",
      "website": "http://www.marposs.com",
      "linkedin_url": "http://www.linkedin.com/company/marposs",
      "phone_number": "+39 051 899111",
      "technologies": ["ASP.NET", "Google Analytics", "Apache", "Vimeo", "Bootstrap"],
      "keywords": ["automation", "measurement", "quality control", "manufacturing", "engineering"],
      "logoColor": "rose"
  },
  {
      "uuid": "6706214a-5608-5db8-9e26-fc9d2b9885e3",
      "name": "ProNvest",
      "employees_count": 8,
      "annual_revenue": 2000000,
      "total_funding": 0,
      "industry": "financial services",
      "city": "Chattanooga",
      "state": "Tennessee",
      "country": "United States",
      "website": "https://pronvest.com",
      "linkedin_url": "http://www.linkedin.com/company/pronvest-inc.",
      "phone_number": "+1 423-648-1878",
      "technologies": ["Hubspot", "Azure", "Webflow", "Outlook", "Mailchimp"],
      "keywords": ["fintech", "retirement", "investing", "wealth management"],
      "logoColor": "purple"
  },
  {
      "uuid": "61797854-fc82-56d1-8ba6-719e732a7615",
      "name": "Copaco",
      "employees_count": 510,
      "annual_revenue": 124000000,
      "total_funding": 0,
      "industry": "information technology",
      "city": "Eindhoven",
      "state": "North Brabant",
      "country": "Netherlands",
      "website": "http://www.copaco.com",
      "linkedin_url": "http://www.linkedin.com/company/copaco",
      "phone_number": "+31 40 230 6306",
      "technologies": ["Salesforce", "AWS", "Zendesk", "Google Tag Manager", "SAP"],
      "keywords": ["distribution", "cloud services", "hardware", "software", "logistics"],
      "logoColor": "blue"
  },
  {
      "uuid": "8301e6fa-00af-516f-87bf-2eebb831c493",
      "name": "Taghleef Industries",
      "employees_count": 1100,
      "annual_revenue": 150000000,
      "total_funding": 0,
      "industry": "plastics",
      "city": "Dubai",
      "state": "Dubai",
      "country": "UAE",
      "website": "http://www.ti-films.com",
      "linkedin_url": "http://www.linkedin.com/company/taghleef-industries-spa",
      "phone_number": "+1 302-326-5500",
      "technologies": ["SAP", "Hubspot", "Salesforce", "Azure", "Wordpress"],
      "keywords": ["manufacturing", "packaging", "sustainability", "films", "industrial"],
      "logoColor": "emerald"
  },
  {
      "uuid": "b7a26713-c37f-5873-9af8-37d6bb124285",
      "name": "Magnolia Talent",
      "employees_count": 2,
      "annual_revenue": 500000,
      "total_funding": 0,
      "industry": "staffing & recruiting",
      "city": "Seattle",
      "state": "Washington",
      "country": "United States",
      "website": "https://magnoliatalent.com",
      "linkedin_url": "http://www.linkedin.com/company/magnolia-talent",
      "phone_number": "+1 206-338-2700",
      "technologies": ["Wix", "Google Cloud", "AWS", "QuickBooks", "Gong", "Snowflake"],
      "keywords": ["recruiting", "talent acquisition", "hr tech", "staffing"],
      "logoColor": "rose"
  }
];

// --- Main Component ---

export const Companies: React.FC = () => {
  // State
  const [companies, setCompanies] = useState<Company[]>(RAW_DATA);
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'bulk' | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    industries: [] as string[],
    countries: [] as string[],
    technologies: [] as string[],
    revenueMin: 0,
    revenueMax: 1000, // Normalized to millions for slider
    employeesMin: 0,
    employeesMax: 5000
  });

  // Derived Data (Unique options for filters)
  const uniqueIndustries = useMemo(() => Array.from(new Set(companies.map(c => c.industry || 'Unknown'))).sort(), [companies]);
  const uniqueCountries = useMemo(() => Array.from(new Set(companies.map(c => c.country || 'Unknown'))).sort(), [companies]);
  const uniqueTechnologies = useMemo(() => {
    const techs = new Set<string>();
    companies.forEach(c => c.technologies.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }, [companies]);

  // Filter Logic
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      // Global Search
      const term = searchTerm.toLowerCase();
      if (term && !c.name.toLowerCase().includes(term) && !c.industry?.toLowerCase().includes(term)) return false;

      // Filter: Industry
      if (filters.industries.length > 0 && !filters.industries.includes(c.industry || '')) return false;

      // Filter: Country
      if (filters.countries.length > 0 && !filters.countries.includes(c.country || '')) return false;

      // Filter: Technology
      if (filters.technologies.length > 0 && !filters.technologies.some(t => c.technologies.includes(t))) return false;

      // Filter: Revenue (Converted to millions for comparison with slider)
      const revM = (c.annual_revenue || 0) / 1000000;
      if (revM < filters.revenueMin || revM > filters.revenueMax) return false;

      // Filter: Employees
      const emp = c.employees_count || 0;
      if (emp < filters.employeesMin || emp > filters.employeesMax) return false;

      return true;
    });
  }, [companies, searchTerm, filters]);

  // Handlers
  const handleGenerateSummary = async (e: React.MouseEvent, company: Company) => {
    e.stopPropagation();
    if (company.aiSummary) return;

    setLoadingSummary(company.uuid);
    try {
      const summary = await generateCompanySummary(company.name, company.industry || 'Technology');
      setCompanies(prev => prev.map(c => c.uuid === company.uuid ? { ...c, aiSummary: summary } : c));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(null);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(0)}M`;
    return `$${val.toLocaleString()}`;
  };

  const activeFilterCount = 
    filters.industries.length + 
    filters.countries.length + 
    filters.technologies.length + 
    (filters.revenueMin > 0 || filters.revenueMax < 1000 ? 1 : 0);

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-64px)] overflow-hidden gap-6 pb-2">
      
      {/* --- Filter Sidebar --- */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 shadow-2xl transition-transform duration-300 md:relative md:transform-none md:w-80 md:bg-transparent md:border-none md:shadow-none flex flex-col
        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="md:hidden p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <span className="font-bold text-lg">Filters</span>
          <button onClick={() => setIsFilterOpen(false)}><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-1 pr-2 space-y-4 md:pb-20 scrollbar-hide">
          <div className="flex items-center gap-2 mb-2 pl-1">
             <Filter size={18} className="text-indigo-500" />
             <h2 className="font-bold text-slate-800 dark:text-slate-100">Smart Filters</h2>
             {activeFilterCount > 0 && <Badge3D variant="indigo">{activeFilterCount}</Badge3D>}
          </div>

          <div className="relative group mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl outline-none text-sm border border-slate-200 dark:border-slate-700 focus:border-indigo-500 shadow-inner-3d-light dark:shadow-inner-3d transition-all"
            />
          </div>

          <FilterSection title="Industry" icon={Factory} count={filters.industries.length} isOpen>
            <MultiSelect3D 
              items={filters.industries}
              onAdd={(i) => setFilters(prev => ({...prev, industries: [...prev.industries, i]}))}
              onRemove={(i) => setFilters(prev => ({...prev, industries: prev.industries.filter(x => x !== i)}))}
              suggestions={uniqueIndustries}
              placeholder="Select industries..."
              color="indigo"
            />
          </FilterSection>

          <FilterSection title="Revenue" icon={DollarSign} isOpen>
             <div className="px-2">
                <RangeSlider3D 
                  min={0} max={1000} step={10}
                  value={[filters.revenueMin, filters.revenueMax]}
                  onChange={([min, max]) => setFilters(prev => ({...prev, revenueMin: min, revenueMax: max}))}
                  formatLabel={(v) => v === 1000 ? '$1B+' : `$${v}M`}
                />
             </div>
          </FilterSection>

          <FilterSection title="Employees" icon={Users}>
             <div className="px-2">
                <RangeSlider3D 
                  min={0} max={10000} step={100}
                  value={[filters.employeesMin, filters.employeesMax]}
                  onChange={([min, max]) => setFilters(prev => ({...prev, employeesMin: min, employeesMax: max}))}
                  formatLabel={(v) => v === 10000 ? '10k+' : v.toString()}
                />
             </div>
          </FilterSection>

          <FilterSection title="Technology" icon={Monitor} count={filters.technologies.length}>
             <MultiSelect3D 
               items={filters.technologies}
               onAdd={(i) => setFilters(prev => ({...prev, technologies: [...prev.technologies, i]}))}
               onRemove={(i) => setFilters(prev => ({...prev, technologies: prev.technologies.filter(x => x !== i)}))}
               suggestions={uniqueTechnologies}
               placeholder="React, AWS..."
               color="purple"
             />
          </FilterSection>

          <FilterSection title="Location" icon={MapPin} count={filters.countries.length}>
             <MultiSelect3D 
               items={filters.countries}
               onAdd={(i) => setFilters(prev => ({...prev, countries: [...prev.countries, i]}))}
               onRemove={(i) => setFilters(prev => ({...prev, countries: prev.countries.filter(x => x !== i)}))}
               suggestions={uniqueCountries}
               placeholder="Select countries..."
               color="emerald"
             />
          </FilterSection>

          <Button3D variant="outline" onClick={() => setFilters({
            industries: [], countries: [], technologies: [], 
            revenueMin: 0, revenueMax: 1000, employeesMin: 0, employeesMax: 5000
          })} className="w-full text-sm">
            <RotateCcw size={14} className="mr-2" /> Reset All Filters
          </Button3D>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden animate-enter" style={{ animationDelay: '200ms' }}>
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pr-2">
           <div>
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
               Companies <span className="text-slate-400 font-normal text-lg">({filteredCompanies.length})</span>
             </h1>
           </div>

           <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
              {/* View Toggle */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 flex mr-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>

              <Button3D variant="secondary" className="flex-1 md:flex-none text-sm" onClick={() => setModalType('bulk')}>
                 <Upload size={16} className="mr-2" /> Import
              </Button3D>
              
              {selectedIds.size > 0 && (
                <Button3D variant="secondary" className="flex-1 md:flex-none text-sm text-indigo-600 dark:text-indigo-400">
                  <Download size={16} className="mr-2" /> Export ({selectedIds.size})
                </Button3D>
              )}

              <Button3D variant="primary" className="flex-1 md:flex-none text-sm" onClick={() => setModalType('add')}>
                 <Plus size={16} className="mr-2" /> Add Company
              </Button3D>
           </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto pr-2 pb-20 scroll-smooth">
          {viewMode === 'grid' ? (
            // --- GRID VIEW ---
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCompanies.map((company, idx) => (
                 <div key={company.uuid} className="perspective-container animate-enter group" style={{ animationDelay: `${idx * 50}ms` }}>
                   <div className={`
                     card-3d h-full bg-white dark:bg-slate-800/60 backdrop-blur-xl border rounded-2xl p-5 shadow-3d-light dark:shadow-3d hover:shadow-3d-hover-light dark:hover:shadow-3d-hover hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden
                     ${selectedIds.has(company.uuid) ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-700/60'}
                   `}>
                     {/* Gloss Effect */}
                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />

                     {/* Top Row: Logo & Name */}
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex gap-3">
                           <div className={`
                             w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner-3d-light dark:shadow-inner-3d
                             bg-${company.logoColor || 'indigo'}-500
                           `}>
                             {company.name.substring(0, 2).toUpperCase()}
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {company.name}
                              </h3>
                              <div className="flex gap-2 mt-1">
                                {company.website && (
                                  <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-indigo-500 flex items-center gap-1 transition-colors">
                                    <Globe size={10} /> Website
                                  </a>
                                )}
                                {company.linkedin_url && (
                                  <a href={company.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-[#0077b5] flex items-center gap-1 transition-colors">
                                    <Linkedin size={10} /> LinkedIn
                                  </a>
                                )}
                              </div>
                           </div>
                        </div>
                        <Checkbox3D checked={selectedIds.has(company.uuid)} onChange={() => toggleSelection(company.uuid)} />
                     </div>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                           <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Revenue</div>
                           <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                             {company.annual_revenue ? formatCurrency(company.annual_revenue) : '-'}
                           </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                           <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Employees</div>
                           <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                             {company.employees_count?.toLocaleString() || '-'}
                           </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                           <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Funding</div>
                           <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                             {company.total_funding ? formatCurrency(company.total_funding) : '-'}
                           </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                           <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Location</div>
                           <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate" title={company.city + ', ' + company.country}>
                             {company.city || '-'}, {company.country || '-'}
                           </div>
                        </div>
                     </div>

                     {/* Technologies */}
                     <div className="flex flex-wrap gap-1.5 mb-4 relative z-10 min-h-[30px]">
                        {company.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-medium border border-indigo-100 dark:border-indigo-500/20">
                            {tech}
                          </span>
                        ))}
                        {company.technologies.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                            +{company.technologies.length - 3}
                          </span>
                        )}
                     </div>

                     {/* AI Summary Section */}
                     <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
                        {company.aiSummary ? (
                           <div className="animate-in fade-in slide-in-from-bottom-2">
                             <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 border border-indigo-100 dark:border-indigo-500/30">
                                <div className="flex items-center gap-1.5 mb-1 text-indigo-600 dark:text-indigo-400 font-bold">
                                   <Sparkles size={12} /> AI Insight
                                </div>
                                {company.aiSummary}
                             </div>
                           </div>
                        ) : (
                           <button 
                             onClick={(e) => handleGenerateSummary(e, company)}
                             disabled={loadingSummary === company.uuid}
                             className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg group/btn"
                           >
                             {loadingSummary === company.uuid ? (
                               <><Sparkles size={12} className="animate-spin" /> Analyzing...</>
                             ) : (
                               <><Sparkles size={12} className="group-hover/btn:text-indigo-500 transition-colors" /> Generate AI Analysis</>
                             )}
                           </button>
                        )}
                     </div>
                   </div>
                 </div>
              ))}
            </div>
          ) : (
            // --- LIST VIEW ---
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/40 shadow-inner-3d-light dark:shadow-inner-3d overflow-hidden flex flex-col">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                 <thead className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold tracking-wider shadow-sm">
                   <tr>
                     <th className="p-4 w-12 text-center"><Checkbox3D /></th>
                     <th className="p-4">Company</th>
                     <th className="p-4">Industry</th>
                     <th className="p-4">Location</th>
                     <th className="p-4">Revenue</th>
                     <th className="p-4">Employees</th>
                     <th className="p-4">Tech Stack</th>
                     <th className="p-4 text-center">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60 text-sm">
                   {filteredCompanies.map(company => (
                     <TiltRow key={company.uuid} className="group hover:bg-white dark:hover:bg-slate-800/80 transition-colors">
                       <td className="p-4 text-center">
                         <Checkbox3D checked={selectedIds.has(company.uuid)} onChange={() => toggleSelection(company.uuid)} />
                       </td>
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-${company.logoColor || 'indigo'}-500 shadow-sm`}>
                             {company.name.substring(0, 2).toUpperCase()}
                           </div>
                           <div>
                             <div className="font-semibold text-slate-800 dark:text-slate-200">{company.name}</div>
                             <a href={company.website || '#'} target="_blank" className="text-xs text-slate-500 hover:text-indigo-500">{company.website}</a>
                           </div>
                         </div>
                       </td>
                       <td className="p-4 text-slate-600 dark:text-slate-400">{company.industry}</td>
                       <td className="p-4 text-slate-600 dark:text-slate-400">{company.city}, {company.country}</td>
                       <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{formatCurrency(company.annual_revenue)}</td>
                       <td className="p-4 text-slate-600 dark:text-slate-400">{company.employees_count?.toLocaleString()}</td>
                       <td className="p-4">
                         <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {company.technologies.slice(0, 2).map(t => (
                              <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">{t}</span>
                            ))}
                            {company.technologies.length > 2 && <span className="text-[10px] text-slate-400">+{company.technologies.length - 2}</span>}
                         </div>
                       </td>
                       <td className="p-4 text-center">
                         <Button3D variant="ghost" className="h-8 w-8 p-0" title="AI Analysis" onClick={(e) => handleGenerateSummary(e, company)}>
                           <Sparkles size={16} className={company.aiSummary ? 'text-indigo-500' : 'text-slate-400'} />
                         </Button3D>
                       </td>
                     </TiltRow>
                   ))}
                 </tbody>
               </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      <Modal3D isOpen={modalType === 'bulk'} onClose={() => setModalType(null)} title="Bulk Import">
         <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
               <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet size={32} className="text-indigo-500" />
               </div>
               <h3 className="font-semibold text-slate-800 dark:text-slate-200">Upload CSV or JSON</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Drag and drop or click to browse</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
               <Button3D variant="ghost" onClick={() => setModalType(null)}>Cancel</Button3D>
               <Button3D variant="primary" iconName="download" onClick={() => setModalType(null)}>Start Import</Button3D>
            </div>
         </div>
      </Modal3D>

      <Modal3D isOpen={modalType === 'add'} onClose={() => setModalType(null)} title="Add Company manually">
         <div className="space-y-4">
            <Input3D label="Company Name" placeholder="e.g. Acme Corp" />
            <div className="grid grid-cols-2 gap-4">
               <Input3D label="Industry" placeholder="e.g. Technology" />
               <Input3D label="Website" placeholder="e.g. acme.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <Input3D label="Employees" type="number" placeholder="100" />
               <Input3D label="Revenue ($)" type="number" placeholder="1000000" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
               <Button3D variant="ghost" onClick={() => setModalType(null)}>Cancel</Button3D>
               <Button3D variant="primary" iconName="plus" onClick={() => setModalType(null)}>Create</Button3D>
            </div>
         </div>
      </Modal3D>
    </div>
  );
};
