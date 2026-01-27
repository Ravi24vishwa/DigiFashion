import { useState, useCallback, useEffect } from 'react';
import { orderService } from '../api/orderService';

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('OrderScreen: Initiating fetchOrders API request');
            const res = await orderService.getOrders();
            console.log('OrderScreen: fetchOrders API request successful, response:', res);
            // Map API response to UI model if needed
            // The API returns orders in res.Data or res.data
            const orderList = res.Data.orders || [];
            { }
            setOrders(orderList.map(order => ({
                id: (order.id || order.order_id || '').toString(),
                title: order.order_items?.[0]?.product_name || 'Order #' + order.order_number,
                price: parseFloat(order.total_amount || order.total || 0),
                soldTo: order.store_name || 'DigiFashion',
                status: order.status || 'Pending',
                date: order.order_date,
                qty: order.total_qty || 1,
                image: order.order_items?.[0]?.product_thumbnail_image_url ? { uri: order.order_items[0].product_thumbnail_image_url } : require('../assets/icons/Show.png'),
                items: order.order_items || []
            })));
        } catch (err) {
            console.error('OrderScreen: fetchOrders API request failed:', err.message, err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchOrderDetails = async (orderId) => {
        setIsLoading(true);
        try {
            console.log('OrderScreen: Initiating fetchOrderDetails API request for orderId:', orderId);
            const res = await orderService.getOrderDetails(orderId);
            console.log('OrderScreen: fetchOrderDetails API request successful for orderId:', orderId, 'response:', res);
            return res.Data || res.data;
        } catch (err) {
            console.error('OrderScreen: fetchOrderDetails API request failed for orderId:', orderId, 'error:', err.message, err);
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        orders,
        isLoading,
        error,
        fetchOrders,
        fetchOrderDetails
    };
};
