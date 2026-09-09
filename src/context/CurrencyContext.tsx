import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR' | 'USD';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  toggleCurrency: () => void;
  formatSalary: (minUsd: number, maxUsd: number, options?: { compact?: boolean; perYear?: boolean }) => string;
  formatSingleSalary: (valUsd: number, options?: { compact?: boolean }) => string;
  getSalaryBreakdown: (minUsd: number, maxUsd: number) => {
    inrLpa: string;
    inrFull: string;
    usdAnnual: string;
    inrDirectConverted: string;
  };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion constants
// Indian Market Benchmark factor: converts base US tech survey salary to realistic Indian tech CTC in Lakhs Per Annum
// (e.g. $80k -> ~14.4 LPA, $140k -> ~25.2 LPA)
const INR_LPA_FACTOR = 0.18;
// Current USD to INR exchange rate for direct conversion
const USD_TO_INR_FX = 86.5;

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('careerpath_currency');
    return (saved === 'USD' || saved === 'INR') ? saved : 'INR';
  });

  useEffect(() => {
    localStorage.setItem('careerpath_currency', currency);
  }, [currency]);

  const setCurrency = (c: CurrencyCode) => setCurrencyState(c);
  const toggleCurrency = () => setCurrencyState(prev => prev === 'INR' ? 'USD' : 'INR');

  const formatSalary = (
    minUsd: number,
    maxUsd: number,
    options: { compact?: boolean; perYear?: boolean } = { compact: true, perYear: false }
  ): string => {
    const suffix = options.perYear ? '/yr' : '';

    if (currency === 'INR') {
      const minLpa = Math.max(3.5, Math.round((minUsd / 1000) * INR_LPA_FACTOR * 10) / 10);
      const maxLpa = Math.max(minLpa + 2, Math.round((maxUsd / 1000) * INR_LPA_FACTOR * 10) / 10);

      if (options.compact === false) {
        const minRupees = Math.round(minLpa * 100000).toLocaleString('en-IN');
        const maxRupees = Math.round(maxLpa * 100000).toLocaleString('en-IN');
        return `₹${minRupees} - ₹${maxRupees}${suffix ? ` ${suffix}` : ''}`;
      }

      // Standard Indian format: ₹12 - 25 LPA
      return `₹${minLpa} - ${maxLpa} LPA${suffix ? ` ${suffix}` : ''}`;
    }

    // USD format
    const minK = Math.round(minUsd / 1000);
    const maxK = Math.round(maxUsd / 1000);
    return `$${minK}k - $${maxK}k${suffix ? ` ${suffix}` : ''}`;
  };

  const formatSingleSalary = (valUsd: number, options: { compact?: boolean } = { compact: true }): string => {
    if (currency === 'INR') {
      const lpa = Math.max(3.5, Math.round((valUsd / 1000) * INR_LPA_FACTOR * 10) / 10);
      if (options.compact === false) {
        return `₹${Math.round(lpa * 100000).toLocaleString('en-IN')}`;
      }
      return `₹${lpa} LPA`;
    }
    const k = Math.round(valUsd / 1000);
    return `$${k}k`;
  };

  const getSalaryBreakdown = (minUsd: number, maxUsd: number) => {
    const minLpa = Math.max(3.5, Math.round((minUsd / 1000) * INR_LPA_FACTOR * 10) / 10);
    const maxLpa = Math.max(minLpa + 2, Math.round((maxUsd / 1000) * INR_LPA_FACTOR * 10) / 10);

    const minDirectLakhs = Math.round((minUsd * USD_TO_INR_FX) / 100000);
    const maxDirectLakhs = Math.round((maxUsd * USD_TO_INR_FX) / 100000);

    return {
      inrLpa: `₹${minLpa} - ${maxLpa} LPA`,
      inrFull: `₹${Math.round(minLpa * 100000).toLocaleString('en-IN')} - ₹${Math.round(maxLpa * 100000).toLocaleString('en-IN')} / year`,
      usdAnnual: `$${Math.round(minUsd / 1000)}k - $${Math.round(maxUsd / 1000)}k USD`,
      inrDirectConverted: `₹${minDirectLakhs}L - ₹${maxDirectLakhs}L (~$${Math.round(minUsd / 1000)}k-$${Math.round(maxUsd / 1000)}k at 1 USD = ₹${USD_TO_INR_FX})`
    };
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatSalary,
        formatSingleSalary,
        getSalaryBreakdown
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}
