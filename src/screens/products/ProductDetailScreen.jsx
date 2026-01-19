import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert, InteractionManager } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { ProductInfo } from '../../components/features/products/ProductInfo'
import {
  BottomActionBar,
  ProductDetails,
  RatingAndReview,
  ReviewsSection,
  SizeSelector
} from '../../components/features/products/ProductDetailsCom'
import { ProductVariantPickerSheet } from '../../components/features/cart/ProductVariantPickerSheet'
import { RateReviewSheet } from '../../components/features/products/RateReviewSheet'
import { useCart, useAppUI, useFavorites } from '../../hooks';
import { CommonHeader } from '../../components/layout/CommonHeader';
import ProductGrid from '../../components/features/products/ProductGrid';
import { productService } from '../../api/productService';
import { ActivityIndicator, Animated as RNAnimated } from 'react-native';
import Toast from 'react-native-toast-message';

// Main Screen Component
export default function ProductDetailScreen({ navigation, route }) {
  const { slug } = route.params || {};
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const cart = useCart();
  const addToCart = cart?.addToCart || (() => console.warn("Cart context missing"));

  const progress = useSharedValue(0);

  const { setIsTabBarVisible } = useAppUI();
  const { toggleFavorite, isFavorite, removeFavoriteLocally } = useFavorites();

  const [saleProduct, setSaleProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const ref = useRef(null);
  const width = Dimensions.get('screen').width;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const res = await productService.getProductDetails(slug);
        if (res.Data) {
          const apiProduct = res.Data;
          // Map API fields to UI fields
          const mappedProduct = {
            ...apiProduct,
            id: apiProduct.id || apiProduct.product_id,
            title: apiProduct.product_name || apiProduct.name,
            price: parseFloat(apiProduct.product_price || 0),
            oldPrice: parseFloat(apiProduct.product_mrp || 0),
            image: apiProduct.image_url || apiProduct.product_thumbnail_image_url,
            images: apiProduct.product_images || [apiProduct.product_images_url],
            brand: apiProduct.product_brand || apiProduct.brand || '',
            rating: parseFloat(apiProduct.product_rating || 0),
            reviews: [] // Reviews might be fetched separately if needed
          };
          setProduct(mappedProduct);
          setSaleProduct(mappedProduct);
          setProductReviews(mappedProduct.reviews || []);

          // Fetch similar products (same category)
          if (apiProduct.category_id) {
            fetchSimilarProducts(apiProduct.category_id, apiProduct.id);
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSimilarProducts = async (categoryId, currentProductId) => {
      try {
        const res = await productService.getProducts({ category_ids: [categoryId], per_page: 10 });
        const list = (res.Data || []).filter(p => (p.id) !== currentProductId);
        const mappedList = list.map(p => ({
          ...p,
          id: p.id || p.product_id,
          title: p.product_name,
          price: parseFloat(p.product_price || 0),
          oldPrice: parseFloat(p.product_mrp || 0),
          imageUrl: p.product_thumbnail_image_url,
          discount: p.product_discount,
          rating: parseFloat(p.product_rating || 0),
        }));
        setSimilarProducts(mappedList);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  useEffect(() => {
    if (!product?.id) return;
    // Optional: persist viewed status locally or via API
  }, [product]);


  // Defer carousel & sheet initialization until after navigation animation completes
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsInitialized(true);
    });
    return () => task.cancel();
  }, []);

  const handleFavoritePress = useCallback((product) => {
    const target = product || saleProduct;
    const productId = target?.id !== undefined ? target.id : target;
    console.log('Toggling favorite for product:', productId, target?.title ? '(Force Local Removal)' : '');

  });

useEffect(() => {
  if (
    saleProduct?.product_additional_details?.Size && saleProduct?.product_additional_details?.Color
  ) {
    // console.log("-------------------------- setting size:", saleProduct.product_additional_details.Size);
    // console.log("-------------------------- setting color:", saleProduct.product_additional_details.Color);
    setSelectedSize(saleProduct.product_additional_details.Size);
    setSelectedColor(saleProduct.product_additional_details.Color);
  }
}, [saleProduct]);

  // Product Options Sheet (Color & Size)
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('Yellow');
  const productOptionsSheetRef = useRef(null);
  const productOptionsSnapPoints = useMemo(() => ['70%'], []);
  // Review Sheet
  const reviewSheetRef = useRef(null);
  const reviewSnapPoints = useMemo(() => ['68%'], []);


  const handleColorSizeChange = (options) => {
    console.log("Selected options from sheet:", options);
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

    // Update local saleProduct state to reflect in UI
    setSaleProduct({
      ...saleProduct,
      reviews: updatedReviews,
      rating: updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length,
      reviewCount: updatedReviews.length
    });

    alert("Thanks for your review!");
    reviewSheetRef.current?.close();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 15, color: '#6B7280', fontSize: 16, fontWeight: '500' }}>Discovering Style...</Text>
      </View>
    );
  }

  if (!saleProduct) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Image
          source={require('../../assets/icons/Show.png')}
          style={{ width: 100, height: 100, tintColor: '#E5E7EB', marginBottom: 20 }}
        />
        <Text style={{ color: '#374151', fontSize: 20, fontWeight: '700', marginBottom: 10 }}>Product Unavailable</Text>
        <Text style={{ color: '#6B7280', textAlign: 'center', marginBottom: 30 }}>The product you're looking for might have been moved or is no longer in stock.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: '#4F46E5', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const carouselImages = saleProduct.product_images_url && saleProduct.product_images_url.length > 0
    ? saleProduct.product_images_url
    : [saleProduct.product_images_url || saleProduct.product_images_url];

  return (
    <View style={styles.container}>
      <CommonHeader
        showBack={true}
        showSearch={true}
        showWishlist={true}
        showCart={true}
        // showShare={true}
        onBackPress={() => navigation.goBack()}
        onWishlistPress={() => handleFavoritePress(saleProduct)}
        // onSharePress={handleSharePress}
        cartBadgeCount={cart?.cartItems?.length || 0}
      />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={carouselImages}
            width={width}
            height={width * 1.2}
            onProgressChange={progress}
            scrollAnimationDuration={500}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image
                  source={typeof item === 'string' ? { uri: item } : (item || require('../../assets/icons/Show.png'))}
                  style={styles.carouselImage}
                />
              </View>
            )}
          />
          <View style={styles.paginationWrapper}>
            <Pagination.Custom
              data={carouselImages}
              progress={progress}
              activeDotStyle={{
                backgroundColor: "#4F46E5",
                width: 24,
                height: 8,
              }}
              dotStyle={{
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                width: 8,
                height: 8,
                borderRadius: 4
              }}
              containerStyle={{ gap: 6 }}
            />
          </View>
        </View>

        <View style={styles.content}>
          <ProductInfo
            item={saleProduct}
            onPress={handleFavoritePress}
            // onShare={handleSharePress}
          />
          <View style={styles.divider} />
          <SizeSelector
            item={saleProduct}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onColorSizeChange={() => {
              setIsTabBarVisible(false);
              productOptionsSheetRef.current?.expand();
            }}
          />
          <View style={styles.divider} />
          <ProductDetails item={saleProduct} />
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
          {productReviews === 0 ? <View style={styles.divider} /> : null}

          {similarProducts.length > 0 && (
            <View style={styles.similarSection}>
              <View style={styles.similarHeader}>
                <Text style={styles.similarTitle}>Similar Products</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CategoryProducts', { categoryId: saleProduct.category_id, categoryName: saleProduct.categorie_name })}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <ProductGrid
                products={similarProducts.map(item => ({
                  ...item,
                  isFavorite: isFavorite(item.id)
                }))}
                horizontal={true}
                cardWidth={170}
                imageHeight={200}
                showOldPrice
                showDiscount
                showFavorite
                onProductPress={(item) => navigation.push('ProductDetailScreen', { slug: item.id || item.product_id })}
                onFavoritePress={(item) => handleFavoritePress(item, false)}
                // onFavoriteLongPress={(item) => handleFavoritePress(item, true)}
                contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 20 }}
              />
            </View>
          )}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
      <BottomActionBar
        onAddToCart={() => {
          addToCart({
            productId: saleProduct.id,
            qty: 1,
            shopId: saleProduct.shop_id || 1,
            color: selectedColor,
            size: selectedSize
          });
          // Alert.alert('Success', 'Added to Bag');
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Added to Bag'
          });
        }}
        onBuyNow={() => {
          addToCart({
            productId: saleProduct.id,
            qty: 1,
            shopId: saleProduct.shop_id || 1,
            color: selectedColor,
            size: selectedSize
          });
          navigation.navigate('Main', { screen: 'CartTab' });
        }}
      />


      {/* Product Variant Picker Sheet (Color & Size Selection) */}
      <ProductVariantPickerSheet
        bottomSheetRef={productOptionsSheetRef}
        snapPoints={productOptionsSnapPoints}
        product={saleProduct}
        // onAddToCart={handleAddToCartFromSheet}
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  carouselContainer: {
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 45,
    width: '100%',
    alignItems: 'center',
  },
  similarSection: {
    marginTop: 20,
  },
  similarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  similarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
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
  similarSectionBottom: {
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