import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const CartItem = ({ item, updateQuantity, onOpenSizeModal, onRemove }) => (
    <View style={styles.cartItemCard}>
        <View style={styles.itemMainInfo}>
            <View style={styles.itemLeft}>
                <Text style={styles.itemBrand} numberOfLines={1}>{item.title || item.name}</Text>
                <Text style={styles.itemSizeLabel}>Size: {item.size || 'XXL'}</Text>
                <Text style={styles.itemPriceText}>₹{item.price}</Text>

                <View style={styles.selectorsRow}>
                    <View style={styles.qtyContainer}>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')} style={styles.qtyBtn}>
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')} style={styles.qtyBtn}>
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.sizeDropdown}
                        onPress={() => onOpenSizeModal(item)}
                    >
                        <Text style={styles.sizeDropdownText}>{item.size || 'XXL'}</Text>
                        <Image source={require('./../../assets/icons/DownArrow.png')} style={styles.dropdownArrow} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.deliveryEstimate}>Delivery by Thu Jun 23</Text>
            </View>

            <View style={styles.itemRight}>
                <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.productImg} />
            </View>
        </View>

        <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionBtn}>
                <Image source={require('./../../assets/icons/Save.png')} style={styles.actionBtnIcon} />
                <Text style={styles.actionBtnText}>Save for later</Text>
            </TouchableOpacity>
            <View style={styles.actionSeparator} />
            <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.actionBtn}>
                <Image source={require('./../../assets/icons/Delete.png')} style={styles.actionBtnIcon} />
                <Text style={styles.actionBtnText}>Remove</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    cartItemCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    itemMainInfo: {
        flexDirection: 'row',
        padding: 12,
    },
    itemLeft: {
        flex: 1,
        paddingRight: 12,
    },
    itemBrand: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    itemSizeLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 6,
    },
    itemPriceText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 10,
    },
    selectorsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        paddingHorizontal: 4,
        marginRight: 10,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    qtyValue: {
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 8,
    },
    sizeDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    sizeDropdownText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginRight: 6,
    },
    dropdownArrow: {
        width: 10,
        height: 6,
        tintColor: '#666',
    },
    deliveryEstimate: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    itemRight: {
        width: 90,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
    },
    productImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    actionBtnIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
        tintColor: '#666',
    },
    actionBtnText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    actionSeparator: {
        width: 1,
        backgroundColor: '#f0f0f0',
    },
});

export default CartItem;
