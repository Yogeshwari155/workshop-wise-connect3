
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'enterprise' | 'admin';
  company?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    // Mock login logic
    if (email === 'admin@workshopwise.com' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@workshopwise.com',
        role: 'admin'
      });
      return true;
    } else if (email && password) {
      setUser({
        id: '2',
        name: email.split('@')[0],
        email,
        role: role === 'enterprise' ? 'enterprise' : 'user',
        company: role === 'enterprise' ? 'Tech Solutions Inc.' : undefined
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any): Promise<boolean> => {
    // Mock registration logic
    setUser({
      id: Date.now().toString(),
      name: userData.name || userData.companyName,
      email: userData.email,
      role: userData.role || 'user',
      company: userData.companyName
    });
    return true;
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
