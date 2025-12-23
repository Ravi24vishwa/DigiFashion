import React from "react";
import { View, FlatList } from "react-native";
import CustomProductList from "./CustomProductList";

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
  contentContainerStyle,
  scrollEnabled = true
}) => {
  const renderItem = ({ item }) => (
    <CustomProductList.ProductCard
      item={item}
      showOldPrice={showOldPrice}
      showDiscount={showDiscount}
      showFavorite={showFavorite}
      cardWidth={cardWidth}
      imageHeight={imageHeight}
      onPress={() => onProductPress && onProductPress(item)}
      onFavoritePress={() => onFavoritePress && onFavoritePress(item)}
    />
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
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
    />
  );
};

export default ProductGrid;
