import { useState, useCallback, useEffect } from 'react';
import { checkoutService } from '../api/checkoutService';
import { orderService } from '../api/orderService';
import { Alert } from 'react-native';

export const useCheckout = () => {
    const [addresses, setAddresses] = useState([]);
    const [states, setStates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const fetchAddresses = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await checkoutService.getAddresses();
            setAddresses(res.Data || []);
            // Set default address if exists
            const defaultAddr = (res.Data || []).find(a => a.default === 1);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchStates = useCallback(async () => {
        try {
            const res = await checkoutService.getStates();
            setStates(res.Data || []);
        } catch (err) {
            console.error('Error fetching states:', err);
        }
    }, []);

    const saveAddress = async (addressData) => {
        setIsLoading(true);
        try {
            const res = await checkoutService.saveAddress(addressData);
            await fetchAddresses();
            return res;
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to save address');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const applyAddress = async (addressId) => {
        setIsLoading(true);
        try {
            await checkoutService.applyAddress(addressId);
            setSelectedAddressId(addressId);
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to apply address');
        } finally {
            setIsLoading(false);
        }
    };

    const submitOrder = async (orderData) => {
        setIsLoading(true);
        try {
            const res = await orderService.submitOrder(orderData);
            return res;
        } catch (err) {
            Alert.alert('Order Failed', err.message || 'Something went wrong');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        addresses,
        states,
        isLoading,
        error,
        selectedAddressId,
        fetchAddresses,
        fetchStates,
        saveAddress,
        applyAddress,
        submitOrder
    };
};
