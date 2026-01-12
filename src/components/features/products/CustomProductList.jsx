import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";


const CustomProductList = {

  ProductCard: React.memo(({
    item,
    showOldPrice = false,
    showDiscount = false,
    showFavorite = false,
    onPress,
    onFavoritePress,
    onFavoriteLongPress,
    cardWidth = 220,
    imageHeight = 250,
    borderRadius = 16,
    discountBgColor = "#637BDD",
  }) => {
    const favoriteBgColor = "#FFF";

    const handleFavorite = useCallback(() => {
      onFavoritePress && onFavoritePress(item);
    }, [item, onFavoritePress]);

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
        {/* ... component content ... */}
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
                resizeMode="cover"
              />
            ) : item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
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
          {showDiscount && !!item.discount && (
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
                -{item.discount} %
              </Text>
            </View>
          )}

          {/* Favorite/Wishlist Button */}
          {showFavorite && (
            <TouchableOpacity
              onPress={() => onFavoritePress && onFavoritePress(item)}
              onLongPress={() => onFavoriteLongPress && onFavoriteLongPress(item)}
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
                <Image source={require('../../../assets/icons/Heart.png')} style={{ height: 22, width: 22, resizeMode: 'contain' }} />
              ) : (
                <Image source={require('../../../assets/icons/Heart1.png')} style={{ height: 22, width: 22, resizeMode: 'contain' }} />
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
          {item.brand ? (
            <Text style={{
              fontSize: 12,
              color: '#8E8E93',
              marginBottom: 4,
              fontWeight: '500',
            }}>
              {item.brand}
            </Text>
          ) : null}

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
              ₹{Number(item.price || 0).toFixed(2)}
            </Text>

            {showOldPrice && !!item.oldPrice && (
              <Text style={{
                fontSize: 14,
                color: '#9B9B9B',
                textDecorationLine: 'line-through',
                marginLeft: 8
              }}>
                ₹{Number(item.oldPrice || 0).toFixed(2)}
              </Text>
            )}
          </View>

          {/* Rating */}
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
              {item.reviews && item.reviews.length > 0 && (
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
  }, (prevProps, nextProps) => {
    // Custom memo comparison - only re-render if these props change
    return prevProps.item.id === nextProps.item.id &&
      prevProps.item.isFavorite === nextProps.item.isFavorite &&
      prevProps.cardWidth === nextProps.cardWidth &&
      prevProps.imageHeight === nextProps.imageHeight;
  }),

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
              // backgroundColor: 'red',
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
    onFavoriteLongPress,
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
          onFavoriteLongPress={() => onFavoriteLongPress && onFavoriteLongPress(item)}
        />
      ))}
    </ScrollView>
  ),


};

export default CustomProductList;