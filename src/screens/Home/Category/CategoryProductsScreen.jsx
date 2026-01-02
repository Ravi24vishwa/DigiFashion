import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { SafeAreaView, StatusBar, FlatList, StyleSheet, InteractionManager } from 'react-native';
import { CommonHeader } from '../../../components/CommonHeader';
import { FilterBar } from '../../../components/FilterBar';

//bottom sheets
import { SortBottomSheet } from '../../../components/SortBottomSheet';
import { CategoryBottomSheet } from '../../../components/CategoryBottomSheet';
import { FilterBottomSheet } from '../../../components/FilterBottomSheet';
import CustomProductList from '../../../CommonHelper/CustomProductList'
import ProductGrid from '../../../CommonHelper/ProductGrid'
import { useTabBarVisibility } from '../../../contexts/TabBarVisibilityContext';
import { useCart } from '../../../contexts/CartContext';
import { useFavorites } from '../../../contexts/FavoritesContext';
import Carousel, { Pagination } from "react-native-reanimated-carousel";

import {
  products,
  sortOptions,
  categoryOptions,
  filterSections,
  saleItems
} from '../../../data/productdata';
import { handlePress } from '../../../components/Log';

const CategoryProductsScreen = ({ navigation, route }) => {
  //data manupulation
  const { ProductList } = CustomProductList

  const { setIsTabBarVisible } = useTabBarVisibility();
  const { cartItems } = useCart();

  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [selectedCategory, setSelectedCategory] = useState('T-shirts');
  const [selectedFilters, setSelectedFilters] = useState({});

  // ─────────────────────────────
  // REFS
  // ─────────────────────────────
  const sortBottomSheetRef = useRef(null);
  const categoryBottomSheetRef = useRef(null);
  const filterBottomSheetRef = useRef(null);

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
    setSelectedSort(sortOption.label);
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

  const { categoryName } = route.params;

  // ─────────────────────────────
  // UI
  // ─────────────────────────────

  const [ClothProductData, setClothProductData] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Optimize initial load - wait for transition to finish
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      // Set initial data after transition
      applyFilters();
    });

    return () => interactionPromise.cancel();
  }, []);

  // Filter application logic reused for both initial load and updates
  const applyFilters = useCallback(() => {
    let filteredData = [...saleItems];

    // 1. Filter by Selected Category
    if (selectedCategory && selectedCategory !== 'All') {
      filteredData = filteredData.filter(item =>
        item.category?.toLowerCase() === selectedCategory?.toLowerCase()
      );
    }

    // 2. Filter by Attributes
    Object.keys(selectedFilters).forEach(filterKey => {
      const selectedValues = selectedFilters[filterKey];
      if (selectedValues && selectedValues.length > 0) {
        filteredData = filteredData.filter(item => {
          const itemValue = item[filterKey];
          if (Array.isArray(itemValue)) {
            return itemValue.some(val => selectedValues.includes(val));
          } else {
            return selectedValues.includes(itemValue);
          }
        });
      }
    });

    // 3. Sort
    switch (selectedSort) {
      case 'Price: lowest to high':
      case 'price_low':
        filteredData.sort((a, b) => a.price - b.price);
        break;
      case 'Price: highest to low':
      case 'price_high':
        filteredData.sort((a, b) => b.price - a.price);
        break;
      case 'Newest':
      case 'newest':
        // Assuming higher ID is newer
        filteredData.sort((a, b) => b.id - a.id);
        break;
      case 'Customer review':
      case 'review':
        filteredData.sort((a, b) => b.rating - a.rating);
        break;
      case 'Popular':
      case 'popular':
      default:
        // Default sort by review count
        filteredData.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
        break;
    }

    setClothProductData(filteredData);
  }, [selectedCategory, selectedFilters, selectedSort]);

  // Run filters when dependencies change, but only if view is ready
  useEffect(() => {
    if (isReady) {
      applyFilters();
    }
  }, [isReady, applyFilters]);

  const { toggleFavorite, isFavorite } = useFavorites();

  const handleFavoritePress = (item) => {
    toggleFavorite(item.id !== undefined ? item.id : item);
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
        onProductPress={(item) => navigation.navigate('ProductDetailScreen', item)}
        onFavoritePress={handleFavoritePress}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, marginLeft: 10 }}
      />




      {/* Sort Bottom Sheet */}
      <SortBottomSheet
        bottomSheetRef={sortBottomSheetRef}
        snapPoints={sortSnapPoints}
        sortOptions={sortOptions}
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
        filterSections={filterSections}
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
