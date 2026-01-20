import api from './index';
import { API_ENDPOINTS } from './endpoints';

export const productService = {
    /**
     * Fetch products (shop)
     * @param {Object} params - { per_page, page, store_id, device_id, category_ids, search, sort_by, price_range, brand }
     */
    getProducts: async (params = {}) => {
        try {
            const body = {
                per_page: params.per_page || 20,
                page: params.page || 1,
                store_id: params.store_id || 1,
                device_id: params.device_id || 'UP1A.231005.007',
                ...params
            };

            // If category_ids is provided, ensure it's an array
            if (params.category_ids && !Array.isArray(params.category_ids)) {
                body.category_ids = [params.category_ids];
            }

            const response = await api.post(API_ENDPOINTS.SHOP, body);
            return response;
        } catch (error) {
            // Suppress predictable "No Data" logs to keep console clean
            if (error.message !== 'Shop Data not found') {
                console.error('Error fetching products:', error);
            }
            throw error;
        }
    },

    getProductDetails: async (slug, shop_id = 1) => {
        try {
            const response = await api.post(API_ENDPOINTS.PRODUCT_DETAILS, { slug, shop_id });
            return response;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    },

    getFilters: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.FILTER_LISTING);
            return response;
        } catch (error) {
            console.error('Error fetching filters:', error);
            throw error;
        }
    }
};

export default productService;
