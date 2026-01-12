import api from './index';
import { API_ENDPOINTS } from './endpoints';

export const checkoutService = {
    /**
     * Get list of states for address form
     */
    getStates: async () => {
        return await api.get(API_ENDPOINTS.STATES);
    },

    /**
     * Get user's saved addresses
     */
    getAddresses: async () => {
        return await api.get(API_ENDPOINTS.ADDRESS_LIST);
    },

    /**
     * Add or Update delivery address
     * @param {Object} addressData - { id, address_type, address, apt, city, state, zipcode, default, title }
     */
    saveAddress: async (addressData) => {
        return await api.post(API_ENDPOINTS.ADDRESS_ADD, addressData);
    },

    /**
     * Apply an address to the current checkout/order
     * @param {number|string} addressId 
     * @param {boolean} isRemove - Set to true to remove applied address
     */
    applyAddress: async (addressId, isRemove = false) => {
        return await api.post(API_ENDPOINTS.ADDRESS_APPLY, {
            user_address_id: addressId,
            is_remove: isRemove
        });
    },

    /**
     * Initiate checkout process to calculate totals
     * @param {Object} checkoutData - { shop_id, delivery_type }
     */
    initiateCheckout: async (checkoutData) => {
        return await api.post(API_ENDPOINTS.CHECKOUT, checkoutData);
    },

    /**
     * Get available coupons
     */
    getCoupons: async () => {
        return await api.get(API_ENDPOINTS.COUPON_LIST);
    },

    /**
     * Apply a coupon code
     * @param {number|string} couponId 
     * @param {boolean} isRemove 
     */
    applyCoupon: async (couponId, isRemove = false) => {
        return await api.post(API_ENDPOINTS.COUPON_APPLY, {
            coupon_id: couponId,
            is_remove: isRemove
        });
    }
};
