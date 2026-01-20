import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    /**
     * Store data in AsyncStorage
     * @param {string} key 
     * @param {any} value 
     */
    setItem: async (key, value) => {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await AsyncStorage.setItem(key, stringValue);
            return true;
        } catch (error) {
            console.error(`Error saving to storage [${key}]:`, error);
            return false;
        }
    },

    /**
     * Retrieve data from AsyncStorage
     * @param {string} key 
     */
    getItem: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (!value) return null;

            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (error) {
            console.error(`Error reading from storage [${key}]:`, error);
            return null;
        }
    },

    /**
     * Remove data from AsyncStorage
     * @param {string} key 
     */
    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from storage [${key}]:`, error);
            return false;
        }
    },

    /**
     * Clear all app data
     */
    clear: async () => {
        try {
            await AsyncStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
};

export default storage;
