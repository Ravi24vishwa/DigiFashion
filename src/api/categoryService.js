import api from './index';
import { API_ENDPOINTS } from './endpoints';

export const categoryService = {
    /**
     * Fetch categories
     * @param {Object} params - { device_id, per_page, isParent }
     */
    getCategories: async (params = {}) => {
        try {
            const body = {
                device_id: params.device_id || 'UP1A.231005.007', // Default or from context
                per_page: params.per_page || 20,
                isParent: params.isParent || "0",
            };
            const response = await api.post(API_ENDPOINTS.CATEGORIES, body);
            return response;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};

export default categoryService;
