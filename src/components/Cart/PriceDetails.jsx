import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PriceDetails = ({ cartItemsCount, totalProductPrice, shippingFee = 100 }) => (
    <View style={styles.priceCard}>
        <Text style={styles.priceCardTitle}>Price Details ({cartItemsCount} item{cartItemsCount !== 1 ? 's' : ''})</Text>
        <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>Total Product Price</Text>
            <Text style={styles.priceDetailValue}>₹{totalProductPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>Shipping</Text>
            <Text style={styles.priceDetailValue}>₹{shippingFee}</Text>
        </View>
        <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>GST 28%</Text>
            <Text style={styles.priceDetailValue}>₹0.00</Text>
        </View>
        <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>Coupon Discount</Text>
            <Text style={styles.priceDetailValue}>₹0.00</Text>
        </View>
        <View style={styles.priceLine} />
        <View style={[styles.priceDetailRow, { marginTop: 10 }]}>
            <Text style={styles.orderTotalLabel}>Order Total</Text>
            <Text style={styles.orderTotalValue}>₹{(totalProductPrice + shippingFee).toLocaleString()}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    priceCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginTop: 8,
    },
    priceCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    priceDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priceDetailLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceDetailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    priceLine: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 4,
    },
    orderTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    orderTotalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
});

export default PriceDetails;
