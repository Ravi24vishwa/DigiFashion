import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useFavorites } from "../contexts/FavoritesContext";

const CustomProductList = {

  ProductCard: ({
    item,
    showOldPrice = false,
    showDiscount = false,
    showFavorite = false,
    onPress,
    onFavoritePress,
    cardWidth = 220,
    imageHeight = 250,
    borderRadius = 16,
    discountBgColor = "#637BDD",
  }) => {
    const favoriteBgColor = "#FFF";

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: cardWidth,
          backgroundColor: '#FFF',
          borderRadius: borderRadius,
          marginRight: 12,
          marginBottom: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          overflow: 'hidden',
        }}
      >
        {/* Image Container */}
        <View style={{
          width: '100%',
          height: imageHeight,
          backgroundColor: '#F5F5F5',
          position: 'relative',
        }}>
          {
            item.image ? (
              <Image
                source={item.image}
                style={{ width: '100%', height: '100%' }}
              />
            ) : item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: item.imageBgColor || '#E0E0E0'
              }}>
                <Text style={{ fontSize: 50 }}>{item.image || '👗'}</Text>
              </View>
            )
          }

          {/* Discount Badge */}
          {showDiscount && item.discount && (
            <View style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: discountBgColor,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20
            }}>
              <Text style={{
                color: '#FFF',
                fontSize: 14,
                fontWeight: 'bold'
              }}>
                {item.discount}
              </Text>
            </View>
          )}

          {/* Favorite/Wishlist Button */}
          {showFavorite && (
            <TouchableOpacity
              onPress={() => onFavoritePress && onFavoritePress(item)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: favoriteBgColor,
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              {item.isFavorite ? (
                <Image source={require('../assets/icons/Heart.png')} style={{ height: 22, width: 22, resizeMode: 'contain' }} />
              ) : (
                <Image source={require('../assets/icons/Heart1.png')} style={{ height: 22, width: 22, resizeMode: 'contain' }} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Content Container */}
        <View style={{ padding: 10 }}>
          {/* Title */}
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#222',
            marginBottom: 4,
          }}>
            {item.title}
          </Text>

          {/* Price Container */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 3
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000'
            }}>
              ₹{item.price.toFixed(2)}
            </Text>

            {showOldPrice && item.oldPrice && (
              <Text style={{
                fontSize: 14,
                color: '#9B9B9B',
                textDecorationLine: 'line-through',
                marginLeft: 8
              }}>
                ₹{item.oldPrice.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Rating */}
          {item.rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[...Array(5)].map((_, index) => (
                <Image
                  key={index}
                  source={index < Math.floor(item.rating)
                    ? require('../assets/icons/Star.png')
                    : require('../assets/icons/Star1.png')
                  }
                  style={{
                    width: 18,
                    height: 18,
                    marginHorizontal: 1,
                  }}
                />
              ))}
              {item.reviews.length && (
                <Text style={{
                  fontSize: 12,
                  color: '#9B9B9B',
                  marginLeft: 4
                }}>
                  ({item.reviews.length})
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  },

  SectionHeader: ({
    title,
    subtitle,
    onViewAll,
    backgroundColor = 'transparent',
    titleColor = '#000',
    titleSize = 24,
    subtitleColor = '#999',
    subtitleSize = 14,
    viewAllColor = '#000',
    showViewAll = true,
    paddingHorizontal = 20,
    marginTop = 10,
    marginBottom = 16,
    products = [],
  }) => (
    <View style={{
      flexDirection: 'column',
      paddingHorizontal: paddingHorizontal,
      marginTop: marginTop,
      marginBottom: marginBottom,
      // backgroundColor: 

    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: titleSize,
          fontWeight: 'bold',
          color: titleColor
        }}>
          {title}
        </Text>

        {showViewAll && (
          <TouchableOpacity onPress={onViewAll} style={{
            // backgroundColor: 'red',
            height: responsiveHeight(3),
            width: responsiveWidth(15),
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: 16,
              color: viewAllColor,
              fontWeight: '700',
              // backgroundColor: 'red'
            }}>
              View all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {subtitle && (
        <Text style={{
          fontSize: subtitleSize,
          color: subtitleColor,
          marginTop: 4
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  ),

  ProductList: ({
    products = [],
    horizontal = true,
    showOldPrice = false,
    showDiscount = false,
    showFavorite = false,
    cardWidth = 185,
    imageHeight = 220,
    onProductPress,
    onFavoritePress,
    contentContainerStyle
  }) => (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        ...contentContainerStyle
      }}
    >
      {products.map((item, index) => (
        <CustomProductList.ProductCard
          key={item.id || index}
          item={item}
          showOldPrice={showOldPrice}
          showDiscount={showDiscount}
          showFavorite={showFavorite}
          cardWidth={cardWidth}
          imageHeight={imageHeight}
          onPress={() => onProductPress && onProductPress(item)}
          onFavoritePress={() => onFavoritePress && onFavoritePress(item)}
        />
      ))}
    </ScrollView>
  ),

  // Example usage component
  ExampleUsage: () => {
    // const sampleProducts = [
    //   {
    //     id: 1,
    //     title: 'Evening Dress',
    //     price: 500.00,
    //     oldPrice: 600.00,
    //     discount: '-20%',
    //     rating: 5,
    //     reviewCount: 10,
    //     imageBgColor: '#C48B9F',
    //     isFavorite: false
    //   },
    //   {
    //     id: 2,
    //     title: 'Sport Dress',
    //     price: 500.00,
    //     oldPrice: 600.00,
    //     discount: '-20%',
    //     rating: 5,
    //     reviewCount: 10,
    //     imageBgColor: '#A8B8C7',
    //     isFavorite: false
    //   },
    //   {
    //     id: 3,
    //     title: 'Summer Dress',
    //     price: 450.00,
    //     oldPrice: 550.00,
    //     discount: '-18%',
    //     rating: 4,
    //     reviewCount: 8,
    //     imageBgColor: '#F5E6D3',
    //     isFavorite: false
    //   }
    // ];

    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <CustomProductList.SectionHeader
          title="Sale"
          subtitle="Super summer sale"
          onViewAll={() => console.log('View all pressed')}
        />

        <CustomProductList.ProductList
          products={sampleProducts}
          showOldPrice={true}
          showDiscount={true}
          showFavorite={true}
          onProductPress={(item) => console.log('Product pressed:', item)}
          onFavoritePress={(item) => console.log('Favorite pressed:', item)}
        />
      </View>
    );
  }
};

export default CustomProductList;