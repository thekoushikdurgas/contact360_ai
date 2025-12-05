

import { NavItem, StatMetric, ActivityItem, UserRole, Company, Contact } from './types';
import { 
  Users, Building2, CheckCircle, Download, LayoutDashboard, 
  Search, Mail, Linkedin, Bot, Settings, LogOut, Sun, Moon, 
  ShieldCheck, CreditCard, History, User, UserCog, Shield
} from 'lucide-react';
import React from 'react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', iconName: 'layout-dashboard' },
  { label: 'AI Assistant', path: '/ai-chat', iconName: 'bot' },
  { label: 'LinkedIn', path: '/linkedin', iconName: 'linkedin' },
  { label: 'Contacts', path: '/contacts', iconName: 'users' },
  { label: 'Companies', path: '/companies', iconName: 'building' },
  { label: 'Email Finder', path: '/finder', iconName: 'mail' },
  { label: 'Verifier', path: '/verifier', iconName: 'shield-check' },
  { label: 'Exports', path: '/export', iconName: 'download' },
  { label: 'Billing', path: '/billing', iconName: 'credit-card' },
  { label: 'Profile', path: '/profile', iconName: 'user' },
  { label: 'Settings', path: '/settings', iconName: 'settings' },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'User Management', path: '/admin/users', iconName: 'user-cog', allowedRoles: [UserRole.SUPER_ADMIN] },
  { label: 'User History', path: '/admin/user-history', iconName: 'history', allowedRoles: [UserRole.SUPER_ADMIN] },
  { label: 'Admin Settings', path: '/admin/settings', iconName: 'shield', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
];

export const MOCK_STATS: StatMetric[] = [
  { title: 'Total Leads', value: '12,450', change: 12, iconName: 'users', colorVariant: 'indigo' },
  { title: 'Companies Tracked', value: '3,842', change: 5, iconName: 'building', colorVariant: 'blue' },
  { title: 'Emails Verified', value: '8,920', change: 24, iconName: 'check-circle', colorVariant: 'emerald' },
  { title: 'Exports This Month', value: '45', change: -2, iconName: 'download', colorVariant: 'orange' },
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'Alex M.', avatar: 'https://picsum.photos/32/32?random=1' },
    action: 'exported',
    target: 'Tech Startups Q3 List',
    timestamp: '2 mins ago',
    count: 145,
    type: 'export'
  },
  {
    id: '2',
    user: { name: 'Sarah L.', avatar: 'https://picsum.photos/32/32?random=2' },
    action: 'verified',
    target: 'Sales Directors',
    timestamp: '15 mins ago',
    count: 24,
    type: 'verify'
  },
  {
    id: '3',
    user: { name: 'Mike R.', avatar: 'https://picsum.photos/32/32?random=3' },
    action: 'tracked',
    target: 'Acme Corp',
    timestamp: '1 hour ago',
    type: 'track'
  },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  'layout-dashboard': LayoutDashboard,
  'users': Users,
  'building': Building2,
  'mail': Mail,
  'download': Download,
  'linkedin': Linkedin,
  'bot': Bot,
  'settings': Settings,
  'log-out': LogOut,
  'check-circle': CheckCircle,
  'search': Search,
  'sun': Sun,
  'moon': Moon,
  'shield-check': ShieldCheck,
  'credit-card': CreditCard,
  'history': History,
  'user': User,
  'user-cog': UserCog,
  'shield': Shield
};

// --- Mock Data ---

