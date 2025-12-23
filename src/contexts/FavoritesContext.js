import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(new Set());

    const toggleFavorite = (itemOrId) => {
        const productId = itemOrId?.id !== undefined ? itemOrId.id : itemOrId;

        setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    const isFavorite = (productId) => {
        return favorites.has(productId);
    };

    const getFavorites = () => {
        return Array.from(favorites);
    };

    const clearFavorites = () => {
        setFavorites(new Set());
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                toggleFavorite,
                isFavorite,
                getFavorites,
                clearFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
