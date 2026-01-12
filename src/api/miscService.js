import api from './index';
import { API_ENDPOINTS } from './endpoints';

export const miscService = {
    getFaqs: async () => {
        try {
            const res = await api.get('faqs');
            return res;
        } catch (error) {
            throw error;
        }
    },

    getPages: async () => {
        try {
            const res = await api.get('pages');
            return res;
        } catch (error) {
            throw error;
        }
    },

    contactUs: async (data) => {
        try {
            // data contains: name, email, phone, subject, message
            const res = await api.post('contact-us', data);
            return res;
        } catch (error) {
            throw error;
        }
    }
};