export const MOCK_COMPANIES: Company[] = [
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

const RAW_CONTACTS_DATA = [
    {
        "uuid": "e5ab9611-a330-585d-88df-f93c9f7b033b",
        "first_name": "Luke",
        "last_name": "Sollitt",
        "title": "road liner",
        "company": "Jointline Limited",
        "company_name_for_emails": "Jointline Limited",
        "email": "luke.sollitt@jointline.co.uk",
        "email_status": "Verified",
        "primary_email_catch_all_status": null,
        "seniority": "Entry",
        "departments": null,
        "work_direct_phone": null,
        "home_phone": null,
        "mobile_phone": null,
        "corporate_phone": "+44 152 286 8636",
        "other_phone": null,
        "stage": "Cold",
        "employees": 82,
        "industry": "construction",
        "keywords": "high friction surfacing, airfield marking, car park marking, warehouse markings, civils, surface dressing, public realm schemes, electric vehicle bays, highways line marking, concrete repairs, airfield inspections, joint sealing, overbanding, utility reinstatement, tar, chip surfacing, thermoplastic, pot hole repairs, groundworks, drainage, flood alleviation, runway grooving, highways grooving, grooving for livestock barns, airfield line marking, helicopter pad line marking, distribution hub safety markings, cold store safety line marking, road stud installation & removal, resin bond surfacing, resin bound surfacing, sports pitch line marking, football pitch line marking, antislip coatings for floors, antislip coating for steps & stairs",
        "person_linkedin_url": "http://www.linkedin.com/in/luake-sollitt-51150b78",
        "website": "http://www.jointline.co.uk",
        "company_linkedin_url": "http://www.linkedin.com/company/jointline",
        "facebook_url": "https://facebook.com/jointlinelimited",
        "twitter_url": "https://twitter.com/jointlineltd",
        "city": "Leeds",
        "state": "England",
        "country": "United Kingdom",
        "company_address": "Lincoln, England, United Kingdom, LN6 9TW",
        "company_city": "Lincoln",
        "company_state": "England",
        "company_country": "United Kingdom",
        "company_phone": "+44 152 286 8636",
        "technologies": "Outlook, Vimeo, reCAPTCHA, Typekit, Mobile Friendly, Google Font API, Apache, Google Tag Manager",
        "annual_revenue": 7000000,
        "total_funding": 0,
        "latest_funding": null,
        "latest_funding_amount": 0,
        "last_raised_at": null,
        "meta_data": {
            "latest_funding_amount": "0"
        },
        "created_at": "2025-11-22T22:10:36.684152",
        "updated_at": "2025-11-22T22:10:36.684152"
    }
];

// Add specific contacts for mock companies
const ADDITIONAL_MOCK_CONTACTS = [
  { uuid: "c1", first_name: "John", last_name: "Smith", title: "CEO", company: "Deloitte", email: "jsmith@deloitte.com", city: "New York", country: "United States" },
  { uuid: "c2", first_name: "Sarah", last_name: "Connor", title: "CTO", company: "Deloitte", email: "sconnor@deloitte.com", city: "London", country: "UK" },
  { uuid: "c3", first_name: "Mike", last_name: "Ross", title: "VP Sales", company: "Walmart", email: "mike.ross@walmart.com", city: "Bentonville", country: "United States" },
  { uuid: "c4", first_name: "Rachel", last_name: "Green", title: "HR Director", company: "SightCall", email: "rachel@sightcall.com", city: "San Francisco", country: "United States" },
  { uuid: "c5", first_name: "Harvey", last_name: "Specter", title: "Legal Counsel", company: "VINCI Autoroutes", email: "harvey@vinci.com", city: "Paris", country: "France" },
];

export const MOCK_CONTACTS: Contact[] = [
    ...RAW_CONTACTS_DATA.map((r: any) => ({
      id: r.uuid,
      name: `${r.first_name} ${r.last_name}`,
      email: r.email || '',
      phone: r.corporate_phone || r.mobile_phone || r.work_direct_phone || '',
      role: r.title,
      company: r.company,
      status: (r.email_status as Contact['status']) || 'Lead',
      location: r.city ? `${r.city}, ${r.country}` : r.country || 'Unknown',
      companyAddress: `${r.company_city}, ${r.company_country}`,
      lastActive: new Date(r.updated_at).toLocaleDateString(),
      avatar: `https://ui-avatars.com/api/?name=${r.first_name}+${r.last_name}&background=6366f1&color=fff&size=128`,
      employees: r.employees,
      revenue: r.annual_revenue,
      industry: r.industry,
      keywords: r.keywords ? r.keywords.split(',').map((k: string) => k.trim()) : [],
      technologies: r.technologies ? r.technologies.split(',').map((t: string) => t.trim()) : [],
      seniority: r.seniority,
      department: r.departments,
      socials: {
        linkedin: r.person_linkedin_url,
        twitter: r.twitter_url,
        facebook: r.facebook_url,
        website: r.website
      },
      selected: false,
    })),
    ...ADDITIONAL_MOCK_CONTACTS.map((c: any) => ({
      id: c.uuid,
      name: `${c.first_name} ${c.last_name}`,
      email: c.email,
      phone: '',
      role: c.title,
      company: c.company,
      status: 'Verified' as Contact['status'],
      location: `${c.city}, ${c.country}`,
      companyAddress: '',
      lastActive: new Date().toLocaleDateString(),
      avatar: `https://ui-avatars.com/api/?name=${c.first_name}+${c.last_name}&background=random&color=fff&size=128`,
      employees: 0,
      keywords: [],
      technologies: [],
      socials: {},
      selected: false
    }))
];
