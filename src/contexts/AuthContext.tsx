
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// User roles
export type UserRole = 'admin' | 'judge' | null;

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Authentication context interface
interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    name: 'Judge 1',
    email: 'judge1@example.com',
    password: 'judge123',
    role: 'judge' as UserRole
  },
  {
    id: '3',
    name: 'Judge 2',
    email: 'judge2@example.com',
    password: 'judge123',
    role: 'judge' as UserRole
  },
  {
    id: '4',
    name: 'Judge 3',
    email: 'judge3@example.com',
    password: 'judge123',
    role: 'judge' as UserRole
  },
  {
    id: '5',
    name: 'Judge 4',
    email: 'judge4@example.com',
    password: 'judge123',
    role: 'judge' as UserRole
  },
  {
    id: '6',
    name: 'Judge 5',
    email: 'judge5@example.com',
    password: 'judge123',
    role: 'judge' as UserRole
  }
];

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hackathon_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would call an API here
    try {
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        toast.error('Invalid email or password');
        return false;
      }

      // Create user object without password
      const authenticatedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };

      // Store in local storage
      localStorage.setItem('hackathon_user', JSON.stringify(authenticatedUser));
      
      // Update state
      setUser(authenticatedUser);
      setRole(authenticatedUser.role);
      
      toast.success(`Welcome back, ${authenticatedUser.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('hackathon_user');
    setUser(null);
    setRole(null);
    toast.info('You have been logged out');
  };

  // Provide the auth context
  const value = {
    user,
    role,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
