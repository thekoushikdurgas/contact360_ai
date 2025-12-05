
import { NavItem, StatMetric, ActivityItem } from './types';
import { 
  Users, Building2, CheckCircle, Download, LayoutDashboard, 
  Search, Mail, Linkedin, Bot, Settings, LogOut, Sun, Moon, ShieldCheck, CreditCard
} from 'lucide-react';
import React from 'react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', iconName: 'layout-dashboard' },
  { label: 'Contacts', path: '/contacts', iconName: 'users' },
  { label: 'Companies', path: '/companies', iconName: 'building' },
  { label: 'Email Finder', path: '/finder', iconName: 'mail' },
  { label: 'Verifier', path: '/verifier', iconName: 'shield-check' },
  { label: 'Billing', path: '/billing', iconName: 'credit-card' },
  { label: 'Exports', path: '/export', iconName: 'download' },
  { label: 'LinkedIn', path: '/linkedin', iconName: 'linkedin' },
  { label: 'AI Assistant', path: '/ai-chat', iconName: 'bot' },
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
  'credit-card': CreditCard
};
