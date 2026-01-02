import React, { createContext, useContext, useMemo } from 'react';
import { useAppCart, useAppFavorites, useAppUI } from '../hooks/useAppData';

/**
 * Global DataContext that combines all Redux state and actions
 * This provides a centralized point to access all app data
 */
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const cart = useAppCart();
  const favorites = useAppFavorites();
  const ui = useAppUI();

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    // Cart
    cart,
    // Favorites
    favorites,
    // UI
    ui,
    // Convenience selectors
    cartItems: cart.cartItems,
    cartTotal: cart.calculateTotal(),
    favoriteIds: favorites.favoriteIds,
    isFavorite: favorites.isFavorite,
    isTabBarVisible: ui.isTabBarVisible,
  }), [cart, favorites, ui]); // Dependencies are now stable objects thanks to optimized hooks

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Hook to use the global DataContext
 */
export const useAppData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useAppData must be used within DataProvider');
  }
  return context;
};
