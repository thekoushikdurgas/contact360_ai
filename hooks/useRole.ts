import { useState } from 'react';

export const useRole = () => {
  // In a real app, this would come from an auth context or JWT
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleRole = () => setIsAdmin(prev => !prev);

  return {
    isSuperAdmin: () => isAdmin,
    toggleRole, // For demo purposes
    isAdmin
  };
};