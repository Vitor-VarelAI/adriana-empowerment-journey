'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import defaultContent from '@/data/cms-defaults.json';

interface CMSContextType {
    getContent: (key: string, fallback?: string) => string;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

interface CMSProviderProps {
    children: ReactNode;
    initialData?: Record<string, string> | null;
}

export const CMSProvider = ({ children, initialData }: CMSProviderProps) => {
    // Merge server data with defaults. 
    // If server data (initialData) is null (e.g. API failed), we rely on defaults only.
    // We can also let initialData override defaults.
    const contentMap = { ...defaultContent, ...(initialData || {}) };

    const getContent = (key: string, fallback?: string): string => {
        return contentMap[key as keyof typeof contentMap] || fallback || key;
    };

    return (
        <CMSContext.Provider value={{ getContent }}>
            {children}
        </CMSContext.Provider>
    );
};

export const useCMS = () => {
    const context = useContext(CMSContext);
    if (context === undefined) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
};
