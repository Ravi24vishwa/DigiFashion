import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useRoute } from '@react-navigation/native';
import ProductGrid from '../../components/features/products/ProductGrid';
import { useFavorites } from '../../hooks';
// import  CustomProductList  from '../../components/features/products/CustomProductList';
import { saleItems } from '../../constants/data/productdata'

const ViewAllScreen = ({ navigation }) => {

  const routes = useRoute();

  const seasonalProductList = routes.params

  console.log("-----------> data", seasonalProductList);

  const [ProductData, setProductData] = useState(seasonalProductList.id)
  const { toggleFavorite, isFavorite, removeFavoriteLocally } = useFavorites();

  const handleFavoritePress = (item, isLongPress = false) => {
    const productId = item.id !== undefined ? item.id : item;
    if (isLongPress) {
      removeFavoriteLocally(productId);
    } else {
      toggleFavorite(productId);
    }
  };

  console.log("-----------> product data", ProductData);

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
        <Text style={{ fontSize: 34, fontWeight: '700' }}>
          {seasonalProductList.title}
        </Text>
        <TouchableOpacity style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#F0F0F0',
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
          backgroundColor: '#F6F6F6',
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
      </ScrollView>
      <ProductGrid
        products={(ProductData?.map(p => ({
          ...p,
          title: p.name || p.title || p.product_name,
          price: parseFloat(p.product_price || 0),
          oldPrice: parseFloat(p.product_mrp || 0),
          imageUrl: p.product_thumbnail_image_url,
          id: p.id || p.product_id,
          discount: p.product_discount
        })))}
        horizontal={false}
        numColumns={2}
        cardWidth={"47%"}
        imageHeight={200}
        showOldPrice
        showDiscount
        showFavorite
        onProductPress={(item) => navigation.navigate('ProductDetailScreen', item)}
        onFavoritePress={(item) => handleFavoritePress(item, false)}
        onFavoriteLongPress={(item) => handleFavoritePress(item, true)}
      />
    </View>
  )
}

export default ViewAllScreen

const styles = StyleSheet.create({})