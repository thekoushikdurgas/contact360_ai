
import React, { useState, useMemo, useEffect } from 'react';
import { Button3D, Input3D, Checkbox3D, Badge3D, Modal3D, MultiSelect3D, RangeSlider3D, TiltRow } from '../components/UI';
import { SkeletonTable3D } from '../components/Skeleton';
import { Contact } from '../types';
import { MOCK_CONTACTS } from '../constants';
import { 
  Search, Filter, Download, List, Users, Building2, MapPin, Hash, Upload, 
  MoreHorizontal, ChevronLeft, ChevronRight, X, Linkedin, Twitter, Facebook,
  ChevronDown, Save, Eye, Trash2, Mail, Briefcase, Globe, DollarSign, Layers,
  Terminal, UserCheck, Copy, ArrowUp, ArrowDown, ArrowUpDown, FileSpreadsheet, 
  CheckCircle, AlertCircle, Sparkles, LayoutGrid, Share2, ListPlus, Edit, UploadCloud,
  AtSign, MousePointer2, Phone, Tag, Columns
} from 'lucide-react';

// --- Components ---

const FilterSection: React.FC<{
  title: string;
  icon?: React.ElementType;
  count?: number;
  isOpen?: boolean;
  children: React.ReactNode;
  onClear?: () => void;
  dotColor?: string;
}> = ({ title, icon: Icon, count, isOpen: defaultOpen = false, children, onClear, dotColor }) => {
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
          {dotColor && hasActive && (
            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
          )}
          {Icon && <Icon size={16} className={hasActive ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'} />}
          <span className={`font-medium text-sm ${hasActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
            {title}
          </span>
          {hasActive && !dotColor && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              {count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
           {hasActive && onClear && (
             <div 
               role="button"
               onClick={(e) => { e.stopPropagation(); onClear(); }}
               className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 rounded transition-colors"
               title="Clear section"
             >
               <X size={12} />
             </div>
           )}
           <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 pb-3 pt-0">
           {children}
        </div>
      </div>
    </div>
  );
};

interface FilterState {
  jobTitles: string[];
  companyNames: string[];
  revenue: [number, number];
  employees: [number, number];
  seniority: string[];
  industry: string[];
  department: string[];
  location: string[];
  lists: string[];
  persona: string[];
}

const INITIAL_FILTERS: FilterState = {
  jobTitles: [],
  companyNames: [],
  revenue: [0, 500], 
  employees: [0, 10000],
  seniority: [],
  industry: [],
  department: [],
  location: [],
  lists: [],
  persona: []
};

export const Contacts: React.FC = () => {
  // --- State ---
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('Total (1.2K)');
  const [revealedEmails, setRevealedEmails] = useState<Set<string>>(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'simple' | 'full'>('full');
  const [isLoading, setIsLoading] = useState(true);
  
  // Sorting & Pagination
  const [sortField, setSortField] = useState<keyof Contact>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [showImport, setShowImport] = useState(false);
  const [showBulkInsert, setShowBulkInsert] = useState(false);

  // Load Data Simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setContacts(MOCK_CONTACTS);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Derived Data Helpers ---
  const uniqueValues = useMemo(() => ({
    roles: Array.from(new Set(contacts.map(c => c.role))).sort(),
    companies: Array.from(new Set(contacts.map(c => c.company))).sort(),
    industries: Array.from(new Set(contacts.map(c => c.industry || 'Unknown'))).sort(),
    departments: Array.from(new Set(contacts.map(c => c.department || 'Unknown'))).sort(),
    seniority: Array.from(new Set(contacts.map(c => c.seniority || 'Unknown'))).sort(),
    locations: Array.from(new Set(contacts.map(c => c.location || 'Unknown'))).sort(),
  }), [contacts]);

  // --- Logic ---
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset page on filter change
  };

  const handleClearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Global Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches = 
          contact.name.toLowerCase().includes(term) || 
          contact.company.toLowerCase().includes(term) ||
          contact.email?.toLowerCase().includes(term) ||
          contact.role.toLowerCase().includes(term);
        if (!matches) return false;
      }

      // Specific Filters
      if (filters.jobTitles.length > 0 && !filters.jobTitles.includes(contact.role)) return false;
      if (filters.companyNames.length > 0 && !filters.companyNames.includes(contact.company)) return false;
      if (filters.industry.length > 0 && !filters.industry.includes(contact.industry || '')) return false;
      if (filters.location.length > 0 && !filters.location.some(l => contact.location.includes(l))) return false;
      
      // Simulate Lists/Persona/Department filtering if implemented
      if (filters.department.length > 0 && !filters.department.includes(contact.department || '')) return false;

      const emp = contact.employees || 0;
      if (emp < filters.employees[0] || emp > filters.employees[1]) return false;

      return true;
    });
  }, [contacts, searchTerm, filters]);

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredContacts, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage);
  const paginatedContacts = sortedContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === paginatedContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedContacts.map(c => c.id)));
    }
  };

  const activeFiltersCount = 
    filters.jobTitles.length + 
    filters.companyNames.length + 
    filters.location.length + 
    filters.employees[0] > 0 || filters.employees[1] < 10000 ? 1 : 0;

  // --- Render Helpers ---

  const SortIcon = ({ field }: { field: keyof Contact }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-30 ml-1" />;
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-indigo-500 ml-1" />
      : <ArrowDown size={14} className="text-indigo-500 ml-1" />;
  };

  const HeaderCell = ({ field, label, align = 'left', className = '' }: { field: keyof Contact, label: string, align?: string, className?: string }) => (
    <th 
      className={`p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group select-none text-${align} ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : ''}`}>
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  const handleRevealEmail = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSet = new Set(revealedEmails);
    newSet.add(id);
    setRevealedEmails(newSet);
  };

  return (
    <div className="flex h-[calc(100dvh-120px)] md:h-[calc(100vh-100px)] gap-6 overflow-hidden relative w-full max-w-full">
      
      {/* Floating Action Toolbar */}
      <div className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) w-[calc(100%-2rem)] md:w-auto
        ${selectedIds.size > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90'}
      `}>
        <div className="flex items-center gap-1 md:gap-2 p-2.5 rounded-2xl bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl shadow-2xl border border-white/10 dark:border-slate-900/10 text-white dark:text-slate-900 overflow-x-auto no-scrollbar max-w-full">
          <div className="px-3 md:px-4 font-bold text-sm whitespace-nowrap border-r border-white/20 dark:border-black/10 mr-1">
            {selectedIds.size} Selected
          </div>
          
          <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-black/10 h-9 px-2 md:px-3 text-xs" onClick={() => console.log('Saving')}>
            <Save size={16} className="mr-2" /> Save
          </Button3D>
          <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-black/10 h-9 px-2 md:px-3 text-xs" onClick={() => console.log('Emailing')}>
            <Mail size={16} className="mr-2" /> Email
          </Button3D>
          <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-black/10 h-9 px-2 md:px-3 text-xs" onClick={() => console.log('Sequence')}>
            <Share2 size={16} className="mr-2" /> Sequence
          </Button3D>
           <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-black/10 h-9 px-2 md:px-3 text-xs" onClick={() => console.log('Lists')}>
            <ListPlus size={16} className="mr-2" /> Lists
          </Button3D>
           <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-black/10 h-9 px-2 md:px-3 text-xs" onClick={() => console.log('Export')}>
            <Download size={16} className="mr-2" /> Export
          </Button3D>
           <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-black/10 h-9 px-2 md:px-3 text-xs" onClick={() => console.log('Edit')}>
            <Edit size={16} className="mr-2" /> Edit
          </Button3D>
           <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-black/10 h-9 px-2 md:px-3 text-xs" onClick={() => console.log('Push')}>
            <UploadCloud size={16} className="mr-2" /> Push to CRM
          </Button3D>
          
          <button 
            onClick={() => setSelectedIds(new Set())}
            className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-full transition-colors ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* --- Sidebar Filters --- */}
      {/* Mobile Overlay Background */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}

      <div className={`
        flex-shrink-0 flex flex-col h-full bg-white/95 dark:bg-slate-900/95 lg:bg-white/50 lg:dark:bg-slate-900/30 border-r border-slate-200 dark:border-slate-700/50 
        lg:-ml-4 lg:pl-4 pr-2 pt-1 animate-enter z-40 lg:z-20
        transition-transform duration-300 ease-in-out
        fixed inset-y-0 left-0 w-[280px] shadow-2xl lg:shadow-none lg:relative lg:translate-x-0 lg:w-80
        ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-4 pr-2 p-4 lg:p-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500">
               <Filter size={18} />
            </div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Filters</h2>
            {activeFiltersCount > 0 && <Badge3D variant="indigo">{activeFiltersCount}</Badge3D>}
          </div>
          <div className="flex items-center gap-1">
            <Button3D variant="ghost" className="h-6 px-2 text-xs" onClick={() => console.log("Save filter")}>Save</Button3D>
            <button className="lg:hidden p-1 text-slate-500" onClick={() => setIsMobileFiltersOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 lg:px-0 lg:pr-2 space-y-1 pb-20 scrollbar-hide">
          {/* Search */}
          <div className="mb-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search People..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 font-medium border border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500 shadow-sm transition-all"
                />
             </div>
          </div>

          {/* Filter Groups */}
          <FilterSection title="Lists" icon={List} isOpen={false}>
             <div className="p-2 text-sm text-slate-500">No lists created.</div>
          </FilterSection>

          <FilterSection title="Persona" icon={Users} isOpen={false}>
             <MultiSelect3D items={filters.persona} onAdd={() => {}} onRemove={() => {}} suggestions={['Decision Maker', 'Influencer', 'Champion']} placeholder="Select persona" />
          </FilterSection>

          <FilterSection title="Name" icon={AtSign} isOpen={false}>
             <Input3D placeholder="Enter name pattern" className="text-sm" />
          </FilterSection>

          <FilterSection title="Job Titles" icon={Briefcase} count={filters.jobTitles.length} isOpen dotColor="bg-blue-500" onClear={() => updateFilter('jobTitles', [])}>
            <MultiSelect3D 
              items={filters.jobTitles} 
              onAdd={(i) => updateFilter('jobTitles', [...filters.jobTitles, i])} 
              onRemove={(i) => updateFilter('jobTitles', filters.jobTitles.filter(x => x !== i))}
              suggestions={uniqueValues.roles}
              placeholder="Marketing Director..."
              color="blue"
            />
          </FilterSection>

          <FilterSection title="Company" icon={Building2} count={filters.companyNames.length} onClear={() => updateFilter('companyNames', [])}>
            <MultiSelect3D 
              items={filters.companyNames} 
              onAdd={(i) => updateFilter('companyNames', [...filters.companyNames, i])} 
              onRemove={(i) => updateFilter('companyNames', filters.companyNames.filter(x => x !== i))}
              suggestions={uniqueValues.companies}
              placeholder="Select company..."
              color="indigo"
            />
          </FilterSection>

          <FilterSection title="Location" icon={MapPin} count={filters.location.length} isOpen dotColor="bg-rose-500" onClear={() => updateFilter('location', [])}>
            <MultiSelect3D 
              items={filters.location} 
              onAdd={(i) => updateFilter('location', [...filters.location, i])} 
              onRemove={(i) => updateFilter('location', filters.location.filter(x => x !== i))}
              suggestions={uniqueValues.locations}
              placeholder="United Kingdom..."
              color="rose"
            />
          </FilterSection>

          <FilterSection title="# Employees" icon={Users} dotColor="bg-purple-500" isOpen>
            <div className="px-2 pb-2">
              <RangeSlider3D 
                 min={0} max={10000} step={100}
                 value={filters.employees}
                 onChange={(val) => updateFilter('employees', val)}
                 formatLabel={(v) => v === 10000 ? '10k+' : v.toString()}
              />
            </div>
          </FilterSection>
          
          <div className="pt-2">
            <Button3D variant="outline" className="w-full text-sm text-indigo-600 dark:text-indigo-400">
                More Filters
            </Button3D>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full animate-enter" style={{ animationDelay: '100ms' }}>
        
        {/* Header Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4 pr-1 pt-1 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex gap-4 md:gap-6 relative overflow-x-auto w-full md:w-auto no-scrollbar">
             {['Total (25)', 'Net New (10)', 'Saved'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${
                     activeTab === tab 
                     ? 'text-indigo-600 dark:text-indigo-400' 
                     : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                   {tab}
                   {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                   )}
                </button>
             ))}
          </div>
          
          <div className="flex gap-3 pb-2 w-full md:w-auto justify-end">
             {/* Mobile Filter Toggle */}
             <Button3D 
                variant="outline" 
                className="lg:hidden text-xs h-8 px-3" 
                onClick={() => setIsMobileFiltersOpen(true)}
             >
               <Filter size={14} className="mr-2" /> Filters
               {activeFiltersCount > 0 && <span className="ml-1 bg-indigo-100 text-indigo-600 px-1.5 rounded-full text-[10px]">{activeFiltersCount}</span>}
             </Button3D>

             <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 mr-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> {selectedIds.size} Selected
             </div>
             
             {/* View Toggle */}
             <div className="bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 flex h-8 items-center">
                <button 
                  onClick={() => setViewMode('simple')} 
                  title="Simple View"
                  className={`px-2 h-full flex items-center rounded-md transition-all ${viewMode === 'simple' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
                >
                   <LayoutGrid size={14} />
                </button>
                <button 
                  onClick={() => setViewMode('full')} 
                  title="Full View"
                  className={`px-2 h-full flex items-center rounded-md transition-all ${viewMode === 'full' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
                >
                   <Columns size={14} />
                </button>
             </div>

             <Button3D variant="secondary" className="text-xs h-8 px-3" onClick={() => setShowImport(true)}>
               <Upload size={14} className="mr-2" /> Import
             </Button3D>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-hidden pb-4 flex flex-col min-h-0">
          <div className="relative flex-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/40 shadow-inner-3d-light dark:shadow-inner-3d overflow-hidden flex flex-col">
             
             {isLoading ? (
                <div className="p-4">
                  <SkeletonTable3D rows={10} />
                </div>
             ) : paginatedContacts.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center p-10">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <Search size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No contacts found</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
                  <Button3D variant="secondary" className="mt-4" onClick={handleClearAllFilters}>
                     Clear Filters
                  </Button3D>
               </div>
             ) : (
               <div className="flex-1 overflow-auto w-full h-full relative custom-scrollbar">
                 <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold tracking-wider shadow-sm">
                       <tr>
                          <th className="p-4 w-12 text-center">
                            <Checkbox3D checked={selectedIds.size === paginatedContacts.length && paginatedContacts.length > 0} onChange={toggleAll} />
                          </th>
                          <HeaderCell field="name" label="Name" className="min-w-[200px]" />
                          <HeaderCell field="role" label="Title" className="min-w-[150px]" />
                          <HeaderCell field="company" label="Company" className="min-w-[180px]" />
                          <th className="p-4 w-48">Quick Actions</th>
                          
                          {/* Full View Columns */}
                          {viewMode === 'full' && (
                            <>
                              <th className="p-4 min-w-[140px]">Contact Info</th>
                              <HeaderCell field="location" label="Location" className="min-w-[150px]" />
                              <HeaderCell field="employees" label="# Employees" className="min-w-[120px]" />
                              <HeaderCell field="industry" label="Industry" className="min-w-[150px]" />
                              <th className="p-4 min-w-[150px]">Keywords</th>
                            </>
                          )}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60 text-sm">
                       {paginatedContacts.map(contact => {
                          const isSelected = selectedIds.has(contact.id);
                          return (
                          <TiltRow key={contact.id} className="group hover:bg-white dark:hover:bg-slate-800/80 transition-colors" isSelected={isSelected}>
                             <td className="p-4 text-center">
                                <Checkbox3D checked={isSelected} onChange={() => toggleSelection(contact.id)} />
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-3">
                                   <div className="relative">
                                      <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-xl shadow-sm object-cover" />
                                      {contact.socials?.linkedin && (
                                        <a href={contact.socials.linkedin} target="_blank" rel="noreferrer" className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm hover:scale-110 transition-transform">
                                           <Linkedin size={10} className="text-[#0077b5]" />
                                        </a>
                                      )}
                                   </div>
                                   <div>
                                      <div className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">{contact.name}</div>
                                      {viewMode === 'full' && contact.seniority && (
                                        <div className="text-[10px] text-slate-400 mt-0.5 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md inline-block">
                                          {contact.seniority}
                                        </div>
                                      )}
                                   </div>
                                </div>
                             </td>
                             <td className="p-4 text-slate-700 dark:text-slate-300 font-medium max-w-[180px] truncate" title={contact.role}>{contact.role}</td>
                             <td className="p-4">
                                <div className="flex flex-col">
                                   <div className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                                      <Building2 size={12} className="text-slate-400" />
                                      {contact.company}
                                   </div>
                                   <div className="flex gap-2 mt-1">
                                      {contact.socials?.linkedin && <a href={contact.socials.linkedin} className="text-slate-400 hover:text-[#0077b5] transition-colors"><Linkedin size={12} /></a>}
                                      {contact.socials?.twitter && <a href={contact.socials.twitter} className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={12} /></a>}
                                      {contact.socials?.facebook && <a href={contact.socials.facebook} className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={12} /></a>}
                                      {contact.socials?.website && <a href={contact.socials.website} className="text-slate-400 hover:text-emerald-500 transition-colors"><Globe size={12} /></a>}
                                   </div>
                                </div>
                             </td>
                             <td className="p-4">
                                {revealedEmails.has(contact.id) ? (
                                    <div className="flex flex-col gap-1 animate-in fade-in zoom-in-95">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <Mail size={14} className="text-emerald-500 shrink-0" />
                                            <span className="truncate max-w-[140px] text-xs font-medium" title={contact.email}>{contact.email || 'No email found'}</span>
                                            <button className="text-slate-400 hover:text-indigo-500 ml-auto" title="Copy"><Copy size={12} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button3D 
                                      variant="success" 
                                      className="h-8 text-xs w-full shadow-emerald-500/20"
                                      onClick={(e) => handleRevealEmail(e, contact.id)}
                                    >
                                      <Mail size={12} className="mr-2" /> Access Email
                                    </Button3D>
                                )}
                             </td>

                             {/* Full View Content */}
                             {viewMode === 'full' && (
                               <>
                                 <td className="p-4">
                                    {contact.phone && (
                                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1">
                                        <Phone size={12} className="text-slate-400" />
                                        {contact.phone}
                                      </div>
                                    )}
                                 </td>
                                 <td className="p-4 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin size={14} className="text-slate-400" />
                                      <span className="truncate max-w-[150px]" title={contact.location}>{contact.location}</span>
                                    </div>
                                 </td>
                                 <td className="p-4 text-slate-600 dark:text-slate-400">
                                    <Badge3D variant="neutral">{contact.employees.toLocaleString()}</Badge3D>
                                 </td>
                                 <td className="p-4 text-slate-600 dark:text-slate-400 capitalize">
                                    {contact.industry || '-'}
                                 </td>
                                 <td className="p-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                      {contact.keywords?.slice(0, 2).map((k, idx) => (
                                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[80px]">
                                          {k}
                                        </span>
                                      ))}
                                      {contact.keywords && contact.keywords.length > 2 && (
                                        <span className="text-[10px] text-slate-400">+{contact.keywords.length - 2}</span>
                                      )}
                                    </div>
                                 </td>
                               </>
                             )}
                          </TiltRow>
                       )})}
                    </tbody>
                 </table>
               </div>
             )}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="h-16 flex items-center justify-between border-t border-slate-200 dark:border-slate-700/60 pt-2 pr-4">
           <div className="text-sm text-slate-500 dark:text-slate-400">
             Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, sortedContacts.length)}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{sortedContacts.length}</span>
           </div>
           
           <div className="flex items-center gap-2">
              <Button3D 
                variant="outline" 
                className="w-8 h-8 p-0 flex items-center justify-center disabled:opacity-50" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft size={14} />
              </Button3D>
              <div className="px-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                 {currentPage}
              </div>
              <Button3D 
                variant="outline" 
                className="w-8 h-8 p-0 flex items-center justify-center disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <ChevronRight size={14} />
              </Button3D>
           </div>
        </div>
      </div>

      {/* --- Import Modal --- */}
      <Modal3D isOpen={showImport} onClose={() => setShowImport(false)} title="Import Contacts">
         <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group bg-slate-50/50 dark:bg-slate-800/20">
               <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner-3d-light dark:shadow-inner-3d">
                  <FileSpreadsheet size={32} className="text-indigo-500" />
               </div>
               <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Upload CSV or JSON</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                 Drag and drop your file here, or click to browse. Max 10MB.
               </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
               <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
               <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-1">Tip: Use the correct format</p>
                  <p>Ensure your CSV has columns for Name, Email, and Company for best results.</p>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
               <Button3D variant="ghost" onClick={() => setShowImport(false)}>Cancel</Button3D>
               <Button3D variant="primary" iconName="upload" onClick={() => setShowImport(false)}>Start Import</Button3D>
            </div>
         </div>
      </Modal3D>

      {/* --- Bulk Insert Modal --- */}
      <Modal3D isOpen={showBulkInsert} onClose={() => setShowBulkInsert(false)} title="Bulk Insert">
         <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
               Paste your contacts below. One contact per line in the format: <code>Name, Email, Company</code>
            </p>
            <textarea 
               className="w-full h-48 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:border-indigo-500 font-mono text-sm resize-none shadow-inner-3d-light dark:shadow-inner-3d"
               placeholder="John Doe, john@example.com, Acme Corp&#10;Jane Smith, jane@test.com, Tech Inc"
            />
            <div className="flex justify-end gap-3 pt-2">
               <Button3D variant="ghost" onClick={() => setShowBulkInsert(false)}>Cancel</Button3D>
               <Button3D variant="primary" iconName="check-circle" onClick={() => setShowBulkInsert(false)}>Process Contacts</Button3D>
            </div>
         </div>
      </Modal3D>

    </div>
  );
};
