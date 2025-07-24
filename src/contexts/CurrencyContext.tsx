// src/context/CurrencyContext.tsx
import React, { createContext, useState, useContext } from 'react';

type Currency = 'USD' | 'MNT';

const CurrencyContext = createContext<{
  currency: Currency;
  toggleCurrency: () => void;
}>({
  currency: 'USD',
  toggleCurrency: () => {},
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'USD' ? 'MNT' : 'USD'));
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
