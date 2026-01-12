import api from './index';
import { API_ENDPOINTS } from './endpoints';

export const orderService = {
    /**
     * Get all user orders
     */
    getOrders: async () => {
        return await api.get(API_ENDPOINTS.ORDER_LIST);
    },

    /**
     * Get detailed information for a specific order
     * @param {number|string} orderId 
     */
    getOrderDetails: async (orderId) => {
        return await api.post(API_ENDPOINTS.ORDER_DETAILS, { order_id: orderId });
    },

    /**
     * Submit final order
     * @param {Object} orderData - { delivery_type, store_id }
     */
    submitOrder: async (orderData) => {
        return await api.post(API_ENDPOINTS.ORDER_SUBMIT, orderData);
    },

    /**
     * Submit review for a purchased product
     * @param {Object} reviewData - { product_id, rating, review }
     */
    addReview: async (reviewData) => {
        return await api.post(API_ENDPOINTS.ORDER_REVIEW_ADD, reviewData);
    },

    /**
     * Get reviews for a product
     * @param {Object} params - { slug, limit, rating }
     */
    getReviews: async (params) => {
        return await api.post(API_ENDPOINTS.ORDER_REVIEW_LIST, params);
    }
};
