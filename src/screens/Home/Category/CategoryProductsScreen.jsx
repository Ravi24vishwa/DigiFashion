import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { StatusBar, FlatList, StyleSheet, InteractionManager, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonHeader } from '../../../components/layout/CommonHeader';
import { FilterBar } from '../../../components/features/products/FilterBar';

//bottom sheets
import { SortBottomSheet } from '../../../components/features/products/SortBottomSheet';
import { CategoryBottomSheet } from '../../../components/features/products/CategoryBottomSheet';
import { FilterBottomSheet } from '../../../components/features/products/FilterBottomSheet';
import CustomProductList from '../../../components/features/products/CustomProductList'
import ProductGrid from '../../../components/features/products/ProductGrid'
import { useAppUI, useCart, useFavorites } from '../../../hooks';
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import {
  sortOptions,
  categoryOptions,
  filterSections,
} from '../../../constants/data/categoryProductScreenData';

import { saleItems } from '../../../constants/data/productdata';
import { handlePress } from '../../../utils/Log';
import { productService } from '../../../api/productService';
import { storage } from '../../../utils/storage';
import { STORAGE_KEYS } from '../../../constants';

const CategoryProductsScreen = ({ navigation, route }) => {
  //data manupulation
  const { ProductList } = CustomProductList

  const { setIsTabBarVisible } = useAppUI();
  const { cartItems } = useCart();

  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilters, setSelectedFilters] = useState({});

  // ─────────────────────────────
  // REFS
  // ─────────────────────────────
  const sortBottomSheetRef = useRef(null);
  const categoryBottomSheetRef = useRef(null);
  const filterBottomSheetRef = useRef(null);

  const [filterData, setFilterData] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // ─────────────────────────────
  // SNAP POINTS
  // ─────────────────────────────
  const sortSnapPoints = useMemo(() => ['50%'], []);
  const categorySnapPoints = useMemo(() => ['50%'], []);
  const filterSnapPoints = useMemo(() => ['73%'], []);

  // ─────────────────────────────
  // SELECT HANDLERS
  // ─────────────────────────────
  const handleSortSelect = useCallback((sortOption) => {
    setSelectedSort(sortOption.value);
    sortBottomSheetRef.current?.close();
  }, []);

  const handleCategorySelect = (item) => {
    setSelectedCategory(item.label);
    categoryBottomSheetRef.current?.close();
  };

  const handleFilterChange = (updatedFilters) => {
    setSelectedFilters(updatedFilters);
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleApplyFilters = () => {
    filterBottomSheetRef.current?.close();
  };

  const [ClothProductData, setClothProductData] = useState([]);
  const [baseData, setBaseData] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { categoryId, categoryName } = route.params;

  // Fetch filters from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // 1. Try Cache
        const cachedFilters = await storage.getItem(STORAGE_KEYS.CACHE_FILTERS);
        if (cachedFilters) {
          setFilterData(cachedFilters);
          if (cachedFilters.price_range) {
            setPriceRange([
              parseFloat(cachedFilters.price_range.min),
              parseFloat(cachedFilters.price_range.max)
            ]);
          }
        }

        setIsFilterLoading(true);
        const res = await productService.getFilters();
        if (res.Status === 200) {
          setFilterData(res.Data);
          // 2. Save fresh filters to cache
          await storage.setItem(STORAGE_KEYS.CACHE_FILTERS, res.Data);

          if (res.Data.price_range) {
            setPriceRange([
              parseFloat(res.Data.price_range.min),
              parseFloat(res.Data.price_range.max)
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setIsFilterLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        category_ids: [categoryId],
        sort_by: selectedSort,
      };

      if (selectedFilters.brand && selectedFilters.brand.length > 0) {
        params.brand = selectedFilters.brand.join(',');
      }

      if (selectedFilters.price_range) {
        params.price_range = `${selectedFilters.price_range[0]}-${selectedFilters.price_range[1]}`;
      }

      const res = await productService.getProducts(params);

      // Map API data to UI format
      const mappedData = (res.Data || []).map(p => ({
        ...p,
        id: p.id || p.product_id || Math.random().toString(),
        title: p.name || p.product_name || 'Unnamed Product',
        price: parseFloat(p.product_price || 0),
        oldPrice: parseFloat(p.product_mrp || 0),
        imageUrl: p.product_thumbnail_image_url || p.product_image_url,
        discount: p.product_discount,
        category: categoryName,
        brand: p.product_brand || p.brand || '',
        rating: parseFloat(p.product_rating || 0),
        reviews: []
      }));
      setBaseData(mappedData);
      setClothProductData(mappedData);
    } catch (error) {
      // Only log if it's a real unexpected error, not just the "No Data" message from API
      if (error.message !== 'Shop Data not found') {
        console.error('Error fetching products for category:', error);
      }
      // Reset data to empty if API fails or returns "Shop Data not found"
      setBaseData([]);
      setClothProductData([]);
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, [categoryId, categoryName, selectedSort, selectedFilters]);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    } else {
      setBaseData(saleItems);
      setIsReady(true);
    }
  }, [categoryId, fetchProducts]);

  const { toggleFavorite, isFavorite, removeFavoriteLocally } = useFavorites();

  const handleFavoritePress = (item, isLongPress = false) => {
    const productId = item.id !== undefined ? item.id : item;
    if (isLongPress) {
      removeFavoriteLocally(productId);
    } else {
      toggleFavorite(productId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CommonHeader
        title={categoryName}
        showBack={true}
        showSearch={true}
        showWishlist={true}
        showCart={true}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => navigation.navigate('SearchBarScreen')}
        cartBadgeCount={cartItems?.length || 0}
      />

      <FilterBar
        onSort={() => {
          setIsTabBarVisible(false);
          sortBottomSheetRef.current?.expand();
        }}
        onCategory={() => {
          setIsTabBarVisible(false);
          categoryBottomSheetRef.current?.expand();
        }}
        onFilter={() => {
          setIsTabBarVisible(false);
          filterBottomSheetRef.current?.expand();
        }}
      />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading products...</Text>
        </View>
      ) : (
        <ProductGrid
          products={ClothProductData.map(item => ({
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
          onProductPress={(item) => navigation.navigate('ProductDetailScreen', { slug: item.product_slug })}
          onFavoritePress={(item) => handleFavoritePress(item, false)}
          onFavoriteLongPress={(item) => handleFavoritePress(item, true)}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, marginLeft: 10 }}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80, paddingHorizontal: 40 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 }}>No products found</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
                We couldn't find any products matching your current filters. Try adjusting your price range or selection.
              </Text>
              {(Object.keys(selectedFilters).length > 0 || selectedSort !== 'newest') && (
                <TouchableOpacity
                  onPress={handleClearAll}
                  style={{
                    backgroundColor: '#A855F7',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Clear All Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}




      {/* Sort Bottom Sheet */}
      <SortBottomSheet
        bottomSheetRef={sortBottomSheetRef}
        snapPoints={sortSnapPoints}
        sortOptions={filterData?.sort_by || sortOptions}
        selectedSort={selectedSort}
        onSelectSort={handleSortSelect}
        setIsTabBarVisible={setIsTabBarVisible}
      />

      {/* Category Bottom Sheet */}
      <CategoryBottomSheet
        bottomSheetRef={categoryBottomSheetRef}
        snapPoints={categorySnapPoints}
        categoryOptions={categoryOptions}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        setIsTabBarVisible={setIsTabBarVisible}
      />

      {/* Filter Bottom Sheet (NEW) */}
      <FilterBottomSheet
        bottomSheetRef={filterBottomSheetRef}
        snapPoints={filterSnapPoints}
        filterData={filterData}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        onApply={handleApplyFilters}
        setIsTabBarVisible={setIsTabBarVisible}
      />
    </SafeAreaView>
  );
};

export default CategoryProductsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  productsGrid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
