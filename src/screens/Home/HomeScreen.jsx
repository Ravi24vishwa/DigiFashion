import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BannerCarousel from '../../components/features/home/BannerCarousel';
import CustomProductList from '../../components/features/products/CustomProductList'
import PromoBanner from '../../components/features/home/PromoBanner'
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useFavorites } from '../../hooks';
import { api } from '../../api/apiService';
import { products } from '../../constants/data/categoryProductScreenData';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

const HomeScreen = ({ navigation }) => {
  const [Banner, setBanner] = useState([])
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { ProductList, SectionHeader } = CustomProductList
  const { toggleFavorite, isFavorite, refreshFavorites, removeFavoriteLocally } = useFavorites();
  const [trendingProduct, settrendingProduct] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Try to load from cache first for instant speed
        const cachedData = await storage.getItem(STORAGE_KEYS.CACHE_HOME_DATA);
        if (cachedData) {
          setHomeData(cachedData.home || []);
          setBanner(cachedData.banners || []);
          if (cachedData.home?.length > 0) {
            settrendingProduct(cachedData.home[0].products || []);
          }
          setIsLoading(false); // Stop loader early if we have cache
        }

        // 2. Fetch fresh data in the background
        const [slidersRes, bannerRes, homeRes] = await Promise.all([
          api.get('sliders'),
          api.get('banners'),
          api.get('homedata')
        ]);

        const freshHome = homeRes.Data || [];
        const freshBanners = bannerRes.Data || [];

        setHomeData(freshHome);
        setBanner(freshBanners);

        if (freshHome.length > 0) {
          const firstSectionProducts = freshHome[0].products || [];
          settrendingProduct(firstSectionProducts);
        }

        // 3. Update cache with fresh data
        await storage.setItem(STORAGE_KEYS.CACHE_HOME_DATA, {
          home: freshHome,
          banners: freshBanners,
          timestamp: Date.now()
        });

        refreshFavorites();
      } catch (error) {
        console.error('Error in HomeScreen fetchData:', error);
        setHomeData([]);
        setBanner([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshFavorites]);

  const handleFavoritePress = useCallback((item, isLongPress = false) => {
    const productId = item.id || item.product_id || item;
    if (isLongPress) {
      removeFavoriteLocally(productId);
    } else {
      toggleFavorite(productId);
    }
  }, [toggleFavorite, removeFavoriteLocally]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#637BDD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10
      }}>
        <Text style={{ fontSize: 44, color: '#000' }}>
          Digi<Text style={{ fontWeight: 'bold' }}>FASHION</Text>
        </Text>
        <TouchableOpacity style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#F5F5F5',
          justifyContent: 'center',
          alignItems: 'center'
        }}
          onPress={() => navigation.navigate('MyProduct')}
        >
          <Image
            source={require('../../assets/icons/Heart1.png')}
            style={{ height: 22, width: 22, resizeMode: 'contain' }}
          ></Image>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity style={{
          marginHorizontal: 20,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          borderRadius: 12,
          paddingHorizontal: 16,
          height: 50
        }}
          onPress={() => (navigation.navigate("SearchBarScreen"))}
        >
          {/* SearchBar */}
          <Image
            source={require('../../assets/icons/search1.png')}
          />
          <Text style={{ color: '#999', marginLeft: responsiveWidth(1.5) }}>What are you looking for...</Text>
        </TouchableOpacity>

        <BannerCarousel data={Banner} />

        {/* Categories / Sections from homeData */}
        {homeData?.map((section, index) => (
          <React.Fragment key={section.id || index}>
            <SectionHeader
              title={section.flag_name}
              onViewAll={() => navigation.navigate('ViewAll', { id: section.products, title: section.flag_name })}
            />
            <ProductList
              products={(section.products || []).map(p => ({
                ...p,
                title: p.name || p.title || p.product_name,
                price: parseFloat(p.product_price || 0),
                oldPrice: parseFloat(p.product_mrp || 0),
                imageUrl: p.product_thumbnail_image_url,
                id: p.id || p.product_id,
                brand: p.product_brand || p.brand || '',
                discount: p.product_discount,
                isFavorite: isFavorite(p.id || p.product_id)
              }))}
              showOldPrice={true}
              showDiscount={true}
              showFavorite={true}
              onProductPress={(item) => navigation.navigate('ProductDetailScreen', { slug: item.product_slug })}
              onFavoritePress={(item) => handleFavoritePress(item, false)}
              onFavoriteLongPress={(item) => handleFavoritePress(item, true)}
            />
          </React.Fragment>
        ))}

        {/* Fallback Static Banners if needed */}
        <PromoBanner imageUrl={require('../../assets/images/HomeScreenImages/PromoBanner1.png')} />
        <PromoBanner imageUrl={require('../../assets/images/HomeScreenImages/PromoBanner2.png')} />

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
