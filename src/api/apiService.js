import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, STORAGE_KEYS } from '../constants';

const apiRequest = async (endpoint, options = {}) => {
    const startTime = Date.now();
    const url = `${BASE_URL}${endpoint}`;

    try {
        // console.log(`[API-STEP 1] Starting ${options.method || 'GET'} request for: ${endpoint}`);

        // Add default headers and auth token
        const headers = {
            'Accept': 'application/json',
            ...(options.headers || {}),
        };

        const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        // Handle Body
        let body = options.body;
        if (body && !(body instanceof FormData) && typeof body === 'object') {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(body);
        }

        const response = await fetch(url, {
            ...options,
            headers,
            body,
        });

        const duration = Date.now() - startTime;
        // console.log(`[API-STEP 2] Request completed in ${duration}ms. Status: ${response.status}`);

        const data = await response.json();

        // Handle Logical errors
        const logicalErrorCode = data?.Status || data?.status;
        if (!response.ok || logicalErrorCode === 400 || logicalErrorCode === 500 || data?.success === false || data?.error) {
            // console.error(`[API-STEP 3] Error detected:`, JSON.stringify(data, null, 2));
            const error = new Error(data.Message || data.message || 'Verification failed');
            error.status = response.status || logicalErrorCode;
            error.data = data;
            throw error;
        }

        // console.log(`[API-STEP 4] Request successful. Returning data.`);
        return data;
    } catch (error) {
        const duration = Date.now() - startTime;
        // console.error(`[API-STEP ERROR] API Error in ${endpoint} (${duration}ms):`, error.message);
        throw error;
    }
};

export const api = {
    get: (endpoint, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, body, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: 'POST',
            body: body
        }),

    put: (endpoint, body, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: 'PUT',
            body: body
        }),

    delete: (endpoint, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
