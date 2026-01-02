import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, STORAGE_KEYS } from '../constants';

const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

const apiRequest = async (endpoint, options = {}) => {
    const token = await getAuthToken();

    const headers = {
        'Accept': 'application/json',
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const url = `${BASE_URL}${endpoint}`;

        let logBody = config.body;
        if (config.body instanceof FormData) {
            logBody = {};
            config.body._parts.forEach(([key, value]) => {
                logBody[key] = value;
            });
        }

        console.log(`[API] Request: ${config.method || 'GET'} ${url}`, {
            headers: config.headers,
            body: logBody
        });

        const response = await fetch(url, config);
        const data = await response.json();

        console.log(`[API] Response: ${endpoint} [Status: ${response.status}]`, data);

        // 1. Handle HTTP errors (non-2xx)
        if (!response.ok) {
            console.error(`[API] HTTP Error:`, data);
            const error = new Error(data.message || 'Something went wrong');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        // 2. Handle Logical errors (Backend returns 200 OK but with error status in body)
        const logicalErrorCode = data?.Status || data?.status;
        if (logicalErrorCode === 400 || logicalErrorCode === 500 || data?.success === false || data?.error) {
            console.error(`[API] Logical Error Details:`, JSON.stringify(data, null, 2));
            const error = new Error(data.Message || data.message || 'Verification failed');
            error.status = logicalErrorCode;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`[API] Fetch Exception (${endpoint}):`, error.message);
        throw error;
    }
};

export const api = {
    get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => apiRequest(endpoint, {
        ...options,
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body)
    }),
    put: (endpoint, body, options = {}) => apiRequest(endpoint, {
        ...options,
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body)
    }),
    delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
