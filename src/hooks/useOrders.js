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
            const res = await orderService.getOrders();
            // Map API response to UI model if needed
            // The API returns orders in res.Data or res.data
            const orderList = res.Data || res.data || [];

            setOrders(orderList.map(order => ({
                id: (order.id || order.order_id || '').toString(),
                title: order.order_items?.[0]?.product_name || 'Order #' + order.id,
                price: parseFloat(order.grand_total || order.total || 0),
                soldTo: order.store_name || 'DigiFashion',
                status: order.status || 'Pending',
                date: order.created_at,
                qty: order.total_qty || 1,
                image: order.order_items?.[0]?.product_thumbnail_image_url ? { uri: order.order_items[0].product_thumbnail_image_url } : require('../assets/icons/Show.png'),
                items: order.order_items || []
            })));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchOrderDetails = async (orderId) => {
        setIsLoading(true);
        try {
            const res = await orderService.getOrderDetails(orderId);
            return res.Data || res.data;
        } catch (err) {
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
