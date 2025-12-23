import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const EmptyCart = ({ onViewProduct }) => (
    <View style={styles.container}>
        <View style={styles.content}>
            <View style={styles.iconCircle}>
                <Image
                    source={require('../../assets/icons/EmptyCart.png')}
                    style={styles.cartIcon}
                // resizeMode="contain"
                />
            </View>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity style={styles.viewProductBtn} onPress={onViewProduct}>
                <Text style={styles.viewProductText}>View Product</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    iconCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        // backgroundColor: '#F4F7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    cartIcon: {
        width: '100%',
        height: '103%',
        // tintColor: '#ADBCFF',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 20,
    },
    viewProductBtn: {
        borderWidth: 2,
        borderColor: '#637BDD',
        borderRadius: 8,
        paddingHorizontal: 30,
        paddingVertical: 12,
        minWidth: 160,
        alignItems: 'center',
    },
    viewProductText: {
        color: '#637BDD',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EmptyCart;
