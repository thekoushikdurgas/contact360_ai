import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  checkAccess: (allowed?: UserRole[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to SUPER_ADMIN to showcase all features initially
  const [role, setRole] = useState<UserRole>(UserRole.SUPER_ADMIN);

  const toggleRole = () => {
    const roles = Object.values(UserRole);
    const currentIndex = roles.indexOf(role);
    const nextIndex = (currentIndex + 1) % roles.length;
    setRole(roles[nextIndex]);
  };

  const checkAccess = (allowed?: UserRole[]) => {
    if (!allowed || allowed.length === 0) return true;
    return allowed.includes(role);
  };

  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;

  return React.createElement(
    RoleContext.Provider,
    { value: { role, setRole, toggleRole, checkAccess, isAdmin, isSuperAdmin } },
    children
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};