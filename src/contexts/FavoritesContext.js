import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
    toggleFavoriteAsync as rtToggleFavorite,
    fetchFavorites as rtFetchFavorites,
    clearFavorites as rtClearFavorites,
    setFavorites as rtSetFavorites,
} from '../store/slices/favoritesSlice';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { favoriteIds, isLoading, error } = useSelector((state) => state.favorites, shallowEqual) || {};

    const isPrimitiveId = (v) => (typeof v === 'string' || typeof v === 'number');

    const toggleFavorite = useCallback((itemOrId) => {
        const id = itemOrId?.id !== undefined ? itemOrId.id : itemOrId;
        if (!isPrimitiveId(id)) {
            console.warn('FavoritesContext: toggleFavorite received non-primitive id, ignoring', id);
            return;
        }
        dispatch(rtToggleFavorite(id));
    }, [dispatch]);

    const addFavorite = useCallback((itemOrId) => {
        const id = itemOrId?.id !== undefined ? itemOrId.id : itemOrId;
        if (!isPrimitiveId(id)) return;
        if (!favoriteIds.includes(id)) {
            dispatch(rtToggleFavorite(id));
        }
    }, [dispatch, favoriteIds]);

    const removeFavorite = useCallback((itemOrId) => {
        const id = itemOrId?.id !== undefined ? itemOrId.id : itemOrId;
        if (!isPrimitiveId(id)) return;
        if (favoriteIds.includes(id)) {
            dispatch(rtToggleFavorite(id));
        }
    }, [dispatch, favoriteIds]);

    const clearFavorites = useCallback(() => {
        dispatch(rtClearFavorites());
    }, [dispatch]);

    const isFavorite = useCallback((productId) => {
        return !!(favoriteIds && favoriteIds.includes(productId));
    }, [favoriteIds]);

    const getFavorites = useCallback(() => {
        return favoriteIds ? favoriteIds : [];
    }, [favoriteIds]);

    const refreshFavorites = useCallback(() => {
        dispatch(rtFetchFavorites());
    }, [dispatch]);

    const value = useMemo(() => ({
        favoriteIds,
        isLoading,
        error,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
        getFavorites,
        refreshFavorites,
    }), [favoriteIds, isLoading, error, toggleFavorite, addFavorite, removeFavorite, clearFavorites, isFavorite, getFavorites, refreshFavorites]);

    return (
        <FavoritesContext.Provider value={value}>
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
