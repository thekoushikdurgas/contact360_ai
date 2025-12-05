
import { useState, useEffect } from 'react';
import { BillingInfo, SubscriptionPlan, AddonPackage, Invoice } from '../types';

// Based on SQL: ('5k', '5k Credits Tier', 'STARTER', true) ... etc
const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: '5k',
    name: '5k Credits Tier',
    category: 'STARTER',
    pricing: {
      monthly: { credits: 5000, rate_per_credit: 0.002, price: 10.0 },
      quarterly: { credits: 15000, rate_per_credit: 0.0018, price: 27.0, savings_amount: 3.0, savings_percentage: 10 },
      yearly: { credits: 60000, rate_per_credit: 0.0016, price: 96.0, savings_amount: 24.0, savings_percentage: 20 }
    },
    features: ['5,000 Credits / mo', 'Email Support', 'Basic Export'],
  },
  {
    id: '25k',
    name: '25k Credits Tier',
    category: 'STARTER',
    pricing: {
      monthly: { credits: 25000, rate_per_credit: 0.0012, price: 30.0 },
      quarterly: { credits: 75000, rate_per_credit: 0.00108, price: 81.0, savings_amount: 9.0, savings_percentage: 10 },
      yearly: { credits: 300000, rate_per_credit: 0.00096, price: 288.0, savings_amount: 72.0, savings_percentage: 20 }
    },
    features: ['25,000 Credits / mo', 'Standard Support', 'Standard Export'],
  },
  {
    id: '100k',
    name: '100k Credits Tier',
    category: 'PROFESSIONAL',
    isPopular: true,
    pricing: {
      monthly: { credits: 100000, rate_per_credit: 0.00099, price: 99.0 },
      quarterly: { credits: 300000, rate_per_credit: 0.000891, price: 267.0, savings_amount: 30.0, savings_percentage: 10 },
      yearly: { credits: 1200000, rate_per_credit: 0.000792, price: 950.0, savings_amount: 238.0, savings_percentage: 20 }
    },
    features: ['100k Credits / mo', 'Priority Support', 'API Access', 'Team Seats (3)'],
  },
  {
    id: '500k',
    name: '500k Credits Tier',
    category: 'PROFESSIONAL',
    pricing: {
      monthly: { credits: 500000, rate_per_credit: 0.000398, price: 199.0 },
      quarterly: { credits: 1500000, rate_per_credit: 0.0003582, price: 537.0, savings_amount: 60.0, savings_percentage: 10 },
      yearly: { credits: 6000000, rate_per_credit: 0.0003184, price: 1910.0, savings_amount: 478.0, savings_percentage: 20 }
    },
    features: ['500k Credits / mo', 'Priority Support', 'API Access', 'Team Seats (5)'],
  },
  {
    id: '1M',
    name: '1M Credits Tier',
    category: 'BUSINESS',
    pricing: {
      monthly: { credits: 1000000, rate_per_credit: 0.000299, price: 299.0 },
      quarterly: { credits: 3000000, rate_per_credit: 0.0002691, price: 807.0, savings_amount: 90.0, savings_percentage: 10 },
      yearly: { credits: 12000000, rate_per_credit: 0.0002392, price: 2870.0, savings_amount: 718.0, savings_percentage: 20 }
    },
    features: ['1M Credits / mo', 'Dedicated Success Manager', 'SSO', 'Unlimited Seats'],
  },
  {
    id: '5M',
    name: '5M Credits Tier',
    category: 'BUSINESS',
    pricing: {
      monthly: { credits: 5000000, rate_per_credit: 0.0001998, price: 999.0 },
      quarterly: { credits: 15000000, rate_per_credit: 0.0001798, price: 2697.0, savings_amount: 300.0, savings_percentage: 10 },
      yearly: { credits: 60000000, rate_per_credit: 0.0001598, price: 9590.0, savings_amount: 2398.0, savings_percentage: 20 }
    },
    features: ['5M Credits / mo', 'Dedicated Success Manager', 'SSO', 'Custom Contracts'],
  },
  {
    id: '10M',
    name: '10M Credits Tier',
    category: 'ENTERPRISE',
    pricing: {
      monthly: { credits: 10000000, rate_per_credit: 0.0001599, price: 1599.0 },
      quarterly: { credits: 30000000, rate_per_credit: 0.0001439, price: 4317.0, savings_amount: 480.0, savings_percentage: 10 },
      yearly: { credits: 120000000, rate_per_credit: 0.0001279, price: 15350.0, savings_amount: 3838.0, savings_percentage: 20 }
    },
    features: ['10M Credits / mo', 'White Labeling', 'On-Premise Option', '24/7 Phone Support'],
  }
];

// Based on SQL Addon Packages
const MOCK_ADDONS: AddonPackage[] = [
  { id: 'small', name: 'Small', credits: 5000, rate_per_credit: 0.002, price: 10.0, description: 'Quick boost for small projects' },
  { id: 'basic', name: 'Basic', credits: 25000, rate_per_credit: 0.0012, price: 30.0, description: 'Standard top-up pack' },
  { id: 'standard', name: 'Standard', credits: 100000, rate_per_credit: 0.00099, price: 99.0, description: 'Popular for growing teams' },
  { id: 'plus', name: 'Plus', credits: 500000, rate_per_credit: 0.000398, price: 199.0, description: 'Heavy usage supplement' },
  { id: 'pro', name: 'Pro', credits: 1000000, rate_per_credit: 0.000299, price: 299.0, description: 'Professional grade volume' },
  { id: 'advanced', name: 'Advanced', credits: 5000000, rate_per_credit: 0.0001998, price: 999.0, description: 'Business scale add-on' },
  { id: 'premium', name: 'Premium', credits: 10000000, rate_per_credit: 0.0001599, price: 1599.0, description: 'Enterprise scale add-on' },
];

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', date: '2023-10-01', amount: 99.00, status: 'paid' },
  { id: 'INV-2023-002', date: '2023-09-01', amount: 99.00, status: 'paid' },
];

const DEFAULT_BILLING_INFO: BillingInfo = {
  subscription_plan_id: '100k',
  subscription_period: 'monthly',
  subscription_status: 'active',
  credits_used: 12450,
  credits_limit: 100000,
  renewal_date: '2023-11-01'
};

export const useBilling = (options = { autoLoad: true }) => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [addonPackages, setAddonPackages] = useState<AddonPackage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  useEffect(() => {
    if (options.autoLoad) {
      loadAllData();
    }
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setBillingInfo(DEFAULT_BILLING_INFO);
    setSubscriptionPlans(MOCK_PLANS);
    setAddonPackages(MOCK_ADDONS);
    setInvoices(MOCK_INVOICES);
    setIsLoading(false);
  };

  const loadBillingInfo = async () => {
     await new Promise(resolve => setTimeout(resolve, 500));
     setBillingInfo({ ...DEFAULT_BILLING_INFO, credits_used: Math.floor(Math.random() * 50000) });
  };

  // Stub actions
  const addPlan = async (plan: SubscriptionPlan) => {};
  const deletePlan = async (id: string) => {};
  const updatePlan = async (updatedPlan: SubscriptionPlan) => {};
  const addAddon = async (addon: AddonPackage) => {};
  const deleteAddon = async (id: string) => {};

  return {
    billingInfo,
    subscriptionPlans,
    addonPackages,
    invoices,
    isLoading,
    isLoadingPlans,
    loadBillingInfo,
    addPlan,
    deletePlan,
    updatePlan,
    addAddon,
    deleteAddon
  };
};
