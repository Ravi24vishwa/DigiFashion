import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    addToCartAsync,
    removeFromCartAsync,
    updateQuantityAsync,
    fetchCart,
    clearCart as clearCartAction,
} from '../store/slices/cartSlice';

/**
 * Custom hook for accessing and managing the Shopping Cart state via Redux.
 */
export const useCart = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.cart, shallowEqual);

    const addToCart = useCallback((productInfo) => {
        // productInfo: { productId, shopId, qty, deviceId }
        return dispatch(addToCartAsync(productInfo));
    }, [dispatch]);

    const removeFromCart = useCallback((cartItemId) => {
        return dispatch(removeFromCartAsync(cartItemId));
    }, [dispatch]);

    const refreshCart = useCallback(() => {
        return dispatch(fetchCart());
    }, [dispatch]);

    const clearCart = useCallback(() => {
        dispatch(clearCartAction());
    }, [dispatch]);

    const calculateTotal = useCallback(() => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => {
            const price = parseFloat(item.product_price || item.price) || 0;
            const quantity = parseInt(item.qty || item.quantity, 10) || 1;
            return total + (price * quantity);
        }, 0);
    }, [items]);

    const updateQuantity = useCallback((productId, qty) => {
        return dispatch(updateQuantityAsync({ productId, qty }));
    }, [dispatch]);

    return useMemo(() => ({
        cartItems: items,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        refreshCart,
        clearCart,
        calculateTotal,
        updateQuantity,
    }), [items, isLoading, error, addToCart, removeFromCart, refreshCart, clearCart, calculateTotal, updateQuantity]);
};

