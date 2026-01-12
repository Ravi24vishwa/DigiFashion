import React from "react";
import { View, FlatList } from "react-native";
import CustomProductList from "./CustomProductList";
import SkeletonLoader from '../../common/SkeletonLoader';

const ProductGrid = ({
  products = [],
  horizontal = false,
  numColumns = 2,
  showOldPrice = false,
  showDiscount = false,
  showFavorite = false,
  cardWidth = 185,
  imageHeight = 220,
  onProductPress,
  onFavoritePress,
  onFavoriteLongPress,
  contentContainerStyle,
  scrollEnabled = true,
  isLoading = false
}) => {
  const renderSkeleton = () => (
    <View style={{ width: cardWidth, marginRight: 15, marginBottom: 20 }}>
      <SkeletonLoader width={cardWidth} height={imageHeight} borderRadius={16} />
      <View style={{ marginTop: 10 }}>
        <SkeletonLoader width={cardWidth * 0.8} height={20} borderRadius={4} />
        <SkeletonLoader width={cardWidth * 0.5} height={16} borderRadius={4} style={{ marginTop: 8 }} />
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    if (isLoading) return renderSkeleton();
    return (
      <CustomProductList.ProductCard
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
    );
  };

  const data = isLoading ? Array(6).fill({}) : products;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => isLoading ? `skeleton-${index}` : (item.id?.toString() || index.toString())}
      horizontal={horizontal}
      numColumns={horizontal ? 1 : numColumns}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        ...contentContainerStyle,
      }}
      scrollEnabled={scrollEnabled}
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      windowSize={21}
      removeClippedSubviews={true}
    />
  );
};

export default ProductGrid;
