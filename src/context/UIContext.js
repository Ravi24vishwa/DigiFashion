import React, { createContext, useContext } from 'react';
import { useAppUI } from '../hooks/useUI';

const UIContext = createContext();

export const TabBarVisibilityProvider = ({ children }) => {
    const ui = useAppUI();
    return (
        <UIContext.Provider value={ui}>
            {children}
        </UIContext.Provider>
    );
};

export const useUIContext = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUIContext must be used within a TabBarVisibilityProvider');
    }
    return context;
};
