import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { ProductInfo } from '../../components/ProductDetails/ProductInfo'
import {
  bannerData
} from '../../components/ProductDetails/productReviewData'

import { BottomActionBar, ProductDetails, RatingAndReview, ReviewsSection, SizeSelector } from '../../components/ProductDetails/ProductDetailsCom'
import { ProductVariantPickerSheet } from '../../components/CartSheets/ProductVariantPickerSheet'
import { RateReviewSheet } from '../../components/RateReviewSheet'
import { useCart } from '../../contexts/CartContext';
import { CommonHeader } from '../../components/CommonHeader';
import { useTabBarVisibility } from '../../contexts/TabBarVisibilityContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import ProductGrid from '../../CommonHelper/ProductGrid';
import { saleItems } from '../../data/productdata';
// Main Screen Component
export default function ProductDetailScreen({ navigation, route }) {
  const ProductData = saleItems;
  // const similarProducts = saleItems.filter(item => item.id !== saleProduct.id);
  const item = route.params || {}; // Safety check
  const cart = useCart();
  const addToCart = cart?.addToCart || (() => console.warn("Cart context missing")); // Safety check

  const progress = useSharedValue(0);

  const { setIsTabBarVisible } = useTabBarVisibility();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [saleProduct, setSaleProduct] = useState(item);
  const [productReviews, setProductReviews] = useState(item.reviews || []);
  const ref = useRef(null);
  const width = Dimensions.get('screen').width;

  useEffect(() => {
    // Mark as viewed when screen opens
    if (item?.id) {
      // Update the local item object
      item.IsViewed = true;
      // Also update the source in saleItems to ensure persistence in MyProduct
      const sourceItem = ProductData.find(p => p.id === item.id);
      if (sourceItem) {
        sourceItem.IsViewed = true;
      }
    }
  }, [item]);

  const handleFavoritePress = (product) => {
    const target = product || saleProduct;
    console.log('Toggling favorite for product:', target?.id, target?.title);
    toggleFavorite(target);
  };

  const handleSharePress = () => {
    if (item?.id) {
      // Update the local item object
      item.IsShared = true;
      // Also update the source in saleItems
      const sourceItem = ProductData.find(p => p.id === item.id);
      if (sourceItem) {
        sourceItem.IsShared = true;
      }
      Alert.alert('Shared', 'Product shared and added to Shared tab!', [
        { text: 'View', onPress: () => navigation.navigate('MyProduct', { tab: 'Shared' }) },
        { text: 'OK' }
      ]);
    }
  };

  // Product Options Sheet (Color & Size)
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('Yellow');
  const productOptionsSheetRef = useRef(null);
  const productOptionsSnapPoints = useMemo(() => ['70%'], []);

  // Review Sheet
  const reviewSheetRef = useRef(null);
  const reviewSnapPoints = useMemo(() => ['68%'], []);

  const handleAddToCartFromSheet = (productWithOptions) => {
    // Update state with selected color and size for persistence
    setSelectedColor(productWithOptions.color);
    setSelectedSize(productWithOptions.size);

    // Add to cart with selected options
    addToCart(productWithOptions);
    // alert("Added to Cart with options!"); // Removed alert to show review sheet immediately

    // Close Product Options Sheet and Open Review Sheet
    productOptionsSheetRef.current?.close();
  };

  const handleColorSizeChange = (options) => {
    setSelectedColor(options.color);
    setSelectedSize(options.size);
  };

  const handleSendReview = (reviewData) => {
    console.log("Review Data:", reviewData);

    // Create new review object
    const newReview = {
      name: 'User', // Placeholder user name
      date: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      rating: reviewData.rating,
      review: reviewData.reviewText
    };

    // Update state
    const updatedReviews = [newReview, ...productReviews];
    setProductReviews(updatedReviews);

    // Update global product data (saleItems)
    const sourceItem = saleItems.find(p => p.id === saleProduct.id);
    if (sourceItem) {
      if (!sourceItem.reviews) sourceItem.reviews = [];
      sourceItem.reviews = [newReview, ...(sourceItem.reviews || [])];

      // Update overall rating and count
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      sourceItem.rating = totalRating / updatedReviews.length;
      sourceItem.reviews.length = updatedReviews.length;

      // Update local saleProduct state to reflect in UI
      setSaleProduct({
        ...sourceItem
      });
    }

    alert("Thanks for your review!");
    reviewSheetRef.current?.close();
  };

  return (
    <View style={styles.container}>
      <CommonHeader
        showBack={true}
        showSearch={true}
        showWishlist={true}
        showCart={true}
        // showShare={true}
        onBackPress={() => navigation.goBack()}
        onWishlistPress={handleFavoritePress}
        onSharePress={handleSharePress}
        cartBadgeCount={cart?.cartItems?.length || 0}
      />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <Carousel
          // autoPlay
          ref={ref}
          data={bannerData}
          width={width}
          onProgressChange={progress}
          style={{ width: width, height: width + 10, margin: 0 }}
          scrollAnimationDuration={300}
          renderItem={() => (
            // <View><Text>text</Text></View>
            <View
              key={item.id || 'default'}
              style={{
                flex: 1,
                justifyContent: 'center',
                padding: 12,
              }}
            >
              <Image
                source={item.image ? item.image : require('../../assets/icons/Show.png')} // Fallback image
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          )}
        />
        <Pagination.Custom
          data={bannerData}
          progress={progress}
          activeDotStyle={{
            backgroundColor: "#637BDD",
            width: 20,
          }}
          dotStyle={{ backgroundColor: '#E3E3E3', borderRadius: 50 }}
          containerStyle={{ gap: 5, marginTop: 4 }}
        />

        <View style={styles.content}>
          <ProductInfo
            item={saleProduct}
            onPress={handleFavoritePress}
            onShare={handleSharePress}
          />
          <View style={styles.divider} />
          <SizeSelector
            item={saleProduct}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onAddToCart={() => {
              setIsTabBarVisible(false);
              productOptionsSheetRef.current?.expand();
            }}
          />
          <View style={styles.divider} />
          <ProductDetails />
          <RatingAndReview
            item={saleProduct}
            reviews={productReviews}
            onpress={() => reviewSheetRef.current?.expand()}
          />
          <ReviewsSection
            reviews={productReviews}
            averageRating={saleProduct.rating}
            totalReviews={productReviews.length}
          />
          {/* <ProductCard /> */}
          {/* <SimilarProducts products={similarProducts} /> */}
        </View>
        <ProductGrid
          products={ProductData.slice(0, 4).map(item => ({
            ...item,
            isFavorite: isFavorite(item.id)
          }))}
          horizontal={false}
          numColumns={2}
          cardWidth={"47%"}
          imageHeight={200}
          showOldPrice
          showDiscount
          showFavorite
          onProductPress={(item) => navigation.replace('ProductDetailScreen', item)}
          onFavoritePress={handleFavoritePress}
          contentContainerStyle={{ backgroundColor: '#fff', marginBottom: 40, paddingBottom: 50 }}
          scrollEnabled={false}
        />
      </ScrollView>
      <BottomActionBar
        onAddToCart={() => {
          // Add to cart with selected color and size
          addToCart({
            ...saleProduct,
            color: selectedColor,
            size: selectedSize,
            quantity: 1
          });
          // Optional: Show success message or toast
          console.log('Product added to cart with color:', selectedColor, 'size:', selectedSize);
        }}
        onBuyNow={() => {
          // Add to cart and navigate to cart screen
          addToCart({
            ...saleProduct,
            color: selectedColor,
            size: selectedSize,
            quantity: 1
          });
          navigation.navigate('Main', { screen: 'CartTab' });
        }}
      />

      {/* Product Variant Picker Sheet (Color & Size Selection) */}
      <ProductVariantPickerSheet
        bottomSheetRef={productOptionsSheetRef}
        snapPoints={productOptionsSnapPoints}
        product={saleProduct}
        onAddToCart={handleAddToCartFromSheet}
        onColorSizeChange={handleColorSizeChange}
        setIsTabBarVisible={setIsTabBarVisible}
      />

      {/* Review Bottom Sheet */}
      <RateReviewSheet
        bottomSheetRef={reviewSheetRef}
        snapPoints={reviewSnapPoints}
        product={saleProduct}
        onSubmitReview={handleSendReview}
        setIsTabBarVisible={setIsTabBarVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ArrowStyle: {
    height: responsiveHeight(2),
    width: responsiveWidth(3),
    // backgroundColor: 'black'
    tintColor: 'black'
  },
  RightSideIcons: {
    height: responsiveHeight(3),
    width: responsiveWidth(5.5),
    // backgroundColor: 'black'
    tintColor: 'black'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  headerIcon: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: responsiveWidth(5),
  },
  imageContainer: {
    width: '100%',
    height: '30%',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    // marginBottom: 56,
    // backgroundColor: 'red'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    height: responsiveHeight(2),
    width: responsiveWidth(3),
    color: '#ffa500',
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9E9E9E'
  },
  sizeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  sizeButtonSelected: {
    backgroundColor: '#4169e1',
    borderColor: '#4169e1',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sizeTextSelected: {
    color: '#fff',
  },
  detailsSection: {
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // backgroundColor: 'red'
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    // backgroundColor: 'yellow'
  },
  link: {
    color: '#4169e1',
    fontSize: 18,
    fontWeight: '600'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    // backgroundColor: 'yellow'
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewsSection: {
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: '#4169e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4169e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  similarSection: {
    marginBottom: 80,
  },
  similarCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  similarPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
  },
  similarDiscount: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4169e1',
    borderRadius: 15,
    paddingVertical: 14,
    gap: 8,
  },
  addToCartIcon: {
    height: responsiveHeight(2.9),
    width: responsiveWidth(4.9),
    tintColor: '#000'
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#637BDD',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 8,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
});