import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    toggleFavoriteAsync,
    fetchFavorites,
    clearFavorites as clearFavoritesAction,
    removeFavoriteLocally as removeFavoriteLocallyAction,
} from '../store/slices/favoritesSlice';

export const useFavorites = () => {
    const dispatch = useDispatch();
    const favoriteIds = useSelector((state) => state.favorites.favoriteIds, shallowEqual);

    const isFavorite = useCallback((productId) => {
        // Since state ensures all IDs are Numbers, we just normalize the input
        const id = Number(productId);
        return Array.isArray(favoriteIds) && favoriteIds.includes(id);
    }, [favoriteIds]);

    const toggleFavorite = useCallback((productId) => {
        dispatch(toggleFavoriteAsync(productId));
    }, [dispatch]);

    const refreshFavorites = useCallback(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    const clearFavorites = useCallback(() => {
        dispatch(clearFavoritesAction());
    }, [dispatch]);

    const removeFavoriteLocally = useCallback((productId) => {
        dispatch(removeFavoriteLocallyAction(productId));
    }, [dispatch]);

    // Backward compatibility
    const addFavorite = toggleFavorite;
    const removeFavorite = toggleFavorite;

    return useMemo(() => ({
        favoriteIds,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
        refreshFavorites,
        removeFavoriteLocally,
    }), [favoriteIds, isFavorite, toggleFavorite, addFavorite, removeFavorite, clearFavorites, refreshFavorites, removeFavoriteLocally]);
};
