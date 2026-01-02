import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useFavorites } from '../../contexts/FavoritesContext';


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
        <View style={styles.priceRow}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
          </View>
          <Text style={styles.deliveryPrice}>₹79 Delivery </Text>
          {item.rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[...Array(5)].map((_, index) => (
                <Image
                  key={index}
                  source={index < Math.floor(item.rating)
                    ? require('../../assets/icons/Star.png')
                    : require('../../assets/icons/Star1.png')
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
      {/* rigthside productInfo */}
      <View style={{ flexDirection: 'row', gap: responsiveWidth(4) }}>
        <TouchableOpacity style={{ alignItems: 'center' }}
          onPress={() => onPress && onPress(item)}
        >
          <Image
            source={
              isItemFavorited
                ? require('../../assets/icons/Heart.png')
                : require('../../assets/icons/Heart1.png')
            }
            style={{ width: responsiveWidth(5.8), height: responsiveHeight(2.8) }}
          />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#9E9E9E' }}>WishList</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', marginRight: responsiveWidth(2) }} onPress={() => onShare && onShare(item)}>
          <Image
            source={require('../../assets/icons/share.png')}
            style={{ width: responsiveWidth(5.5), height: responsiveHeight(2.8) }}
          />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#9E9E9E' }}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  productInfo: {
    marginBottom: 20,
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'space-between'
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceRow: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // backgroundColor: 'red'
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  oldPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
  },

  deliveryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9E9E9E',
    // textDecorationLine: 'line-through',
  },
})