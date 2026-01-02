import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import BannerCarousel from '../../CommonHelper/BannerCarousel';
import CustomProductList from '../../CommonHelper/CustomProductList'
import PromoBanner from '../../CommonHelper/PromoBanner'
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useFavorites } from '../../contexts/FavoritesContext';
import { api } from '../../api/apiService';

const HomeScreen = ({ navigation }) => {
  const [sliders, setSliders] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { ProductList, SectionHeader } = CustomProductList
  const { toggleFavorite, isFavorite, refreshFavorites } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const slidersRes = await api.get('sliders');
        setSliders(slidersRes.data || []);

        const homeRes = await api.get('homedata?store_id=1'); // Default store_id
        setHomeData(homeRes.data);

        refreshFavorites();
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshFavorites]);

  const handleFavoritePress = useCallback((item) => {
    toggleFavorite(item.id || item.product_id || item);
  }, [toggleFavorite]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#637BDD" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
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

        <BannerCarousel data={sliders} />

        {/* Categories / Sections from homeData */}
        {homeData?.categories?.map((category, index) => (
          <React.Fragment key={category.id || index}>
            <SectionHeader
              title={category.name}
              subtitle={category.description || `Explore ${category.name}`}
              onViewAll={() => navigation.navigate('CategoryProducts', { id: category.id, title: category.name })}
            />
            <ProductList
              products={category.products?.map(p => ({ ...p, isFavorite: isFavorite(p.id) })) || []}
              showOldPrice={true}
              showDiscount={true}
              showFavorite={true}
              onProductPress={(item) => navigation.navigate('ProductDetailScreen', { slug: item.slug })}
              onFavoritePress={handleFavoritePress}
            />
          </React.Fragment>
        ))}

        {/* Fallback Static Banners if needed */}
        <PromoBanner imageUrl={require('../../assets/images/HomeScreenImages/PromoBanner1.png')} />
        <PromoBanner imageUrl={require('../../assets/images/HomeScreenImages/PromoBanner2.png')} />

      </ScrollView>
    </View>
  );
};

export default HomeScreen;
