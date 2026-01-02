import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  addToCartAsync as rtAddToCart,
  removeFromCartAsync as rtRemoveFromCart,
  fetchCart as rtFetchCart,
  clearCart as rtClearCart,
} from '../store/slices/cartSlice';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { items: cartItems, isLoading, error } = useSelector((state) => state.cart, shallowEqual) || {};

  const addToCart = useCallback((productInfo) => {
    // productInfo should contain { productId, shopId, qty, deviceId }
    dispatch(rtAddToCart(productInfo));
  }, [dispatch]);

  const removeFromCart = useCallback((cartItemId) => {
    dispatch(rtRemoveFromCart(cartItemId));
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch(rtClearCart());
  }, [dispatch]);

  const refreshCart = useCallback(() => {
    dispatch(rtFetchCart());
  }, [dispatch]);

  const calculateTotal = useCallback(() => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart,
    calculateTotal,
  }), [cartItems, isLoading, error, addToCart, removeFromCart, clearCart, refreshCart, calculateTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
