import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useFavorites } from '../../../hooks';


// Product Info Component
export const ProductInfo = ({
  item,
  onPress,
  onShare,
}) => {
  const { isFavorite } = useFavorites();
  const isItemFavorited = isFavorite(item.id);

  return (
    <View style={styles.productInfo}>
      <View >
        <Text style={styles.productName}>{item.title}</Text>
        {item.brand ? (
          <Text style={styles.brandName}>{item.brand}</Text>
        ) : null}
        <View style={styles.priceRow}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
          </View>
          <Text style={styles.deliveryPrice}>₹79 Delivery </Text>
          {!!item.rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[...Array(5)].map((_, index) => (
                <Image
                  key={index}
                  source={index < Math.floor(item.rating)
                    ? require('../../../assets/icons/Star.png')
                    : require('../../../assets/icons/Star1.png')
                  }
                  style={{
                    width: 18,
                    height: 18,
                    marginHorizontal: 1,
                  }}
                />
              ))}
              {item.reviews && (
                <Text style={{
                  fontSize: 12,
                  color: '#666',
                  marginLeft: 4
                }}>
                  ({item.reviews.length})
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
      {/* rightside productInfo */}
      <View style={{ flexDirection: 'row', gap: responsiveWidth(4) }}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onPress && onPress(item, false)}
          onLongPress={() => onPress && onPress(item, true)}
        >
          <Image
            source={
              isItemFavorited
                ? require('../../../assets/icons/Heart.png')
                : require('../../../assets/icons/Heart1.png')
            }
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare && onShare(item)}
        >
          <Image
            source={require('../../../assets/icons/share.png')}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  productInfo: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  productName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 10,
    lineHeight: 32,
  },
  priceRow: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2937',
  },
  oldPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  deliveryPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  actionButton: {
    alignItems: 'center',
    // backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 12,
    minWidth: 50,
    // backgroundColor: 'red'
  },
  actionIcon: {
    width: 25,
    height: 24,
    marginBottom: 4,
    // tintColor: '#4B5563',
  },
  brandName: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
});

export default ProductInfo;