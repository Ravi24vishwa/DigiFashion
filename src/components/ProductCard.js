// ==================== ProductCard.js ====================
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export const ProductCard = memo(({ item, onPress, isfavorite, onFavoritePress }) => {
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      {/* Sale Badge */}
      {item.discount && (
        <View style={styles.saleBadge}>
          <Text style={styles.saleText}>{item.discount}</Text>
        </View>
      )}

      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => onFavoritePress && onFavoritePress(item)}
      >
        <Image
          source={
            // Check both the passed prop and the item property for robustness
            (isfavorite || item.isFavorite)
              ? require('../assets/icons/Heart.png') // Filled heart
              : require('../assets/icons/Heart1.png') // Empty heart
          }
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <Image source={item.image} style={styles.productImage} />

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
          <Text style={styles.oldPrice}>₹{item.oldPrice.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  saleBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#5B6BEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  saleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  favoriteIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  oldPrice: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
});