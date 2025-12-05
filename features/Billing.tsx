
import React, { useState, useEffect } from 'react';
import { Card3D, Button3D, Badge3D, TiltRow, Modal3D, Input3D, TabGroup } from '../components/UI';
import { 
  CheckCircle, CreditCard, Download, Clock, FileText, 
  ShieldCheck, Zap, Package, Plus, Edit, Trash2, 
  RefreshCw, LayoutGrid, List, AlertTriangle, Star, Check,
  Lock, ArrowRight
} from 'lucide-react';
import { useBilling } from '../hooks/useBilling';
import { useRole } from '../hooks/useRole';
import { SubscriptionPlan, AddonPackage, BillingInfo, Invoice, BillingPeriod, PlanCategory } from '../types';
import { jsPDF } from "jspdf";

// --- Sub-Components ---

const CurrentSubscription: React.FC<{ billingInfo: BillingInfo | null, planName?: string, onUpdate: () => void }> = ({ billingInfo, planName, onUpdate }) => {
  if (!billingInfo) return null;

  const usagePercentage = Math.min((billingInfo.credits_used / billingInfo.credits_limit) * 100, 100);

  return (
    <div className="perspective-container h-full">
      <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 md:p-8 shadow-3d-light dark:shadow-3d h-full flex flex-col relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
               <Zap size={12} className="text-amber-500" /> Current Subscription
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{planName || 'Unknown Plan'}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize">{billingInfo.subscription_period} billing • Renews {new Date(billingInfo.renewal_date).toLocaleDateString()}</p>
          </div>
          <Badge3D variant="emerald" className="px-3 py-1 text-sm shadow-emerald-500/20">Active</Badge3D>
        </div>

        <div className="mb-8 relative z-10">
          <div className="flex justify-between text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            <span>Credit Usage</span>
            <span className="text-xs text-slate-500 font-normal self-end">{billingInfo.credits_limit - billingInfo.credits_used} remaining</span>
          </div>
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2 shadow-inner border border-slate-200 dark:border-slate-600">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out relative" 
              style={{ width: `${usagePercentage}%` }} 
            >
               <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{billingInfo.credits_used.toLocaleString()}</span> used of <span className="font-semibold text-slate-700 dark:text-slate-200">{billingInfo.credits_limit.toLocaleString()}</span> monthly limit.
          </p>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-4 relative z-10">
          <Button3D variant="primary" className="flex-1" iconName="refresh-cw" onClick={onUpdate}>Refresh Info</Button3D>
          <Button3D variant="outline" className="flex-1 text-rose-500 hover:text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20">Cancel Plan</Button3D>
        </div>
      </div>
    </div>
  );
};

const PlanCard: React.FC<{ 
  plan: SubscriptionPlan; 
  period: BillingPeriod;
  isCurrent: boolean;
  onSubscribe: (plan: SubscriptionPlan) => void;
}> = ({ plan, period, isCurrent, onSubscribe }) => {
  const details = plan.pricing[period];

  return (
    <div className={`perspective-container group flex h-full ${plan.isPopular ? '-mt-4 mb-4 z-10' : ''}`}>
      <div className={`
        card-3d w-full bg-white dark:bg-slate-800/60 backdrop-blur-xl border rounded-2xl p-6 shadow-3d-light dark:shadow-3d flex flex-col relative overflow-hidden transition-all duration-300
        ${isCurrent ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700/60 hover:-translate-y-2'}
        ${plan.isPopular && !isCurrent ? 'border-indigo-500 ring-1 ring-indigo-500/30' : ''}
      `}>
        {plan.isPopular && (
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg z-20">
            MOST POPULAR
          </div>
        )}
        
        <div className="mb-4 text-center border-b border-slate-100 dark:border-slate-700/50 pb-4">
          <Badge3D variant={
             plan.category === 'STARTER' ? 'slate' : 
             plan.category === 'PROFESSIONAL' ? 'indigo' : 
             plan.category === 'BUSINESS' ? 'purple' : 'neutral'
          } className="mb-2 text-[10px] tracking-wider">{plan.category}</Badge3D>
          
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{plan.name}</h3>
          
          <div className="flex items-center justify-center gap-1 mt-4">
            <span className="text-4xl font-bold text-slate-800 dark:text-white">${details.price.toLocaleString()}</span>
            <div className="flex flex-col items-start text-xs text-slate-500 dark:text-slate-400">
               <span>/ {period === 'monthly' ? 'mo' : period === 'quarterly' ? 'qtr' : 'year'}</span>
            </div>
          </div>
          
          {/* Savings Badge */}
          {details.savings_percentage && details.savings_percentage > 0 && (
            <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
              Save {details.savings_percentage}% (${details.savings_amount})
            </div>
          )}

          <div className="mt-4 font-bold text-slate-700 dark:text-slate-200">
             {details.credits.toLocaleString()} <span className="font-normal text-slate-500">Credits</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
             ${(details.rate_per_credit * 1000).toFixed(2)} per 1k credits
          </div>
        </div>

        <div className="space-y-3 mb-8 flex-1">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button3D 
          variant={isCurrent ? 'success' : 'primary'} 
          className="w-full"
          onClick={() => onSubscribe(plan)}
          disabled={isCurrent}
        >
          {isCurrent ? 'Current Plan' : 'Subscribe'}
        </Button3D>
      </div>
    </div>
  );
};

