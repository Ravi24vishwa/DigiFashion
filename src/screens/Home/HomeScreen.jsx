import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BannerCarousel from '../../CommonHelper/BannerCarousel';
import CustomProductList from '../../CommonHelper/CustomProductList'
import PromoBanner from '../../CommonHelper/PromoBanner'
import { saleItems } from '../../data/productdata'
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useFavorites } from '../../contexts/FavoritesContext';

const HomeScreen = ({ navigation }) => {
  const [saleProduct, setSaleProduct] = useState(saleItems)
  const { ProductList, SectionHeader } = CustomProductList
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleFavoritePress = (item) => {
    toggleFavorite(item);
  };

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

        <BannerCarousel />

        {/* Sale Section */}
        <SectionHeader
          title="Sale"
          subtitle="Super summer sale"
          onViewAll={() => navigation.navigate('ViewAll', saleProduct.filter(item => item.Season === 'Sales').map(item => ({
            ...item,
            isFavorite: isFavorite(item.id)
          })))}
        />
        <ProductList
          products={saleProduct.filter(item => item.Season === 'Sales').map(item => ({
            ...item,
            isFavorite: isFavorite(item.id)
          }))}
          showOldPrice={true}
          showDiscount={true}
          showFavorite={true}
          onProductPress={(item) => navigation.navigate('ProductDetailScreen', item)}
          onFavoritePress={handleFavoritePress}
        />

        {/* New Section */}
        <SectionHeader
          title="New"
          subtitle="You’ve never seen it before!"
          onViewAll={() => navigation.navigate('ViewAll', saleProduct.filter(item => item.Season === 'New').map(item => ({
            ...item,
            isFavorite: isFavorite(item.id)
          })))}
        />
        <ProductList
          products={saleProduct.filter(item => item.Season === 'New').map(item => ({
            ...item,
            isFavorite: isFavorite(item.id)
          }))}
          showOldPrice={true}
          showDiscount={true}
          showFavorite={true}
          onProductPress={(item) => navigation.navigate('ProductDetailScreen', item)}
          onFavoritePress={handleFavoritePress}
        />

        {/* Promo Banner */}
        <PromoBanner imageUrl={require('../../assets/images/HomeScreenImages/PromoBanner1.png')} />
        <PromoBanner imageUrl={require('../../assets/images/HomeScreenImages/PromoBanner2.png')} />

        {/* Top Section */}
        <SectionHeader
          title="Top"
          subtitle="You’ve never seen it before!"
          onViewAll={() => navigation.navigate('ViewAll', saleProduct.filter(item => item.Season === 'Top').map(item => ({
            ...item,
            isFavorite: isFavorite(item.id)
          })))}
        />
        <ProductList
          products={saleProduct.filter(item => item.Season === 'Top').map(item => ({
            ...item,
            isFavorite: isFavorite(item.id)
          }))}
          showOldPrice={true}
          showDiscount={true}
          showFavorite={true}
          onProductPress={(item) => navigation.navigate('ProductDetailScreen', item)}
          onFavoritePress={handleFavoritePress}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
