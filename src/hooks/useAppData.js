import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateCartItem,
  clearCart,
} from '../store/slices/cartSlice';
import {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  clearFavorites,
} from '../store/slices/favoritesSlice';
import { setTabBarVisible } from '../store/slices/uiSlice';

/**
 * Custom hook for cart operations
 * Optimized with memoization to prevent unnecessary re-renders
 */
export const useAppCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items, shallowEqual);

  const handleAddToCart = useCallback((product) => dispatch(addToCart(product)), [dispatch]);
  const handleRemoveFromCart = useCallback((productId) => dispatch(removeFromCart(productId)), [dispatch]);
  const handleUpdateQuantity = useCallback((productId, type) =>
    dispatch(updateQuantity({ productId, type })), [dispatch]);
  const handleUpdateCartItem = useCallback((productId, updates) =>
    dispatch(updateCartItem({ productId, updates })), [dispatch]);
  const handleClearCart = useCallback(() => dispatch(clearCart()), [dispatch]);

  const calculateTotal = useCallback(() =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return useMemo(() => ({
    cartItems,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    updateCartItem: handleUpdateCartItem,
    clearCart: handleClearCart,
    calculateTotal,
  }), [cartItems, handleAddToCart, handleRemoveFromCart, handleUpdateQuantity, handleUpdateCartItem, handleClearCart, calculateTotal]);
};

/**
 * Custom hook for favorites operations
 * Optimized with memoization
 */
export const useAppFavorites = () => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites.favoriteIds, shallowEqual);

  const extractId = useCallback((itemOrId) => (itemOrId?.id !== undefined ? itemOrId.id : itemOrId), []);
  const isPrimitiveId = useCallback((v) => (typeof v === 'string' || typeof v === 'number'), []);

  const safeDispatchId = useCallback((fn, itemOrId) => {
    const id = extractId(itemOrId);
    if (!isPrimitiveId(id)) {
      console.warn('useAppFavorites: ignored non-primitive id for favorites action', id);
      return;
    }
    return fn(id);
  }, [extractId, isPrimitiveId]);

  const handleToggleFavorite = useCallback((productOrId) => safeDispatchId((id) => dispatch(toggleFavorite(id)), productOrId), [dispatch, safeDispatchId]);
  const handleAddFavorite = useCallback((productOrId) => safeDispatchId((id) => dispatch(addFavorite(id)), productOrId), [dispatch, safeDispatchId]);
  const handleRemoveFavorite = useCallback((productOrId) => safeDispatchId((id) => dispatch(removeFavorite(id)), productOrId), [dispatch, safeDispatchId]);
  const handleClearFavorites = useCallback(() => dispatch(clearFavorites()), [dispatch]);

  const isFavorite = useCallback((productId) => !!(favoriteIds && favoriteIds.includes(productId)), [favoriteIds]);
  const getFavorites = useCallback(() => (favoriteIds ? favoriteIds : []), [favoriteIds]);

  return useMemo(() => ({
    favoriteIds,
    toggleFavorite: handleToggleFavorite,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    clearFavorites: handleClearFavorites,
    isFavorite,
    getFavorites,
  }), [favoriteIds, handleToggleFavorite, handleAddFavorite, handleRemoveFavorite, handleClearFavorites, isFavorite, getFavorites]);
};

/**
 * Custom hook for UI state
 * Optimized with memoization
 */
export const useAppUI = () => {
  const dispatch = useDispatch();
  const isTabBarVisible = useSelector((state) => state.ui.isTabBarVisible, shallowEqual);

  const handleSetTabBarVisible = useCallback((visible) => dispatch(setTabBarVisible(visible)), [dispatch]);

  return useMemo(() => ({
    isTabBarVisible,
    setTabBarVisible: handleSetTabBarVisible,
    setIsTabBarVisible: handleSetTabBarVisible, // Alias for compatibility
  }), [isTabBarVisible, handleSetTabBarVisible]);
};
