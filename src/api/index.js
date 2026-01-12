import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, STORAGE_KEYS } from '../constants';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        const data = response.data;
        // Handle logical errors if the API returns 200 but with an error status in body
        const logicalErrorCode = data?.Status || data?.status;
        if (logicalErrorCode === 400 || logicalErrorCode === 500 || data?.success === false || data?.error) {
            const error = new Error(data.Message || data.message || 'API request failed');
            error.status = logicalErrorCode;
            error.data = data;
            return Promise.reject(error);
        }
        return data;
    },
    (error) => {
        // Handle global errors (401, etc.)
        if (error.response) {
            const { status, data } = error.response;
            const message = data?.Message || data?.message || 'Something went wrong';
            const enhancedError = new Error(message);
            enhancedError.status = status;
            enhancedError.data = data;
            return Promise.reject(enhancedError);
        }
        return Promise.reject(error);
    }
);

export default api;
