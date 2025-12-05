

export interface StatMetric {
  title: string;
  value: string;
  change: number;
  iconName: 'users' | 'building' | 'check-circle' | 'download' | 'trending-up';
  colorVariant: 'indigo' | 'blue' | 'emerald' | 'orange' | 'rose';
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  count?: number;
  type: 'export' | 'track' | 'verify' | 'search';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum UserRole {
  FREE_USER = 'FREE_USER',
  PRO_USER = 'PRO_USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface NavItem {
  label: string;
  path: string;
  iconName: string;
  allowedRoles?: UserRole[];
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash',
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  company: string;
  status: 'Active' | 'Lead' | 'Churned' | 'Inactive' | 'Verified' | 'Risky';
  location: string;
  companyAddress?: string;
  lastActive: string;
  avatar: string;
  selected?: boolean;
  employees: number;
  revenue?: number;
  industry?: string;
  keywords?: string[];
  technologies?: string[];
  seniority?: string;
  department?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
}

export interface Company {
  uuid: string;
  name: string;
  employees_count: number;
  annual_revenue: number;
  total_funding: number;
  industry: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
  linkedin_url: string | null;
  phone_number: string | null;
  technologies: string[];
  keywords: string[] | null;
  logoColor?: string; // UI specific
  aiSummary?: string; // UI specific
}

// --- Billing Types ---

export type PlanCategory = 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE';
export type BillingPeriod = 'monthly' | 'quarterly' | 'yearly';

export interface PlanPricing {
  price: number;
  credits: number;
  rate_per_credit: number;
  savings_amount?: number;
  savings_percentage?: number;
}

export interface SubscriptionPlan {
  id: string; // The Tier ID (e.g. '5k')
  name: string;
  category: PlanCategory;
  pricing: {
    monthly: PlanPricing;
    quarterly: PlanPricing;
    yearly: PlanPricing;
  };
  features: string[];
  isPopular?: boolean;
}

export interface AddonPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  rate_per_credit: number;
  description: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

export interface BillingInfo {
  subscription_plan_id: string;
  subscription_period: BillingPeriod;
  subscription_status: 'active' | 'cancelled' | 'expired';
  credits_used: number;
  credits_limit: number;
  renewal_date: string;
}

// --- Admin History Types ---

export type UserHistoryEventType = 'registration' | 'login' | 'password_reset' | 'settings_update' | 'api_key_created';

export interface UserHistoryItem {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  event_type: UserHistoryEventType;
  created_at: string;
  city?: string;
  region_name?: string;
  country?: string;
  country_code?: string;
  timezone?: string;
  ip?: string;
  proxy?: boolean;
  device?: string;
}