const SubscriptionPlans: React.FC<{ 
  plans: SubscriptionPlan[], 
  currentPlanId?: string, 
  onSubscribe: (plan: SubscriptionPlan) => void 
}> = ({ plans, currentPlanId, onSubscribe }) => {
  const [cycle, setCycle] = useState<BillingPeriod>('monthly');

  // Group plans by category to render them in sections if needed, or just a grid
  // Since we have 7 plans, a grid that wraps is best.
  
  return (
    <div className="space-y-6">
      {/* Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex shadow-inner-3d-light dark:shadow-inner-3d">
           {(['monthly', 'quarterly', 'yearly'] as BillingPeriod[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`
                   px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative
                   ${cycle === c 
                      ? 'text-indigo-600 dark:text-white shadow-sm bg-white dark:bg-slate-700' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                `}
              >
                 {c.charAt(0).toUpperCase() + c.slice(1)}
                 {c !== 'monthly' && (
                    <span className="absolute -top-3 -right-2 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-sm font-bold animate-bounce">
                       -{c === 'quarterly' ? '10' : '20'}%
                    </span>
                 )}
              </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {plans.map((plan) => (
           <PlanCard 
              key={plan.id} 
              plan={plan} 
              period={cycle} 
              isCurrent={plan.id === currentPlanId} 
              onSubscribe={onSubscribe} 
           />
        ))}
      </div>
    </div>
  );
};

const AddonPackages: React.FC<{ packages: AddonPackage[], onPurchase: (pkg: AddonPackage) => void }> = ({ packages, onPurchase }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {packages.map((pkg) => (
        <div key={pkg.id} className="perspective-container group">
          <div className="card-3d bg-white dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 shadow-3d-light dark:shadow-3d hover:shadow-3d-hover-light dark:hover:shadow-3d-hover hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-2">
               <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
                  <Package size={20} />
               </div>
               <Badge3D variant="neutral" className="text-[10px]">{pkg.credits.toLocaleString()} Credits</Badge3D>
            </div>
            
            <h4 className="font-bold text-slate-800 dark:text-slate-200">{pkg.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[2.5em]">{pkg.description}</p>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
               <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-800 dark:text-white">${pkg.price}</span>
                  <span className="text-[10px] text-slate-400">${(pkg.rate_per_credit * 1000).toFixed(2)} / 1k</span>
               </div>
               <Button3D variant="secondary" className="h-8 text-xs px-3" onClick={() => onPurchase(pkg)}>Buy</Button3D>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main Page Component ---

export const Billing: React.FC = () => {
  const { 
    billingInfo, subscriptionPlans, addonPackages, invoices, isLoading, 
    loadBillingInfo, addPlan, deletePlan, updatePlan, addAddon, deleteAddon 
  } = useBilling();
  
  const { isAdmin, toggleRole } = useRole();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Handle Tab Switch safety
  useEffect(() => {
     if (!isAdmin && activeTab === 'admin') {
        setActiveTab('user');
     }
  }, [isAdmin, activeTab]);

  const currentPlan = subscriptionPlans.find(p => p.id === billingInfo?.subscription_plan_id);

  const handleDownloadInvoice = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Brand Colors
    const primaryColor = "#6366f1";
    const darkColor = "#1e293b";
    const lightGray = "#f1f5f9";
    
    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 25, { align: "center" });
    
    // Company Info
    doc.setTextColor(darkColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("HyperDash Inc.", 20, 60);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123 Dashboard Way", 20, 66);
    doc.text("Tech City, TC 90210", 20, 71);
    doc.text("billing@hyperdash.com", 20, 76);
    
    // Invoice Info
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice #: ${invoice.id}`, 140, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${invoice.date}`, 140, 66);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 140, 71);
    
    // Line Item Header
    doc.setFillColor(lightGray);
    doc.rect(20, 90, 170, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 96);
    doc.text("Amount", 185, 96, { align: "right" });
    
    // Items
    doc.setFont("helvetica", "normal");
    doc.text(`Subscription Charge`, 25, 110);
    doc.text(`$${invoice.amount.toFixed(2)}`, 185, 110, { align: "right" });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 115, 190, 115);
    
    // Total
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total`, 140, 130);
    doc.text(`$${invoice.amount.toFixed(2)}`, 185, 130, { align: "right" });
    
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    
    doc.save(`invoice_${invoice.id}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-slate-400 gap-4">
         <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
         <p>Loading Billing Information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-enter pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
            Billing & Subscription
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-500 rounded-full opacity-30" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your plan, addons, and invoices.</p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
           <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">View Mode:</span>
              <button 
                 onClick={toggleRole} 
                 className={`
                    relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                    ${isAdmin 
                       ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-500/30' 
                       : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
                 `}
              >
                 {isAdmin ? 'SUPER ADMIN' : 'USER'}
              </button>
           </div>
           
           {isAdmin && (
              <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex">
                 <button 
                   onClick={() => setActiveTab('user')}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'user' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                 >
                    My Billing
                 </button>
                 <button 
                   onClick={() => setActiveTab('admin')}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                 >
                    Admin Management
                 </button>
              </div>
           )}
        </div>
      </div>

      {activeTab === 'user' ? (
         <div className="space-y-12 animate-enter">
            {/* 1. Top Section: Current Plan & Payment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
               <div className="lg:col-span-2 h-full">
                  <CurrentSubscription 
                     billingInfo={billingInfo} 
                     planName={currentPlan?.name} 
                     onUpdate={loadBillingInfo} 
                  />
               </div>
               
               {/* Payment Method Mini-Section */}
               <div className="perspective-container h-full">
                  <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 md:p-8 shadow-3d-light dark:shadow-3d h-full flex flex-col">
                     <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <CreditCard size={12} /> Payment Method
                     </div>
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-inner-3d-light dark:shadow-inner-3d">
                           <CreditCard size={24} />
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">•••• 4242</div>
                           <div className="text-sm text-slate-500 dark:text-slate-400">Expires 12/25</div>
                        </div>
                     </div>
                     <div className="mt-auto">
                        <Button3D 
                          variant="ghost" 
                          className="w-full text-sm"
                          onClick={() => setIsPaymentModalOpen(true)}
                        >
                          Update Card
                        </Button3D>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Subscription Plans */}
            <div>
               <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} /> Upgrade Plan
               </h3>
               <SubscriptionPlans 
                  plans={subscriptionPlans} 
                  currentPlanId={billingInfo?.subscription_plan_id}
                  onSubscribe={(plan) => console.log('Subscribe to', plan.name)}
               />
            </div>

            {/* 3. Addon Packages */}
            <div>
               <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <Package className="text-indigo-500" size={20} /> One-time Credit Packs
               </h3>
               <AddonPackages packages={addonPackages} onPurchase={(pkg) => console.log("Bought", pkg.name)} />
            </div>

            {/* 4. Invoice History */}
            <div className="perspective-container">
               <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 md:p-8 shadow-3d-light dark:shadow-3d">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500">
                        <FileText size={20} />
                     </div>
                     <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">Invoice History</h3>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/50">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700/50">
                           <tr>
                              <th className="p-4">Invoice ID</th>
                              <th className="p-4">Date</th>
                              <th className="p-4">Amount</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 text-right">Download</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {invoices.map((invoice) => (
                              <TiltRow key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                 <td className="p-4 font-mono text-slate-500 dark:text-slate-400">{invoice.id}</td>
                                 <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">{invoice.date}</td>
                                 <td className="p-4 text-slate-600 dark:text-slate-300">${invoice.amount.toFixed(2)}</td>
                                 <td className="p-4">
                                    <Badge3D variant="emerald" className="pl-1 pr-2 py-0.5 inline-flex items-center gap-1.5 uppercase">
                                       <CheckCircle size={12} strokeWidth={3} /> PAID
                                    </Badge3D>
                                 </td>
                                 <td className="p-4 text-right">
                                    <button 
                                      className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all inline-block"
                                      onClick={() => handleDownloadInvoice(invoice)}
                                    >
                                       <Download size={18} />
                                    </button>
                                 </td>
                              </TiltRow>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      ) : (
         <div className="animate-enter text-center p-12 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
             <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
             <h2 className="text-xl font-bold text-slate-800 dark:text-white">Admin Management Unavailable</h2>
             <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
               The admin interface is temporarily disabled while we migrate to the new pricing matrix structure.
             </p>
         </div>
      )}

      {/* Payment Method Modal */}
      <Modal3D
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Update Payment Method"
      >
        <div className="space-y-4">
          <Input3D
            label="Cardholder Name"
            placeholder="John Doe"
            value={paymentForm.name}
            onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
          />
          <div className="relative">
             <Input3D
               label="Card Number"
               placeholder="0000 0000 0000 0000"
               value={paymentForm.cardNumber}
               onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
               className="pl-10"
             />
             <CreditCard size={16} className="absolute left-3.5 top-[38px] text-slate-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input3D
              label="Expiry Date"
              placeholder="MM/YY"
              value={paymentForm.expiry}
              onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})}
            />
            <div className="relative">
              <Input3D
                label="CVV"
                placeholder="123"
                value={paymentForm.cvv}
                onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                className="pl-10"
              />
              <Lock size={16} className="absolute left-3.5 top-[38px] text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
             <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
             <span className="text-xs text-slate-400 whitespace-nowrap">Secured by Stripe</span>
             <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6">
            <Button3D variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button3D>
            <Button3D variant="primary" onClick={() => setIsPaymentModalOpen(false)}>Save Card</Button3D>
          </div>
        </div>
      </Modal3D>

    </div>
  );
};
