/**
 * Server Health Check Utility
 * Use this to test if your backend is awake before making actual API calls
 */

import { BASE_URL } from '../constants';

/**
 * Checks if the server is responsive
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<{isAlive: boolean, responseTime: number}>}
 */
export const checkServerHealth = async (timeout = 5000) => {
    const startTime = Date.now();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(BASE_URL, {
            method: 'HEAD',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        return {
            isAlive: response.status < 500,
            responseTime,
            status: response.status,
        };
    } catch (error) {
        const responseTime = Date.now() - startTime;

        return {
            isAlive: false,
            responseTime,
            error: error.message,
        };
    }
};

/**
 * Pings the server to wake it up (async, don't wait for response)
 */
export const wakeUpServer = () => {
    console.log('[SERVER] Sending wake-up ping...');

    fetch(BASE_URL, { method: 'HEAD' })
        .then(() => console.log('[SERVER] Wake-up ping sent successfully'))
        .catch(() => console.log('[SERVER] Wake-up ping sent (error expected)'));
};

/**
 * Test function - logs server health to console
 */
export const testServerConnection = async () => {
    console.log('[SERVER TEST] Checking server health...');
    const result = await checkServerHealth();

    if (result.isAlive) {
        console.log(`[SERVER TEST] ✅ Server is ALIVE - Response time: ${result.responseTime}ms`);
    } else {
        console.log(`[SERVER TEST] ❌ Server is DOWN or SLOW - Timeout: ${result.responseTime}ms`);
    }

    return result;
};
