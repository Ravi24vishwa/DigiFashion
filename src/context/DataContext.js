import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../api/productService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            // In a real app, we'd fetch categories from API
            // const res = await productService.getCategories();
            // setCategories(res.Data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <DataContext.Provider value={{ categories, isLoading, error, refreshData: fetchCategories }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
