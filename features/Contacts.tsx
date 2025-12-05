
import React, { useState, useMemo, useEffect } from 'react';
import { Button3D, Input3D, Checkbox3D, Badge3D, Modal3D, MultiSelect3D, RangeSlider3D, TiltRow, Select3D } from '../components/UI';
import { SkeletonTable3D } from '../components/Skeleton';
import { Contact } from '../types';
import { MOCK_CONTACTS } from '../constants';
import { 
  Search, Filter, Download, List, Users, Building2, MapPin, Hash, Upload, 
  MoreHorizontal, ChevronLeft, ChevronRight, X, Linkedin, Twitter, Facebook,
  ChevronDown, Save, Eye, Trash2, Mail, Briefcase, Globe, DollarSign, Layers,
  Terminal, UserCheck, Copy, ArrowUp, ArrowDown, ArrowUpDown, FileSpreadsheet, 
  CheckCircle, AlertCircle, Sparkles, LayoutGrid, ListPlus, Edit, UploadCloud,
  AtSign, MousePointer2, Phone, Tag, Columns, Calendar, Clock
} from 'lucide-react';

// --- Helper Components ---

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
      group rounded-xl transition-all duration-300 border mb-3 overflow-hidden relative
      ${isOpen || hasActive 
        ? 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 shadow-sm' 
        : 'bg-transparent border-transparent hover:bg-white/40 dark:hover:bg-slate-800/30'
      }
    `}>
      {/* Active Indicator Line */}
      {hasActive && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${dotColor || 'bg-indigo-500'}`} />
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 pl-4 text-left relative z-10"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-1.5 rounded-lg ${hasActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
               <Icon size={14} />
            </div>
          )}
          <span className={`font-semibold text-sm ${hasActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
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
               className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
               title="Clear section"
             >
               <X size={12} />
             </div>
           )}
           <div className={`p-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={14} className="text-slate-400" />
           </div>
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-0">
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
  salary: [number, number];
  lastActive: number; // Days
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
  salary: [50, 250],
  lastActive: 30,
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
  const [activeTab, setActiveTab] = useState('Total');
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
    }, 800);
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
      if (filters.seniority.length > 0 && !filters.seniority.includes(contact.seniority || '')) return false;
      
      const emp = contact.employees || 0;
      if (emp < filters.employees[0] || emp > filters.employees[1]) return false;

      // Mock Salary & Date Logic (since mock data might not have it)
      // We assume data passes if it's within "mock" ranges for demo purposes
      
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
    if (selectedIds.size === paginatedContacts.length && paginatedContacts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedContacts.map(c => c.id)));
    }
  };

  const activeFiltersCount = 
    filters.jobTitles.length + 
    filters.companyNames.length + 
    filters.location.length + 
    filters.seniority.length +
    filters.industry.length +
    (filters.employees[0] > 0 || filters.employees[1] < 10000 ? 1 : 0) +
    (filters.salary[0] > 50 || filters.salary[1] < 250 ? 1 : 0);

  // --- Render Helpers ---

  const SortIcon = ({ field }: { field: keyof Contact }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="opacity-30 ml-1.5" />;
    return sortDirection === 'asc' 
      ? <ArrowUp size={12} className="text-indigo-500 ml-1.5" />
      : <ArrowDown size={12} className="text-indigo-500 ml-1.5" />;
  };

  const HeaderCell = ({ field, label, align = 'left', className = '' }: { field: keyof Contact, label: string, align?: string, className?: string }) => (
    <th 
      className={`p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group select-none text-${align} ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className={`flex items-center ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider group-hover:text-indigo-500 transition-colors">{label}</span>
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
    <div className="flex h-[calc(100dvh-80px)] md:h-[calc(100vh-100px)] gap-6 overflow-hidden relative w-full max-w-full">
      
      {/* Floating Action Toolbar (Bottom Center) */}
      <div className={`
        fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) w-auto max-w-[90vw]
        ${selectedIds.size > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90 pointer-events-none'}
      `}>
        <div className="flex items-center gap-1 p-1.5 pl-4 rounded-2xl bg-slate-900/90 dark:bg-white/90 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-white/20 dark:border-black/10 text-white dark:text-slate-900 ring-1 ring-black/5 dark:ring-white/20">
          <div className="mr-3 font-bold text-sm whitespace-nowrap flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">
              {selectedIds.size}
            </div>
            Selected
          </div>
          
          <div className="h-6 w-px bg-white/20 dark:bg-black/10 mx-1" />

          <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/20 dark:hover:bg-black/10 h-8 px-3 text-xs rounded-xl" onClick={() => console.log('Saving')}>
            <Save size={14} className="mr-2" /> Save
          </Button3D>
          <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/20 dark:hover:bg-black/10 h-8 px-3 text-xs rounded-xl" onClick={() => console.log('Emailing')}>
            <Mail size={14} className="mr-2" /> Email
          </Button3D>
           <Button3D variant="ghost" className="text-white dark:text-slate-900 hover:bg-white/20 dark:hover:bg-black/10 h-8 px-3 text-xs rounded-xl" onClick={() => console.log('Export')}>
            <Download size={14} className="mr-2" /> Export
          </Button3D>
          
          <div className="h-6 w-px bg-white/20 dark:bg-black/10 mx-1" />

          <button 
            onClick={() => setSelectedIds(new Set())}
            className="w-8 h-8 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 rounded-xl transition-all"
            title="Clear Selection"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* --- Sidebar Filters --- */}
      {/* Mobile Overlay Background */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}

      <div className={`
        flex-shrink-0 flex flex-col h-[100dvh] lg:h-full bg-white/80 dark:bg-slate-900/80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-r lg:border-none border-slate-200 dark:border-slate-700/50 
        lg:pr-2 pt-1 animate-enter z-50 lg:z-0
        transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        fixed inset-y-0 left-0 w-[85vw] max-w-[300px] lg:w-[280px] lg:max-w-none shadow-2xl lg:shadow-none lg:relative lg:translate-x-0
        ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-4 pr-2 p-4 lg:p-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
               <Filter size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white leading-tight">Filters</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{activeFiltersCount} Active</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {activeFiltersCount > 0 && (
              <button 
                onClick={handleClearAllFilters}
                className="text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-2 py-1 rounded-lg transition-colors"
              >
                CLEAR
              </button>
            )}
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setIsMobileFiltersOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 lg:px-0 lg:pr-1 space-y-1 pb-24 scroll-smooth custom-scrollbar">
          {/* Global Search Input */}
          <div className="mb-4 relative group perspective-[1000px]">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
             <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner-3d-light dark:shadow-inner-3d flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Global Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-transparent rounded-xl outline-none text-base md:text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 font-medium"
                />
             </div>
          </div>

          {/* Filter Groups */}
          <FilterSection title="Targeting Lists" icon={List} isOpen={false}>
             <div className="p-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                <p>No custom lists yet.</p>
                <button className="text-indigo-500 font-bold text-xs mt-1 hover:underline">+ Create List</button>
             </div>
          </FilterSection>

          <FilterSection title="Contact Info" icon={AtSign} isOpen>
             <div className="space-y-3">
                <Input3D placeholder="Name or Email pattern" className="text-xs h-9" />
                <div className="flex gap-2">
                   <div className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex items-center gap-2 cursor-pointer hover:border-indigo-300 transition-colors">
                      <Checkbox3D /> <span className="text-xs text-slate-600 dark:text-slate-400">Has Email</span>
                   </div>
                   <div className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex items-center gap-2 cursor-pointer hover:border-indigo-300 transition-colors">
                      <Checkbox3D /> <span className="text-xs text-slate-600 dark:text-slate-400">Has Phone</span>
                   </div>
                </div>
             </div>
          </FilterSection>

          <FilterSection title="Job Titles" icon={Briefcase} count={filters.jobTitles.length} isOpen dotColor="bg-blue-500" onClear={() => updateFilter('jobTitles', [])}>
            <MultiSelect3D 
              items={filters.jobTitles} 
              onAdd={(i) => updateFilter('jobTitles', [...filters.jobTitles, i])} 
              onRemove={(i) => updateFilter('jobTitles', filters.jobTitles.filter(x => x !== i))}
              suggestions={uniqueValues.roles}
              placeholder="e.g. Marketing Director"
              color="blue"
            />
          </FilterSection>

          <FilterSection title="Seniority" icon={UserCheck} count={filters.seniority.length} onClear={() => updateFilter('seniority', [])}>
             <div className="flex flex-wrap gap-2">
                {['CXO', 'VP', 'Director', 'Manager', 'Senior', 'Entry'].map(lvl => (
                   <button 
                     key={lvl}
                     onClick={() => {
                        const newSet = filters.seniority.includes(lvl) 
                           ? filters.seniority.filter(s => s !== lvl)
                           : [...filters.seniority, lvl];
                        updateFilter('seniority', newSet);
                     }}
                     className={`
                        px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                        ${filters.seniority.includes(lvl) 
                           ? 'bg-indigo-500 border-indigo-600 text-white shadow-md' 
                           : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'}
                     `}
                   >
                      {lvl}
                   </button>
                ))}
             </div>
          </FilterSection>

          <FilterSection title="Company" icon={Building2} count={filters.companyNames.length} onClear={() => updateFilter('companyNames', [])}>
            <MultiSelect3D 
              items={filters.companyNames} 
              onAdd={(i) => updateFilter('companyNames', [...filters.companyNames, i])} 
              onRemove={(i) => updateFilter('companyNames', filters.companyNames.filter(x => x !== i))}
              suggestions={uniqueValues.companies}
              placeholder="Search companies..."
              color="indigo"
            />
          </FilterSection>

          <FilterSection title="Industry" icon={Tag} count={filters.industry.length} onClear={() => updateFilter('industry', [])}>
            <MultiSelect3D 
              items={filters.industry} 
              onAdd={(i) => updateFilter('industry', [...filters.industry, i])} 
              onRemove={(i) => updateFilter('industry', filters.industry.filter(x => x !== i))}
              suggestions={uniqueValues.industries}
              placeholder="Select industry..."
              color="purple"
            />
          </FilterSection>

          <FilterSection title="Location" icon={MapPin} count={filters.location.length} dotColor="bg-rose-500" onClear={() => updateFilter('location', [])}>
            <MultiSelect3D 
              items={filters.location} 
              onAdd={(i) => updateFilter('location', [...filters.location, i])} 
              onRemove={(i) => updateFilter('location', filters.location.filter(x => x !== i))}
              suggestions={uniqueValues.locations}
              placeholder="City, Country..."
              color="rose"
            />
          </FilterSection>

          <FilterSection title="Salary Range" icon={DollarSign} dotColor="bg-emerald-500">
            <div className="px-2 pb-2">
              <RangeSlider3D 
                 min={50} max={250} step={10}
                 value={filters.salary}
                 onChange={(val) => updateFilter('salary', val)}
                 formatLabel={(v) => `$${v}k`}
              />
            </div>
          </FilterSection>

          <FilterSection title="Company Size" icon={Users} dotColor="bg-purple-500">
            <div className="px-2 pb-2">
              <RangeSlider3D 
                 min={0} max={10000} step={100}
                 value={filters.employees}
                 onChange={(val) => updateFilter('employees', val)}
                 formatLabel={(v) => v === 10000 ? '10k+' : v.toString()}
              />
            </div>
          </FilterSection>

          <FilterSection title="Last Active" icon={Clock}>
             <div className="space-y-3">
               <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>Within last:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{filters.lastActive} days</span>
               </div>
               <input 
                  type="range" 
                  min="1" max="90" 
                  value={filters.lastActive}
                  onChange={(e) => updateFilter('lastActive', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1d</span>
                  <span>30d</span>
                  <span>90d</span>
               </div>
             </div>
          </FilterSection>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full animate-enter" style={{ animationDelay: '100ms' }}>
        
        {/* Top Bar: Tabs & Quick Actions */}
        <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 mb-4 pr-2 pt-2">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 relative shadow-inner-3d-light dark:shadow-inner-3d w-full xl:w-auto overflow-x-auto no-scrollbar">
             {['Total', 'Net New', 'Saved', 'Do Not Contact'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      relative px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 z-10 whitespace-nowrap flex-1 xl:flex-none
                      ${isActive ? 'text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
                    `}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-indigo-600 rounded-lg shadow-md -z-10 animate-in fade-in zoom-in-95 duration-200" />
                    )}
                    {tab}
                    {tab === 'Total' && <span className={`ml-2 text-[10px] py-0.5 px-1.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{contacts.length}</span>}
                  </button>
                );
             })}
          </div>
          
          <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
             {/* Mobile Filter Toggle */}
             <Button3D 
                variant="outline" 
                className="lg:hidden text-xs h-9 px-3" 
                onClick={() => setIsMobileFiltersOpen(true)}
             >
               <Filter size={14} className="mr-2" /> Filters
               {activeFiltersCount > 0 && <span className="ml-1 bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px]">{activeFiltersCount}</span>}
             </Button3D>

             {/* View Toggle */}
             <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700/60 flex h-9 items-center backdrop-blur-md shadow-sm">
                <button 
                  onClick={() => setViewMode('simple')} 
                  title="Simple View"
                  className={`px-3 h-full flex items-center justify-center rounded-lg transition-all text-xs font-medium gap-2 ${viewMode === 'simple' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <List size={14} /> Simple
                </button>
                <button 
                  onClick={() => setViewMode('full')} 
                  title="Full View"
                  className={`px-3 h-full flex items-center justify-center rounded-lg transition-all text-xs font-medium gap-2 ${viewMode === 'full' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <Columns size={14} /> Full
                </button>
             </div>

             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

             <Button3D variant="secondary" className="text-xs h-9 px-4 hidden sm:flex" onClick={() => setShowImport(true)}>
               <Upload size={14} className="mr-2" /> Import
             </Button3D>
             <Button3D variant="primary" className="text-xs h-9 px-4 shadow-indigo-500/20" onClick={() => setShowBulkInsert(true)}>
               <ListPlus size={14} className="mr-2" /> Bulk Insert
             </Button3D>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-hidden pb-4 flex flex-col min-h-0 relative">
          <div className="relative flex-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/40 shadow-inner-3d-light dark:shadow-inner-3d overflow-hidden flex flex-col backdrop-blur-sm">
             
             {/* Query Metadata Bar */}
             <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <div className="flex items-center gap-4">
                   <span>Strategy: Cursor-based</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                   <span>Records: {filteredContacts.length}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span>Sorted By: <span className="text-indigo-500">{sortField}</span></span>
                </div>
             </div>

             {isLoading ? (
                <div className="p-4">
                  <SkeletonTable3D rows={10} />
                </div>
             ) : paginatedContacts.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center p-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 shadow-inner-3d-light dark:shadow-inner-3d">
                     <Search size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No contacts found</h3>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto">We couldn't find any contacts matching your current filters.</p>
                  <Button3D variant="secondary" className="mt-6" onClick={handleClearAllFilters}>
                     Clear All Filters
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
                          <HeaderCell field="name" label="Name" className="min-w-[220px]" />
                          <HeaderCell field="role" label="Title" className="min-w-[180px]" />
                          <HeaderCell field="company" label="Company" className="min-w-[180px]" />
                          <th className="p-4 w-40">Quick Actions</th>
                          
                          {/* Full View Columns */}
                          {viewMode === 'full' && (
                            <>
                              <HeaderCell field="location" label="Location" className="min-w-[150px]" />
                              <HeaderCell field="employees" label="# Emp" className="min-w-[100px]" />
                              <HeaderCell field="industry" label="Industry" className="min-w-[140px]" />
                              <th className="p-4 min-w-[160px]">Keywords</th>
                              <th className="p-4 min-w-[120px]">Last Active</th>
                            </>
                          )}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60 text-sm">
                       {paginatedContacts.map((contact, idx) => {
                          const isSelected = selectedIds.has(contact.id);
                          return (
                          <TiltRow key={contact.id} className="group hover:bg-white dark:hover:bg-slate-800/80 transition-colors" isSelected={isSelected}>
                             <td className="p-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full" />}
                                <Checkbox3D checked={isSelected} onChange={() => toggleSelection(contact.id)} />
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-4">
                                   <div className="relative shrink-0">
                                      <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-xl shadow-sm object-cover ring-2 ring-white dark:ring-slate-700" />
                                      {contact.socials?.linkedin && (
                                        <a href={contact.socials.linkedin} target="_blank" rel="noreferrer" className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm hover:scale-110 transition-transform border border-slate-100 dark:border-slate-600">
                                           <Linkedin size={10} className="text-[#0077b5]" />
                                        </a>
                                      )}
                                   </div>
                                   <div>
                                      <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer text-[15px]">{contact.name}</div>
                                      {viewMode === 'full' && contact.seniority && (
                                        <div className="flex gap-1 mt-0.5">
                                           <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-px bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                             {contact.seniority}
                                           </span>
                                        </div>
                                      )}
                                   </div>
                                </div>
                             </td>
                             <td className="p-4 text-slate-700 dark:text-slate-300 font-medium max-w-[180px]">
                                <div className="truncate" title={contact.role}>{contact.role}</div>
                                {contact.department && <div className="text-xs text-slate-400 mt-0.5">{contact.department}</div>}
                             </td>
                             <td className="p-4">
                                <div className="flex flex-col">
                                   <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer">
                                      <Building2 size={14} className="text-slate-400" />
                                      {contact.company}
                                   </div>
                                   <div className="flex gap-2 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                      {contact.socials?.linkedin && <a href={contact.socials.linkedin} className="text-slate-400 hover:text-[#0077b5] transition-colors"><Linkedin size={12} /></a>}
                                      {contact.socials?.twitter && <a href={contact.socials.twitter} className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={12} /></a>}
                                      {contact.socials?.website && <a href={contact.socials.website} className="text-slate-400 hover:text-emerald-500 transition-colors"><Globe size={12} /></a>}
                                   </div>
                                </div>
                             </td>
                             <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                {revealedEmails.has(contact.id) ? (
                                    <div className="flex flex-col gap-1 animate-in fade-in zoom-in-95 slide-in-from-left-2">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <Mail size={14} className="text-emerald-500 shrink-0" />
                                            <span className="truncate max-w-[120px] text-xs font-mono select-all" title={contact.email}>{contact.email || 'No email found'}</span>
                                            <button className="text-slate-400 hover:text-indigo-500 ml-auto" title="Copy"><Copy size={12} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button3D 
                                      variant="ghost" 
                                      className="h-8 text-xs w-full border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600"
                                      onClick={(e) => handleRevealEmail(e, contact.id)}
                                    >
                                      <Mail size={12} className="mr-2" /> Reveal Email
                                    </Button3D>
                                )}
                             </td>

                             {/* Full View Columns */}
                             {viewMode === 'full' && (
                               <>
                                 <td className="p-4 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin size={14} className="text-slate-400 shrink-0" />
                                      <span className="truncate max-w-[140px]" title={contact.location}>{contact.location}</span>
                                    </div>
                                 </td>
                                 <td className="p-4 text-slate-600 dark:text-slate-400">
                                    <Badge3D variant="neutral" className="font-mono text-[10px]">{contact.employees.toLocaleString()}</Badge3D>
                                 </td>
                                 <td className="p-4 text-slate-600 dark:text-slate-400">
                                    <span className="capitalize px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs border border-slate-200 dark:border-slate-700">
                                      {contact.industry || '-'}
                                    </span>
                                 </td>
                                 <td className="p-4">
                                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                                      {contact.keywords?.slice(0, 2).map((k, idx) => (
                                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[80px]">
                                          {k}
                                        </span>
                                      ))}
                                      {contact.keywords && contact.keywords.length > 2 && (
                                        <span className="text-[10px] text-slate-400 flex items-center">+{contact.keywords.length - 2}</span>
                                      )}
                                    </div>
                                 </td>
                                 <td className="p-4 text-slate-500 text-xs">
                                    <div className="flex items-center gap-1.5">
                                       <Clock size={12} /> {contact.lastActive}
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

        {/* Pagination Controls (Floating Glass) */}
        <div className="h-14 flex items-center justify-between px-4 mt-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5 mx-1">
           <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
             Showing <span className="text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedContacts.length)}</span> of <span className="text-slate-900 dark:text-white">{sortedContacts.length}</span> results
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="px-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                 {currentPage} <span className="text-slate-400 font-normal mx-1">/</span> {totalPages}
              </div>
              
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* --- Import Modal --- */}
      <Modal3D isOpen={showImport} onClose={() => setShowImport(false)} title="Import Contacts">
         <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-white/5 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group bg-slate-50/50 dark:bg-slate-800/20">
               <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner-3d-light dark:shadow-inner-3d">
                  <FileSpreadsheet size={32} className="text-indigo-500" />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Drop CSV or JSON file</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                 Or click to browse. Max file size 10MB.
               </p>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
               <AlertCircle className="text-indigo-500 shrink-0 mt-0.5" size={18} />
               <div className="text-sm text-indigo-900 dark:text-indigo-200">
                  <p className="font-bold mb-1">Data Requirements</p>
                  <p className="opacity-80">Ensure your file includes: <code>Name</code>, <code>Email</code>, <code>Company</code>, and <code>Job Title</code> columns.</p>
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
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
               <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <Terminal size={14} /> Quick Paste Format
               </div>
               <p className="text-sm font-mono text-slate-600 dark:text-slate-300">
                  Name, Email, Company (one per line)
               </p>
            </div>
            <textarea 
               className="w-full h-64 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:border-indigo-500 font-mono text-sm resize-none shadow-inner-3d-light dark:shadow-inner-3d focus:ring-4 focus:ring-indigo-500/10 transition-all"
               placeholder="Elon Musk, elon@tesla.com, Tesla&#10;Tim Cook, tim@apple.com, Apple"
            />
            <div className="flex justify-end gap-3 pt-2">
               <Button3D variant="ghost" onClick={() => setShowBulkInsert(false)}>Cancel</Button3D>
               <Button3D variant="primary" iconName="check-circle" onClick={() => setShowBulkInsert(false)}>Process Data</Button3D>
            </div>
         </div>
      </Modal3D>

    </div>
  );
};
