
import React, { useState } from 'react';
import { Card3D, Button3D, Input3D, Modal3D } from '../components/UI';
import { User, Mail, Camera, Lock, CheckCircle, X, AlertCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  // Mock User Data based on spec
  const currentUser = {
    name: "Alex Johnson",
    email: "alex@leadgen.pro",
    avatar: "https://picsum.photos/200",
    role: "ADMIN"
  };

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleSave = () => {
     setIsLoading(true);
     // Simulate API call
     setTimeout(() => {
       setIsLoading(false);
       setShowSuccess(true);
       setTimeout(() => setShowSuccess(false), 3000);
     }, 1000);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (passwordError) setPasswordError(null);
  };

  const submitPasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    
    // Basic Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
       setPasswordError("Password must be at least 8 characters.");
       return;
    }

    setIsSavingPassword(true);

    // Simulate API Call
    setTimeout(() => {
      setIsSavingPassword(false);
      setIsPasswordModalOpen(false);
      setShowSuccess(true); // Reuse the main success message
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-enter">
       {/* Header */}
       <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white relative inline-block">
             Account Settings
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
          </h1>
       </div>

       {showSuccess && (
        <div className="mb-6 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-lg">
          <CheckCircle size={20} />
          <span className="font-semibold">Profile updated successfully!</span>
          <button onClick={() => setShowSuccess(false)} className="ml-auto hover:bg-emerald-200 dark:hover:bg-emerald-800/50 p-1 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

       <div className="perspective-container">
          <div className="card-3d bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-3d-light dark:shadow-3d">
             
             {/* Profile Picture Section */}
             <div className="p-8 flex flex-col items-center border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-white/5 relative">
                 <div className="relative group cursor-pointer mb-4">
                    <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-slate-700 shadow-xl ring-4 ring-slate-50 dark:ring-slate-800/50">
                       <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-800 hover:bg-indigo-700 hover:scale-110 transition-all duration-200">
                       <Camera size={16} />
                    </button>
                 </div>
                 <h2 className="text-xl font-bold text-slate-800 dark:text-white">{currentUser.name}</h2>
                 <p className="text-slate-500 dark:text-slate-400 font-medium">{currentUser.email}</p>
             </div>

             {/* Form Sections */}
             <div className="p-8 space-y-8">
                {/* Personal Information */}
                <div>
                   <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50">
                      Personal Information
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                         <Input3D 
                            label="Full Name" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="pl-9"
                         />
                         <User size={18} className="absolute left-3 top-[38px] text-slate-400" />
                      </div>
                      <div className="relative">
                         <Input3D 
                            label="Email Address" 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="pl-9"
                         />
                         <Mail size={18} className="absolute left-3 top-[38px] text-slate-400" />
                      </div>
                   </div>
                </div>

                {/* Security */}
                <div>
                   <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50">
                      Security
                   </h3>
                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
                            <Lock size={20} />
                         </div>
                         <div>
                            <div className="font-medium text-slate-700 dark:text-slate-200">Password</div>
                            <div className="text-xs text-slate-500">Last changed 3 months ago</div>
                         </div>
                      </div>
                      <button 
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-semibold hover:underline"
                      >
                         Change Password
                      </button>
                   </div>
                </div>
             </div>

             {/* Footer Actions */}
             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Button3D variant="secondary" onClick={() => window.history.back()}>
                   Cancel
                </Button3D>
                <Button3D variant="primary" onClick={handleSave} disabled={isLoading}>
                   {isLoading ? 'Saving...' : 'Save Changes'}
                </Button3D>
             </div>

          </div>
       </div>

       {/* Change Password Modal */}
       <Modal3D
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          title="Change Password"
       >
          <div className="space-y-4">
              <Input3D 
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
              <Input3D 
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
              <Input3D 
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />

              {passwordError && (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg text-sm border border-rose-100 dark:border-rose-900/30 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={16} />
                      {passwordError}
                  </div>
              )}

              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <Button3D variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>
                      Cancel
                  </Button3D>
                  <Button3D 
                      variant="primary" 
                      onClick={submitPasswordChange}
                      disabled={isSavingPassword}
                  >
                      {isSavingPassword ? 'Updating...' : 'Update Password'}
                  </Button3D>
              </div>
          </div>
       </Modal3D>
    </div>
  );
};
