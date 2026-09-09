import React, { createContext, useContext, useState } from 'react';
import { Career } from '../types';

interface CompareContextType {
  selectedCareers: Career[];
  addCareerToCompare: (career: Career) => boolean;
  removeCareerFromCompare: (careerId: string) => void;
  clearCompare: () => void;
  isCareerComparing: (careerId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([]);

  const addCareerToCompare = (career: Career): boolean => {
    if (selectedCareers.some(c => c.id === career.id)) return true;
    if (selectedCareers.length >= 3) {
      return false; // Max 3 careers
    }
    setSelectedCareers(prev => [...prev, career]);
    return true;
  };

  const removeCareerFromCompare = (careerId: string) => {
    setSelectedCareers(prev => prev.filter(c => c.id !== careerId));
  };

  const clearCompare = () => {
    setSelectedCareers([]);
  };

  const isCareerComparing = (careerId: string) => {
    return selectedCareers.some(c => c.id === careerId);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedCareers,
        addCareerToCompare,
        removeCareerFromCompare,
        clearCompare,
        isCareerComparing
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
