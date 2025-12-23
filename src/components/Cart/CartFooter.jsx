import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CartFooter = ({ total, label = 'Continue', onPress }) => (
    <View style={styles.footerContainer}>
        <View style={styles.footerLeft}>
            <Text style={styles.footerTotalLabel}>Total Price</Text>
            <Text style={styles.footerTotalPrice}>₹{(total + 100).toLocaleString()}</Text>
        </View>
        <TouchableOpacity
            style={styles.continueButton}
            onPress={onPress}
        >
            <Text style={styles.continueButtonText}>{label}</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingBottom: 24,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    footerLeft: {
        flex: 1,
    },
    footerTotalLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    footerTotalPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#000',
    },
    continueButton: {
        backgroundColor: '#637BDD',
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 10,
        minWidth: 160,
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default CartFooter;
