// src/context/CurrencyContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Currency = 'USD' | 'MNT';

interface CurrencyContextType {
    currency: Currency;
    toggleCurrency: () => void;
    formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>('USD');

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'USD' ? 'MNT' : 'USD');
    };

    const formatPrice = (price: number): string => {
        if (price === 0) return 'TBD';
        
        // Convert USD to MNT if needed (using a conversion rate)
        const convertedPrice = currency === 'MNT' ? price * 3450 : price;

        if (currency === 'MNT') {
            return `${convertedPrice.toLocaleString()}`;
        }

        return `${convertedPrice.toLocaleString()}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
