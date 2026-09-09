import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  savedCareerIds: Set<string>;
  savedResourceIds: Set<string>;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; educationLevel?: string; institution?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loginAsStudent: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  toggleCareerBookmark: (careerId: string) => Promise<boolean>;
  toggleResourceBookmark: (resourceId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('careerpath_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [savedCareerIds, setSavedCareerIds] = useState<Set<string>>(new Set());
  const [savedResourceIds, setSavedResourceIds] = useState<Set<string>>(new Set());

  const loadSavedItems = async () => {
    try {
      const [careersRes, resourcesRes] = await Promise.all([
        api.getSavedCareers().catch(() => ({ savedCareers: [] })),
        api.getSavedResources().catch(() => ({ savedResources: [] }))
      ]);
      setSavedCareerIds(new Set(careersRes.savedCareers.map(c => c.id)));
      setSavedResourceIds(new Set(resourcesRes.savedResources.map(r => r.id)));
    } catch {
      // Ignore
    }
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('careerpath_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      setUser(res.user);
      setToken(storedToken);
      await loadSavedItems();
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      localStorage.removeItem('careerpath_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('careerpath_token', res.token);
    setToken(res.token);
    setUser(res.user);
    await loadSavedItems();
  };

  const register = async (data: { name: string; email: string; password: string; educationLevel?: string; institution?: string }) => {
    const res = await api.register(data);
    localStorage.setItem('careerpath_token', res.token);
    setToken(res.token);
    setUser(res.user);
    await loadSavedItems();
  };

  const logout = () => {
    localStorage.removeItem('careerpath_token');
    setToken(null);
    setUser(null);
    setSavedCareerIds(new Set());
    setSavedResourceIds(new Set());
  };

  const loginAsStudent = async () => {
    await login('student@careerpath.edu', 'Student@12345');
  };

  const loginAsAdmin = async () => {
    await login('admin@careerpath.edu', 'Admin@12345');
  };

  const toggleCareerBookmark = async (careerId: string): Promise<boolean> => {
    try {
      const res = await api.toggleSaveCareer(careerId);
      setSavedCareerIds(prev => {
        const next = new Set(prev);
        if (res.isSaved) {
          next.add(careerId);
        } else {
          next.delete(careerId);
        }
        return next;
      });
      return res.isSaved;
    } catch (err) {
      console.error('Bookmark toggle error:', err);
      return false;
    }
  };

  const toggleResourceBookmark = async (resourceId: string): Promise<boolean> => {
    try {
      const res = await api.toggleSaveResource(resourceId);
      setSavedResourceIds(prev => {
        const next = new Set(prev);
        if (res.isSaved) {
          next.add(resourceId);
        } else {
          next.delete(resourceId);
        }
        return next;
      });
      return res.isSaved;
    } catch (err) {
      console.error('Resource bookmark toggle error:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        savedCareerIds,
        savedResourceIds,
        login,
        register,
        logout,
        refreshUser,
        loginAsStudent,
        loginAsAdmin,
        toggleCareerBookmark,
        toggleResourceBookmark
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
